Ext.ns("App.Widget");

/** 
 * Tabla de grupos de usuarios.
 * 
 * @class JobsSelectorTable
 * @extends App.Widget.Table
 * @memberOf App#Widget
 * @namespace App.Widget 
 */
App.Widget.JobsSelectorTable = Ext.extend(App.Widget.Table,{
    
    constructor: function(config) {
        //Ext.applyIf(config,App.Widget.Table.Selectable); //Make Table checkbox-selectable
        if (!config.noselectable)
            config=App.Widget.Table.makeSelectable(config);
        
        config.columnDefs.push({
             targets:2,
             sortable:false,
             className: "selectorCell"
        }); 
        Ext.applyIf(config, {
                cssClass:"selectorTable",
                rowModel: App.Model.Job,
                dom: 't'

            });
        
        App.Widget.JobsSelectorTable.superclass.constructor.call(this,config);
        
       this.on("loaded",function() {
           
           
       },this)
        
    },
    initHeader: function() {
        
         
         
    }
});

