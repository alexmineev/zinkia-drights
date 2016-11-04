Ext.ns("App.Widget");

/**
 * Selector de multiples Pools
 *   
 * @class PoolsSelectBox
 * @memberOf App#Widget
 * @namespace App.Widget
 * @extends App.Widget.SelectBox
 */
App.Widget.PoolsSelectBox = Ext.extend(App.Widget.SelectBox,{
    
       
    constructor:  function PoolsSelectBox(config) {
        
      this._defConfig =  {
               cssClass: "widget selectbox pools",
               
               label: "Pools",
               width: "250px",
               no_results_text: "No pools found!",
               defaultMessage: "Select pools",
               modelClass: App.Model.Pool
        }; 
        
        
      Ext.applyIf(config, this._defConfig);
           
      App.Widget.PoolsSelectBox.superclass.constructor.apply(this,arguments);
        
        
    },
    addOption: function(optModel) {
        if (optModel.id==0 && !this.permitAllPool) return this;
        else
            this.constructor.superclass.addOption.apply(this,arguments);
    }
});
