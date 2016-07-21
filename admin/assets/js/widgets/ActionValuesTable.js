Ext.ns("App.Widget");

/** 
 * Tabla de grupos de usuarios.
 * 
 * @class ActionValuesTable
 * @extends App.Widget.Table
 * @memberOf App#Widget
 * @namespace App.Widget 
 */
App.Widget.ActionValuesTable = Ext.extend(App.Widget.Table,{
    
    constructor: function(config) {
        //Ext.applyIf(config,App.Widget.Table.Selectable); //Make Table checkbox-selectable
        if (!config.noselectable)
            config=App.Widget.Table.makeSelectable(config);
        
        
        config.columnDefs.push({
            targets: 1,
            sortable:false,
            
        });
        config.columnDefs.push({
            targets: 2,
            sortable:false,
            className:"actionValue"
            
        });
        Ext.apply(config, {
            rowClass: App.Model.ActionParam,

            
        });
        
        App.Widget.ActionValuesTable.superclass.constructor.call(this,config);
       
        
    },
    initHeader: function() {
         $("#"+this.id+"_n").text(this.rows.length);
         
         $("#"+this.id+" td a[data-actionid]").off("click")
                              .click(function() { 
                                console.log("[ActionValuesTable] Loading group data id:"+this.getAttribute("data-actionid"));
                                
                                
                                                                                             
                            });
          $(".ico-info").popover();                  
         
         
    }
});

