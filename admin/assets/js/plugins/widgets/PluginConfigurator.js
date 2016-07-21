Ext.ns("App.Widget");

/**
 * 
 * @class PluginConfigurator
 * @extends App.Widget
 * @namespace App.Widget
 * @memberOf App#Widget
 */
App.Widget.PluginConfigurator = {
    cssClass:"pluginEditor",
    isShown:false,
    constructor: function(config) {
        
        Ext.applyIf(config,{
            template: "pluginConfig",
            pluginName:"",
            pluginConfig:"",
            propTableId:"propTable",
            
            
        });
        
        this.addEvents(
                
                    'shown',
            
                    'hidden',
                    
                    'close'
         );
         
         App.Widget.PluginConfigurator.superclass.constructor.call(this,config);  
         
         this.propTable = new App.Widget.PropertiesTable({
             id:this.propTableId,
             selectable:false,
             //animation: false,
         });
        
        
            if (this.pluginProperties)
                    this.loadProperties(this.pluginProperties);
        
        var me=this;
        $("#btnApplyProp").click(function() {
            me.apply();
        });
        
    },
    show: function() {
        $("#"+this.id).modal({backdrop:"static"}).fadeIn();
        this.isShown = true;
        this.fireEvent("shown",this.id);
    },
    hide: function() {
        $("#"+this.id).fadeOut();
        this.isShown =false;
        this.fireEvent("hidden",this.id);
    },
    close: function() {
        $("#"+this.id).modal("hide").fadeOut();
       
        $("#"+this.id).remove();
        
        this.fireEvent("close",this.id);
        delete this;
    },
    apply: function() {
        if (!this.propTable.isValid()) {
            App.errorMsg("Plugin Properties","Some properties has incorrect values, please fix them.");
            return;
        }
        this.fireEvent("apply",this.propTable.toTypedProperties());
        this.hide();
    },
            
            
    /**
     * Loads a widget with properties data
     * 
     * @param {Array} properties
     * @returns {void}
     */
    loadProperties: function(properties) {
        console.info("Loading properties");
        console.dir(properties);
        
        this.propTable.load(properties);
    }
    
};
App.Widget.PluginConfigurator = Ext.extend(App.Widget,App.Widget.PluginConfigurator);
