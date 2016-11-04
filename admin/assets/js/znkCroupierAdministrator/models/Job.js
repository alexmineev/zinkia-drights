Ext.ns("App.Model");

/**
 * Job data model class
 * 
 * @class Job
 * @extends App.Model.Abstract
 * @memberOf App#Model
 * @namespace App.Model
 */
App.Model.Job={
        $fields: [],
        toolbarTpl: '<href="#" title="Remove job" class="color-red"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>							<a href="#" title="Pause job"><span class="glyphicon glyphicon-pause" aria-hidden="true"></span></a><a href="#" title="Start job" class="color-green"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></a>',
        
        
        constructor: function(job) {
            App.Model.Job.superclass.constructor.apply(this,arguments);
                             
            this.$private("_id",this._getId,this._setId);
            
            this.addEvents("log","properties");
            this.id=job.id;
            
            
            this.name = job.name;
            
            this.plugin = job.hasOwnProperty('plugin') ?job.plugin :"";//"[NOT SET]";
            this.priority = job.hasOwnProperty('priority')?job.priority :0;
            this.status = job.status || croupier.JobStatus.DISABLED;
            this.progress = job.progress || 0;
            
            this.time = job.time || 0;
            this.errors = job.errors||0;
            this.warnings = job.warnings||0;
            //this.progress = job.progress_4display;
            this.registered = job.registered;
            
            
            this.$private("primaryNodes",this._getPrimaryNodes,this._setPrimaryNodes);
            this.$private("primaryPools",this._getPrimaryPools,this._setPrimaryPools);
            
            this.$private("secondaryNodes",this._getSecondaryNodes,this._setSecondaryNodes);
            this.$private("secondaryPools",this._getSecondaryPools,this._setSecondaryPools);
            
            //this.$private("node",this.getNode,this.setNode);
            
            this.primaryNodes=job.primaryNodes;
            this.secondaryNodes = job.secondaryNodes;
            
            this.primaryPools=job.primaryPools;
            this.secondaryPools = job.secondaryPools;
            
            if ($.isNumeric(this.node)) 
                this.node = croupier.data.nodes.get(this.node);;
            
            
          
        },
        getRemaining: function() {
          if (!this.remaining) return "[NOT SET]";
          else {
              var duration=this.remaining;
            var milliseconds = parseInt((duration%1000)/100)
            , seconds = parseInt((duration/1000)%60)
            , minutes = parseInt((duration/(1000*60))%60)
            , hours = parseInt((duration/(1000*60*60))%24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    
          }
          
        },
        getEstFinishTime: function() {
           if (!this.remaining) return "[UNKNOWN]"; 
            
            var d= new Date();
            d.setMilliseconds(this.remaining);
            return d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()+"\r\n"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"."+d.getMilliseconds();
        } 
        ,
        getNode: function() {
            return this.node;
        },
        setNode: function(node) {
            console.log("[setNode]"+node);
            this.node=$.isNumeric(node) ? App.API.Nodes.getNode(node):node;
        },
        _getId: function() {
            
             return this.isChildJob() ? this.parent.id + "."+this.part : this.id ;
            
        },
        _setId: function(id) {
            this.$id =  id;
        },
        isChildJob: function() {return $.isPlainObject(this.parent);}
        ,
        getPriority: function() {
            switch (this.priority) {
                case CONSTANT.PRIORITY.A_DEFINED.ULTRA_HIGH:
                   return "ULTRA_HIGH ("+this.priority+")";
                break;   
                case CONSTANT.PRIORITY.A_DEFINED.HIGH:
                   return "HIGH ("+this.priority+")";
                break;
                case CONSTANT.PRIORITY.A_DEFINED.NORMAL:
                   return "NORMAL ("+this.priority+")";
                break;
                case CONSTANT.PRIORITY.A_DEFINED.LOW:
                   return "LOW ("+this.priority+")";
                break;
                case CONSTANT.PRIORITY.A_DEFINED.ULTRA_LOW:
                   return "ULTRA_LOW ("+this.priority+")";
                break;
                default: 
                    return this.priority;
            }
            
            
        },
        /**
         * @deprecated text
         * @param {Number} nodeId
         * @returns {unresolved}
         */
        getNodeById: function(nodeId) {
            return App.API.Nodes.getNode(nodeId);
        },
        
       /* toNodeList: function(nodesData) {
            
            var list = "", 
                me= this;
                nodes = new Array();
                
                
            var nodes =nodes.concat(nodesData);
            
            
            
            if (nodes.length==0) return "[EMPTY]";
            if (firstNode = this.getNodeById(nodes[0]))
            {
                list=firstNode.name;
            } else {
                list="[UnknownNode]";
            } 
            
            nodes.remove(nodes[0]);
            
            var nodeNames = nodes.map(function(node) {
                return (nodeObj = me.getNodeById(node)) ? nodeObj.name: "[UnknownNode]";
                    
            });
          var tpl= new Ext.Template(App.Widget.getTemplate("table_popup_list")); tpl.compile();
          
      if (nodes.length>1) list+='&nbsp;&nbsp;'+tpl.apply({content: nodeNames.join("\r\n")});
            
            return list;
        },*/
        _getPrimaryNodes: function() {
            return $.isArray(this.$primaryNodes) && this.$primaryNodes.length>0 
                    ? this.toLookupList(this.$primaryNodes,"nodes",App.Model.Node): "";
        },
        _setPrimaryNodes: function(nodes)  {
            this.$primaryNodes = $.isArray(nodes) ? nodes: null;
        },
        _getSecondaryNodes: function() {
            return $.isArray(this.$secondaryNodes) && this.$secondaryNodes.length>0 ? 
                this.toLookupList(this.$secondaryNodes,"nodes",App.Model.Node): "";
        },
        _setSecondaryNodes: function(nodes)  {
            this.$secondaryNodes = $.isArray(nodes) ? nodes: null;
        },
        
        _getPrimaryPools: function() {
            return Array.isArray(this.$primaryPools) && this.$primaryPools.length>0  ? 
                    this.toLookupList(this.$primaryPools,"pools",App.Model.Pool): "";
        },
        _setPrimaryPools: function(pools)  {
            this.$primaryPools = $.isArray(pools) && pools.length>0 ? pools: "";
        },
        _getSecondaryPools: function() {
            return Array.isArray(this.$secondaryPools) && this.$secondaryPools.length>0  ? 
                    this.toLookupList(this.$secondaryPools,"pools",App.Model.Pool): "";
        },
        _setSecondaryPools: function(pools)  {
            this.$secondaryPools = $.isArray(pools) ? pools: null;
        },
        getJobs: function() {
            if (!Array.isArray(this.children) || this.children.length==0) return null;
            
            return this.children.map(function(job) {
                  job.id = this.id;
                  job.plugin = this.plugin;
                  return job;
            },this);
            
            
        },
        getProgress: function() {
            
            function _progressFormat(progress) {
                 var tpl= new Ext.Template(progress == 100? HTML_CODE.Progres_bar_executed:HTML_CODE.Progres_bar);
                   return tpl.compile().apply({
                                WIDTH: progress,
                                PERCENT:progress
                            });
                  
                  
                 
            }
            
          switch (this.status) {
              case    croupier.JobStatus.EXECUTED:
                return _progressFormat(100);
              break; 
              
                         
              /*case croupier.JobStatus.RETRY:
              case croupier.JobStatus.DISABLED:
                  return "";
              break;*/
              
              
              case croupier.JobStatus.RETRY:
              case croupier.JobStatus.DISABLED:
              case croupier.JobStatus.TIMEOUT:
              case croupier.JobStatus.ENABLED:
              case croupier.JobStatus.ERROR:
              case croupier.JobStatus.EXECUTING:
              case croupier.JobStatus.PAUSED:
                  return _progressFormat(this.progress==null?0:this.progress);
              break;
           }
          return this.progress + "%";  
        },
        
        setPrimaryPools: function(pools) {
            var me =this;
            croupier.api.job$set(this.id,this.name,this.description,this.priority,this.retries,this.timeout,this.os,
                this.$primaryNodes,this.$secondaryNodes,pools,this.$secondaryPools,function(res) {
                    if (res.status == croupier.ResponseStatus.SUCCESS) 
                            me.fireEvent("updated",this);
                });
        },
        setSecondaryPools: function(pools) {
              var me =this;
            croupier.api.job$set(this.id,this.name,this.description,this.priority,this.retries,this.timeout,this.os,
                this.$primaryNodes,this.$secondaryNodes,this.$primaryPools==""?[]:this.$primaryPools,pools,function(res) {
                    if (res.status == croupier.ResponseStatus.SUCCESS) 
                            me.fireEvent("updated",this);
                });
        },
        setPrimaryNodes: function(nodes) {
              var me =this;
            croupier.api.job$set(this.id,this.name,this.description,this.priority,this.retries,this.timeout,this.os,
                nodes,this.$secondaryNodes,this.$primaryPools==""?[]:this.$primaryPools,this.$secondaryPools,function(res) {
                    if (res.status == croupier.ResponseStatus.SUCCESS) 
                            me.fireEvent("updated",this);
                });
        },
        setSecondaryNodes: function(nodes) {
              var me =this;
            croupier.api.job$set(this.id,this.name,this.description,this.priority,this.retries,this.timeout,this.os,
                this.$primaryNodes,nodes,this.$primaryPools==""?[]:this.$primaryPools,this.$secondaryPools,function(res) {
                    if (res.status == croupier.ResponseStatus.SUCCESS) 
                            me.fireEvent("updated",this);
                });
        },
        toRowModelArray: function(rowType) {
            if (rowType == "history")
               return ["","",this.id,croupier.JobStatus.__names__[this.status],this.name,this.plugin.split(":")[0],this.plugin.split(":")[1],new Date(this.created).toLocaleString(),new Date(this.finish).toLocaleString()||"[NOT FINISHED]",this.getPriority()]; 

            else if(rowType=="poolsselector") {
                return ["",this.name,$("<div>").attr("id","jobpools"+this.id+"_container").get(0).outerHTML];
            }
            else if(rowType=="nodesselector") {
                return ["",this.name,$("<div>").attr("id","jobnodes"+this.id+"_container").get(0).outerHTML];
            }
            else 
              return !this.isChildJob() ? ["","",this._id,
                this.name,
                this.plugin,
                this.getProgress(),
                this.getRemaining(),
                this.getEstFinishTime(),
                croupier.JobStatus.__names__[this.status],
                new Date(this.start).toLocaleString()||"",new Date(this.finish).toLocaleString()||"",
                this.getPriority(),
                
                this.errors||0,this.warnings||0, 
                this.primaryPools,this.secondaryPools,this.primaryNodes,this.secondaryNodes,
                 this.getToolbar()
                //this.pools.length >0
            ] : [
                "","",this.name,this.plugin,this.getProgress(),this.getRemaining(),this.getEstFinishTime(),
                croupier.JobStatus.__names__[this.status],
                this.getPriority(),
                this.errors||0,this.warnings||0,
                this.getToolbar(),""
            ]; 
          
            
            //return this.constructor.superclass.toArray.apply(this);
        },
        requestProperties: function() {
            var me=this;
            croupier.api.job$getProperties(this.id,function(res) {
                if (res.status == croupier.ResponseStatus.SUCCESS)
                    me.fireEvent("properties",res.value);
            });
        }
        ,
        getStatusClass: function() {
                   switch (this.status) {
                                case croupier.JobStatus.ENABLED:
					return HTML_CODE.tr_pending; // naranja
                                break;        
				case croupier.JobStatus.DISABLED:
				    return HTML_CODE.tr_disabled; //gris
				break;
                                case croupier.JobStatus.EXECUTED:
				
                                    return HTML_CODE.tr_finished; // verde 
				break;
				case croupier.JobStatus.PAUSED: 
                                    return HTML_CODE.tr_paused; // rosita
				break;
                                case croupier.JobStatus.EXECUTING:
                                    return "in-progress";
                                break;
                                case croupier.JobStatus.ERROR:
                                case croupier.JobStatus.RETRY:
                                case croupier.JobStatus.TIMEOUT:
                                    return "with-error";
                                    
                                default:
                                    return false;
                                     
                             }
        },
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
        },
        getToolbar: function() {
            /*if (this.isChildJob()) {
                /*var tpl= new Ext.Template(this.toolbarTpl);
                tpl.compile();
                return tpl.apply({});
           } else  {*/
                if (!this.isChildJob() && this.children && this.children.length>0) {
                    if (nodeJob=this.children.find(function(job) {
                        return $.isPlainObject(job.node);
                    },this)) {
                        
                        return nodeJob.name;
                    } else {
                        return "[NOT SET]";
                    }
                }
               
               return $.isPlainObject(this.node)  ? this.node.name:"[NOT SET]" ;
           //}
           
        },
        requestLog: function() {
            var me=this;
            croupier.api.job$getLog(this.id,this.part||0,function(res) {
                if (res.status == croupier.ResponseStatus.SUCCESS)
                    me.fireEvent("log",res.value);
            });
        }
        
    
};
App.Model.Job=Ext.extend(App.Model.Abstract,App.Model.Job);
