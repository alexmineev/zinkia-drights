Ext.ns("App.Widget");

App.Widget.GroupsPermissionsDuoTables = Ext.extend(App.Widget.PermissionsDuoTables,{
    constructor: function(config) {
        
        Ext.applyIf(config,{
                    leftTable: {
                     $class: App.Widget.GroupsTable,
                     config: config.leftTableConfig || {rowType: "permission",noselectable:true}
                    },
                    rightTable: {
                     $class: App.Widget.GroupsTable,
                     config: config.rightTableConfig || {}
                    },
                    permissionColumn:true,
                    apiSet: croupier.UserGroupUserGroupPermission
               });
        
       App.Widget.GroupsPermissionsDuoTables.superclass.constructor.call(this,config); 
        
       this.leftTable.on("rowadded",function(index,group) {
           group.groupCanModify = group.groupCanModify||false;
           
                $(this.leftTable.$dt.row(index).node()) //row
                        .find(".permissionsSelect") //permissionSelect of table
                        .val(group.groupCanModify?croupier.UserGroupUserGroupPermission.MODIFY:croupier.UserGroupUserGroupPermission.VIEW)
                        .on("change",function() {
                             group.groupCanModify = 
                                    $(this).val() == croupier.UserGroupUserGroupPermission.MODIFY;
                        });
                
                
        },this);   
       
    },
    getAssigned: function() {
        if (this.isAll()) {
            return [new App.Model.Group({id:0,groupCanModify: this.$all.val()==croupier.UserGroupUserGroupPermission.MODIFY})];
        } else {
           return this.constructor.superclass.getAssigned.call(this);
        }
    }
});

