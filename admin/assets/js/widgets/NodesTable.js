Ext.ns("App.Widget");

/**
 * 
 * @class App.Widget.NodesTable
 * @extends App.Widget.Table
 * @memberOf App#Widget
 * @namespace App.Widget
 *
 */
App.Widget.NodesTable = Ext.extend(App.Widget.Table,{
            constructor: function NodesTable(config) {
                var me =this;
                
                Ext.applyIf(config,{
                           
                             //template: $(config.id).html(),
                             rowClass: App.Model.Node,
                             columnDefs: [
                                 {
                                    orderable: false,
                                    className: 'select-checkbox',
                                    targets:   0
                                 },
                                 {
                                    className: 'power-indicator',
                                    targets:   1
                                 }
                             ],
                             
                             pagingType: 'full_numbers',
                select: {
                    style:    'multi',
                    selector: 'td.select-checkbox'
                },
                orderMulti: true,
                order: [[ 0, 'asc' ]],
                
                actions: [
                       
                       {
                           label: "Show details",
                           hint: "Shows detailed information of the node and permits Enable/Disable node plugins.",
                           iconClass: "ico-btn ico-btn-view_details",
                           menuOnly: true,
                           validator: function() {return true;},
                           handler: function(nodes) {
                               var node = nodes[0];
                               me.loadDetails(node); 
                           }
                       }, 
                       {
                           label: "Show Log",
                           hint:"Opens a log of this node.",
                           iconClass:"ico-btn ico-btn-log",
                           validator: function(nodes) {
                               return nodes[0].hasPermission(croupier.NodePermission.getLog);
                           },
                           handler: function(nodes) {

                              var node = nodes[0];
                              this.logViewer =  new App.Widget.LogViewer({id:this.id+"_nodeLog",logName:node.name,title:"Node Log"});
                              
                              node.addListener("log.loaded",function(log) {
                                  App.mainBox.progress(100);
                                  App.mainBox.done();
                                  this.logViewer.loadLog(log);
                                  this.logViewer.show();

                              },this);
                              
                              
                              App.mainBox=App.progressMsg("Nodes","Loading log of node:"+node.name);
                              node.requestLog();
                              
                              
                           },
                           scope: this
                       },
                       {
                           label: "Pause node(s)",
                           hint: "Pauses all selected nodes",
                           iconClass: "ico-btn ico-btn-pause",
                           scope: this,
                           multi:true,
                           validator: function(nodes) {
                               return nodes.some(function(node) {
                                    return node.hasPermission(croupier.NodePermission.pause);
                               });
                               
                           }, 
                           handler: function(nodes) {
                               App.mainBox =App.progressMsg("Nodes","Pausing nodes...");
                               App.API.Nodes.pauseNodes(nodes,confirm("Do you wish to also cancel all jobs of the node(s)?"),function() {
                                   App.mainBox.progress(100);
                                   App.mainBox.done();
                               });
                           }
                       },
                       {
                           label: "Resume node(s)",
                           hint: "Resumes paused nodes",
                           iconClass: "ico-btn ico-btn-play",
                           multi: true,
                           validator: function(nodes) {
                               return nodes.some(function(node) {
                                    return node.hasPermission(croupier.NodePermission.resume);
                               });
                           },
                           handler: function(nodes) {
                               App.mainBox =App.progressMsg("Nodes","Resuming nodes...");
                               App.API.multiAction("resume","node",nodes);
                               
                               
                           },
                       },
                       {
                           label: "Stop node(s)",
                           hint: "Stops selected nodes",
                           iconClass: "ico-btn ico-btn-stop",
                           multi: true,
                           validator: function(nodes) {
                               return nodes.some(function(node) {
                                    return node.hasPermission(croupier.NodePermission.stop);
                               });
                           },
                           handler: function(nodes) {
                               App.mainBox =App.progressMsg("Nodes","Stopping nodes...");
                               App.API.multiAction("stop","node",nodes);
                               
                               
                           },
                       },
                       {
                           label: "Enable node(s)",
                           hint: "Enables selected nodes",
                           iconClass: "ico-btn ico-btn-node_power_on",
                           multi: true,
                           validator: function(nodes) {
                               return nodes.some(function(node) {
                                    return node.hasPermission(croupier.NodePermission.set) && !node.enabled;
                               });
                           },
                           handler: function(nodes) {
                               App.mainBox =App.progressMsg("Nodes","Enabling nodes...");
                               App.API.Nodes.enableNodes(nodes,true);
                               
                               
                           },
                       },
                       {
                           label: "Disable node(s)",
                           hint: "Disables selected nodes",
                           iconClass: "ico-btn ico-btn-node_power_off",
                           multi: true,
                           validator: function(nodes) {
                               return nodes.some(function(node) {
                                    return node.hasPermission(croupier.NodePermission.set) && node.enabled=="1";
                               });
                           },
                           handler: function(nodes) {
                               App.mainBox =App.progressMsg("Nodes","Disabling nodes...");
                               App.API.Nodes.enableNodes(nodes,false);
                               
                               
                           },
                       },
                       {
                           label: "Remove node(s)",
                           hint: "Removes selected nodes permanently.",
                           iconClass: "ico-btn ico-btn-node_delete",
                           multi: true,
                           validator: function(nodes) {
                               return nodes.some(function(node) {
                                    return node.hasPermission(croupier.NodePermission.remove);
                               });
                           },
                           handler: function(nodes) {
                               App.mainBox =App.progressMsg("Nodes","Removing nodes...");
                               App.API.Nodes.removeNodes(nodes,function() {
                                   App.mainBox.progress(100);
                                   App.mainBox.done();
                               });
                               
                               
                           },
                       },{
                           label: "Shutdown node(s)",
                           hint: "Powers off the nodes machine",
                           iconClass: "ico-btn ico-btn-node_power_off",
                           multi: true,
                           validator: function(nodes) {
                               return nodes.some(function(node) {
                                    return node.hasPermission(croupier.NodePermission.resume);
                               });
                           },
                           handler: function(nodes) {
                               App.mainBox =App.progressMsg("Nodes","Shutdown nodes...");
                               App.API.multiAction("shutdown","node",nodes);

                           },
                       },
                       {
                           label: "Power on node(s)",
                           hint: "Powers on the nodes machine",
                           iconClass: "ico-btn ico-btn-node_power_on",
                           multi: true,
                           validator: function(nodes) {
                               return nodes.some(function(node) {
                                    return node.hasPermission(croupier.NodePermission.wake) && !node.on;
                               });
                               return false;
                           },
                           handler: function(nodes) {
                               App.mainBox =App.progressMsg("Nodes","Power on nodes...");
                               //App.errorMsg(App.getAppName(),"This function is not implemented yet",function() {App.mainBox.abort();});
                               App.API.multiAction("wake","node",nodes);
                               
                           },
                       },
                       {
                           label: "Reboot node(s)",
                           hint: "Reboots the nodes machine",
                           iconClass: "ico-btn ico-btn-node_reboot",
                           multi: true,
                           validator: function(nodes) {
                               return nodes.some(function(node) {
                                    return node.hasPermission(croupier.NodePermission.reboot);
                               });
                           },
                           handler: function(nodes) {
                               App.mainBox =App.progressMsg("Nodes","Shutdown nodes...");
                               App.API.multiAction("reboot","node",nodes);

                           },
                       },
                       {
                           label: "Assign to pool",
                           hint: "Asks you for a pool and assigns selected node(s) to that pool",
                           iconClass: "glyphicon glyphicon-indent-left",
                           multi: true,
                           validator: function(nodes) {
                               return nodes.some(function(node) {
                                    return node.hasPermission(croupier.NodePermission.set);
                               });
                           },
                           handler: function(nodes) {
                               var me=this;
                               
                               this.poolBox.modal({backdrop:"static"});
                               this.poolSelector.setLoadingMask();
                               this.poolSelector.on("loaded",function() {
                                   this.poolSelector.setLoadingMask(false);
                               },this);
                               
                               this.poolSelector.load(App.API.Pools.getPools());
                               
                               $("#"+this.poolBox.attr("id")+"_applyBtn").click(function() {
                                    var pool = me.poolSelector.getSelectedModel();
                                    App.mainBox = App.progressMsg("Nodes","Assigning nodes to pool:"+pool.name);
                                    pool.on("nodesupdated",function() {
                                       App.mainBox.progress(100);
                                       App.mainBox.done();
                                    });
                                    
                                    pool.addNodes(nodes);
                                   
                               });
                               
                           },
                           scope: this
                       }
                      
                   ]
                    
                });
                /**Constructing generic App.Table**/
                
                App.Widget.NodesTable.superclass.constructor.call(this,config);
                
                
                /**
                 * Setting listeners
                 */
                
                this.on('loaded',function() {
                    console.log("NodesTable loaded");
                    
                    this._buildActionsButtons(this.id+"_nodeActions",false);
                    this._buildPoolSelector(this.id+"_poolSelector");
                    
                    $("#"+this.id+"_saveNodeBtn").click(function() {

                        me.saveNode();
                        //me.configsTable.destroy();                        
                    });
                    
                    $("#"+this.id+"_cancelNodeBtn").click(function() {
                        //me.configsTable.destroy();
                    });
                    
                });
                
                
                this.$dt.on("click","td.power-indicator",function(e) {
                    var node = $(e.currentTarget).parent("tr").data();
                    if (node.on=="1" && confirm("You are about to shutdown a node "+node.name+". Proceed?"))
                    {
                        App.mainBox = App.progressMsg("Node","Shutdown node "+node.name);
                        App.API.multiAction("shutdown","node",[node]);
                    } else if (!node.on && confirm("You are about to power on a node "+node.name+". Proceed?")) {
                        App.mainBox = App.progressMsg("Node","Trying to boot node "+node.name);
                        
                        //App.errorMsg(App.getAppName(),"This functionality is not inmplemented yet.",function() {App.mainBox.abort();});
                        App.API.multiAction("wake","node",[node]);
                        
                    }
                });
                
                this._setStatusMarkers();
                
                if (!croupier || config.noSync) return;
                
                croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.node$add],function(data) {
                     me.addRow(data);
                     me.initHeader();
                });
                
                
                croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.node$setStatus],function(data,id) {
                     me.updateRow(App.API.Nodes.getNode(id));
                     me.initHeader();
                     
                });
                
                
                croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.node$removePool],function(data,id) {
                     console.info("[Nodes] removePool event captured");
                     
                     me.updateRow(App.API.Nodes.getNode(id));
                     me.initHeader();
                     
                });
                
                croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.node$addPool],function(data,id) {
                     console.info("[Nodes] addPool event captured");
                     
                     me.updateRow(App.API.Nodes.getNode(id));
                     me.initHeader();
                     
                });
                
                croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.node$setBasicSystemInfo],function(data,id) {
                     
                     
                     me.updateRow(App.API.Nodes.getNode(id));
                     me.initHeader();
                     
                });
                
                 croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.node$setJobPlugins],function(data,id) {
                     
                     
                     me.updateRow(App.API.Nodes.getNode(id));
                     me.initHeader();
                     
                });
                
                croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.node$setEnabled],function(data,id) {
                     
                     
                     me.updateRow(App.API.Nodes.getNode(id));
                     me.initHeader();
                     
                });
                croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.node$addJob],function(data,id) {
                     
                     me.updateRow(App.API.Nodes.getNode(id));
                     me.initHeader();
                     
                });
                
                croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.node$removeJob],function(data,id) {
                     
                     me.updateRow(App.API.Nodes.getNode(id));
                     me.initHeader();
                     
                });
                
                
                /*RUNTIME EVENT*/
                if (App.config.handleRuntimeEvents)
                    croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.node$setBasicRuntimeInfo],function(data,id) {
                       me.updateRow(App.API.Nodes.getNode(id));
                       me.initHeader();
                    });
                
                croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.node$remove],function(data,id) {
                     
                     
                    
                     
                     me.deleteRowModel(id);
                     me.initHeader();
                     //me.updateRow(croupier.data.nodes.get(id));
                     
                });
                
                
                
                
            },
            
            initHeader: function() {
                //console.debug("[NodesTable::initHeader] call()");
                var me= this;
                
                $("#"+this.id+"_nodes_n,#"+this.id+"_n").text(this.rows.length); 
                $("#"+this.id+"_nodes_wn,#"+this.id+"_wn").text(this.rows.filter(function(row){
                    return row.status == croupier.NodeStatus.EXECUTING
                }).length);
                
                $("#"+this.id+"_nodes_on,#"+this.id+"_on").text(this.rows.filter(function(row){
                    return row.status == croupier.NodeStatus.DISCONNECTED
                }).length);
                
                $("#"+this.id+"_nodes_rn,#"+this.id+"_rn").text(this.rows.filter(function(row){
                    return row.status == croupier.NodeStatus.READY
                }).length);
                
                $(".table_popup_list").popover();
                $("#"+this.id+" td a[data-node-id]").off("click").click(function() {
                    
                    me.$dt.rows("*").deselect();
                    me.$dt.rows($(this).parent("td").parent("tr")).select();
                    
                    var nodeId=$(this).attr("data-node-id");
                     me.loadDetails(App.API.Nodes.getNode(nodeId));
                    
                });
                
                this.constructor.superclass.initHeader.call(this);
                
            },
            _setStatusMarkers: function() {
                var me = this;
                
                this.on("rowadded",function(index,rowModelObject) {
                   // if (rowModelObject instanceof App.Model.Node)
                   
                      $(me.$dt.row(index).node()).addClass(rowModelObject.getStatusClass()+" "+rowModelObject.getPowerClass());
                      
           
                });
                
                this.on("rowupdated",function(index,rowModelObject) {
                    // if (rowModelObject instanceof App.Model.Node)
                    var rowNode = $(me.$dt.row(index).node());
                    if (rowNode.hasClass('selected'))
                        rowNode.attr("class",rowModelObject.getStatusClass()+" "+rowModelObject.getPowerClass()+ " selected");
                    else
                        rowNode.attr("class",rowModelObject.getStatusClass()+" "+rowModelObject.getPowerClass());
         
                });
                
            },
            loadDetails:
            function(node) {
              var me=this;
              
            if (!App.Model.isModel(node) && $.isNumeric(node))
                node = App.API.Nodes.getNode(node);
            
             
              function $det(id) {
                  return $("#"+me.id+"_"+id);
              }
            
            $det("nodeName").text(node.name);
            $det("nodeIp").text(node.ip);
            
            this.nodePoolBox=new App.Widget.PoolsSelectBox({
                id: this.id+"_nodePool",
                multiple: true,
                persistentContainer: true,
            });
                        
            
            this.nodePoolBox.on("loaded",function() {
                    
                    $(this.nodePoolBox.$select).val(node.$pools);
                    this.nodePoolBox._syncChosen();
            },this);
            
            this.nodePoolBox.load(App.API.Pools.getPools());
            
            $("li[role='presentation']:first a").click();
            if (Array.isArray(node.$jobs) && node.$jobs.length>0) { //current job
                var job = App.API.Jobs.getJob(node.$jobs[0]);
                
                
                
                $det("jobName").text(job.name);
                $det("jobId").text(job.id);
                $det("jobPlugin").text(job.plugin.split(":")[0]);
                $det("jobConfig").text(job.plugin.split(":")[1]);
                $det("jobPriority").text(job.getPriority());
                
                $det("jobPrimaryPool").html(job.primaryPools);
                $det("jobSecondaryPool").html(job.secondaryPools);
                
                $det("jobPrimaryNodes").html(job.primaryNodes);
                $det("jobSecondaryNodes").html(job.secondaryNodes);
                
                $det("progress").html(job.getProgress());
                
                $("li[role='presentation']:last").removeClass("disabled");
                $det("nodeJobBtn").show();
                $det("nodeJob").css("visibility","visible").removeClass("disabled");
                
                
                
                
                
            } else { //has no current job
                $det("nodeJobBtn").hide();
                $("li[role='presentation']:last").addClass("disabled");
                $det("nodeJob").css("visibility","hidden").addClass("disabled");
            }
            
            //window.alert=function() {}; /*DEBUG STUB*/
            this.configsTable= new App.Widget.PluginConfigsTable({
                id:this.id+"_config",
                rowType: "node"
            });
            
            this.allConfigs = [];
            this.plugins = App.API.Plugins.getPlugins();
            
                this.plugins.forEach(function(plugin) {
                  $.merge(this.allConfigs,plugin.getConfigurations());
                
                 },this);
            
            this.configs = node.jobPlugins.map(function(pl) {
                var pluginId=pl.plugin.split(":")[0],
                    configId=pl.plugin.split(":")[1];
                
                if ((plModel=this.allConfigs.find(function(conf) {
                    return conf.id==pl.plugin;
                })))
                {
                    plModel.test = pl.test;
                    plModel.enabled = pl.enabled;
                    return plModel;
                } else {
                    return false;
                }
            },this);
            
           this.configsTable.on("loaded",function() {
               this.configsTable.$dt.order([[3,'asc']]).draw();
           },this);
            
           this.configsTable.on("rowadded",function(index,config) {
                
               if (config.enabled)  this.configsTable.$dt.rows(index).select();
           },this); 
            
           this.configsTable.load(this.configs.filter(function(c) {return c;}));      
            
            if (node.os) {
                $det("soInfo").css("visibility","visible");
                $det("os").html(node.getOs());
                $det("bits").text(node.os.bits);
                
            } else {
                $det("soInfo").css("visibility","hidden");
            }
            
            if (node.cpu)
            {
                $det("cpu").text(node.cpu.model);
                $det("totalCores").text(node.cpu.cores);
                $det("mhz").text(node.cpu.mhz);
                
            }
            
            if (node.memory) {
                $det("ram").text(node.ram);
            }
            
            $det("nodeDetails").modal({backdrop:"static"}).show();
            this.currentNode = node;
           
                
            
        },
        saveNode: function() {
            var $pools = this.currentNode.$pools.map(function(p) {
                return p.toString();
            });
            
            App.mainBox =App.progressMsg("Nodes","Saving node details...");
            if ((Array.isArray(this.nodePoolBox.val()) && !this.nodePoolBox.val().equal($pools)) ||
                 (this.nodePoolBox.val() == null && this.currentNode.$pools.length!=0)) 
            { //pools changed
                
               var pools = this.nodePoolBox.val().toModelArray("pools",App.Model.Pool);
               
               pools.forEach(function(pool) {
                   
                   pool.on("nodesupdated",function() {
                       App.mainBox.progress(50);
                   })
                   pool.addNodes([this.currentNode]);
                   
                 
                   
                   
               },this);
                
            }
            
            this.currentNode.setEnabledJobPlugins(this.configsTable.getSelectedRows());
            
            this.currentNode.addListener("updated",function() {
                App.mainBox.progress(100);
                App.mainBox.done();
            });
            
            this.currentNode.update();
            
        }
        ,
        _buildPoolSelector: function(id) {
            
            var config = {
                id:id,
                title: "Move node(s) to the pool",
                notable:"display:none"
            }
            
            $("<div>").attr("id",id+"_container").appendTo(
                $("#"+this.id).parent());
            
            $("#"+id+"_container").replaceWith($(App.Widget.renderTemplate("selectorBox",config)));
            this.poolBox=$("#"+id);
            
            this.poolSelector = new App.Widget.PoolsSelectBox({
                    id: id+"_select",
                    defaultMessage: "Select a pool",
                    multiple:false
            });
            
        }
            
    
    
});

