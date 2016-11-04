Ext.ns("App.Widget");

/** 
 * Tabla de grupos de usuarios.
 * 
 * @class PluginsTable
 * @extends App.Widget.Table
 * @memberOf App#Widget
 * @namespace App.Widget 
 */
App.Widget.PluginsTable = Ext.extend(App.Widget.Table,{
    
    constructor: function(config) {
        //Ext.applyIf(config,App.Widget.Table.Selectable); //Make Table checkbox-selectable
        config=App.Widget.Table.makeSelectable(config);
        
        Ext.apply(config, {
            rowClass: App.Model.Plugin,
            
        });
        if (config.showConfigs)
        config.columnDefs.push({
                                    className: "details-control text-left",
                                    orderable: false,   
                                    defaultContent: '',
                                    targets: 5
            });
        
        
        App.Widget.PluginsTable.superclass.constructor.call(this,config);
        
        if (config.showConfigs)
            this.on("loaded",function() {
                this._setExtraInfo();
            },this);
        
        
        this.on("rowadded",function(index,plugin) {
            plugin.loadData();
        });
        
    },
    _setExtraInfo: function() {
         var me=this;
        
         $("#"+this.id+"_dt tbody").on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = me.$dt.row( tr );
 
        if ( row.child.isShown() ) {
            // This row is already open - close it
            //tr.getAttribute();
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            var rand = Math.floor(Math.random()*1000000000000);
            
            var childConfigs= $(row.node())
                                .data()
                                .getConfigurations();
                        
            if (childConfigs === null) {
                 row.child(App.Widget.getTemplate('no_plugin_config')).show();
                 tr.addClass('shown');
                return;
            }
            
            
            var tplHtml = App.Widget.renderTemplate("plugin_configs",{id: me.id+"_child_"+rand});
            
                        
            row.child(tplHtml).show();
           
            me.configsTable = new App.Widget.PluginConfigsTable({
                id:me.id+"_child_"+rand,
                dom:"t",
                noGroup:true
            });
         
            me.configsTable.load(childConfigs); 
            $("#"+me.id+"_child_"+rand).addClass("childTable");
            
            tr.addClass('shown');
            tr.attr("data-child-id",me.id+"_child_"+rand);    
            
        }
        } );
    }
    
});

