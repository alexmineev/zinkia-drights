Ext.ns("App.Panel");


App.Panel.ButtonOpenNewTabs = {
    
constructor:function button_open_new_tabs()
{

	
// 	panel_header.prototype = panel; /// P�ra que "herede" pero no vale de mucho de momento
	
/// ATRIBUTOS 
	
	this.html_id="button_open_new_tab";
// 	this.url='assets/html/button_open_new_tabs.html';

	this.define=C.panels.button_open_new_tabs;
	
	
	/// CONSTRUCTOR AL FINAL PAR PODER USAR LOS METODOS DECLARADOS

	
/// METODOS 
///		PRIVADOS 
///			var metodo =function()[];
///		PUBLICOS 
///			this.metodo =function()[];
	
	


	this.loaded_html= function ()
	{
// 		
		$('#button-report-processor').click(
							function(e)
							{
                                                            App.tabs.create_tab(CONSTANT.panels.panel_monitor);
							});
		
		
		$('#tasks_view').click(
											function(e)
											{
												App.tabs.create_tab(CONSTANT.panels.panel_user_list);
// 												the_panel_new_job.load_new_job_plugins();
											}
										 );
		
		
		$('#button-monitor').click(
											function(e)
											{
												App.tabs.create_tab(CONSTANT.panels.panel_monitor);
// 												the_panel_new_job.load_new_job_plugins();
											}
										 );
		
		$('#button-group').click(
											function(e)
											{
												App.tabs.create_tab(CONSTANT.panels.panel_group_list);
// 												the_panel_new_job.load_new_job_plugins();
											}
										 );
		
		$('#button-create-history').click(
											function(e)
											{
												App.tabs.create_tab(CONSTANT.panels.panel_history);
// 												the_panel_new_job.load_new_job_plugins();
											}
										 );
		
		$('#button-create-stadistics').click(
											function(e)
											{
												App.tabs.create_tab(CONSTANT.panels.panel_statistics);
// 												the_panel_new_job.load_new_job_plugins();
											}
										 );
		
		$('#button-create-nodes').click(
											function(e)
											{
												App.tabs.create_tab(CONSTANT.panels.panel_node_list);
// 												the_panel_new_job.load_new_job_plugins();
											}
										 );
		
		$('#button-create-pools').click(
											function(e)
											{
												App.tabs.create_tab(CONSTANT.panels.panel_pool_list);
// 												the_panel_new_job.load_new_job_plugins();
											}
										 );
		$('#button-create-presets').click(
											function(e)
											{
												App.tabs.create_tab(CONSTANT.panels.panel_preset_list);
// 												the_panel_new_job.load_new_job_plugins();
											}
										 );
		
		$('#button-create-crontab').click(
											function(e)
											{
												App.tabs.create_tab(CONSTANT.panels.panel_contrab_list);
// 												the_panel_new_job.load_new_job_plugins();
											}
										 );
		
		                                                   
		
		
		
              
              //this.constructor.superclass.loaded_html.call(this);
		this.show();
	}  
	


		
/// CONSTRUCTOR	 (despues de las declaraciones para poder usar los metodos delcarados
	

	
 	App.Panel.ButtonOpenNewTabs.superclass.constructor.call(this);
	
}

}
App.Panel.ButtonOpenNewTabs = Ext.extend(App.Panel,App.Panel.ButtonOpenNewTabs);
window.button_open_new_tabs = App.Panel.ButtonOpenNewTabs;

