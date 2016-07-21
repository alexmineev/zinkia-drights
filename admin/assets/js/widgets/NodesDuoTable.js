Ext.ns("App.Widget");

App.Widget.NodesDuoTable = Ext.extend(App.Widget.DuoTables,{
    constructor: function(config) {
        
        Ext.applyIf(config,{
                    leftTable: {
                     $class: App.Widget.NodesTable,
                     config: config.leftTableConfig || {noSync:true}
                    },
                    rightTable: {
                     $class: App.Widget.NodesTable,
                     config: config.rightTableConfig || {}
                    }
               });
        
       App.Widget.NodesDuoTable.superclass.constructor.call(this,
                                                                config); 
    }
    
    
    
});



