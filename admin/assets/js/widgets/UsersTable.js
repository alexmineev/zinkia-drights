Ext.ns("App.Widget");

/**
 * @class UsersTable
 * @extends App.Widget.Table
 * @memberof App#Widget
 * @namespace App.Widget
 */
App.Widget.UsersTable = Ext.extend(App.Widget.Table,{
    constructor: function(config) {
        config=App.Widget.Table.makeSelectable(config);
        //Ext.applyIf(config,App.Widget.Table.Selectable); //Make Table checkbox-selectable
        
        Ext.apply(config, {
             rowClass: App.Model.User,
             
             actions: [
                  {
                           label: "New user",
                           hint: "Create a new user",
                           iconClass: "ico-btn ico-btn-user_add",
                           noRowsAllowed: true,
                           multi:true,
                           validator: function() {
                                                              
                               return App.canUserDo(croupier.ModificationDataAllPermission.user$add);
                               
                           },
                           handler: function() {
                               
                               
                               
                                 App.tabs.tab_active.the_panel_user_data=new panel_user_data(App.tabs.tab_active.tab_id, -1);
                                 App.tabs.tab_active.the_panel_user_data.show();
                           }
                  }
                 ,
                 {
                           label: "Show details",
                           hint: "Shows detailed information of the user and permits add/remove his groups",
                           iconClass: "ico-btn ico-btn-view_details",
                           menuOnly: true,
                           validator: function(users) {
                              
                               return true;
                               
                           },
                           handler: function(users) {
                               var user = users[0];
                               
                               
                               App.tabs.tab_active.the_panel_user_data=new panel_user_data(App.tabs.tab_active.tab_id, user.id);
                               App.tabs.tab_active.the_panel_user_data.show();
                           }
                 },
                 {
                     label: "Remove users",
                     hint: "Removes selected users",
                     iconClass:"ico-btn ico-btn-user_delete",
                     multi: true,
                     
                     validator: function(users) {
                         
                         return users.some(function(user) {
                            return user.hasPermission(croupier.UserPermission.remove);
                         });
                     },
                     handler: function(users) {
                         
                         if (!confirm("Are you sure?")) return;
                            
                         
                          App.mainBox = App.progressMsg("Users","Removing users...");
                          
                          
                          
                          App.API.Users.removeUsers(users,function() {
                            App.mainBox.progress(100);
                            App.mainBox.done();
                   
                          },this);
                     },
                     scope:this
                 }
             ]
             
        });
        
        
        App.Widget.UsersTable.superclass.constructor.call(this,config);
        
        if (croupier && !config.noSync) {
           
            croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.user$add],function(data) {
                    this.addRow(data);
                    //this.initHeader();
            },this);
            croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.user$set],function(data,id) {
                    
                    this.updateRow(croupier.data.users.get(id));
                    //this.initHeader();
            },this);
            croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.user$remove],function(data,id) {
                console.info("[users table] captured remove event");
                
                    
                    this.deleteRowModel(id);
                   //this.initHeader();
            },this);
        }
        var me=this;
        $("#"+me.id+"_dt").on("draw.dt",function() {
              
                       $("#"+me.id+"_dt td a").off("click")
                              .click(function() { 
                                console.log("[UsersTable] Loading user data id:"+this.getAttribute("data-userid"));
                                //App.tabs.tab_active.userDetails(this.getAttribute("data-userid"));
                                App.tabs.tab_active.the_panel_user_data=new panel_user_data(App.tabs.tab_active.tab_id, this.getAttribute("data-userid"));
                        });
        
          });
        
    },
    
    initHeader: function() {
        var me=this;
                    
    
        $("#"+this.id+"_n").text(this.rows.length);
        $("#"+this.id+"_wn").text(
           this.rows.filter(function(user) {
                return user.role==croupier.UserRole.ADMINISTRATOR||user.role==croupier.UserRole.SUPERADMINISTRATOR 
            }).length
           );
        
    }
});

