Ext.ns("App.Panel");


App.Panel.Header = Ext.extend(App.Panel,{
    constructor: function panel_header()
{

	
// 	panel_header.prototype = panel; /// P�ra que "herede" pero no vale de mucho de momento
	
/// ATRIBUTOS 
	
	this.html_id="header";
// 	this.url='assets/html/header.html';

	this.define=C.panels.header;
	

	
	/// CONSTRUCTOR AL FINAL PAR PODER USAR LOS METODOS DECLARADOS

		
	
	
/// METODOS 
///		PRIVADOS 
///			var metodo =function()[];
///		PUBLICOS 
///			this.metodo =function()[];
	

	this.loaded_html= function ()
	{
		$('#nickusername_header').text(App.user.getName());
                $("#user_avatar").attr("src",App.user.getImageUrl());
		$("#"+this.html_id).show();
                                
	}  


		
/// CONSTRUCTOR	 (despues de las declaraciones para poder usar los metodos delcarados
	


	
 	App.Panel.Header.superclass.constructor.apply(this,arguments);


}

});

window.panel_header = App.Panel.Header;
// var panel_header= function ()


