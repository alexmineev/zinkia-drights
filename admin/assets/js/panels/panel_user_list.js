Ext.ns("App.Panel");
/**
 * Panel de lista de usuarios
 * 
 * @class UserList 
 * @extends App.Panel
 * @memberOf App#Panel
 * @namespace App.Panel
 */
App.Panel.UserList = Ext.extend(App.Panel,{
    
    constructor:function UserList(tab_id)
    {
        
            
// 	panel_header.prototype = panel; /// P�ra que "herede" pero no vale de mucho de momento
	
/// ATRIBUTOS 
	
	this.html_id="user_list";
// 	this.url='assets/html/user_list.html';
	this.tab_id=tab_id;

	
	this.define=C.panels.panel_user_list;
	
	this.the_panel_user_data;
	
        this.usersTableId = "table_user";
	/// CONSTRUCTOR AL FINAL PAR PODER USAR LOS METODOS DECLARADOS

		
	this.deleteUsers = function() {
            var selUsers =this.usersTable.getSelectedRows();
            if (selUsers.length == 0) return;
            
            if (!window.confirm("Are you sure?")) return;
            
            var removed = 0;
            App.mainBox = App.progressMsg("Users","Deleting users...");
            
           /* selUsers.forEach(function(user) {
                
                 user.on("removed",function() {
                    removed++;
                   if (removed==selUsers.length) {
                       App.mainBox.progress(100);
                       App.mainBox.done();
                   } else {
                       App.mainBox.progress(Math.round(removed*100/selUsers.length));
                   }
                    
                 },this);
                 
                 user.remove();   
                    
            },this);*/
            
            
            App.API.Users.removeUsers(selUsers,function() {
                App.mainBox.progress(100);
                App.mainBox.done();
            });
            
            
            
        }
	
/// METODOS 
///		PRIVADOS 
///			var metodo =function()[];
///		PUBLICOS 
///			this.metodo =function()[];
	

	this.loaded_html= function ()
	{
                
                console.log("Panel[Users]::loaded_html()");
                
		$("#"+this.html_id).show();
		
		
		var tab_id=this.tab_id,
                        me=this;
		
                    
                this.tasksTable = new App.Widget.TasksTable({
                      id: "table_tasks"
                });     
                
            
                this.tables.push(this.tasksTable);
                
                
                this.constructor.superclass.loaded_html.call(this);
                
               var me=this;
               
            this.tasksTable.load([]);
                
		
	}  

	this.initialLoad = function() {
            
        }
	
		
	this.addUser=function()
	{
		
                
            this.the_panel_user_data=new panel_user_data(this.tab_id, -1);
            this.the_panel_user_data.show();
                
		
	}
	

		
	this.userDetails=function(userId)
	{
// 		
			this.the_panel_user_data=new panel_user_data(this.tab_id, userId);
                        this.the_panel_user_data.show();
		
	}
	
	/**
         * 
         * @deprecated
         */
	this.update= function ()
	{
		


        
	}		
	
	
	

		
/// CONSTRUCTOR	 (despues de las declaraciones para poder usar los metodos delcarados
	

	
 	//panel.prototype.constructor.call(this);
        App.Panel.UserList.superclass.constructor.apply(this,arguments);
}

});
/**
 * @deprecated backcompatibility
 * @type App.Panel.UserList
 */
var panel_user_list = App.Panel.UserList;