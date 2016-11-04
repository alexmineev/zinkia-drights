Ext.ns("App.Widget");

/**
 * Selector de multiples Crons
 *   
 * @class CronsSelectBox
 * @memberOf App#Widget
 * @namespace App.Widget
 * @extends App.Widget.SelectBox
 */
App.Widget.CronsSelectBox = Ext.extend(App.Widget.SelectBox,{
    
       
    constructor:  function CronsSelectBox(config) {
        
      this._defConfig =  {
               cssClass: "widget selectbox crons",
               
               label: "Crons",
               width: "300px",
               no_results_text: "No crons found!",
               defaultMessage: "Select crons which will execute this preset",
               modelClass: App.Model.Cron,
               posClass:"col-sm-1"
        }; 
        
        
      Ext.applyIf(config, this._defConfig);
           
      App.Widget.CronsSelectBox.superclass.constructor.apply(this,arguments);
        
        
    }
});
