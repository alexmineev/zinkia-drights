Ext.ns("App.Widget");

/**
 * 
 * @class JobsTable
 * @memberOf App#Widget
 * @namespace App.Widget
 * @extends App.Widget.Table
 *
 */
App.Widget.JobsTable = Ext.extend(App.Widget.JobsExtendedTable,{
            constructor: function(config) {
                var me =this;
                
                
                Ext.applyIf(config,{
                    rowClass: App.Model.Job,
                    pagingType: 'full_numbers',
               
                    actions: [
                        {
                            label: "Pause job(s)",
                            hint : "Pauses selected jobs",
                            iconClass: "ico-btn ico-btn-pause",
                            multi: true,
                            handler: function(jobs) {
                                
                                var cancel=confirm("Do you want also cancel and reexecute theese jobs?");
                                
                                App.mainBox = App.progressMsg("Jobs","Pausing job(s)...");
                                App.API.Jobs.pauseJobs(jobs,cancel,function() {
                                            App.mainBox.progress(100);
                                            App.mainBox.done();
                                });
                            },
                            validator: function(jobs) {
                                return jobs.some(function(job) {
                                    return job.hasPermission(croupier.JobPermission.set) &&
                                            job.status==croupier.JobStatus.EXECUTING;
                                });
                            }
                        },
                        {
                            label: "Resume job(s)",
                            hint : "Resumes selected jobs",
                            iconClass: "ico-btn ico-btn-play",
                            multi: true,
                            handler: function(jobs) {
                                App.mainBox = App.progressMsg("Jobs","Resuming job(s)...");
                                App.API.multiAction("resume","job",jobs);
                            },
                            validator: function(jobs) {
                                return jobs.some(function(job) {
                                    return job.hasPermission(croupier.JobPermission.set);
                                });
                            }
                        },
                        {
                            label: "Cancel job(s)",
                            hint : "Cancels selected jobs on they node",
                            iconClass: "ico-btn ico-btn-job_cancel",
                            multi: true,
                            handler: function(jobs) {
                                
                                var nodes = jobs.map(function(job) {
                                    return {id: job.node.id};//App.Model.isModel(job.node)? job.node:App.API.Nodes.getNode(job.node);
                                });
                                App.mainBox = App.progressMsg("Jobs","Resuming job(s)...");
                                App.API.multiAction("cancelJobs","node",nodes);
                            },
                            validator: function(jobs) {
                                return jobs.some(function(job) {
                                    return job.node && App.Model.Abstract.prototype.hasPermission.call(job.node,croupier.NodePermission.cancelJobs);
                                });
                            }
                        },
                        {
                            label: "Retry job(s)",
                            hint : "Reexecutes selected jobs (Jobs must be in ERROR state).",
                            iconClass: "ico-btn ico-btn-node_reboot",
                            multi: true,
                            handler: function(jobs) {
                                App.mainBox = App.progressMsg("Jobs","Relaunching job(s)...");
                                App.API.multiAction("retry","job",jobs);
                            },
                            validator: function(jobs) {
                                return jobs.some(function(job) {
                                    return job.status == croupier.JobStatus.ERROR ||
                                            job.status == croupier.JobStatus.RETRY; 
                                });
                            }
                        },
                        {
                            label: "Change priority",
                            hint : "Sets a new priority for the selected job(s)",
                            iconClass: "ico-btn ico-btn-priority",
                            multi: true,
                            handler: function(jobs) {
                                var rule = App.API.Users.getCurrentUser().isSuperAdministrator()?"-255 and +255":"-100 and +100",
                                priority = prompt("Enter new priority. (Value must be between "+rule+" )");
                        
                                if ($.isNumeric(priority) && (App.API.Users.getCurrentUser().isSuperAdministrator() ? (priority>=-255 && priority<=255):(priority>=-100 && priority<=100)))
                                {
                                    App.mainBox = App.progressMsg("Jobs","Setting priority of job(s) to:"+priority);
                                    App.API.Jobs.setPriority(jobs,priority);
                                } else {
                                    App.errorMsg("Invalid priority value","Priority value must be numeric, and between "+rule);
                                }
                        
                            },
                            validator: function(jobs) {
                                return jobs.some(function(job) {
                                    return job.hasPermission(croupier.JobPermission.set) && job.status!=croupier.JobStatus.EXECUTED;
                                });
                            }
                        },
                        {
                            label: "Remove job",
                            hint : "Removes selected job(s)",
                            iconClass: "ico-btn ico-btn-job_delete",
                            multi: true,
                            handler: function(jobs) {
                                if (!confirm("Do you really want to remove selected job(s)?")) return;
                                App.mainBox = App.progressMsg("Jobs","Removing job(s)...");
                                
                                App.API.Jobs.removeJobs(jobs,false);
                            },
                            validator: function(jobs) {
                                return jobs.some(function(job) {
                                    return job.hasPermission(croupier.JobPermission.remove);
                                });
                            }
                        },{
                            label: "Disable job(s)",
                            hint : "Cancels selected job(s),and no execute until it will be enabled",
                            iconClass: "ico-btn ico-btn-node_power_off",
                            multi: true,
                            handler: function(jobs) {
                                App.mainBox = App.progressMsg("Jobs","Disabling jobs...");
                                App.API.Jobs.enableJobs(jobs,false);
                            },
                            validator: function(jobs) {
                                return jobs.some(function(job) {
                                    return job.hasPermission(croupier.JobPermission.set) && job.status!=croupier.JobStatus.DISABLED;
                                });
                            }
                        },{
                            label: "Enable job(s)",
                            hint : "Enables disabled job(s)",
                            iconClass: "ico-btn ico-btn-node_power_on",
                            multi: true,
                            handler: function(jobs) {
                                App.mainBox = App.progressMsg("Jobs","Enabling jobs...");
                                App.API.Jobs.enableJobs(jobs,true);
                            },
                            validator: function(jobs) {
                                return jobs.some(function(job) {
                                    return job.hasPermission(croupier.JobPermission.set) && job.status == croupier.JobStatus.DISABLED;
                                });
                            }
                        },
                        {
                            label: "Show log",
                            hint : "Opens a log viewer and load the log file of the job",
                            iconClass: "ico-btn ico-btn-log",
                            
                            handler: function(jobs) {
                                
                                var job=jobs[0];
                                
                                this.logViewer = new App.Widget.LogViewer({
                                    id: this.id+"_jobLog",
                                });
                                
                                this.logViewer = new App.Widget.LogViewer({
                                    id: this.id+"_jobLog",
                                    logName:job.name,
                                    title:"Job Log"
                                });
                                
                                job.on("log",function(log) {
                                    App.mainBox.progress(100);
                                    App.mainBox.done();
                                    
                                    this.logViewer.loadLog(log);
                                    this.logViewer.show();
                                },this);
                                
                                App.mainBox = App.progressMsg("Jobs","Loading log of job: "+job.name);
                                job.requestLog();
                                
                                
                            },
                            validator: function(jobs) {
                                return jobs.some(function(job) {
                                    return job.hasPermission(croupier.JobPermission.get);
                                });
                            }
                        },
                        {
                            label: "Duplicate job",
                            hint : "Opens a 'New Job' dialogbox and loads the same data as in selected job",
                            iconClass: "ico-btn ico-btn-job_duplicate",
                            
                            handler: function(jobs) {
                                var job=jobs[0];
                                
                                this.panelNewJob = new App.Panel.NewJob();
                                this.panelNewJob.show();
                                
                                $("#create-new-job").modal({backdrop:"static"});
                                this.panelNewJob.loadJobData(job);
                                
                                
                            },
                             validator: function(jobs) {
                                return true;
                            },
                            scope:this
                        },
                        
                        {
                            label: "Change primary pools",
                            hint : "Ask's you for a list of pools and then set's them as a primary pools of all of the selected jobs",
                            iconClass: "ico-btn ico-btn-pool_primary",
                            multi: true,
                            handler: function(jobs) {
                                 var me=this;
                                console.debug("JOBS:"); 
                               console.debug(jobs);  
                               var _jobs = jobs;
                               this.poolBox.modal({backdrop:"static"});
                               //this.poolSelector.setLoadingMask();
                               if (!$("#"+this.poolBox.attr("id")+"_all").prop("checked")) {
                                   $("#"+this.poolBox.attr("id")+"_all").prop("checked",true);
                                   $("#"+this.poolBox.attr("id")+"_all").triggerHandler("change");
                               }
                               this.poolSelector.un("loaded");
                               this.poolSelector.on("loaded",function() {
                                   this.loadSelector(this.poolSelector,this.poolSelectorTable,jobs,"$primaryPools");
                               },this);
                               
                               this.poolSelector.load(App.API.Pools.getPools());
                               
                               $("#"+this.poolBox.attr("id")+"_applyBtn").off("click").on("click",function() {
                                    
                                    App.mainBox = App.progressMsg("Jobs","Assigning primary pools...");
                                    
                                    if ($("#"+me.poolBox.attr("id")+"_all").prop("checked")) { //Assign to ALL jobs
                                        
                                       console.debug(_jobs);  
                                       _jobs.forEach(function(job,n) {
                                           
                                           job.on("updated",function() {
                                               
                                                  
                                               if (n==_jobs.length-1){
                                                   App.mainBox.progress(100);
                                                   App.mainBox.done();
                                               } 
                                           });
                                           
                                           job.setPrimaryPools(me.poolSelector.val());
                                           
                                       }); 
                                        
                                    } else {
                                        var jobs = me.poolSelectorTable.getSelectedRows(); 
                                        jobs.forEach(function(job,n) {
                                            job.on("updated",function() {
                                               
                                                  
                                               if (n==jobs.length-1){
                                                   App.mainBox.progress(100);
                                                   App.mainBox.done();
                                               } 
                                           });
                                            
                                            job.setPrimaryPools(this.poolSelectorTable["selector"+job.id].val());
                                        },me);
                                        
                                    }
                                    
                                    
                                       
                                    
                                                                    
                                    
                                    
                                   
                               });
                               
                               
                            },
                            scope:this
                            ,
                            validator: function(jobs) {
                                
                                return jobs.some(function(job) {
                                    return job.hasPermission(croupier.JobPermission.set) && job.status!=croupier.JobStatus.EXECUTED && ((!Array.isArray(job.$primaryNodes) || job.$primaryNodes.length==0) && (!Array.isArray(job.$secondaryNodes) || job.$secondaryNodes.length==0));
                                });
                            }
                        },
                        {
                            label: "Change secondary pools",
                            hint : "Ask's you for a list of pools and then set's them as a secondary pools of all of the selected jobs",
                            iconClass: "ico-btn ico-btn-pool_secondary",
                            multi: true,
                            handler: function(jobs) {
                                   var me=this;
                               var _jobs =jobs;
                               this.poolBox.modal({backdrop:"static"});
                               //this.poolSelector.setLoadingMask();
                               this.poolSelector.on("loaded",function() {
                                  this.loadSelector(this.poolSelector,this.poolSelectorTable,jobs,"$secondaryPools");
                               },this);
                               
                               this.poolSelector.load(App.API.Pools.getPools());
                               
                               $("#"+this.poolBox.attr("id")+"_applyBtn").off("click").one("click",function() {
                                    
                                    App.mainBox = App.progressMsg("Jobs","Assigning secondary pools...");
                                    
                                    if ($("#"+me.poolBox.attr("id")+"_all").prop("checked")) { //Assign to ALL jobs
                                        
                                         
                                       _jobs.forEach(function(job,n) {
                                           
                                           job.on("updated",function() {
                                               
                                                  
                                               if (n==_jobs.length-1){
                                                   App.mainBox.progress(100);
                                                   App.mainBox.done();
                                               } 
                                           });
                                           
                                           job.setSecondaryPools(me.poolSelector.val());
                                           
                                       }); 
                                        
                                    } else {
                                        var jobs = me.poolSelectorTable.getSelectedRows(); 
                                        jobs.forEach(function(job,n) {
                                            job.on("updated",function() {
                                               
                                                  
                                               if (n==jobs.length-1){
                                                   App.mainBox.progress(100);
                                                   App.mainBox.done();
                                               } 
                                           });
                                            
                                            job.setSecondaryPools(this.poolSelectorTable["selector"+job.id].val());
                                        },me);
                                        
                                    }
                                 });         
                            },
                            validator: function(jobs) {
                                
                                return jobs.some(function(job) {
                                    return job.hasPermission(croupier.JobPermission.set) && job.status!=croupier.JobStatus.EXECUTED && ((!Array.isArray(job.$primaryNodes) || job.$primaryNodes.length==0) && (!Array.isArray(job.$secondaryNodes) || job.$secondaryNodes.length==0));
                                });
                            },
                            scope:this
                        },
                        {
                            label: "Change primary nodes",
                            hint : "Ask's you for a list of nodes and then set's them as a primary nodes of all of the selected jobs",
                            iconClass: "ico-btn ico-btn-node_primary",
                            multi: true,
                            handler: function(jobs) {
                                var me=this;
                               var _jobs=jobs;
                               this.nodeBox.modal({backdrop:"static"});
                               //this.nodeSelector.setLoadingMask();
                               this.nodeSelector.on("loaded",function() {
                                  this.loadSelector(this.nodeSelector,this.nodeSelectorTable,jobs,"$primaryNodes");
                               },this);
                               
                               this.nodeSelector.load(App.API.Nodes.getNodes());
                               
                               $("#"+this.nodeBox.attr("id")+"_applyBtn").off("click").one("click",function() {
                                    
                                    App.mainBox = App.progressMsg("Jobs","Assigning primary nodes...");
                                    
                                    if ($("#"+me.nodeBox.attr("id")+"_all").prop("checked")) { //Assign to ALL jobs
                                        
                                         
                                       _jobs.forEach(function(job,n) {
                                           
                                           job.on("updated",function() {
                                               
                                                  
                                               if (n==_jobs.length-1){
                                                   App.mainBox.progress(100);
                                                   App.mainBox.done();
                                               } 
                                           });
                                           
                                           job.setPrimaryNodes(me.nodeSelector.val());
                                           
                                       }); 
                                        
                                    } else {
                                        var jobs = me.nodeSelectorTable.getSelectedRows(); 
                                        jobs.forEach(function(job,n) {
                                            job.on("updated",function() {
                                               
                                                  
                                               if (n==jobs.length-1){
                                                   App.mainBox.progress(100);
                                                   App.mainBox.done();
                                               } 
                                           });
                                            
                                            job.setPrimaryNodes(this.nodeSelectorTable["selector"+job.id].val());
                                        },me);
                                        
                                    }
                                 });
                            },
                            validator: function(jobs) {
                               
                                return jobs.some(function(job) {
                                    return job.hasPermission(croupier.JobPermission.set) && job.status!=croupier.JobStatus.EXECUTED &&  ((!Array.isArray(job.$primaryPools) || job.$primaryPools.length==0) && (!Array.isArray(job.$secondaryPools) || job.$secondaryPools.length==0));
                                });
                            },
                            scope:this
                        },
                        {
                            label: "Change secondary nodes",
                            hint : "Ask's you for a list of nodes and then set's them as a secondary nodes of all of the selected jobs",
                            iconClass: "ico-btn ico-btn-node_secondary",
                            multi: true,
                            scope:this,
                            handler: function(jobs) {
                                     var me=this;
                               var _jobs=jobs;
                               this.nodeBox.modal({backdrop:"static"});
                               
                               this.nodeSelector.on("loaded",function() {
                                  this.loadSelector(this.nodeSelector,this.nodeSelectorTable,jobs,"$secondaryNodes");
                               },this);
                               
                               this.nodeSelector.load(App.API.Nodes.getNodes());
                               
                               $("#"+this.nodeBox.attr("id")+"_applyBtn").off("click").one("click",function() {
                                    
                                    App.mainBox = App.progressMsg("Jobs","Assigning secondary nodes...");
                                    
                                    if ($("#"+me.nodeBox.attr("id")+"_all").prop("checked")) { //Assign to ALL jobs
                                        
                                         
                                       _jobs.forEach(function(job,n) {
                                           
                                           job.on("updated",function() {
                                               
                                                  
                                               if (n==_jobs.length-1){
                                                   App.mainBox.progress(100);
                                                   App.mainBox.done();
                                               } 
                                           });
                                           
                                           job.setSecondaryNodes(me.nodeSelector.val());
                                           
                                       }); 
                                        
                                    } else {
                                        var jobs = me.nodeSelectorTable.getSelectedRows(); 
                                        jobs.forEach(function(job,n) {
                                            job.on("updated",function() {
                                               
                                                  
                                               if (n==jobs.length-1){
                                                   App.mainBox.progress(100);
                                                   App.mainBox.done();
                                               } 
                                           });
                                            
                                            job.setSecondaryNodes(this.nodeSelectorTable["selector"+job.id].val());
                                        },me);
                                        
                                    }
                                 });
                            },
                            validator: function(jobs) {
                              
                                return jobs.some(function(job) {
                                    return job.hasPermission(croupier.JobPermission.set) && job.status!=croupier.JobStatus.EXECUTED &&  ((!Array.isArray(job.$primaryPools) || job.$primaryPools.length==0) && (!Array.isArray(job.$secondaryPools) || job.$secondaryPools.length==0));
                                });
                            }
                        }
                        
                    ]
                });
                /**Constructing generic App.Table**/
                 
                App.Widget.JobsTable.superclass.constructor.call(this,config);
                
                
                /**
                 * Setting listeners
                 */
                
                this.on('loaded',function() {
                    console.log("JobsTable loaded");
                    
                    this._buildPoolSelector(this.id+"_poolSelector","Pools");
                    this._buildNodesSelector(this.id+"_nodeSelector","Nodes");
                    
                })
                
                 croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.job$remove],function(data,id) {
                    // console.info("[Monitor "+me.tab_id+"] Node$remove event captured");
                     
                                          
                     me.deleteRow(id);
                     me.initHeader();
                     //me.nodesTable.updateRow(croupier.data.nodes.get(id));
                     
                });
                //croupier.on();
                croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.job$add],function(data) {
                    // console.info("[Monitor "+me.tab_id+"] Job Added event captured");
                     
                     me.addRow(data);
                     me.initHeader();
                });
                
                croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.job$setStatus],function(data,id) {
                    // console.info("[Monitor "+me.tab_id+"] Job$setStatus event captured");
                     
                     console.log("[job$setstatus]: "+id);
                     console.log(data);
                     
                     me.updateRow(App.API.Jobs.getJob(id));
                     me.initHeader();
                     
                });
                
                  croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.job$setNode],function(data,id) {
                    // console.info("[Monitor "+me.tab_id+"] Job$setStatus event captured");
                     
                    /* console.log("[job$setstatus]: ");
                     console.dir(data);*/
                     
                     me.updateRow(App.API.Jobs.getJob(id));
                    // me.initHeader();
                     
                });
                
                croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.job$setPriority],function(data,id) {
                     me.updateRow(App.API.Jobs.getJob(id));
                    
                     
                });
                croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.job$set],function(data,id) {
                     me.updateRow(App.API.Jobs.getJob(id));
                     
                });
                 croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.job$setUser],function(data,id) {
                     me.updateRow(App.API.Jobs.getJob(id));
                     
                });
                 croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.job$setUserGroup],function(data,id) {
                     me.updateRow(App.API.Jobs.getJob(id));
                     
                });
                
                this._setStatusMarkers();
                
            },
            
            initHeader: function() {
                 $("#"+this.id+"_jobs_n").text(this.rows.length); 
                $("#"+this.id+"_jobs_wn").text(this.rows.filter(function(row){
                    return row.status == croupier.JobStatus.EXECUTING
                }).length);
                
                $(".table_popup_list").popover();

                
            }
            ,
             _buildPoolSelector: function(id,title) {
                 var me=this;
            var config = {
                id:id,
                title: "Select "+title+" to set to jobs",
                
            }
            
            $("<div>").attr("id",id+"_container").appendTo(
                $("#"+this.id).parent());
            
            $("#"+id+"_container").replaceWith($(App.Widget.renderTemplate("selectorBox",config)));
            this.poolBox=$("#"+id);
            
             this.poolSelector = new App.Widget.PoolsSelectBox({
                    id: id+"_select",
                    defaultMessage: "Select "+title,
                    multiple:true,
                    label: "ALL"
            });
            
            this.poolSelectorTable = new App.Widget.JobsSelectorTable({
                id:id+"_table",
                rowType:"poolsselector"
            });
            
            this.poolSelectorAll = $("#"+id+"_all");
            
            this.poolSelectorAll.change(function() {
                if ($(this).prop("checked")) {
                    me.poolSelectorTable.hide();
                    me.poolSelector.enable();
                } else {
                    me.poolSelectorTable.show();
                    me.poolSelectorTable.$dt.rows("*").select();
                    me.poolSelector.disable();
                }
                
            });
            this.poolSelectorTable.on("loaded",function() {
                this.poolSelectorTable.rows.forEach(function(job) {
                    this.poolSelectorTable["selector"+job.id] = new App.Widget.PoolsSelectBox({
                        id: "jobpools"+job.id
                    })
                    this.poolSelectorTable["selector"+job.id].load(App.API.Pools.getPools());
                    
                },this);
                
                
            },this);
                       
        },
         _buildNodesSelector: function(id,title) {
            var me=this;
            var config = {
                id:id,
                title: "Select "+title+" to set to jobs",
                
            }
            
            $("<div>").attr("id",id+"_container").appendTo(
                $("#"+this.id).parent());
            
            $("#"+id+"_container").replaceWith($(App.Widget.renderTemplate("selectorBox",config)));
            this.nodeBox=$("#"+id);
            
             this.nodeSelector = new App.Widget.NodesSelectBox({
                    id: id+"_select",
                    defaultMessage: "Select "+title,
                    multiple:true,
                    label:"ALL"
                    
            });
            
            this.nodeSelectorTable = new App.Widget.Table({
                id: id+"_table",
                rowModel: App.Model.Job,
                rowType:"nodesselector",
                dom: 't'
            });
            
            this.nodeSelectorAll = $("#"+id+"_all");
            
            this.nodeSelectorAll.change(function() {
                if ($(this).prop("checked")) {
                    me.nodeSelectorTable.hide();
                    me.nodeSelector.enable();
                } else {
                    me.nodeSelectorTable.show();
                    me.nodeSelectorTable.$dt.rows("*").select();
                    me.nodeSelector.disable();
                }
                
            });
            this.nodeSelectorTable.on("loaded",function() {
                this.nodeSelectorTable.rows.forEach(function(job) {
                    this.nodeSelectorTable["selector"+job.id] = new App.Widget.NodesSelectBox({
                        id: "jobnodes"+job.id
                    })
                    this.nodeSelectorTable["selector"+job.id].load(App.API.Nodes.getNodes());
                    
                },this);
                
             },this);
                       
        },
            _setStatusMarkers: function() {
                var me = this;
                
                this.on("rowadded",function(index,rowModelObject) {
                   // if (rowModelObject instanceof App.Model.Node)
                   
                      $(me.$dt.row(index).node()).addClass(rowModelObject.getStatusClass());
                    //console.log("[JobsTable] rowadded event fired");
                });
                
                this.on("rowupdated",function(index,rowModelObject) {
                    // if (rowModelObject instanceof App.Model.Node)
                    var rowNode = $(me.$dt.row(index).node());
                    if (rowNode.hasClass('selected'))
                        rowNode.attr("class",rowModelObject.getStatusClass()+ " selected");
                    else
                        rowNode.attr("class",rowModelObject.getStatusClass());
                    
                   // console.log("[JobsTable] rowmodified event fired");
                });
                
            },
            deleteRow: function(id) {
                
                var rowIndex= this.rows.findIndex(function(row) {return croupier.toJobLongId(row.id) == id});
                
                if (rowIndex != -1)
                    this.constructor.superclass.deleteRow.call(this,rowIndex);
                else
                    throw new Error("[JobsTable::deleteRow()]: No row with id:"+id+" found");
            },
            getRowIndex: function(rowModel) {
                return this.rows.findIndex(function(row) {
                    return rowModel.longId == row.longId;
                });
            },
            loadSelector: function(all,table,jobs,field) {
                   function containsAll(/* pass all arrays here */) {
    var output = [];
    var cntObj = {};
    var array, item, cnt;
    // for each array passed as an argument to the function
    for (var i = 0; i < arguments.length; i++) {
        array = arguments[i];
        // for each element in the array
        for (var j = 0; j < array.length; j++) {
            item = "-" + array[j];
            cnt = cntObj[item] || 0;
            // if cnt is exactly the number of previous arrays, 
            // then increment by one so we count only one per array
            if (cnt == i) {
                cntObj[item] = cnt + 1;
            }
        }
    }
    // now collect all results that are in all arrays
    for (item in cntObj) {
        if (cntObj.hasOwnProperty(item) && cntObj[item] === arguments.length) {
            output.push(item.substring(1));
        }
    }
    return(output);
}     
                
                
                var ids = jobs.map(function(job) {
                    return job[field] || [];
                },this);
                
                var commonIds = containsAll.apply(this,ids);

                all.val(commonIds);
                
                
                table.on("loaded",function() {
                    table.rows.forEach(function(job) {
                        table["selector"+job.id].val(job[field]);
                    });
                    
                    
                },this);
                
                table.load(jobs);
                
                
            }    
                
    
});
