Ext.ns("App.Panel");


/**
 * 
 * 
 * @class Groups
 */
App.Panel.Groups = Ext.extend(App.Panel,{
    

    constructor: function panel_group_list(tab_id)
        {

	

	

	
	this.html_id="group_list";

	this.tab_id=tab_id;

        this.tableGroupsId= "table-group";
	this.define=C.panels.panel_group_list;
	
	this.the_panel_group_data;
	
// 	this.the_panel_user_data;
	
	/// CONSTRUCTOR AL FINAL PAR PODER USAR LOS METODOS DECLARADOS

		
	
	
/// METODOS 
///		PRIVADOS 
///			var metodo =function()[];
///		PUBLICOS 
///			this.metodo =function()[];
	

	this.loaded_html= function ()
	{
// 		
		$("#"+this.html_id).show();
		console.log("html loaded");
	
		var tab_id=this.tab_id;
                
                this.groupsTable= new App.Widget.GroupsTable({
                    id: this.tableGroupsId,
                }); 
                
 		
               this.tables.push(this.groupsTable);
                
                
                this.constructor.superclass.loaded_html.call(this);
		this.updateButtonAble();
	
	},
        this.initialLoad = function() {
          
          var me=this;  
            
          this.groupsTable.on("rowselected",function(group) {
            if (group.hasPermission(croupier.UserGroupPermission.remove))
            {
                $("#remove_group").off("click").click(function() {me.removeGroups();});
                return true;
            }
            else{
                App.errorMsg("Groups","You don't has a permission to remove this group");
                return false;
            }
                
          },this);  
            
          this.groupsTable.on("loaded",function() {
              App.mainBox.progress(100);
              App.mainBox.done();
              
          },this); 
            
          App.mainBox = App.progressMsg("Groups","Loading groups...");  
          this.groupsTable.load(App.API.Groups.getGroups()); 
          this.groupsTable.initHeader();
          
          
          
        },

	this.updateButtonAble=function()
	{
	
		var me=this;
                $('#group_details').hide(); //TODO: remove
		
		
		if (App.canUserDo(croupier.ModificationDataAllPermission.userGroup$add))
        		$("#add_group").click(function ()
                                                {
                                                     me.the_panel_group_data=new panel_group_data(me.tab_id, -1);
                                                });

		else
                    $("#add_group").addClass("disabled");
                
	}
	
	this.removeGroups=function()
	{
		var selGroups = this.groupsTable.getSelectedRows();
		
                if (selGroups.length==0) return;
                if (!window.confirm("Are you sure?")) return;
                
                App.mainBox = App.progressMsg("Groups","Removing selected groups...");
                
                App.API.Groups.removeGroups(selGroups,function() {
                    App.mainBox.progress(100);
                    App.mainBox.done();
                });
                
	}
	
	
	this.addGroup=function()
	{
		log4javascript.getRootLogger().info("addGroup--");
		
	}
	
	this.detailsGroup=function()
	{
		log4javascript.getRootLogger().info("detailsGroup");
		
	}
	
	
	this.groupDetails=function(groupId)
	{
		
		this.the_panel_group_data=new panel_group_data(this.tab_id, groupId);	
// 		
	}
	
	
	
	this.update= function ()
	{

        //console.info("UPDATE GROUPS");
            this.groupsTable.adjust();

       }
       
      


	App.Panel.Groups.superclass.constructor.apply(this,arguments);
	
}

});
/**
 * Self instance (legacy)
 * @type self
 */
window.panel_group_list =App.Panel.Groups;
