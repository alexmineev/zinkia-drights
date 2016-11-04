Ext.ns("App.API");

/**
 * 
 * Singelton Groups Class 
 * 
 * @class Groups 
 * @memberOf App#API
 * @static
 */
App.API.Groups = 
{
        getGroups: function() {
            return this.data.userGroups.values(true);
        },
        /**
         * Return an array of groups of a user.
         * 
         * @param {Number|App.Model.User} user|userId
         * @returns {Array[App.Model.Group]}
         */
        getGroupsByUser: function(user) {
            user = Number.isInteger(user)? this.Users.getUser(user) : user; 
            
            return user.groups.map(function(gId) {
                
                return this.getGroup(gId);
                
            },this);
           
        },
        getGroup: function(id) {
            
            if ((group = this.data.userGroups.get(id)) == null) {
                
                if (App.config.debug) App.errorMsg("App.API.Groups::get()","No id found: "+id);
                else
                    throw new Error("[App.API.Groups::get()]: No Group with ID:"+id);
                
                return false;
            }
            
            return new App.Model.Group(group); //Object.create(group,this.$Group);
        },
        removeGroups: function(groups,cbDone,scope)  {
            this.api.userGroup$remove(groups.toIds(),function(result) {
               if (result.status == croupier.ResponseStatus.SUCCESS) 
                    cbDone.call(scope||this);
                else
                    App.mainBox.abort();
            });
        }
        
};

App.API.Groups = $.extend(croupier,App.API.Groups);






