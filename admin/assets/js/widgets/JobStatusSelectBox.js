Ext.ns("App.Widget");

/**
 * Selector de status de job
 *   
 * @class JobStatusSelectBox
 * @memberOf App#Widget
 * @namespace App.Widget
 * @extends App.Widget.SelectBox
 */
App.Widget.JobStatusSelectBox = Ext.extend(App.Widget.SelectBox,{
    
       
    constructor:  function JobStatusSelectBox(config) {
        
      this._defConfig =  {
               cssClass: "widget selectbox jobstatus",
               
               label: "Job Status",
               width: "250px",
               no_results_text: "No status type found!",
               defaultMessage: "Select job status",
               modelClass: App.Model.APISet
        }; 
        
        
      Ext.applyIf(config, this._defConfig);
           
      App.Widget.JobStatusSelectBox.superclass.constructor.apply(this,arguments);
        
      this.load();  
    },
    load: function() {
        croupier.JobStatus.__names__.forEach(function(status) {
            this.constructor.superclass.addOption.call(this,{key: status, value: croupier.JobStatus[status]});
        },this);
        
    },
    addOption: function() {
        throw new Error("[JobStatusSelectBox]: It's a static list. Cannot add values.");
    }
});
