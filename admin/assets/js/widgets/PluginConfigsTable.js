Ext.ns("App.Widget");

/** 
 * Tabla de grupos de usuarios.
 * 
 * @class PluginConfigsTable
 * @extends App.Widget.Table
 * @memberOf App#Widget
 * @namespace App.Widget 
 */
App.Widget.PluginConfigsTable = Ext.extend(App.Widget.Table,{
    
    constructor: function(config) {
        
        
        //Ext.applyIf(config,App.Widget.Table.Selectable); //Make Table checkbox-selectable
        config=App.Widget.Table.makeSelectable(config);
        
        Ext.apply(config, {
            rowClass: App.Model.PluginConfig,
            
            drawCallback: function ( settings ) {
                
                if (config.noGroup) return;
                var api = this.api();
                var rows = api.rows( {page:'current'} ).nodes();
                var last=null;
 
            api.column(3, {page:'current'} ).data().each( function ( group, i ) {
                
                if ( last !== group ) {
                    
                    $(rows).eq( i ).before(
                        App.Widget.renderTemplate('pluginConfigGroup',{name:group.name,icon:group.icon,description:group.description})
                        
                    );
            
                    
 
                    last = group;
                }
                
                
            } );
            
           
        }
        });
        
        if (!config.noGroup)
          config.columnDefs.push({
             visible: false, 
             targets:3
          });
        
        App.Widget.PluginConfigsTable.superclass.constructor.call(this,config);
        
    }
});

