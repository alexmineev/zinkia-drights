Ext.ns("App.Model");

/**
 * Node data model class
 * 
 * @class Node
 * @extends App.Model.Abstract
 * @memberOf App#Model
 * @namespace App.Model
 */

App.Model.Node = {
        /**
         * @deprecated text
         * @type Array
         */
        $fields: ["os","ip","name","status","progress"],
        
        /**
         * 
         * @param {Object} node
         * @constructs App.Model.Node
         */
        constructor: function(node) {
            App.Model.Node.superclass.constructor.apply(this,arguments);
            
            if (node==null) return;
            
            this.id = node.id;
            this.name = node.name;
            if (node.hasOwnProperty('basicSystemInfo')) {
                
                Ext.apply(this,this.basicSystemInfo);
                
                this.os = node.basicSystemInfo.os && node.basicSystemInfo.os.name ? croupier.OsName.__names__[node.basicSystemInfo.os.name]: " --- "; 
                this.ip = node.basicSystemInfo.net ? node.basicSystemInfo.net.ip : " - ";
                this.bits = node.basicSystemInfo.os && node.basicSystemInfo.os.bits ? node.basicSystemInfo.os.bits :"";
                
                if (this.memory) this.ram = Math.round(this.memory.ram/(1024*1024)) + " MB"; 
                
            }    
            else {
                this.ip= this.os = "[NOT SET]";
                this.bits =""; 
            }
            
            if (this.enabled == 1) this.enabled=true;
            this.status = node.status;
            
            this.progress = node.progress;
            this.registered = node.registered;
            
            this.$private("jobs",this._getJobs,this._setJobs);
            this.$private("pools",this._getPools,this._setPools);
            
            this.addEvents(
                        /**
                         * @event fires when requestLog call competes successfully.
                         * @param String log
                         */
                        "log.loaded",
                        "moved"        
                    );
            
            this._setJobs(node.jobs);
            this._setPools(node.pools);
            
        },
        setStatus: function(status) {
             
        },
        setEnabledJobPlugins: function(jobPlugins) {
            this.enabledPlugins = jobPlugins.toIds();
        }
        ,
        getExtraInfo: function() {
            
        },
        _getJobs: function() {
            return this.$jobs ? this.$jobs: "[HIDDEN]";
        }, 
        _setJobs: function(jobs)  {
            this.$jobs = $.isArray(jobs) ? jobs.toModelArray("jobs",App.Model.Job): null;
        },
        
        _getPools: function() {
            return this.$pools ? this.$pools: "[HIDDEN]";
        },
        _setPools: function(pools)  {
            this.$pools = $.isArray(pools) ? pools: null;
        },
        getPoolsList: function() {
            return this.toLookupList(this.$pools,"pools",App.Model.Pool);
        },
        getProgress: function() {
            
            function _progressFormat(progress) {
                 var tpl= new Ext.Template(progress == 100? HTML_CODE.Progres_bar_executed:HTML_CODE.Progres_bar);
                 tpl.compile();
                   return tpl.apply({
                                WIDTH: progress,
                                PERCENT:progress
                            });
                  
                  
                 
            }
            
          switch (this.status) {
              case    croupier.NodeStatus.LOGGED: 
              case    croupier.NodeStatus.UPDATING:
              case    croupier.NodeStatus.VALIDATING:
	      case    croupier.NodeStatus.TESTING:
	      case    croupier.NodeStatus.WAITING: 
                  return _progressFormat(0);
              break;
              case  croupier.NodeStatus.DISCONNECTED: 
                  return "";
              break;
            
              case croupier.NodeStatus.READY:
                  return "";
              break;
              
              case croupier.NodeStatus.EXECUTING:
              case croupier.NodeStatus.PAUSED:
                  return _progressFormat(this.progress);
              break;
           }
          return this.progress + "%";  
        },
        getOsIcon: function() {
            
            switch (this.os)  {
                case "Linux" :
                    return "<span class='ico-os ico-os-linux'>Linux</span>"    
                break;
                case "Windows" :
                    return "<span class='ico-os ico-os-windows'>Windows</span>"    
                break;
                case "Mac" :
                    return "<span class='ico-os ico-os-mac'>MacOS</span>"
                break;
                default:
                    return "";
            }
            
        }
        ,
        getOs: function() {
            switch (this.os)  {
                case "Linux" :
                    return "<span class='ico-os ico-os-linux'>Linux</span>&nbsp&nbsp Linux";    
                break;
                case "Windows" :
                    return "<span class='ico-os ico-os-windows'>Windows</span>&nbsp&nbsp Windows";    
                break;
                case "Mac" :
                    return "<span class='ico-os ico-os-mac'>MacOS</span>&nbsp&nbsp SunOS"; 
                break;
                default:
                    return this.os;
            }
            
        },getDataLink: function() {
            return '<a href="#" data-node-id='+this.id+'>'+this.name+'</a>';
        }
        ,
        toRowModelArray: function(rowType) {
            jobs=this.jobs.length>0 && (job=App.API.Jobs.getJob(this.jobs[0].id))!=null ?  job.name: "";
            if (!rowType)
            return ["","",this.getOs(),
                this.ip,
                this.getDataLink(),
                this.getStatusName(),
                Array.isArray(this.jobs)?jobs:this.jobs,
                this.getProgress(),
                new Date(this.registered).toLocaleString(), //ELAPSED TIME
                this.getPoolsList(),
                this.getCPUInfo(),
                this.getMemoryInfo()
            ];
            else if(rowType=="full")
            {
                
                return ["","",this.getDataLink(),this.getStatusName(),this.fullOs(),
                    this.ip,Array.isArray(this.jobPlugins)?this.toLookupList(this.jobPlugins.map(function(pl) {
                        pl.name=pl.enabled=="1"?pl.plugin:pl.plugin+" (disabled)\r\n";
                        return pl;
                    })):"[NOT SET]"];
            }
            else if(rowType=="stat")
            {
                return [this.name,this.totalJobs||0];
            }
            
            //return this.constructor.superclass.toArray.apply(this);
        },
        fullOs: function() {
            return this.getOs()+" "+this.bits;
        },
        requestLog: function() {
            var me =this;
            croupier.api.node$getLog(this.id,function(res) {
                if (res.status == croupier.ResponseStatus.SUCCESS)
                
                    me.fireEvent("log.loaded",res.value);
                
            });
        },
         getNodeJobs: function() {
             return App.API.Jobs.getJobs().filter(function(job) {
                 return job.node.id == this.id;
             },this);
         }  
         ,
         getCPUInfo: function() {
             if (!this.basicRuntimeInfo) return "[NO INFO]";
             
              var cpu =Math.round(this.basicRuntimeInfo.cpu.used*100);
                  
             
              if (cpu<App.config.cpuMeter.good) 
                  var tpl=new Ext.Template(HTML_CODE.Progres_bar_executed);
              else if (cpu>=App.config.cpuMeter.good&&cpu<=App.config.cpuMeter.normal)
                  var tpl=new Ext.Template(HTML_CODE.Progres_bar);
              else if (cpu>App.config.cpuMeter.normal && cpu<=App.config.cpuMeter.warning)  
                  var tpl=new Ext.Template(HTML_CODE.Progres_bar_warning);
              else
                  var tpl=new Ext.Template(HTML_CODE.Progres_bar_danger);
              
              return tpl.compile().apply({ WIDTH: cpu,PERCENT:cpu});
         },
         getMemoryInfo: function() {
             if (!this.basicRuntimeInfo) return "[NO INFO]";
             
             
             var memory = Math.round(this.basicRuntimeInfo.memory.used*100/this.basicRuntimeInfo.memory.total),
                 totalMem = Math.round(this.basicRuntimeInfo.memory.total / (1024*1024)) +" MB ",
                 usedMem =Math.round(this.basicRuntimeInfo.memory.used/(1024*1024)) +" MB "+memory;
              
              if (memory<App.config.memoryMeter.good) 
                  var tpl=new Ext.Template(HTML_CODE.Progres_bar_executed);
              else if (memory>=App.config.memoryMeter.good&&memory<=App.config.memoryMeter.normal)
                  var tpl=new Ext.Template(HTML_CODE.Progres_bar);
              else if (memory>App.config.memoryMeter.normal && memory<=App.config.memoryMeter.warning)  
                  var tpl=new Ext.Template(HTML_CODE.Progres_bar_warning);
              else
                  var tpl=new Ext.Template(HTML_CODE.Progres_bar_danger);
              var memoryHtml = tpl.compile().apply({ WIDTH: memory,PERCENT:usedMem});
             
              return memoryHtml;
             
         }
        ,
        getStatusName: function() {
            return croupier.NodeStatus.__names__[this.status] ? 
                   croupier.NodeStatus.__names__[this.status] : "UNKNOWN";
        }
        ,
        getStatusClass: function() {
                   switch (this.status) {
				case	croupier.NodeStatus.LOGGED: 
				case	croupier.NodeStatus.UPDATING:
				case    croupier.NodeStatus.VALIDATING:
				case    croupier.NodeStatus.TESTING:
				case    croupier.NodeStatus.WAITING:
				
					return HTML_CODE.tr_pending; // naranja
                                break;        
				case croupier.NodeStatus.DISCONNECTED:
				
				    return HTML_CODE.tr_disabled; //gris
				break;
                                case croupier.NodeStatus.READY: 
				
                                    return HTML_CODE.tr_finished; // verde 
				break;
				case croupier.NodeStatus.PAUSED: 
                                    return HTML_CODE.tr_paused; // rosita
				break;
                                case croupier.NodeStatus.EXECUTING:
                                    return "in-progress";
                                break;
                                
                                default:                                                                                                                                                                                                                                                             
                                    return false;
                                    
                                    
                             }
        },
        
    canUseAsPrimary: function() {
        return this.hasPermission(croupier.NodePermission.usePrimary);    
    },
    canUseAsSecondary: function() {
        return this.hasPermission(croupier.NodePermission.useSecondary);
    },
    moveToPool: function(pool) {
        var me= this;
        if (App.Model.isModel(pool)) throw new Error("[Node::moveToPool()]: Pool provided is not a valid pool model.");
        
        croupier.api.pool$moveNodes(this.$pools.length>0? this.$pools[0].id : 0,pool.id,[this.id],function(r) {
             if (r.status == croupier.ResponseStatus.SUCCESS)
                    me.fireEvent("moved",pool);
        });
    },
    getPowerClass: function() {
            return this.on=="1"?"poweron":"poweroff";
    },
    update: function() {
        var me=this;
        croupier.api.node$set(this.id,this.permanent||0,this.plugin||null,this.properties||{},this.enabled||false,this.enabledPlugins||[],function(res) {
           if (res.status == croupier.ResponseStatus.SUCCESS) 
                me.fireEvent("updated");
        });
    }
        
        
    
};
App.Model.Node=Ext.extend(App.Model.Abstract,App.Model.Node);
