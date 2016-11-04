Ext.ns("App.Widget");

/**
 * 
 * @class App.Widget.PoolsPermissionsDuoTables
 * @extends App.Widget.PermissionsDuoTables
 */
App.Widget.PoolsPermissionsDuoTables={
    constructor: function(config) {
        
        Ext.applyIf(config,{
                    leftTable: {
                     $class: App.Widget.PoolsTable,
                     config: config.leftTableConfig || {rowType:"duo"},
                     
                    },
                    rightTable: {
                     $class: App.Widget.PoolsTable,
                     config: config.rightTableConfig || {rowType:"duo"},
                     
                    },
                    permissionColumn:true,
                    apiSet: App.config.UserGroupPoolPermission
               });
        
       App.Widget.PoolsPermissionsDuoTables.superclass.constructor.call(this,
                                                                config); 
                                                                
                                                                
        this.leftTable.on("rowadded",function(index,pool) {
            
            pool.groupPermission=typeof pool.groupPermission == "undefined"?croupier.UserGroupPoolPermission.VIEW:pool.groupPermission;
            
                $(this.leftTable.$dt.row(index).node())
                            .find(".permissionsSelect")
                            .val(pool.groupPermission)
                            .on("change",function() {
                                 pool.groupPermission=$(this).val();
                            });
        },this); 
        this.leftTable.on("loaded",function() {
           
        },this);
    },
    getAssigned: function() {
        if (this.isAll()) {
            return [new App.Model.Pool({id:0,groupPermission: this.$all.val()})];
        } else {
            return this.constructor.superclass.getAssigned.call(this);
        }
    }
    
    
    
};

App.Widget.PoolsPermissionsDuoTables = Ext.extend(App.Widget.PermissionsDuoTables,App.Widget.PoolsPermissionsDuoTables);




