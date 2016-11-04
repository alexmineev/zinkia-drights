Ext.ns("App.Widget");

App.Widget.PluginsPermissionsDuoTables = Ext.extend(App.Widget.PermissionsDuoTables,{
    constructor: function(config) {
        
        Ext.applyIf(config,{
                    leftTable: {
                     $class: App.Widget.PluginConfigsTable,
                     config: config.leftTableConfig || {}
                    },
                    rightTable: {
                     $class: App.Widget.PluginConfigsTable,
                     config: config.rightTableConfig || {}
                    },
               });
        
       App.Widget.PluginsPermissionsDuoTables.superclass.constructor.call(this,config); 
       
       this.leftTable.on("loaded",function() {
           
           var allConfigs = [];
           
           App.API.Plugins.getPlugins().forEach(function(plugin) {
               $.merge(allConfigs,plugin.getConfigurations());
           },this);
           
           if (this.leftTable.rows.length==allConfigs.length)
           {
               $("#"+this.id+"_all").prop("checked",true).triggerHandler("click");
           }
           
       },this);
    },
    getAssigned: function() {
        if (this.isAll()) {
            return [new App.Model.Plugin({id:"*"})];
        } else {
           return this.constructor.superclass.getAssigned.call(this);
        }
    }
});

