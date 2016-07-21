Ext.ns("App.Panel");


App.Panel.History = {
    constructor:function panel_history(tab_id)
{

	
// 	panel_header.prototype = panel; /// P�ra que "herede" pero no vale de mucho de momento
	
/// ATRIBUTOS 
	
	this.html_id="history";
// 	this.url='assets/html/user_list.html';
	this.tab_id=tab_id;

	
	this.define=C.panels.panel_history;
	
        this.initialLoad= function() {
            var me=this;
            
                this.plugins.on("change",function(ch) {
                    this.plugin  = this.plugins.getSelectedModel();
                    this.pluginsConfig.load(this.plugin.getConfigurations());
                },this);
                this.plugins.load(App.API.Plugins.getPlugins());
            
            App.API.Users.getUsers().forEach(function(user) {
                    $("<option>")
                        .attr("value",user.id)
                        .text(user.name)
                        .appendTo($("#history_user"));
                },this);
                $("#history_user").chosen({width:"200px",placeholder_text_multiple:"Select users"});  
                
                        
            
            this.poolsPrimary.on("loaded",function() {
                
                this.poolsPrimary.syncListWith(this.poolsSecondary);
            },this);
            
            this.poolsSecondary.on("loaded",function() {
                this.poolsSecondary.syncListWith(this.poolsPrimary)
            },this);
            
            
            this.poolsPrimary.load(App.API.Pools.getPools());
            this.poolsSecondary.load(App.API.Pools.getPools());
            
            
            this.nodesPrimary.on("loaded",function() {
                
                this.nodesPrimary.syncListWith(this.nodesSecondary);
            },this);
            
            this.nodesSecondary.on("loaded",function() {
                this.nodesSecondary.syncListWith(this.nodesPrimary)
            },this);
            
            
            this.nodesPrimary.load(App.API.Nodes.getNodes());
            this.nodesSecondary.load(App.API.Nodes.getNodes());
            
            
            
           
            
           // App.mainBox = App.progressMsg("History","Loading removed jobs...");
            
            this.groups.load(App.API.Groups.getGroups());
            
               
            
        }

	this.loaded_html= function ()
	{
              var me=this;
              this.plugins = new App.Widget.PluginsSelectBox({
                   id:"history_plugins",
              });
                
               this.pluginsConfig = new App.Widget.PluginConfigSelectBox({
                   id:"history_config",
                });
                this.groups = new App.Widget.GroupsSelectBox({
                    id: "history_group",  
                });
                
                this.users=$("#history_user");
                
                this.priorityStart = $("#history_priority");
                this.priorityEnd = $("#history_priority_end");
                
                $("#history_priority_sel,#history_priority_end_sel").append($("<option>").attr("value","-100").text("ULTRA_LOW"));
                $("#history_priority_sel,#history_priority_end_sel").append($("<option>").attr("value","-50").text("LOW"));
                $("#history_priority_sel,#history_priority_end_sel").append($("<option>").attr("value","0").text("NORMAL").attr("selected","selected"));
                $("#history_priority_sel,#history_priority_end_sel").append($("<option>").attr("value","50").text("HIGH"));
                $("#history_priority_sel,#history_priority_end_sel").append($("<option>").attr("value","100").text("ULTRA_HIGH"));
                
                //$("#history_priority_sel,#history_priority_end_sel").chosen();
                
            this.jobsTable = new App.Widget.JobsTable({
                id:"table-jobs",
                rowType:"history",
                noSync: true,
                actions: 
                   [
                    {
                            label: "Recover",
                            hint : "Recovers selected jobs from removed jobs list",
                            iconClass: "ico-btn ico-btn-node_power_on",
                            multi: true,
                            handler: function(jobs) {
                                App.mainBox = App.progressMsg("Jobs","Recovering job(s)..." );
                                App.API.multiAction("recover","job",jobs);
                                
                                
                                
                            },
                            validator: function() {
                               return true;
                            }
                    }
                 ]
                
            });
            
            this.poolsPrimary = new App.Widget.PoolsSelectBox({
                id:"history_pool_primary",
                label: "Primary pools"
            });
            this.poolsSecondary = new App.Widget.PoolsSelectBox({
                id:"history_pool_secondary",
                label: "Secondary pools"
            });
            
            this.nodesPrimary = new App.Widget.NodesSelectBox({
                id:"history_node_primary",
                label: "Primary nodes"
            });
            this.nodesSecondary = new App.Widget.NodesSelectBox({
                id:"history_node_secondary",
                label: "Secondary nodes"
            });
            
            this.status = new App.Widget.JobStatusSelectBox({
                id: "history_status"
            });
            
            $("#history_priority_sel").change(function() {
                $("#history_priority").val($(this).val());
            });
            $("#history_priority_end_sel").change(function() {
                $("#history_priority_end").val($(this).val());
            });
            
            $(".datetimepicker").datetimepicker({locale:"es"});
            $(".timepicker").datetimepicker({locale:"es",format:"HH:mm:ss",useCurrent:false});
            
            
            
            $("#history_btnOk").click(function() {
                if (!me.jobs || $("#history_syncJobs").prop("checked")) {
                    
                
                App.mainBox=App.progressMsg("History","Retrieving removed jobs list...");
                croupier.api.job$listRemoved(null,function(res) {
                me.jobs = res.value.map(function(job) {
                    return new App.Model.Job(job);
                });
                
                
                App.mainBox.progress(100);
                App.mainBox.done();
                
                me.doSearch();
               // me.jobsTable.load(me.jobs);
            });  
           } else {
               me.doSearch();
           }
            });
            
            this.constructor.superclass.loaded_html.apply(this,arguments);
	}  

	
 	App.Panel.History.superclass.constructor.apply(this,arguments);
},
syncJobs: function() {
           
    
},
doSearch: function() {
    var me=this;
    function $f(id) {return $("#history_"+id);}
    
    App.mainBox=App.progressMsg("History","Searching jobs...");
    
   
    var jobs = Array.from(this.jobs);
    
         jobs = jobs.filter(function(job) {
            var name = $f("name").val().length>0 ? 
                        job.name.search($f("name").val()) !==-1 : true;
            var plugin = this.plugins.val() ?
                            job.plugin.split(":")[0] ==this.plugins.val() : true;
            var config = this.pluginsConfig.val() ?
                            job.plugin == this.pluginsConfig.val() : true;
            var group = this.groups.val()!=null ?
                                this.groups.val().contains(job.group ? job.group.toString() : null) : true;
            var user = $f("user").val()!=null ?
                               $f("user").val().contains(job.user ? job.user.toString() : null) : true;
                               
             
            var priority=exectime=finished=creation = true; 
             
             
            if ($f("exectime").data("DateTimePicker").date()!=null && $f("exectime_end").data("DateTimePicker").date()!=null) {
                var time_start = ($f("exectime").data("DateTimePicker").date().hours()*3600+$f("exectime").data("DateTimePicker").date().minutes()*60+$f("exectime").data("DateTimePicker").date().seconds())*1000,
                    time_end = ($f("exectime_end").data("DateTimePicker").date().hours()*3600+$f("exectime_end").data("DateTimePicker").date().minutes()*60+$f("exectime_end").data("DateTimePicker").date().seconds())*1000;
              
               var exectime = job.time >= time_start  &&  job.time<=time_end;
            }  else if($f("exectime").data("DateTimePicker").date()!=null && $f("exectime_end").data("DateTimePicker").date()==null) {
                var time_start = ($f("exectime").data("DateTimePicker").date().hours()*3600+$f("exectime").data("DateTimePicker").date().minutes()*60+$f("exectime").data("DateTimePicker").date().seconds())*1000;
                
                var exectime = job.time >= time_start;
            }
            
            
            if ($f("creation").data("DateTimePicker").date()!=null && $f("creation_end").data("DateTimePicker").date()!=null) {
                var time_start = $f("creation").data("DateTimePicker").date().valueOf(),
                    time_end = $f("creation_end").data("DateTimePicker").date().valueOf();
              
               var creation = job.created >= time_start &&  job.created<=time_end;
            }  else if($f("creation").data("DateTimePicker").date()!=null && $f("creation_end").data("DateTimePicker").date()==null) {
                var time_start = $f("creation").data("DateTimePicker").date().valueOf()
                
                var creation = job.created >= time_start;
            }
            
            if ($f("finished").data("DateTimePicker").date()!=null && $f("finished_end").data("DateTimePicker").date()!=null) {
                var time_start = $f("finished").data("DateTimePicker").date().valueOf(),
                    time_end = $f("finished_end").data("DateTimePicker").date().valueOf();
              
               var finished = job.finish >= time_start && job.finish <= time_end;
            }  else if($f("finished").data("DateTimePicker").date()!=null && $f("finished_end").data("DateTimePicker").date()==null) {
                var time_start = $f("finished").data("DateTimePicker").date().valueOf();
                
                var finished = job.finish >= time_start;
             }
             
             if ($f("priority").val()!="" && $f("priority_end").val()!="") {
                 priority=job.priority >=$f("priority").val() && job.priority <= $f("priority_end").val()
             } else if ($f("priority").val()!="" && $f("priority_end").val()=="")
             {
                 priority = job.priority == $f("priority").val();
             }
             
             if (this.poolsPrimary.val()!=null) {
                 var primPools = Array.isArray(job.$primaryPools)?job.$primaryPools.equal(this.poolsPrimary.val().toNumerics()):false;
             } else 
                 var primPools = true;
             
             if (this.poolsSecondary.val()!=null) {
                 var secPools = Array.isArray(job.$poolsSecondary)?job.$secondaryPools.equal(this.poolsSecondary.val().toNumerics()):false;
             } else 
                 var secPools = true;
             
             if (this.nodesPrimary.val()!=null) {
                 var primNodes = Array.isArray(job.$primaryNodes)?job.$primaryNodes.equal(this.nodesPrimary.val().toNumerics()):false;
             } else 
                 var primNodes = true;
             
             if (this.nodesSecondary.val()!=null) {
                 var secNodes = Array.isArray(job.$secondaryNodes)?job.$secondaryNodes.equal(this.nodesSecondary.val().toNumerics()):false;
             } else 
                 var secNodes = true;
             
             var status = this.status.val()!=null ? this.status.val().contains(job.status.toString()): true;

             /*console.debug("Status:"+job.status);
             console.debug(this.status.val());
             console.debug(status);*/
             return name && plugin && config && group && user && exectime && creation && finished && priority && primNodes && primPools && secNodes && secPools && status; 
             
         },this);
    
    
    
    
      var me=this;
    
   this.jobsTable.on("loaded",function() {
                App.mainBox.progress(100);
                App.mainBox.done();
                
              
      
                                
            },this);
    
    
    
    this.jobsTable.load(jobs);
    
    
              croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.job$add],function(data,id) {
                    // console.info("[Monitor "+me.tab_id+"] Node$remove event captured");
                     
                                          
                     me.jobsTable.deleteRow(data.longId);
                     me.jobsTable.initHeader();
                     //me.nodesTable.updateRow(croupier.data.nodes.get(id));
                     
                });
    
      
      
    
}
    
    
}
App.Panel.History = Ext.extend(App.Panel,App.Panel.History);
window.panel_history = App.Panel.History;
