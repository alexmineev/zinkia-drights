Ext.ns("App.Widget");


// var panel_new_job = function ()
App.Panel.UserData=Ext.extend(App.Panel,{
    
    constructor: function panel_user_data(id_tab, id_user)
    {
// 	panel_new_job.prototype = new panel();
	
	/// ATRIBUTOS 
	
	this.html_id="panel_user_data";
	this.tab_id=id_tab;
// 	this.url='assets/html/new_job.html';
	
	
	this.define=C.panels.panel_user_data;
	
	
	this.user_id=id_user;
	this.user_data;
	
	
	this.all_groups;
	
	
        this.close = function() {
                        
            $("#panel_user_data .modal").remove();
            $("#panel_user_data").remove();
        }
            
        this.show = function() {
            
            $("#panel_user_data").show();
            
            $("#panel_user_data .modal").modal({backdrop:"static"})
                    .show();
                    
            
            
        }
            
 
        
	this.loadDataUser=function()
	{
		

		//throw this.user_id; 
              if (this.user_id!=-1) {  
		
		this.user_data=App.API.Users.getUser(this.user_id);
		
		
		$("#user_nick").val(this.user_data.alias); 
                
		$("#user_name").val(this.user_data.name);
		$("#user_mail").val(this.user_data.email);
                
		$("#user_subname").val(this.user_data.surname);
                
		$("#userRole").val(this.user_data.role);
                
		$("#user_enable").prop( "checked", this.user_data.enabled);
                
                //App.test = this; //DEBUG
                //
                //console.dir(this.user_data.groups);
                this.userGroups = this.user_data.getGroups();
            } 
                
                
                this.groupsDuo = new App.Widget.GroupsDuoTables({
                    id:"duogroups"
                });
                
                this.userGroupsTable = this.groupsDuo.leftTable;
               this.allGroupsTable = this.groupsDuo.rightTable;
                
                this.constructor.superclass.loaded_html.call(this);
			
		
		
	}
	this.getAllAvaliableGroups= function() {
         /*return App.API.Groups.getGroups().filter(function(group) {
              return !this.userGroups.contains(group.id);
          },this);*/
           return App.API.Groups.getGroups(); 
            
        };
        
        this.addMode = function() {
            
            $("#"+this.html_id+" .modal-title").text("Add User");
            
            $("#user_nick").val("");
            $("#user_password").val("");
            
            App.mainBox = App.progressMsg("Add User","Loading groups...");
            
            this.allGroupsTable.on("loaded",function() {
                    App.mainBox.progress(100);
                    App.mainBox.done();
                    
                  window.setTimeout(function() {  //HACK
                      $("#user_nick").val("");
                      $("#user_password").val("");
                      $(".form_control").val("");
                  },500);  
                    
            });
            
            this.allGroupsTable.load(this.getAllAvaliableGroups());
            
            
            
        };
        
        this.initialLoad = function() {
            
            
            if (this.user_id==-1) return this.addMode();
            
            $("#"+this.html_id+" .modal-title").text("User Details");
            
            App.mainBox = App.progressMsg("User details","Loading user groups...");
            
            this.allGroupsTable.on("loaded",function() {
                    App.mainBox.progress(100);
                    App.mainBox.done();
                    
                    /* Entry point */
                    
            });
                
            
            this.userGroupsTable.on("loaded", function() {
                    App.mainBox.progress(50);
                    
                this.allGroupsTable.load(this.getAllAvaliableGroups());
                
                
            },this);
            
            
            if (this.user_id!=-1) {
                this.userGroupsTable.load(this.userGroups);
            }
            
                
                
            
            
            
        }

	this.getUserGroups=function()
	{
            return this.userGroupsTable.rows.map(function(g) {return g.id});
	}
	

	this.loaded_html= function ()
	{
// 		
		//$("#section_user_list").hide();
           
		
		
		this.loadDataUser();
		
		
		
		
		$("#user_password").val("");// para evitar que se use la de la cache del navegador
		
		
		// the_panel_new_job.load_status();
		
// 		log4javascript.getRootLogger().info("--panel_user_data--loaded_html "+this.html_id);
		
		
// 		log4javascript.getRootLogger().info("this.tab_id: "+this.tab_id);
		
		var me= this;
		
		$('.users_data_close_btn').click(
									function()
									{
                                                                            $("#panel_user_data .modal").remove();
                                                                            $("#panel_user_data").remove();
										
									});
		
		
		
		
		$('.users_data_save_btn').click(
									function()
									{
                                                                                
										me.saveDataUser();

									});
                                                                        
                                                                        
		this.show();
		
		
					    
	 }  

        this.isUserGroupsChanged =  function() {
            
            if (this.user_id == -1) return true;
            
            var origUserGroups = this.userGroups.map(function(g){return g.id}),
                newUserGroups = this.getUserGroups();    
            
               return !origUserGroups.equal(newUserGroups);
        };
	this.saveDataUser= function ()
	{

		if (this.user_id == -1 &&
                
                            !$("#user_nick,#user_password,#user_name,#user_subname,#user_mail")
                                .formValidate()
                                
                                
                   ) return;
                
                
                
		//var all_groups=this.getAllGroupsUsable();
		var name_user=$("#user_name").val();
		var nick_user=$("#user_nick").val();
		var mail_user=$("#user_mail").val();
                var surname =$("#user_subname").val();
		
		
                var enabled_user=$("#user_enable")[0].checked;
		
		var me = this;
		var role_user=$("#userRole").val();
		//this.userGroupsTable.msgBox("-","Users","Saving user data...");
                
                App.mainBox = App.progressMsg("Users","Saving User data");
                        
                      function __cb(result) {
                         
                        if (result.status==croupier.ResponseStatus.SUCCESS) {
                            
                            
                            
                            if ($("#user_password").val()!="" && me.user_id!==-1) { //password update required
                                App.mainBox.setMsg("Saving user password...");
                                App.mainBox.progress(50);
                                
                                
                                croupier.api.user$setPassword(me.user_data.id,md5($("#user_password").val()),function(result) {
                                    
                                   if (result.status == croupier.ResponseStatus.SUCCESS) {
                                        if (me.isUserGroupsChanged()) //groups update required
                                        {
                                            App.mainBox.setMsg("Saving user groups...");
                                            App.mainBox.progress(50);
                                            
                                            me.saveGroups(function() {
                                                App.mainBox.progress(100);
                                                App.mainBox.done();
                                                me.done();
                                            });
                                        }
                                        else { //no groups update
                                            App.mainBox.progress(100);
                                            App.mainBox.done();
                                            me.done();
                                        }
                                        
                                   } else {
                                       App.errorMsg("Croupier Server Error","Message: "+result.value,3000);
                                   }
                                
                                },me);
                            } else { //no password update
                                
                               if (me.isUserGroupsChanged()) { 
                                   
                                   App.mainBox.setMsg("Saving user groups...");
                                   App.mainBox.progress(50);
                                   
                                if (me.user_id == -1) me.user_id = result.value; 
                                
                                    me.saveGroups(function() {
                                        App.mainBox.progress(100);
                                        App.mainBox.done();
                                        me.done();
                                    });
                               } else {
                                        App.mainBox.progress(100);
                                        App.mainBox.done();
                                        me.done();
                               }
                            }  
                                
                            
                            
                            
                        } else {
                            
                        }
                          
                      };  
                      
                      
                      if (this.user_id !== -1)
                        croupier.api.user$set(me.user_data.id, mail_user, name_user ,surname,nick_user,role_user, enabled_user,
                        __cb,me)
                      else
                        croupier.api.user$add(mail_user,md5($("#user_password").val()),name_user,surname,nick_user,role_user,enabled_user,__cb,me);  
                    
               
		
		//this.saveGroups();
                
		//croupier.api.user$setGroups (this.user_data.id , ids_groups2add);	
		// TODO error
		
		//this.close();
	}
	
	
	this.done = function() {
           
           function _close() {
                $("#panel_user_data .modal").remove();
                $("#panel_user_data").remove();
            }
            
            
            _close.defer(2000);
          
          
            
        };
	
        this.close = function() {
            $("#section_user_data").remove();
            App.tabs.tab_active.show();
        }
        /**
         * 
         * @returns {App.Panel.UserData}
         */
        this.saveGroups = function(cbDone) {
            
                        
            
            
            croupier.api.user$setGroups(this.user_id,this.getUserGroups(),function(result) {
                if (result.status == croupier.ResponseStatus.SUCCESS)
                {
                   cbDone.call(this);
                } else {
                    
                   App.errorMsg("Croupier Server Error","Message: "+result.value); 
                }
                
            },this);
            
            return this;
            
        }
        
	
		
	/// CONSTRUCTOR	 (despues de las declaraciones para poder usar los metodos delcarados
	
	
	App.Panel.UserData.superclass.constructor.apply(this,arguments);



}

});

window.panel_user_data = App.Panel.UserData;