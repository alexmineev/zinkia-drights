/**
 * 
 * @class Action
 */
App.Model.Action = {
    $fields: ["order","method","parameters"],
    
    constructor: function Action(action) {
        
        
      App.Model.Action.superclass.constructor.apply(this,arguments);  
      
      this.define = App.config.presetMethods[this.method];
      this.id = "presetAction"+Math.round(Math.random()*10000000000);
      
     /* this.on("tableadded",function() {
          this.initParametersTable();
      },this);*/
      
    }
    ,
    toRowModelArray: function() {
        return ["",this.order,this.method,this._genParametersContainer()];
    },
    _genParametersContainer: function() {
        return App.Widget.renderTemplate("actionParams",{id:this.id});
    },
    initParametersTable: function() {
        this.paramsTable = new App.Widget.ActionValuesTable({
            id:this.id,
            dom: "t"
        });
        
        this.paramsTable.on("loaded",function() {
            this.paramsTable.rows.forEach(function(param) {
                
                
                  switch (param.type) { 
                      case "nodes": 
                          
                        param.selBox = new App.Widget.NodesSelectBox({id: param.id});
                        
                        param.selBox.on("loaded",function() {
                            this.setValue(this.value);
                        },param);
                        
                        param.selBox.load(App.API.Nodes.getNodes());
                        
                      break;
                      case "pools":
                        param.selBox = new App.Widget.PoolsSelectBox({id: param.id,permitAllPool:true});
                        param.selBox.on("loaded",function() {
                            this.setValue(this.value);
                        },param);
                        param.selBox.load(App.API.Pools.getPools());
                      break;
                 }
                
                              
                 
            },this);
                
        },this);
        
        this.paramsTable.load(this.getParameters());
    },
    getParameters: function() {
        var i=0;
        return this.define.parameters.map(function(p) {
            p.value=this.parameters[i] || "";
            p.method=this.method;
            p.order = this.order;
            i++;
            return new App.Model.ActionParam(p);
            
        },this);
    },
    getMappedParameters: function() {
        return this.paramsTable.rows.map(function(param) {
            return param.getValue();
        });
    }
};
App.Model.Action = Ext.extend(App.Model.Abstract,App.Model.Action);