Ext.ns("App.API");

/**
 * 
 * Singelton Plugins Class 
 * 
 * @class Plugins 
 * @memberOf App#API
 * @static
 */
App.API.Plugins = 
{
        /**
         * 
         * @returns {Array} Array of {App.Model.Plugin}
         */
        getPlugins: function() {
            
            return this.plugins ||
             (this.plugins = this.data.plugins.job /*this.data.plugins.postJob*/
                            .map(function(plugin) {
                                return new App.Model.Plugin(plugin);
                            },this)) ;
        },
        /**
         * 
         * @param {String} pluginId
         * @returns {App.Model.PluginData}
         */
        getPluginData: function(id,cbData,scope) {
            console.log("[Plugins::getPluginData():] "+id);
            console.dir(this.getPlugin(id));
            
            if (!App.Model.isModel(plugin = this.getPlugin(id))) {
                    //console.dir(plugin);
                    
                    throw new Error("[App.API.Plugins] Plugin Id:'"+id+"' not found.");
                }
            
            
            if (plugin.data) return plugin.data;
            
                function _processPluginData(data) {
                     plugin.data = [];
                    
                    Ext.apply(plugin,data);
                    
                   
                    var defPropList = "default";
                    return data
                            .configurations
                              .map(function(c) {
                                          var idProp= c.properties;
                                           console.log(idProp);
                                         if (!Ext.isString(idProp)) throw new TypeError("id of property of "+c.name+" is not String");
                                         
                                            c.properties=plugin.properties.find(function(prop) {
                                                 return prop.id == idProp;
                                            }).properties;      
                                            
                                                                                
                                         
                                            return new App.Model.PluginData(c);
                                     });
                    
                }
            
            
           // App.mainBox = App.progressMsg("Plugins","Load plugin configuration...");
            this.api.plugin$getData(plugin.id,function(res) {
                if (res.status==croupier.ResponseStatus.SUCCESS)
                {
                    /*App.mainBox.progress(100);
                    App.mainBox.done();*/
                   // console.dir(res.value);
                    plugin.data = _processPluginData(res.value);
                    
                   
                                     
                    cbData.call(scope,plugin.data);
                } else {
                  throw new Error("Plugins","Error loading configuration of plugin: "+plugin.id+";<br/> Status: "+res.status+"; message: "+res.value);
                }
            });
            
            
            
            return;
        },
        
        /**
         * 
         * @param {type} id
         * @returns {App.Model.Plugin}
         */
        getPlugin: function(id) {
            return this.getPlugins().find(function(plugin) {
                return plugin.id === id;
            },this);
        }
       
        
};
App.API.Plugins = $.extend(croupier,App.API.Plugins);

 



