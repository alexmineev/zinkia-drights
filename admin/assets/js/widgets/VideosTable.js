Ext.ns("App.Widget");

App.Widget.VideosTable = Ext.extend(App.Widget.Table,{
    constructor: function(config) {
        var me = this;
        config = App.Widget.Table.makeSelectable(config);
        Ext.applyIf(config,{
                    rowModel: App.Model.Video,
                    
                    actions: [
                        {
                           label: "Procesar primer trimestre",
                           hint: "Carga y processa datos de primer trimeste de este año apartir de informes de YT CMS.",
                           iconClass: "ico-trimester ico-trimester-first",
                           noRowsAllowed: true,
                           multi:true,
                           scope:this,
                           validator: function() {
                              
                               return true;
                           },
                           handler: function() {
                               this.loadTrimester(1);
                           }
                        },
                        {
                           label: "Procesar segundo trimestre",
                           hint: "Carga y processa datos de segundo trimeste de este año apartir de informes de YT CMS.",
                           iconClass: "ico-trimester ico-trimester-second",
                           noRowsAllowed: true,
                           multi:true,
                           scope:this,
                           validator: function() {
                              
                               return true;
                           },
                           handler: function() {
                               this.loadTrimester(2);
                           }
                        },{
                           label: "Procesar tercer trimestre",
                           hint: "Carga y processa datos de tercer trimeste de este año apartir de informes de YT CMS.",
                           iconClass: "ico-trimester ico-trimester-third",
                           noRowsAllowed: true,
                           multi:true,
                           scope:this,
                           validator: function() {
                              
                               return true;
                           },
                           handler: function() {
                               this.loadTrimester(3);
                           }
                        },
                        {
                           label: "Procesar cuarto trimestre",
                           hint: "Carga y processa datos de cuarto trimeste de este año apartir de informes de YT CMS.",
                           iconClass: "ico-trimester ico-trimester-forth",
                           noRowsAllowed: true,
                           multi:true,
                           scope:this,
                           validator: function() {
                              
                               return true;
                           },
                           handler: function() {
                               this.loadTrimester(4);
                           }
                        },
                        {
                            label: "Transferir a repositorio en Google Drive",
                            hint: "Tranfiere los datos en formato Google Sheets dentro de repositorio de Google Drive predefinido.",
                            iconClass: "ico-drive",
                            noRowsAllowed :true,
                            scope:this,
                            validator: function(rows) {
                                return me.rows.length>0;
                            },
                            handler: function() {
                               
                               
                              /* var csvLines = this.rows.map(function(video) {
                                   var videos = [];
                                   
                                   videos.push('"'+video['title']+'"');
                                   videos.push('"'+video['channel']+'"');
                                   videos.push('"'+video['views']+'"');
                                   videos.push('"'+parseFloat(video['earnings']).toPrecision(2)+" USD"+'"');
                                   
                                   return videos.join(",");
                               });
                               
                               csvLines.unshift('"Título","Canal","Views","Earnings"');*/
                               var me =this;
                               App.mainBox = App.progressMsg("Youtube Reports","Uploading data to Google Drive...");
                               
                               $.post(App.config.API.csvToDrive,{year:this.year,trimester:this.trimester,email:App.user.getEmail()},function(resp) {
                                 
                                  
                                  App.mainBox.progress(100);
                                  App.mainBox.done();
                                  
             
                                  
                                  //App.mainBox.done();
                                 /* $.getScript("https://script.google.com/a/macros/zinkia.com/s/AKfycbzBjH6z9D_sSYVbuQ0omFO497oMupXJkoN2M8f_aunX1-zmj3_j/exec?filename="+req.filename+"&data="+escape(JSON.stringify(req.data)),function(resp) {
                                     App.mainBox.progress(100);
                                     App.mainBox.done();
                                     
                                     //window.open("https://docs.google.com/a/zinkia.com/spreadsheets/d/"+resp.id+"/edit?usp=sharing");
                                  });*/
                                  
                                  window.addEventListener("message",function(e) {
                                      //App.mainBox.progress(100);
                                      App.mainBox.done();
                                      window.xdrive.close();
                                      window.open(e.data);
                                  });
                                  
                                  /*$("<iframe>")
                                          .attr("name","xcomm")
                                          //.attr("sandbox","allow-scripts allow-same-origin allow-popup")
                                          .on("load",function() {
                                              alert('Loaded:'+this.contentWindow.name);
                                          })
                                     .appendTo($("body"));*/
                                  App.mainBox =App.driveMsg("Zinkia MCN", "Generando informe como hoja de calculo en Google Drive"); 
                                  var xcomm = window.open("about:blank","xcomm","width=400,height=200,location=no,menubar=no,locationbar=no");
                                 // xcomm.document.write("Comunicando con Google...");
                                  window.xdrive=xcomm;
                                  xcomm.document.title="Comunicando con Google Drive...";
                                  
                                   var frm=$("<form>")
                                            .attr("action","https://script.google.com/a/macros/zinkia.com/s/AKfycbzBjH6z9D_sSYVbuQ0omFO497oMupXJkoN2M8f_aunX1-zmj3_j/exec")
                                            .attr("method","POST")
                                            .attr("target","xcomm");
                                            
                                           
                                   $("<input>")
                                          .attr("type","hidden")
                                          .attr("name","filename")
                                          .attr("value","ZINKIA_MCN_REPORT_"+me.year+"_TRIMESTER_"+me.trimester)
                                          .appendTo(frm);
                                  
                                  $("<input>")
                                          .attr("type","hidden")
                                          .attr("name","data")
                                          .attr("value",resp)
                                          .appendTo(frm);
                                  
                                  
                                  $("<input>")
                                          .attr("type","hidden")
                                          .attr("name","callback_url")
                                          .attr("value",location.href+"youtube/xcomm.php")
                                          .appendTo(frm);
                                  
                                   frm.submit();       
                                  
                                  
                               });
                               
                            }
                        }
                    ]
                    
                });
        
        
       App.Widget.VideosTable.superclass.constructor.call(this,config); 
       
       this.load([]);
    },
    
    loadTrimester: function(trimester) {
                               var me = this;
                               
                               var year=new Date().getFullYear();
                              
                               App.mainBox = App.progressMsg("YouTube Zinkia MCN","Conectando YouTube Zinkia MCN Dashboard y descargando informes. (Puede tardar un rato)");
                               
                               $.getScript(App.config.API.fetchReports+"?year="+year+"&trimester="+trimester+"&type=videoclaim",function(resp) {
                                    
                                  if (window.__abort) {window.__abort = false; return;}
                                  
                                  App.mainBox = App.progressMsg("YoutTube Video Reports","Calculando Views & Earnings de trimestre elegido..");
                                  
                                    
                                    $.getJSON(App.config.API.loadReports+"?year="+year+"&trimester="+trimester+"&type=videoclaim",function(resp) {
                                       
                                        App.mainBox.progress(50);
                                       var videos = resp.videos.map(function(video) {
                                           return new App.Model.Video(video);
                                       });
                                       
                                       
                                       
                                       me.panel.videos = videos;
                                       
                                       me.on("loaded",function() {
                                          App.mainBox.progress(100);
                                          App.mainBox.done();

                                          switch (trimester) {
                                              case 1:
                                                  $(".ico-trimester-first").parent("a").css("background-color","grey");
                                                  
                                                  $(".ico-trimester-second").parent("a").css("background-color","white");
                                                  $(".ico-trimester-third").parent("a").css("background-color","white");
                                                  $(".ico-trimester-forth").parent("a").css("background-color","white");
                                              break;
                                              case 2:
                                                  $(".ico-trimester-second").parent("a").css("background-color","grey");
                                                  
                                                  $(".ico-trimester-first").parent("a").css("background-color","white");
                                                  $(".ico-trimester-third").parent("a").css("background-color","white");
                                                  $(".ico-trimester-forth").parent("a").css("background-color","white");
                                              break;
                                              case 3:
                                                  $(".ico-trimester-third").parent("a").css("background-color","grey");
                                                  
                                                  $(".ico-trimester-second").parent("a").css("background-color","white");
                                                  $(".ico-trimester-first").parent("a").css("background-color","white");
                                                  $(".ico-trimester-forth").parent("a").css("background-color","white");
                                              break;
                                              case 4:
                                                  $(".ico-trimester-forth").parent("a").css("background-color","grey");
                                                  
                                                  
                                                  $(".ico-trimester-second").parent("a").css("background-color","white");
                                                  $(".ico-trimester-third").parent("a").css("background-color","white");
                                                  $(".ico-trimester-first").parent("a").css("background-color","white");
                                              break;
                                          }
                                          
                                       },me);
                                       
                                       me.load(videos);
                                       me.year = year;
                                       me.trimester = trimester;
                                       
                                       document.title = "YT_ZINKIA_MCN_"+year+"_TRIMESTER_"+trimester;
                                    });
                        
                                          
                                
                               });
                               //$("#uploader").modal().show();
                           }
});

