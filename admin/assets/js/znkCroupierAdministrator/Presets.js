Ext.ns("App.API");

/**
 * 
 * Singelton Presets Class 
 * 
 * @class Presets 
 * @memberOf App#API
 * @static
 */
App.API.Presets = 
{
        getPresets: function() {
            return this.data.presets.values(true).map(function(n) {
                return this.getPreset(n.id);
            },this) ;
        },
        getPreset: function(id) {
             if ((preset = this.data.presets.get(id)) == null) {
                
                if (App.config.debug) App.errorMsg("App.API.Presets::get()","No id found: "+id);
                else
                    throw new Error("[App.API.Presets::get()]: No Preset with ID:"+id);
                
                return false;
            }
            
            return new App.Model.Preset(preset);
        },
        removePresets: function(presets,cbDone,scope)
        {
            this.api.preset$remove(presets.toIds(),function(result) {
                if (result.status == croupier.ResponseStatus.SUCCESS)
                    cbDone.call(scope || this);
            });
            
        }
        
        
        
};
App.API.Presets = $.extend(croupier,App.API.Presets);

 

