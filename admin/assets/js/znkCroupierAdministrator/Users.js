Ext.ns("App.API");

/**
 * 
 * Singelton Users Class 
 * 
 * @class Users 
 * @memberOf App#API
 * @static
 */
App.API.Users = 
{
        getUsers: function() {
            return this.data.users.values(true).map(function(n) {
                return this.getUser(n.id);
            },this) ;
        },
        getUser: function(id) {
            if (id==0) return new App.Model.User(croupier.user);
            
             if ((user = this.data.users.get(id)) == null) {
                
                if (App.config.debug) App.errorMsg("App.API.Users::getUser()","No id found: "+id);
                else
                    throw new Error("[App.API.Users::getUser()]: Wrong User ID:"+id);
                
                return false;
            }
            return new App.Model.User(user);
        },
        getCurrentUser: function() {
            return this.getUser(this.user.id);
        },
        removeUsers: function(users,__cbDone,scope) {
            this.api.user$remove(users.toIds(),function(res) {
                if (res.status == croupier.ResponseStatus.SUCCESS)
                {
                  __cbDone.call(scope||this);  
                } 
            });
        },
        setClientData: function(layouts,__cbDone,scope) {
            
            var data = JSON.stringify(layouts);
            this.api.user$setClient(App.config.clientId,data.toString(),function(res) {
                if (res.status == croupier.ResponseStatus.SUCCESS)
                {
                  __cbDone.call(scope||this);  
                } 
            });
        },
        getClientData: function() {
           if (croupier.user.id!=0 && App.user.client) 
            return $.parseJSON(App.user.client.data);
           else 
              return [];
            
        }
        
};
App.API.Users = $.extend(croupier,App.API.Users);

 



