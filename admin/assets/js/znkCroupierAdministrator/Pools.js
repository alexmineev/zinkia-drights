Ext.ns("App.API");

/**
 * 
 * Singelton Pools Class 
 * 
 * @class Pools 
 * @memberOf App#API
 * @static
 */
App.API.Pools = 
{
        getPools: function() {
            return this.data.pools.values(true).map(function(n) {
                return this.getPool(n.id);
            },this) ;
        },
        getPool: function(id) {
             if ((pool = this.data.pools.get(id)) == null) {
                
                if (App.config.debug) App.errorMsg("App.API.Pools::get()","No id found: "+id);
                else
                    throw new Error("[App.API.Pools::get()]: No Pool with ID:"+id);
                
                return false;
            }
            
            return new App.Model.Pool(pool);
        },
        removePools: function(pools,cbDone,scope)
        {
            this.api.pool$remove(pools.toIds(),function(result) {
                if (result.status == croupier.ResponseStatus.SUCCESS)
                    cbDone.call(scope || this);
            });
            
        }
        
        
        
};
App.API.Pools = $.extend(croupier,App.API.Pools);

 



