/**
 * 
 * @class GroupData
 */
App.Panel.GroupData = Ext.extend(App.Panel,{

// var panel_new_job = function ()
    constructor:function panel_group_data(id_tab, id_group)
    {

	
	this.html_id="panel_group_data";
	this.tab_id=id_tab;
// 	this.url='assets/html/new_job.html';
	
	
	this.define=C.panels.panel_group_data;
	
	
	this.group_id=id_group;
	
	
	
	//this.userGroups = croupier.data.userGroup.values(true);
        this.users = App.API.Users.getUsers();
	
    
	if (id_group!=-1)
            this.group_data = App.API.Groups.getGroup(this.group_id); 
        else 
            this.group_data =null;
        
	this.loadDataGroup=function()
	{
            
            
            $("#groupName").val(this.group_data.name);
            $("#groupDescription").val(this.group_data.description);
            
       
	    
	}
        
        this.close = function() {
            $("#datatables_buttons_info").remove();
            $("#"+this.html_id+" .modal").remove();
            $("#panel_group_data").remove();
        }
        this.show = function() {
            
            $("#"+this.html_id+" .modal").modal({backdrop:"static"})
                    .fadeIn();
                    
            
            $("#"+this.html_id).show();
        }
        
        /**
         * @deprecated see App.API.Users
         * */
        this.getUsersByGroupId= function(groupid) {
            return this.users.filter(function(user) {
                return $.inArray(this.group_id,user.groups);
            },this);
        };
        this.initialLoad = function() {
            
            if (this.group_id == -1) return this.addModeLoad();
            
            App.mainBox = App.progressMsg("Group details","Loading group users...");
            
            
            this.groupsDuo.leftTable.on("loaded",function() {
               App.mainBox.progress(87);
              this.groupsDuo.rightTable.load(App.API.Groups.getGroups());
            },this);
            
            this.groupsDuo.rightTable.on("loaded",function() {
               
                if (this.group_data.groupAllPerm) {
                    $("#"+this.groupsDuo.id+"_all").prop("checked",true).triggerHandler("click");
                    $("#"+this.groupsDuo.id+"_all_perm").val(this.group_data.groupAllPerm);
                    
                } 
                
               App.mainBox.progress(100);
               App.mainBox.done();
              
              $("#datatables_buttons_info").remove();
               
            },this);
            
            
            this.pluginsDuo.leftTable.on("loaded",function() {
                App.mainBox.progress(62);
               
                this.allConfigs = [];
                this.pluginsLoaded = 0;
                this.plugins = App.API.Plugins.getPlugins();
            
                this.plugins.forEach(function(plugin) {
                  $.merge(this.allConfigs,plugin.getConfigurations());
                
                 },this);
                  this.pluginsDuo.rightTable.load(this.allConfigs);
               
            },this);
            
            
            this.pluginsDuo.rightTable.on("loaded",function() {
               App.mainBox.progress(75);
                App.mainBox.setMsg("Loading group groups...");
                
                this.groupsDuo.leftTable.load(this.group_data.getGroups());
                
                
            },this);
            this.poolsDuo.leftTable.on("loaded",function() {
               App.mainBox.progress(37);
               
               if (this.group_data.poolAllPerm) {
                    $("#"+this.poolsDuo.id+"_all").prop("checked",true).triggerHandler("click");
                     $("#"+this.poolsDuo.id+"_all_perm").val(this.group_data.poolAllPerm);
                    
                } 
               
               this.poolsDuo.rightTable.load(App.API.Pools.getPools());
               
            },this);
            
            this.poolsDuo.rightTable.on("loaded",function() {
               App.mainBox.progress(50);
               App.mainBox.setMsg("Loading group plugins...");
               
               
               this.groupConfigs =  this.group_data.getPluginConfigs();
                console.dir(this.groupConfigs);
                
                this.pluginsDuo.leftTable.load(this.groupConfigs);
               
            },this);
            
            
            this.usersDuo.rightTable.on("loaded",function() {
                App.mainBox.progress(25);
                App.mainBox.setMsg("Loading group pools...");
                
                this.poolsDuo.leftTable.load(this.group_data.getPools());
            },this);
            
            this.usersDuo.leftTable.on("loaded",function() {
                
                App.mainBox.progress(12);
                this.usersDuo.rightTable.load(this.users); //all users;
                
                
            },this);
            
                    
            
            this.usersDuo.leftTable.load(this.group_data.getUsers());  //group users
            
            
        };
        this.addModeLoad = function() {
            App.mainBox = App.progressMsg("Add Group","Loading lists...");
            
            
            $("#groupName").val("");
            $("#groupDescription").val("");
            
            $(".panel-newmode-only").show().css("visibility","visible");
            
            this.usersDuo.rightTable.on("loaded",function() {
                App.mainBox.progress(25);
                
                
                 this.allConfigs = [];
                this.pluginsLoaded = 0;
                this.plugins = App.API.Plugins.getPlugins();
            
                this.plugins.forEach(function(plugin) {
                  $.merge(this.allConfigs,plugin.getConfigurations());
                
                 },this);
                 
                  this.pluginsDuo.allConfigs = this.allConfigs;
                  this.pluginsDuo.rightTable.load(this.allConfigs);
                  
                
                
            },this);
            
            this.pluginsDuo.rightTable.on("loaded",function() {
                App.mainBox.progress(50);
                
                this.poolsDuo.rightTable.load(App.API.Pools.getPools());
                
            },this);
            this.poolsDuo.rightTable.on("loaded",function() {
                App.mainBox.progress(75);
                
                this.groupsDuo.rightTable.load(App.API.Groups.getGroups());
                
                
            },this);
            this.groupsDuo.rightTable.on("loaded",function() {
                App.mainBox.progress(100);
                App.mainBox.done();
            },this);
            
            
            this.usersDuo.rightTable.load(App.API.Users.getUsers());
            
        }
        
	this.loaded_html= function ()
	{
		var me=this;
                
		 this.usersDuo =  new App.Widget.UsersDuoTables({
                    id:"duousers"
                 });
                
                this.pluginsDuo = new App.Widget.PluginsPermissionsDuoTables({
                    id:"duoplugins"
                });
                
                this.poolsDuo = new App.Widget.PoolsPermissionsDuoTables({
                    id:"duopools"
                });
		
                this.groupsDuo = new App.Widget.GroupsPermissionsDuoTables({
                    id:"duogroupsperm"
                }) 
                
                
                
		if(this.group_id != -1) 
		{
			this.loadDataGroup();
			
		}else
		{
                    $("#"+this.html_id+" .modal-title").text("Add Group");
			/// Se trata de un alta nueva
		}
	
		
		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                    me.usersDuo.refresh();
                    me.poolsDuo.refresh();
                    me.groupsDuo.refresh();
                    me.pluginsDuo.refresh();
                })
		//$("div").tab();
		
		//$("#"+this.html_id).show();
		// the_panel_new_job.load_status();
		
// 		log4javascript.getRootLogger().info("--panel_user_data--loaded_html "+this.html_id);
		
		var my_id_tab=this.tab_id;
		
		$('.groups_data_close_btn').click(function() {
                    me.close();
                });
								
		$('.groups_data_save_btn').click(function() {
                    if (me.group_id!=-1)
                        me.save();
                    else
                        me.add();    
                });
                
		this.show();
                
                
		
         App.Panel.GroupData.superclass.loaded_html.call(this);       


}

    this.save= function() {
        
        App.mainBox=App.progressMsg("Group details","Saving group data...");
        
        
        this.group_data.name = $("#groupName").val();
        this.group_data.description = $("#groupDescription").val();
        
        this.group_data.setUsers(this.usersDuo.getAssigned());
        this.group_data.setPools(this.poolsDuo.getAssigned());
        this.group_data.setPlugins(this.pluginsDuo.getAssigned());
        this.group_data.setGroups(this.groupsDuo.getAssigned());
        
        this.group_data.on("updated",function() {
                App.mainBox.progress(100);
                App.mainBox.done();
                
              this.close.defer(2000,this);
                
        },this);
        
        
        this.group_data.update();
        
    }
    this.add = function() {
        
        if (!$("#groupName").formValidate()) return;
        
        
        App.mainBox=App.progressMsg("Add Group","Inserting group data...");
        
              
        this.group_data = new App.Model.Group({id:-1});
        
        this.group_data.name = $("#groupName").val();
        this.group_data.description = $("#groupDescription").val();
        this.group_data.permission = $("#groupPermission").val();
        
        this.group_data.setUsers(this.usersDuo.getAssigned());
        this.group_data.setPools(this.poolsDuo.getAssigned());
        this.group_data.setPlugins(this.pluginsDuo.getAssigned());
        this.group_data.setGroups(this.groupsDuo.getAssigned());
        
        
        this.group_data.on("inserted",function() {
                App.mainBox.progress(100);
                App.mainBox.done();
                
              this.close.defer(2000,this);
                
        },this);
        
        
        this.group_data.insert();
        
    }



        App.Panel.GroupData.superclass.constructor.apply(this,arguments);
    }
});
window.panel_group_data = App.Panel.GroupData;