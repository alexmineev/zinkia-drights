vvvExt.ns("App.Widget");

/**
 * @class CommentsTable
 * @extends App.Widget.Table
 * @memberof App#Widget
 * @namespace App.Widget
 */
App.Widget.CommentsTable = Ext.extend(App.Widget.Table,{
    constructor: function(config) {
        config=App.Widget.Table.makeSelectable(config);
        //Ext.applyIf(config,App.Widget.Table.Selectable); //Make Table checkbox-selectable
        
        Ext.apply(config, {
             rowClass: App.Model.Comment,
             pageLength: 10,
             actions: [

                 {
                     label: "Remove comments",
                     hint: "Removes selected comments from database",
                     iconClass:"ico-btn ico-btn-job_cancel",
                     multi: true,
                     validator: function(comments) {
                         return true;
                         
                     },
                     handler: function(comments) {
                         
                         if (!confirm("Are you sure?")) return;
                            
                         
                          App.mainBox = App.progressMsg("Comments","Removing comments...");
                          
                         
                     },
                     scope:this
                 }

             ]
             
        });
        
        
        App.Widget.CommentsTable.superclass.constructor.call(this,config);
        
       
      
       
        
    },
    initHeader: function() {
        
        
        App.Widget.CommentsTable.superclass.initHeader.call(this);
    }
});

