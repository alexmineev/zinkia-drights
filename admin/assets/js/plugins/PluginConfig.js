Ext.ns("App.Model");
/**
 * 
 * @class PluginConfig
 * @extends App.Model.Abstract
 * @namespace App.Model
 */
App.Model.PluginConfig = {
    $fields: ["id","name"],
    
    constructor: function PluginConfig(pluginConfig) {
      
      App.Model.PluginConfig.superclass.constructor.apply(this,arguments);  
      
      this.id = this.plugin.id+":"+this.id; 
      //this.name = this.id;
    },
    
    toRowModelArray: function(rowType) {
        
        if (!rowType)
            return ["",this.name,this.getEnabledBox(),/*this.plugin ? this.plugin.name:""*/this.plugin];
        else if(rowType == "node") {
            return ["",this.name,this.test,this.plugin];
        }
    },
    getEnabledBox: function() {
        var $inp =  $("<input>")
                .attr("type","checkbox")
                .attr("disabled","disabled");
         if (this.enabled=="1") $inp.attr("checked","checked");
         
       return $inp.get(0).outerHTML;  
    }
    
};
App.Model.PluginConfig = Ext.extend(App.Model.Abstract,App.Model.PluginConfig);
