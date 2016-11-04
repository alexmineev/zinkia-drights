Ext.ns("App.Model");

/**
 * User data model class
 * 
 * @class User
 * @memberOf App#Model
 * @namespace App.Model
 */
App.Model.User = {
    $fields:[],
    constructor: function(user) {
        App.Model.User.superclass.constructor.apply(this,arguments);
        
        
        
        Ext.apply(this,user);
        
        
        if (this.id == 0)
        
            this.groups = App.API.Groups.getGroups();
        
        
        
        
    },
    getRole: function() {
        return croupier.UserRole.__names__[this.role];
    },
    getDataLink: function(text) {
        return '<a href="#" data-userid='+this.id+'>'+text+'</a>';
    },
    toRowModelArray: function() {
        return ["",this.alias, this.getDataLink(this.name),this.surname,this.email,this.getRole(),$.isArray(this.groups) ? this.groups.length:"[UNKNOWN]"];
    },
    getGroups: function() {
        
        return this.id==0 ? this.groups:
                    App.API.Groups.getGroupsByUser(this);
    },
    isSuperAdministrator: function() {
        return this.role === croupier.UserRole.SUPERADMINISTRATOR;
    },
    remove: function() {
        var me=this;
        croupier.api.user$remove([this.id],function() {
            me.fireEvent("removed",this);
        });
    }
    
    
};
App.Model.User = Ext.extend(App.Model.Abstract, App.Model.User);
