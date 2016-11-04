
// <editor-fold defaultstate="collapsed" desc="TEST">
        
// </editor-fold>

Ext.ns("App.Widget");
/**
 * Selector de multiples Nodos
 *   
 * @class PluginConfigSelectBox
 * @memberOf App#Widget
 * @namespace App.Widget
 * @extends App.Widget.SelectBox
 */
App.Widget.PluginConfigSelectBox = Ext.extend(App.Widget.SelectBox,{
    
       
    constructor:  function PluginConfigSelectBox(config) {
       var me=this; 
      this._defConfig =  {
               cssClass: "widget selectbox pluginconfig",
               label: "Configuration",
               width: "260px",
               height: "40px",
               no_results_text: "No configuration found!",
               defaultMessage: "Select plugin configuration",
               modelClass: App.Model.APISet,
               template: "defSelectBox",
               emptyOption: "Select configuration"
               
        }; 
        
        
      Ext.applyIf(config, this._defConfig);
           
      App.Widget.PluginConfigSelectBox.superclass.constructor.apply(this,arguments);
      
      
      
      
      this.$chosen.on("chosen:showing_dropdown",function($chosen) {
         // me._setListDecoration();
      });
      this.$chosen.on("chosen:hiding_dropdown",function($chosen) {
          //me._setSelectedDecoration();
      });
      this.$chosen.on("chosen:ready",function($chosen) {
          //me._setSelectedDecoration();
      });  
      
      
    },
    
    _setListDecoration: function() {
        var me= this;
        console.info("[PluginConfigSelectBox]: setListDecoration()");
        $("#"+this.id+" .chosen-results > li.active-result")
            .each(function(i,pluginItem) {
                
                        
                //$(pluginItem).html("<span class='ico-os ico-os-linux'>Linux</span>"+$(e).html())
        
               var pluginModel = me.options[pluginItem.getAttribute("data-option-array-index")-1];
               $(pluginItem).html('<div class="pluginInfo" data-container="body" data-toggle="popover" data-placement="left" title="'+pluginModel.description+'">'+pluginModel.getIcon(40)+'&nbsp&nbsp'+pluginModel.name+'</div>');
              
                $(".pluginInfo").mouseenter(function() {
                    $(this).popover('show'); 
                 }).mouseleave(function() {
                       $(this).popover('hide'); 
                });
                
               
         });
        
    },
   
});


