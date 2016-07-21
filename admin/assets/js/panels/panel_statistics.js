Ext.ns("App.Panel");


App.Panel.Statistics = {
    constructor:function panel_stat(tab_id)
{

	
// 	panel_header.prototype = panel; /// P�ra que "herede" pero no vale de mucho de momento
	
/// ATRIBUTOS 
	
	this.html_id="statistics";
// 	this.url='assets/html/user_list.html';
	this.tab_id=tab_id;

	
	this.define=C.panels.panel_statistics;
	
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
                        .appendTo($("#stat_user"));
                },this);
                $("#stat_user").chosen();  
                
                        
            
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
            
            
            
           
            
           // App.mainBox = App.progressMsg("Statistics","Loading removed jobs...");
            
            this.groups.load(App.API.Groups.getGroups());
            
               
            
        }

	this.loaded_html= function ()
	{
              var me=this;
              this.plugins = new App.Widget.PluginsSelectBox({
                   id:"stat_plugins",
              });
                
               this.pluginsConfig = new App.Widget.PluginConfigSelectBox({
                   id:"stat_config",
                });
                this.groups = new App.Widget.GroupsSelectBox({
                    id: "stat_group",  
                });
                
                this.users=$("#stat_user");
                
                this.priorityStart = $("#stat_priority");
                this.priorityEnd = $("#stat_priority_end");
                
                $("#stat_priority_sel,#stat_priority_end_sel").append($("<option>").attr("value","-100").text("ULTRA_LOW"));
                $("#stat_priority_sel,#stat_priority_end_sel").append($("<option>").attr("value","-50").text("LOW"));
                $("#stat_priority_sel,#stat_priority_end_sel").append($("<option>").attr("value","0").text("NORMAL").attr("selected","selected"));
                $("#stat_priority_sel,#stat_priority_end_sel").append($("<option>").attr("value","50").text("HIGH"));
                $("#stat_priority_sel,#stat_priority_end_sel").append($("<option>").attr("value","100").text("ULTRA_HIGH"));
                
                //$("#stat_priority_sel,#stat_priority_end_sel").chosen();
                
            
            this.poolsPrimary = new App.Widget.PoolsSelectBox({
                id:"stat_pool_primary",
                label: "Primary pools"
            });
            this.poolsSecondary = new App.Widget.PoolsSelectBox({
                id:"stat_pool_secondary",
                label: "Secondary pools"
            });
            
            this.nodesPrimary = new App.Widget.NodesSelectBox({
                id:"stat_node_primary",
                label: "Primary nodes"
            });
            this.nodesSecondary = new App.Widget.NodesSelectBox({
                id:"stat_node_secondary",
                label: "Secondary nodes"
            });
            
            this.status = new App.Widget.JobStatusSelectBox({
                id: "stat_status"
            });
            
            
            this.nodesTable = new App.Widget.NodesTable({
                id:"stat_nodes",
                rowType:"stat",
                columnDefs: [],
                noSync: true
            });
            
            $("#stat_priority_sel").change(function() {
                $("#stat_priority").val($(this).val());
            });
            $("#stat_priority_end_sel").change(function() {
                $("#stat_priority_end").val($(this).val());
            });
            
            $(".datetimepicker").datetimepicker({locale:"es"});
            $(".timepicker").datetimepicker({locale:"es",format:"HH:mm:ss",useCurrent:false});
            
            
            
            $("#stat_btnOk").click(function() {
                if (!me.jobs || $("#stat_syncJobs").prop("checked")) {
                    
                
                App.mainBox=App.progressMsg("Statistics","Retrieving removed jobs list...");
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

	
 	App.Panel.Statistics.superclass.constructor.apply(this,arguments);
},
syncJobs: function() {
           
    
},
doSearch: function() {
    var me=this;
    function $f(id) {return $("#stat_"+id);}
    
    App.mainBox=App.progressMsg("Statistics","Calculating data...");
    
   
    var jobs = $.merge(Array.from(this.jobs),App.API.Jobs.getJobs());
    
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
         App.mainBox.progress(50);
         
        $f("total").text(jobs.length);
        
        var errors=0,warnings=0,jobsfinished=0,pause=0,pending=0,processing=0,totalexec=0,avgexec=0,totallive=0,avglive=0;
        
        jobs.forEach(function(job) {
            if (job.errors && job.errors>0) errors++;
            if (job.warnings && job.warnings>0) warnings++;
            if (job.status == croupier.JobStatus.EXECUTED) {
                jobsfinished++;
                totalexec+=job.time||0;
            }  
            if (job.status == croupier.JobStatus.PAUSED) pause++;
            if (job.status == croupier.JobStatus.ENABLED) pending++;
            if (job.status == croupier.JobStatus.EXECUTING){
               processing++;  
               totallive+=parseInt(moment().format("x"))-job.start;
               console.debug(job.start);
            } 
            
        });
         
         avgexec=Math.round(totalexec/jobsfinished);
         avglive=Math.round(totallive/processing);
         
         avgexec=isNaN(avgexec)?0:avgexec;
         avglive=isNaN(avglive)?0:avglive;
         
         
         totalexec = {
             sec:parseInt((totalexec/1000)%60),
             min:parseInt((totalexec/(1000*60))%60),
             hours: parseInt((totalexec/(1000*60*60))%24)
         }
         
         
         totallive = {
             sec:parseInt((totallive/1000)%60),
             min:parseInt((totallive/(1000*60))%60),
             hours: parseInt((totallive/(1000*60*60))%24)
         }
         
         
         avgexec = {
             sec:parseInt((avgexec/1000)%60),
             min:parseInt((avgexec/(1000*60))%60),
             hours: parseInt((avgexec/(1000*60*60))%24)
         }
         
         
         avglive = {
             sec:parseInt((avglive/1000)%60),
             min:parseInt((avglive/(1000*60))%60),
             hours: parseInt((avglive/(1000*60*60))%24)
         }
         
         
         
         
         $f("errors").text(errors);
         $f("warnings").text(warnings);
         $f("jobsfinished").text(jobsfinished);
         $f("pause").text(pause);
         $f("pending").text(pending);
         $f("processing").text(processing);
         $f("totalexec").text(totalexec.hours+"h "+totalexec.min+"min "+totalexec.sec+"sec");
         $f("avgexec").text(avgexec.hours+"h "+avgexec.min+"min "+avgexec.sec+"sec");
         $f("totallive").text(totallive.hours+"h "+totallive.min+"min "+totallive.sec+"sec");
         $f("avglive").text(avglive.hours+"h "+avglive.min+"min "+avglive.sec+"sec");
         
         
         this.nodesTable.on("loaded",function() {
            App.mainBox.progress(100);
            App.mainBox.done();
         })
         
         
         var nodes = App.API.Nodes.getNodes().map(function(node) {
                node.totalJobs = jobs.filter(function(job) {return $.isPlainObject(job.node) && job.node.id == node.id}).length;
                return node;
         });
         
         this.nodesTable.load(nodes);
         
         
}
    
    
}
App.Panel.Statistics = Ext.extend(App.Panel,App.Panel.Statistics);
window.panel_statistics = App.Panel.Statistics;
