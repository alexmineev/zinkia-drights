Ext.ns("App.Panel");

App.Panel.PresetList = {
   constructor: function panel_preset_list(tab_id)
{

	
// 	panel_header.prototype = panel; /// P�ra que "herede" pero no vale de mucho de momento
	
/// ATRIBUTOS 
	
	this.html_id="preset_list";
// 	this.url='assets/html/user_list.html';
	this.tab_id=tab_id;

	
	this.define=C.panels.panel_preset_list;
	

        

	this.update= function ()
	{
		


	}		
	
	

		
/// CONSTRUCTOR	 (despues de las declaraciones para poder usar los metodos delcarados
	

// 	log4javascript.getRootLogger().info("panel_header html_id:"+this.html_id);
	
	
	

	App.Panel.PresetList.superclass.constructor.apply(this,arguments);
        
        
 	
    },
    initialLoad: function() {
        this.presetsTable.on("loaded",function() {
            App.mainBox.progress(100);
            App.mainBox.done();
        })
        
        App.mainBox=App.progressMsg("Presets","Loading presets...");
        
        this.presetsTable.load(App.API.Presets.getPresets());
    },
    loaded_html: function() {
        
        
        
        this.presetsTable = new App.Widget.PresetsTable({
           id:"presets-table" 
        });
        
               
        this.tables.push(this.presetsTable);
        return App.Panel.PresetList.superclass.loaded_html.call(this);
    },
    
}
App.Panel.PresetList = Ext.extend(App.Panel,App.Panel.PresetList);

window.panel_preset_list = App.Panel.PresetList;