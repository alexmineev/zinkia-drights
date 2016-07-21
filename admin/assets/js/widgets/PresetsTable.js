Ext.ns("App.Widget");

/**
 * @class PresetsTable
 * @extends App.Widget.Table
 * @memberof App#Widget
 * @namespace App.Widget
 */
App.Widget.PresetsTable = Ext.extend(App.Widget.Table,{
    $det: function(id)  {return $("#"+this.id+"_"+id)},
    constructor: function(config) {
        config=App.Widget.Table.makeSelectable(config);
        //Ext.applyIf(config,App.Widget.Table.Selectable); //Make Table checkbox-selectable
            
        Ext.applyIf(config, {
             rowClass: App.Model.Preset,
             actions: [
                  {
                           label: "New",
                           hint: "Create a new preset",
                           iconClass: "ico-btn ico-btn-pool_add",
                           noRowsAllowed: true,
                           multi:true,
                           scope:this,
                           validator: function() {
                                                              
                               return App.canUserDo(croupier.ModificationDataAllPermission.preset$add);
                               
                           },
                           handler: function() {
                              
                               this.newPreset();
                               
                              
                              
                              
                               
                           }
                  },
                  {
                           label: "Execute",
                           hint: "Executes selected preset",
                           iconClass: "ico-btn ico-btn-play",
                           scope:this,
                           validator: function(presets) {
                                return presets.some(function(preset) {
                                    return preset.hasPermission(croupier.PresetPermission.execute);
                                } ,this);
                               
                           },
                           handler: function(presets) {
                               
                              var preset = presets[0];
                              
                              App.mainBox= App.progressMsg("Presets","Executing preset: "+preset.name);
                              
                              preset.on("executed",function() {
                                  App.mainBox.progress(100);
                                  App.mainBox.done();
                              });
                              preset.execute();
                              
                              
                               
                           }
                  },
                  {
                           label: "Duplicate",
                           hint: "Creates a new preset with the same configuration as a selected one",
                           iconClass: "ico-btn ico-btn-job_duplicate",
                           scope:this,
                           validator: function() {
                                                              
                               return App.canUserDo(croupier.ModificationDataAllPermission.preset$add);
                               
                           },
                           handler: function(presets) {
                               
                               var preset=presets[0];
                               this.duplicatePreset(preset);
                                 
                           }
                  },
                  {
                           label: "Edit",
                           hint: "Edits selected preset",
                           iconClass: "ico-btn ico-btn-view_details",
                           scope:this,
                           
                           validator: function(presets) {
                                                              
                               return presets.some(function(preset) {
                                    return preset.hasPermission(croupier.PresetPermission.set);
                                } ,this);
                               
                           },
                           handler: function(presets) {
                               var preset = presets[0];
                               
                               this.editPreset(preset);
                               
                           }
                  }
                 ,
                 {
                     label: "Remove",
                     hint: "Removes selected presets",
                     iconClass:"ico-btn ico-btn-job_cancel",
                     multi: true,
                     scope:this,
                     validator: function(presets) {
                         return presets.some(function(preset) {
                             return preset.hasPermission(croupier.PresetPermission.remove) && preset.getCrons().length==0;
                         } ,this);
                         
                     },
                     handler: function(presets) {
                         if (!confirm(presets.length+" presets will be removed. Proceed?")) return;
                         
                         App.mainBox = App.progressMsg("Presets","Deleting presets...");
                         
                         App.API.Presets.removePresets(presets,function() {
                             App.mainBox.progress(100);
                             App.mainBox.done();
                         },this);
                         
                     },
                     scope:this
                 }
                 
             ]
             
        });
        
        
        App.Widget.PresetsTable.superclass.constructor.call(this,config);
        
        
        
        
        var me=this;
       
        this.presetCrons = new App.Widget.CronsTable({
                    id:"preset-crons",
                    rowType:"nodatalink",
                    actions: [{
                     label: "Remove",
                     hint: "Removes selected crons",
                     iconClass:"ico-btn ico-btn-job_cancel",
                     multi: true,
                     scope:this,
                     validator: function(crons) {
                         return crons.some(function(cron) {
                                return cron.hasPermission(croupier.CronPermission.remove);
                         });
                         
                     },
                     handler: function(crons) {
                         
                         if (!confirm(crons.length +" crons will be removed. Are you sure?")) return;
                     
                         App.mainBox = App.progressMsg("Crons","Deleting crons...");
                         
                         App.API.Crons.removeCrons(crons,function() {
                             App.mainBox.progress(100);
                             App.mainBox.done();
                         });
                         
                     },
                     scope:this
                 }]
                    
        });
        
        
        this.actionsTable = new App.Widget.ActionsTable({
            id: "table-actions",
            dom: "tip"
        });
        
        this.presetCrons.$.hide().siblings("header").hide();
        
        
        
          if (croupier && !config.noSync) {
           
            croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.preset$add],function(data) {
                console.info("[Presets] new model added. ID:"+data.id);
                    this.addRow(data);
                    this.initHeader();
            },this);
            croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.preset$set],function(data,id) {
                console.info("[Presets] model updated. ID:"+id);
                    this.updateRow(App.API.Presets.getPreset(id));
                    this.initHeader();
            },this);
            
            croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.preset$remove],function(data,id) {
                console.info("[preset] captured remove event");
                    
                    this.deleteRowModel(id);
                   this.initHeader();
            },this);
        }
        
    },
    initHeader: function() {
        var me= this;
        $("#"+this.id+" table td a[data-presetid]").off("click").click(function() {
            console.debug("edit click");
            me.editPreset(App.API.Presets.getPreset($(this).attr("data-presetid")));
        });
        
       
        
        this.constructor.superclass.initHeader.call(this);
    },
    editPreset: function(preset) {
        var me= this;
        console.debug("editPreset");
        this.presetCrons.load(preset.getCrons());
        this.presetCrons.$.show().siblings("header").show();
        $("#"+this.id+"_cronsSel").hide();
        
        this.$det("name").val(preset.name);
        this.$det("desc").val(preset.description || "");
        
                
        this.actionsTable.load(preset.getActions());
        
        
        
        this.$det("saveBtn").off("click").click(function() {
        
            if (!me.$det("name").formValidate()) return;
                        
            me.savePreset(preset);
        });
        
        this.$det("cancelBtn").off("click").click(function() {
            me.$det("data").hide();
        });
        
        this.$det("dataTitle").text("Edit preset: "+preset.name);
        this.$det("data").modal({backdrop:"static"}).show();
        
    },
    newPreset: function() {
                    var me=this;
                    this.cronsList = new App.Widget.CronsSelectBox({id: this.id+"_cronsSel", persistentContainer:true});  
                    this.cronsList.load(App.API.Crons.getCrons());
                    $("#"+this.id+"_cronsSel").show(); 
                    this.$det("dataTitle").text("New preset");
                    this.presetCrons.$.hide();
                    $("#"+this.presetCrons.id+"_header").hide();
                    $("#"+this.actionsTable.id+"_header").show();
                    this.actionsTable.adjust();
                    this.actionsTable.load([]);
                    
                    this.$det("data").modal({backdrop:"static"}).show();
                    
                     this.$det("saveBtn").off("click").click(function() {
                       
                        if (!me.$det("name").formValidate()) return;
                        
                        me.savePreset();
                        
                     });
        
                    this.$det("cancelBtn").off("click").click(function() {
                         me.$det("data").hide();
                    });
                    
                    this.$det("name").val("");
                    this.$det("desc").val("");
                    
    },
    duplicatePreset: function(preset)
    {
        this.newPreset();
        this.$det("dataTitle").text("New preset | Duplicated from preset:"+preset.name);
                     
        this.actionsTable.load(preset.getActions());
        
    }
    ,
    savePreset:function(preset) {
       var me=this;
        if (preset) {
           preset.name =  this.$det("name").val();
           preset.description = this.$det("desc").val();
           preset.setActions(this.actionsTable.rows);
           
          App.mainBox= App.progressMsg("Presets","Saving preset: "+preset.name);
           preset.on("updated",function() {
              App.mainBox.progress(100); 
              App.mainBox.done(); 
              
              window.setTimeout(function() {
                  me.$det("data").hide();
              },2000);
           });
           preset.update();
           
        } else {
           var preset = new App.Model.Preset({id:null});
           preset.name =  this.$det("name").val();
           preset.description = this.$det("desc").val();
           preset.setActions(this.actionsTable.rows);
           
           
               
          App.mainBox=App.progressMsg("Presets","Creating new preset: "+preset.name);            
           
           preset.on("inserted",function(v) {
              App.mainBox.progress(100); 
              App.mainBox.done(); 
              
              window.setTimeout(function() {
                  me.$det("data").hide();
              },2000);
              
              if (this.cronsList.val()!=null) 
            {
             App.mainBox=App.progressMsg("Presets","Resetting crons for created preset...");
           
                this.cronsList.val().forEach(function(cronid) {
               var cron = App.API.Crons.getCron(cronid);
               
               preset.id =v;
               cron.preset = preset;
               cron.on("updated",function() {
                     App.mainBox.progress(100); 
                     App.mainBox.done();
                     
                     me.updateRow(preset);
               })
               
               cron.update();
               
           });
          }     
              
              
              
              
           },this);
           preset.insert();
           
        }
    }
    
});

