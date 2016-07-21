            Ext.namespace("App");
            
            /**
             * Global register of application components (used for serialization)
             * 
             * @type Object
             */
            App.components = {};
            
            App.load = function(classPath,cbOnload,cbError) {
                            
                            console.info("[App.load] Loading "+classPath); 
                            
                             var scr= document.createElement("script");
                             scr.setAttribute("type","text/javascript")
                            // scr.setAttribute("onload",cbOnload);
                             scr.setAttribute("src",classPath);
                             scr.setAttribute("async","false");
                             scr.onload = cbOnload;
                             
                             scr.onerror = $.isFunction(cbError) ? cbError: function(e) {console.error("Error loading classFile: "+e.target.src)};
                             
                            document.getElementsByTagName("head")[0].appendChild(scr); 
                        };
            App.loadTemplates = function() {
                if (!App.config.widgetsTemplatesFile) {
                    console.warn("[App::loadTemplates] No templates config defined");
                    return;
                }
                $.get(App.config.widgetsTemplatesFile,function(html) {
                    console.info("[App::loadTemplates()] Templates loaded");
                    $(document.body).append($(html));
                    
                });
            }
            
            App.AbstractClass = Ext.extend(Ext.util.Observable,{
                
                $private: function(v,getter,setter) {
                
                  Object.defineProperty(this,"$"+v,{
                    configurable:true,
                    enumerable: false,
                    value: null,
                    writable: true
                  });
                  
                  if (getter) this.__defineGetter__(v,getter);
                  if (setter) this.__defineSetter__(v,setter);
                  
            },
             
            });
                        
            App.Config = function(conf) { //Configuration constructor
                
                var me = this;
                
               try { 
                $.ajax({
                   dataType: "json", 
                   url: conf.config,
                   success:function(config) {
                      me.config = config;  
                      console.info("[App.Config] "+conf.config+" loaded");
                      
                      $.ajax({
                        dataType: "json", 
                        url: conf.adminConfig,
                        success:function(adminConfig) {
                           Ext.apply(me.config, adminConfig);
                           
                           console.info("[App.Config] "+conf.adminConfig+" loaded");
                           
                           me._loaded.apply(me,arguments);
                           
                        },
                        error: function() {
                            console.warn("[Config] Config "+conf.adminConfig+" not found!");
                            me._loaded.apply(me,arguments);
                        }
                    });
                      
                      
                  },
                  error: function() {
                      App.errorMsg("Fatal error","Error loading "+conf.config);
                  }
                });
                
                
                
                
                
                
              } catch(e) {
                  console.error("[App.Config] Error loading config: "+e);
                  
              }
            };
            
            App.Bootstrap = Ext.extend(App.Config,{
              constructor: function(conf) {
                 
                 App.Bootstrap.superclass.constructor.call(this,conf);
                 
                                    
                  
                   
                  
              },
              _loaded: function() {
                  var me = this,
                      loaded = 0;
              
                  //console.log(this.config);
                  
                  /*$.ajaxSetup({error: function(e) {
                                console.error("[App.Bootstrap] ");
                                console.dir(e);
                        }
                    });    */
                   
                  //this.config.classes.forEach(function(classFile) {
                    if (this.config.classes.length == 0) return;
                    
                      var classFile = this.config.classes[0],
                                        
                            classPath=this.config.jsDir+"/"+classFile,
                            cbError = App.errorMsg.createCallback("System loading error","Failed loading:"+classFile);
                                
                                
                            cbOnload = function(file) {
                                    console.info("[App.load] File "+file+" loaded");
                                    if (App._abort) {
                                            console.warn("[App.Bootstrap] Loading aborted. ");
                                        return;}
                                    if (loaded++ == me.config.classes.length-1 && $.isFunction(App.onLoad))
                                        App.onLoad(me.config);
                                    
                                    else
                                        App.load(me.config.jsDir+"/"+me.config.classes[loaded],
                                                 cbOnload.createCallback(me.config.jsDir+"/"+me.config.classes[loaded]),
                                                 App.errorMsg.createCallback("System loading error","Failed loading:"+me.config.jsDir+"/"+me.config.classes[loaded],function() {$("*").addClass("disabled").attr("disabled","disabled");})
                                                );
                                    
                                   App.mainBox.progress(Math.round((loaded-1) * 100 / (me.config.classes.length-1)));             
                            };
                      
                         App.mainBox = App.progressMsg(this.config.appName+" v."+this.config.appVersion,"Loading system files...",function(id) {
                             App._abort = true; $("#"+id).remove();
                             //$("*").addClass("disabled").attr("disabled","disabled");
                         });
                         
                         App.load(classPath,cbOnload,cbError);
                         
                         
                      //});
                       
                 
                       
                      
                  } });
            
            //$.ajaxSetup({async:false});
           App.errorMsg = function(title,message,closed) {
                                $("#loading").hide();
                                var me=this;
                                var tpl = new Ext.Template($("template[name='errorMessage']").html());
                                
                                this.title =title;
                                this.message = message
                                this.id ="error"+Math.floor(Math.random() *100000000);
                                
                                var msgBox = $(tpl.apply(this));
                                
                                $(document.body).append(msgBox);
                                
                                msgBox.modal({backdrop:"static"});
                                
                                this.box =msgBox;
                                
                                $("#"+this.id+"_alert").alert()
                                        .on("close.bs.alert",function() {
                                            msgBox.hide();
                                    if (closed) {
                                        closed.call(msgBox);
                                       msgBox.remove();
                                        if (App.mainBox) App.mainBox.abort();
                                    } else {
                                        msgBox.remove();
                                        if (App.mainBox) App.mainBox.abort();
                                    } 
                                }); 
                          return msgBox;      
                                
           };
           App.errorMsg.close = function() {
               this.box.remove();
           };
           App.errorMsg.setMsg = function(msg) {
               
           };
           App.progressMsg = function(title,message,abort,initProgress)
           {
               
                var tpl = new Ext.Template($("template[name='progressBox']").html());
                                var me= this;
                                
                                this.title =title;
                                this.message = message
                                this.id ="progressMsg"+Math.floor(Math.random() *100000000);
                                this.noabort = $.isFunction(abort) ? "":"hidden";
                                
                                if (initProgress == NaN) initProgress = 0;
                                this.progress = initProgress || 0;
                                
                                var msgBox = $(tpl.apply(this));
                                
                                
                                
                                $(document.body).append(msgBox);
                                var alertBox = $("#"+me.id+"_alert");
                                msgBox.modal({backdrop:"static"});
                                alertBox.alert()
                                        .on("close.bs.alert",function() {
                                             if ($.isFunction(abort)) 
                                                    abort(me.id);
                                             else {
                                                 msgBox.hide();
                                                 msgBox.remove();
                                             }   
                                        });
                                        
                             /* function __errorCheck() {
                                  if (me.percent == 0) me.abort();
                              }*/          
                              
                              //__errorCheck.defer(5000);  
                                
                         return {
                             id:me.id,
                             percent:initProgress || 0, 
                             progress: function(percent) {
                                 
                                 if (isNaN(percent)) percent=100;
                                 this.percent=percent||0;
                                 var self =this;
                                 
                                 $("#"+this.id+"_progress")
                                                      .width(percent+"%")  
                                                      .filter(":first-child") 
                                                      .html("<b>"+percent+"%</b>"); 
                                             
                                     
                                 
                             },
                             setMsg: function(msg) {
                                 $("#"+this.id+" .msg").html(msg);
                             },
                             done: function() {
                                 
                                 $("#"+this.id+" p:first").html("<b>DONE!</b>");
                                 var id=me.id;
                                 window.setTimeout(function(){$("#"+id).remove()},1000);
                             },
                             abort: function() {
                                 var me=this;
                                 
                                 $("#"+this.id+" p:first").html("<font color='red'><b>ERROR!</b></font>");
                                 window.setTimeout(function(){$("#"+me.id).remove();},300);
                             }
                         };      
               
           };
           
           
           App.driveMsg = function(title,message,abort)
           {
               
                var tpl = new Ext.Template($("template[name='driveBox']").html());
                                var me= this;
                                
                                this.title =title;
                                this.message = message
                                this.id ="progressMsg"+Math.floor(Math.random() *100000000);
                                this.noabort = $.isFunction(abort) ? "":"hidden";
                                
                                                              
                                var msgBox = $(tpl.apply(this));
                                
                                
                                
                                $(document.body).append(msgBox);
                                var alertBox = $("#"+me.id+"_alert");
                                msgBox.modal({backdrop:"static"});
                                alertBox.alert()
                                        .on("close.bs.alert",function() {
                                             if ($.isFunction(abort)) 
                                                    abort(me.id);
                                             else {
                                                 msgBox.hide();
                                                 msgBox.remove();
                                             }   
                                        });
                                        
                             /* function __errorCheck() {
                                  if (me.percent == 0) me.abort();
                              }*/          
                              
                              //__errorCheck.defer(5000);  
                                
                         return {
                             id:me.id,
                            
                             done: function() {
                                 
                                 $("#"+this.id+" p:first").html("<b>DONE!</b>");
                                 var id=me.id;
                                 window.setTimeout(function(){$("#"+id).remove()},1000);
                             },
                            
                         };      
               
           };
           
           App.getAppName=function(){
               return App.config.appName+" v."+App.config.appVersion;
           };
           
            
           App.canUserDo = function(permission) {
               return (croupier.data.permissions & (1 << permission)) !== 0;
           } 
           // $.ajaxSetup({async:true});
           
           App.registerComponent=function(compClass,obj)
           {
               if (!Array.isArray(this.components[compClass])) this.components[compClass] = [];
               
               this.components[compClass].push(obj);
           }
           
           