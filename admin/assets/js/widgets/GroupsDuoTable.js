Ext.ns("App.Widget");

App.Widget.GroupsDuoTables = Ext.extend(App.Widget.DuoTables,{
    constructor: function(config) {
        
        Ext.applyIf(config,{
                    leftTable: {
                     $class: App.Widget.GroupsTable,
                     config: config.leftTableConfig || {}
                    },
                    rightTable: {
                     $class: App.Widget.GroupsTable,
                     config: config.rightTableConfig || {}
                    }
               });
        
       App.Widget.GroupsDuoTables.superclass.constructor.call(this,config); 
    }
});




