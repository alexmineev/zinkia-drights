/**
 * 
 * @class Plugin
 */
App.Model.Plugin = {
    $fields: ["id","name"],
    
    constructor: function Plugin(plugin) {
        
      
      App.Model.Plugin.superclass.constructor.apply(this,arguments);  
      
      this.description = this.description || "";
    },
    getIcon: function(height) {
        return $("<img>").attr("src","data:image/png;base64,"+this.icon)//.css("background-image","url(data:image/png;base64,"+this.icon+")")
                         .attr("height",height+"px")
                         .get(0).outerHTML;
    },
    
    toRowModelArray: function() {
        //throw this.name;
        return ["",this.getIcon(40),this.name,this.description,(this.vendor && this.vendor.name) || "[NOT SET]",this.configurations.length];
    },
    getConfigurations: function() {
        
        
        return this.configurations.map(function(conf) {
             return new App.Model.PluginConfig({id: conf,name:conf,enabled
                 :1,plugin:this}); 
        },this);
    },
    loadData: function() {
        /*if (!this.data) 
            App.API.Plugins.getPluginData(this.id,function() {},this);*/
    }
    
    
};
App.Model.Plugin = Ext.extend(App.Model.Abstract,App.Model.Plugin);
