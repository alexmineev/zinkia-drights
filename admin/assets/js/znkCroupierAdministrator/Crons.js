Ext.ns("App.API");

/**
 * 
 * Singelton Crons Class 
 * 
 * @class Crons 
 * @memberOf App#API
 * @static
 */
App.API.Crons = 
{
        getCrons: function() {
            return this.data.crons.values(true).map(function(n) {
                return this.getCron(n.id);
            },this) ;
        },
        getCron: function(id) {
             if ((cron = this.data.crons.get(id)) == null) {
                
                if (App.config.debug) App.errorMsg("App.API.Crons::get()","No id found: "+id);
                else
                    throw new Error("[App.API.Crons::get()]: No Cron with ID:"+id);
                
                return false;
            }
            
            return new App.Model.Cron(cron);
        },
        removeCrons: function(crons,cbDone,scope)
        {
            this.api.cron$remove(crons.toIds(),function(result) {
                if (result.status == croupier.ResponseStatus.SUCCESS)
                    cbDone.call(scope || this);
            });
            
        }
        
        
        
};
App.API.Crons = $.extend(croupier,App.API.Crons);

 

