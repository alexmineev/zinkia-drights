/**
 * Clase base General
 *
 * 
 * @class General
 * @namespace App.Croupier
 */

Ext.namespace("App.Croupier");
Ext.namespace("App.Panel");

App.Croupier.General = Ext.extend(App.AbstractClass,{
    
    load_layout: function(layout) /*OnLogin()*/
    {
      
       
        if (!App.header) App.header=new panel_header();
        
        if (App.tabs) {
            
            App.tabs.destroy();
            delete App.tabs;
        }
	
        the_panel_tabs=App.tabs = new App.Tabs({
                                                html_id:"tabs",
                                                scrollBarWidths:40,
                                                wrapperClass:"wrapper",
                                                listClass:"list",
                                                scrollerLeftClass:"scroller-left",
                                                scrollerRightClass:"scroller-right"
                                            });
                                           
        if (!window.the_button_open_new_tabs) window.the_button_open_new_tabs=new button_open_new_tabs();
       
      if (!App.layoutManager) {  
            App.layoutManager = new App.Widget.LayoutManager({id:"layoutManager"});                         
            //App.layoutManager.loadLayouts();
       
        if (App.layoutManager.layoutsTable.rows.length == 0) {
               console.debug("No layouts o userid=0");
            App.tabs.create_tab(App.config.panels[App.config.initialPanel]);
            return;
        }
        
        if (!layout && App.layoutManager.hasDefaultLayout()) {
            layout=App.layoutManager.getDefaultLayout();
            
            console.debug("Default layout: " + layout.name);
        }
      }   
      
      if (layout) {  //loading specific layout
            console.debug("layout: "+layout.name);
            console.info("[LayoutManager]: Loading layout: "+layout.name);
            //App.mainBox=App.progressMsg(App.getAppName(),"Loading application layout: "+layout.name);
            console.debug(layout);
            
            App.currentLayout = layout;
            var activeClass;
            layout.config.tabs.forEach(function(tab) {
                var panel = App.tabs.create_tab(App.config.panels[tab.panelClass],tab.name);
                if (tab.active) activeClass=tab.panelClass;
                
                
                panel.tables.forEach(function(table) {
                    if (tab.tables[table.id])
                        /*table.on("loaded",function() {
                            table.setTableConfig(tab.tables[table.id]);
                            table.hideFilter.defer(500,table);
                        },this);*/
                      table.setTableConfig(tab.tables[table.id]);      
                            
                },this);
                
                
                
                
            },this);
            
            App.tabs.setActiveTabId(App.tabs.getTabByType(App.config.panels[activeClass]));
            
            App.mainBox.progress(100);
            App.mainBox.done();
            
    
    } else { //no layouts, loading default configuration
         App.tabs.create_tab(App.config.panels[App.config.initialPanel]);
         App.load("auth.php");
         
    }
	
}

,
init_star: function()
{
        
     $("#logout").click(function() {
         
     });          
 	
}
});


