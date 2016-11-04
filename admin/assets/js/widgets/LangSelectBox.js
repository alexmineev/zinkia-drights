Ext.ns("App.Widget");

/**
 * Selector de multiples Lang
 *   
 * @class LangSelectBox
 * @memberOf App#Widget
 * @namespace App.Widget
 * @extends App.Widget.SelectBox
 */
App.Widget.LangSelectBox = Ext.extend(App.Widget.SelectBox,{
    
       
    constructor:  function LangSelectBox(config) {
        
      this._defConfig =  {
               cssClass: "widget selectbox langs",
               label: "Idiomas:",
               width: "200px",
               no_results_text: "No se encontraron idiomas",
               defaultMessage: "Todos los idiomas",
               modelClass: App.Model.Lang,
               posClass:"col-sm-3"
        }; 
        
        
      Ext.applyIf(config, this._defConfig);
           
      App.Widget.LangSelectBox.superclass.constructor.apply(this,arguments);
        
        
    }
});
