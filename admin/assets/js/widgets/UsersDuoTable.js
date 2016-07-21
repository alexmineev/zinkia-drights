Ext.ns("App.Widget");

App.Widget.UsersDuoTables = Ext.extend(App.Widget.DuoTables,{
    constructor: function(config) {
        
        Ext.applyIf(config,{
                    leftTable: {
                     $class: App.Widget.UsersTable,
                     config: config.leftTableConfig || {}
                    },
                    rightTable: {
                     $class: App.Widget.UsersTable,
                     config: config.rightTableConfig || {}
                    }
               });
        
       App.Widget.UsersDuoTables.superclass.constructor.call(this,config); 
    }
});

