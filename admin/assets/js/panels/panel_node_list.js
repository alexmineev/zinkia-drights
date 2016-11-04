

//Inherit the methods of panel
Ext.ns("App.Panel");

App.Panel.NodeList = {
    

constructor: function panel_node_list(tab_id)
{

	
// 	panel_header.prototype = panel; /// P�ra que "herede" pero no vale de mucho de momento
	
/// ATRIBUTOS 
	
	this.html_id="node_list";
// 	this.url='assets/html/user_list.html';
	this.tab_id=tab_id;

	
	this.define=C.panels.panel_node_list;
	
// 	this.the_panel_user_data;
	
	/// CONSTRUCTOR AL FINAL PAR PODER USAR LOS METODOS DECLARADOS

		
	
	
/// METODOS 
///		PRIVADOS 
///			var metodo =function()[];
///		PUBLICOS 
///			this.metodo =function()[];
	
        
        this.initialLoad= function() {
            this.nodeTable.on("loaded",function() {
                App.mainBox.progress(100);
                App.mainBox.done();
            },this);
            
            
            App.mainBox = App.progressMsg("Nodes","Loading nodes...");
            this.nodeTable.load(App.API.Nodes.getNodes());
            
        }

	this.loaded_html= function ()
	{
                var me=this;
		this.nodeTable = new App.Widget.NodesTable({
                   id:"table-nodes",
                   rowType: "full"
                  
                });
                this.tables.push(this.nodeTable);
              croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.pool$list],function(data) {
                     App.mainBox = App.progressMsg("Croupier Server Syncronization","Reloading nodes...");
                     this.nodeTable.load(App.API.Nodes.getNodes());
             },this);   
             this.constructor.superclass.loaded_html.call(this);   
	}  


	this.update= function ()
	{
            this.nodeTable.adjust();
	}		
	
        
        //this.loadDetails = 
	
		
/// CONSTRUCTOR	 (despues de las declaraciones para poder usar los metodos delcarados
	
	
	App.Panel.NodeList.superclass.constructor.call(this);
	
 	
}


}

App.Panel.NodeList = Ext.extend(App.Panel,App.Panel.NodeList);

window.panel_node_list = App.Panel.NodeList;