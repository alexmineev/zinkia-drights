Ext.ns("App.Widget");

/** 
 * Tabla de grupos de usuarios.
 * 
 * @class GroupsTable
 * @extends App.Widget.Table
 * @memberOf App#Widget
 * @namespace App.Widget 
 */
App.Widget.GroupsTable = Ext.extend(App.Widget.Table,{
    
    constructor: function(config) {
        //Ext.applyIf(config,App.Widget.Table.Selectable); //Make Table checkbox-selectable
        if (!config.noselectable)
            config=App.Widget.Table.makeSelectable(config);
        
        Ext.apply(config, {
            rowClass: App.Model.Group,
            
             actions: [
                  {
                           label: "New group",
                           hint: "Create a new group",
                           iconClass: "ico-btn ico-btn-group_add",
                           noRowsAllowed: true,
                           multi:true,
                           validator: function() {
                                                              
                               return App.canUserDo(croupier.ModificationDataAllPermission.userGroup$add);
                               
                           },
                           handler: function() {
                               
                               
                               
                                  App.tabs.tab_active.the_panel_group_data=new App.Panel.GroupData(App.tabs.tab_active.getTabId(),
                                                                                                -1);
                           }
                  }
                 ,
                 {
                           label: "Show details",
                           hint: "Shows detailed information of the group and permits configure it permissions and add/remove users",
                           iconClass: "ico-btn ico-btn-view_details",
                           menuOnly: true,
                           validator: function(users) {
                              
                               return true;
                               
                           },
                           handler: function(users) {
                               var user = users[0];
                               
                               
                                App.tabs.tab_active.the_panel_group_data=new App.Panel.GroupData(App.tabs.tab_active.getTabId(),
                                                                                               user.id );
                           }
                 },
                 {
                     label: "Remove groups",
                     hint: "Removes selected groups",
                     iconClass:"ico-btn ico-btn-group_delete",
                     multi: true,
                     
                     validator: function(users) {
                         
                         return users.some(function(user) {
                            return user.hasPermission(croupier.UserGroupPermission.remove);
                         });
                     },
                     handler: function(groups) {
                         
                         if (!confirm("Are you sure?")) return;
                            
                         
                          App.mainBox = App.progressMsg("Groups","Removing groups...");
                          
                          
                          
                          App.API.Groups.removeGroups(groups,function() {
                            App.mainBox.progress(100);
                            App.mainBox.done();
                   
                          },this);
                     },
                     scope:this
                 }
             ]
            
        });
        
        App.Widget.GroupsTable.superclass.constructor.call(this,config);
        
        if (croupier && !config.noSync) {
           
                croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.userGroup$add],function(data) {
                   this.addRow(data);
                   this.initHeader();
                },this);
                
                croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.userGroup$removeUser],function(data) {
                   this.updateRow(data);
                   this.initHeader();
                },this);
                
                croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.userGroup$remove],function(data,id) {
                   this.deleteRowModel(id);
                   this.initHeader();
                },this);
        }
        
        
    },
    initHeader: function() {
         $("#"+this.id+"_n").text(this.rows.length);
         
         $("#"+this.id+" td a").off("click")
                              .click(function() { 
                                console.log("[GroupsTable] Loading group data id:"+this.getAttribute("data-groupid"));
                                
                                App.tabs.tab_active.the_panel_group_data=new App.Panel.GroupData(App.tabs.tab_active.getTabId(),
                                                                                                this.getAttribute("data-groupid"));
                                                                                             
                            });
                            
         
         
    },
    addRow: function(rowData) {
        if (rowData.id == 0) return this;
        else
            return this.constructor.superclass.addRow.apply(this,arguments);
        
    }
});

