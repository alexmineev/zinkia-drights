Ext.ns("App.Widget");

/**
 * Selector de multiples Channel
 *   
 * @class ChannelSelectBox
 * @memberOf App#Widget
 * @namespace App.Widget
 * @extends App.Widget.SelectBox
 */
App.Widget.ChannelSelectBox = Ext.extend(App.Widget.SelectBox,{
    
       
    constructor:  function ChannelSelectBox(config) {
        
      this._defConfig =  {
               cssClass: "widget selectbox channels",
               
               label: "",
               width: "200px",
               no_results_text: "No channels found!",
               defaultMessage: "Todos los canales",
               modelClass: App.Model.Channel,
               posClass:"col-sm-2"
        }; 
        
        
      Ext.applyIf(config, this._defConfig);
           
      App.Widget.ChannelSelectBox.superclass.constructor.apply(this,arguments);
        
        
    }
});
