Ext.ns("App.Widget");

/**
 * @class CronsTable
 * @extends App.Widget.Table
 * @memberof App#Widget
 * @namespace App.Widget
 */
App.Widget.CronsTable = Ext.extend(App.Widget.Table,{
    WEEKDAYS: ["Monday","Thusday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    MONTH:["January","Febrary","March","April","May","June","July","August","September","October","November","December"],
    constructor: function(config) {
        config=App.Widget.Table.makeSelectable(config);
        //Ext.applyIf(config,App.Widget.Table.Selectable); //Make Table checkbox-selectable
        
        
        Ext.applyIf(config, {
                
             rowClass: App.Model.Cron,
             actions: [
                  {
                           label: "New",
                           hint: "Create a new cron",
                           iconClass: "ico-btn ico-btn-pool_add",
                           noRowsAllowed: true,
                           multi:true,
                           scope:this,
                           validator: function() {
                                                              
                               return true;
                               
                           },
                           handler: function() {
                              var me=this; 
                              var $det= function(id) {
                                  return $("#"+me.id+"_"+id);
                                }; 
                                
                                this.clearForm();
                              $det("cronDetails").modal({backdrop:"static"}).show();
                              $det("cronDetails_title").text("New Cron");
                              
                                                            
                              $("#"+this.id+"_saveBtn").off("click")
                                      .click(function() {
                                          me.addCron();
                                         
                               });
                               
                           }
                  },
                  
                  {
                           label: "Edit",
                           hint: "Edits selected cron",
                           iconClass: "ico-btn ico-btn-view_details",
                           scope:this,
                           
                           validator: function(crons) {
                                                              
                               return true;
                               
                           },
                           handler: function(crons) {
                               var cron=crons[0];
                               this.clearForm();
                               this.editCron(cron);
                               
                           }
                  }
                 ,
                 
                 {
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
                 }
             ]
             
        });
        
        
        App.Widget.CronsTable.superclass.constructor.call(this,config);
        
        var me=this;
        
        this.on("loaded",function() {
            this._prepareDetails();   
            
            
            
        },this);
        
        
        if (croupier && !config.noSync) {
           
            croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.cron$add],function(data) {
                console.info("[Crons] new model added. ID:"+data.id);
                    this.addRow(data);
                    this.initHeader();
            },this);
            croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.cron$set],function(data,id) {
                console.info("[Crons] model updated. ID:"+id);
                    this.updateRow(App.API.Crons.getCron(id));
                    this.initHeader();
            },this);
            
            
            
            croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.cron$remove],function(data,id) {
                console.info("[crons] captured remove event");
                    
                   this.deleteRowModel(id);
                   this.initHeader();
            },this);
        }
        
        
    },
    clearForm: function() {
        var me=this;
        var $det= function(id) {
            return $("#"+me.id+"_"+id);
        };
        
        
        $det("name").val("");
        $det("desc").val("");
        //$det("preset").val(0);
        
        $det("minute").val(null).trigger("chosen:updated");
        $det("hour").val(null).trigger("chosen:updated");
        $det("day").val(null).trigger("chosen:updated");
        $det("month").val(null).trigger("chosen:updated");
        $det("dweek").val(null).trigger("chosen:updated");
        $det("year").val(null).trigger("chosen:updated");
        
        $det("minute_all").prop("checked",true);
        $det("hour_all").prop("checked",true);
        $det("day_all").prop("checked",true);
        $det("month_all").prop("checked",true);
        $det("dweek_all").prop("checked",true);
        $det("year_all").prop("checked",true);
        
        this.$minute.siblings("div").hide();
        this.$hour.siblings("div").hide();
        this.$day.siblings("div").hide();
        this.$dweek.siblings("div").hide();
        
        this.$month.siblings("div").hide();
        this.$year.siblings("div").hide();
        $("#"+$det("day_all").attr("data_disable")).hide();
        $("#"+$det("dweek_all").attr("data_disable")).hide();
        $("#"+$det("month_all").attr("data_disable")).hide();
        $("#"+$det("year_all").attr("data_disable")).hide();
        
    }
    ,
    initHeader: function() {
        var me =this;
        $("#"+this.id+" table td a[data-cronid]").off("click").click(function() {
            me.editCron(App.API.Crons.getCron($(this).attr("data-cronid")));
        });
        
        this.constructor.superclass.initHeader.call(this);
    }
    ,
    addCron: function() {
        var me=this;
        var $det= function(id) {
            return $("#"+me.id+"_"+id);
        };
        
        if (!$det("name").formValidate()) return;
        var hour = $det("hour").val()!=null?$det("hour").val().toString():"",
            minute =$det("minute").val()!=null?$det("minute").val().toString():"",
            day = $det("day").val()!=null?$det("day").val().toString():"",
            dweek = $det("dweek").val()!=null?$det("dweek").val().toString():"",
            year = $det("year").val()!=null?$det("year").val().toString():"",
            month =  $det("month").val()!=null?$det("month").val().toString():"";
    
        var cron = new App.Model.Cron({
            hour: $det("hour_all").prop("checked")? "*":hour,
            minute: $det("minute_all").prop("checked")? "*":minute,
            day: $det("day_all").prop("checked")? "*":day,
            dayOfWeek: $det("dweek_all").prop("checked")? "*":dweek,
            year: $det("year_all").prop("checked")? "*":year,
            month:$det("month_all").prop("checked")? "*":month,
            preset: $det("preset").val(),
            name: $det("name").val(),
            description: $det("desc").val()
        });
        
        App.mainBox = App.progressMsg("Add Cron","Creating new cron...");
        cron.on("inserted",function() {
            App.mainBox.progress(100);
            App.mainBox.done();
            
            window.setTimeout(function() {$det("cronDetails").hide();},1000);
            
        },this);
        cron.insert();
        
        
    },
    editCron : function(cron) {
        var me=this;
        var $det= function(id) {
            return $("#"+me.id+"_"+id);
        };
        this.clearForm();
        $det("name").val(cron.name);
        $det("desc").val(cron.description);
        
        $det("preset").val(cron.preset.id);
        
        if (cron.minute!=="*") {
            $det("minute").val(cron.minute.split(","));
            $det("minute_all").prop("checked",false);
            this.$minute.siblings("div").show();
            this.$minute.trigger("chosen:updated");
        }    
        
        if (cron.hour!=="*") {
            $det("hour").val(cron.hour.split(","));
            $det("hour_all").prop("checked",false);
            this.$hour.siblings("div").show();
            this.$hour.trigger("chosen:updated");
        }    
        
       if (cron.day!=="*") {
            $det("day").val(cron.day.split(","));
            $det("day_all").prop("checked",false);
            this.$day.siblings("div").show();
            this.$day.trigger("chosen:updated");
        }    
        if (cron.dayOfWeek!=="*") {
            $det("dweek").val(cron.dayOfWeek.split(","));
            $det("dweek_all").prop("checked",false);
            this.$dweek.siblings("div").show();
            this.$dweek.trigger("chosen:updated");
        }    
        
        if (cron.month!=="*") {
            $det("month").val(cron.month.split(","));
            $det("month_all").prop("checked",false);
            this.$month.siblings("div").show();
            this.$month.trigger("chosen:updated");
        }    
        
        if (cron.year!=="*") {
            $det("year").val(cron.year.split(","));
            $det("year_all").prop("checked",false);
            this.$year.siblings("div").show();
            this.$year.trigger("chosen:updated");
        }    
        
        $det("cronDetails").modal({backdrop:"static"}).show();
        $det("cronDetails_title").text("Edit Cron");
        
        $det("saveBtn").off("click").click(function() {
            me.saveCron(cron);
        });
        
    },
    saveCron: function(cron) {
        var me=this;
        var $det= function(id) {
            return $("#"+me.id+"_"+id);
        };
        if (!$det("name").formValidate()) return;
        
        cron.name =$det("name").val();
        cron.description =$det("desc").val();
        cron.preset = App.API.Presets.getPreset($det("preset").val());
        cron.minute = $det("minute_all").prop("checked")?"*": $det("minute").val().toString();
        cron.hour = $det("hour_all").prop("checked")?"*": $det("hour").val().toString();
        cron.day =$det("day_all").prop("checked")?"*": $det("day").val().toString();
        cron.dayOfWeek = $det("dweek_all").prop("checked")?"*": $det("dweek").val().toString();
        cron.month = $det("month_all").prop("checked")?"*": $det("month").val().toString();
        cron.year = $det("year_all").prop("checked")?"*": $det("year").val().toString();
        
        App.mainBox = App.progressMsg("Edit Cron","Saving cron data...");
        
        cron.on("updated",function() {
            
            
           App.mainBox.progress(100);
           App.mainBox.done();
           
          window.setTimeout(function() {$det("cronDetails").hide();},1000); 
        });
        cron.update();
        
    }
    ,
    _prepareDetails: function() {
        var me=this;
        var $det=function(id) {return $("#"+me.id+"_"+id);}
        
        var presets = App.API.Presets.getPresets();
        
        $det("preset").empty();
        
        presets.forEach(function(preset) {
            
            $("<option>")
                    .attr("value",preset.id)
                    .text(preset.name)
                    .appendTo($det("preset"));
           
        },this);
        
        $det("preset").chosen({width:"200px"});
        
        
        
        for (day=1;day<=31;day++)
        {
            $("<option>")
                    .attr("value",day)
                    .text(day)
                    .appendTo($det("day"));
        }
        
        
        for (hour=0;hour<=24;hour++)
        {
            $("<option>")
                    .attr("value",hour)
                    .text(hour)
                    .appendTo($det("hour"));
        }
        
        for (minute=0;minute<=60;minute++)
        {
            $("<option>")
                    .attr("value",minute)
                    .text(minute)
                    .appendTo($det("minute"));
        }
        
        
        for (year=new Date().getFullYear();year<=new Date().getFullYear()+100;year++)
        {
            $("<option>")
                    .attr("value",year)
                    .text(year)
                    .appendTo($det("year"));
        }
        
        
        var i=1;
        this.WEEKDAYS.forEach(function(wday) {
            $("<option>")
                    .attr("value",i)
                    .text(wday)
                    .appendTo($det("dweek"));
           i++; 
        });
        

         var i=1;
        this.MONTH.forEach(function(m) {
            $("<option>")
                    .attr("value",i)
                    .text(m)
                    .appendTo($det("month"));
           i++; 
        });
       
        
        var _chHandler = function() {
            $("#"+$(this).attr("data-disable"))[this.checked?"hide":"show"]();

        }
        
        
        $det("minute_all").change(_chHandler);
        $det("hour_all").change(_chHandler);
        $det("day_all").change(_chHandler);
        $det("dweek_all").change(_chHandler);
        $det("month_all").change(_chHandler);
        $det("year_all").change(_chHandler);

        this.$day=$det("day").chosen({width:"70px"});
        this.$month=$det("month").chosen({width:"120px"});
        this.$year=$det("year").chosen({width:"80px"});
        this.$dweek=$det("dweek").chosen({width:"120px"});
        this.$hour=$det("hour").chosen({width:"70px"});
        this.$minute=$det("minute").chosen({width:"70px"});                    
        
        
    }
    
});

                                                                                                                                                                                                                                                                                                                                                                                                                      