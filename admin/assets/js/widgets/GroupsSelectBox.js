Ext.ns("App.Widget");

/**
 * Selector de multiples Groups
 *   
 * @class GroupsSelectBox
 * @memberOf App#Widget
 * @namespace App.Widget
 * @extends App.Widget.SelectBox
 */
App.Widget.GroupsSelectBox = Ext.extend(App.Widget.SelectBox,{
    
       
    constructor:  function GroupsSelectBox(config) {
        
      this._defConfig =  {
               cssClass: "widget selectbox pools",
               label: "Groups",
               width: "250px",
               no_results_text: "No groups found!",
               defaultMessage: "Select group",
               modelClass: App.Model.Group
        }; 
        
        
      Ext.applyIf(config, this._defConfig);
           
      App.Widget.GroupsSelectBox.superclass.constructor.apply(this,arguments);
        
        
    },
    addOption: function(optModel) {
        if (optModel.id==0) return this;
        else
            this.constructor.superclass.addOption.apply(this,arguments);
    }
});
