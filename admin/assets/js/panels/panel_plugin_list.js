Ext.ns("App.Panel");




App.Panel.Plugins = {
    
 constructor: function panel_plugin_list(tab_id)
{

	this.html_id="plugin_list";
// 	this.url='assets/html/user_list.html';
	this.tab_id=tab_id;

	
	this.define=C.panels.panel_plugin_list;

	this.loaded_html= function ()
	{
                
           
            this.pluginsTable = new App.Widget.PluginsTable({
                id: "plugins-table",
                showConfigs: true
                
            }); 
            this.tables.push(this.pluginsTable);
            App.mainBox=App.progressMsg("Plugins","Loading plugins");    
                
            return this.constructor.superclass.loaded_html.apply(this,arguments);
	}
        
        this.initialLoad=function() {
            this.pluginsTable.on("loaded",function() {
                App.mainBox.progress(100);
                App.mainBox.done();
            }); 
            
            this.pluginsTable.load(App.API.Plugins.getPlugins());
        }

 	App.Panel.Plugins.superclass.constructor.apply(this,arguments);
}

}

App.Panel.Plugins = Ext.extend(/*@extends*/App.Panel,
                              /*@class*/App.Panel.Plugins);
                              
window.panel_plugin_list = App.Panel.Plugins; 