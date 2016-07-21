Ext.ns("App.Widget");

/**
 * @class TasksTable
 * @extends App.Widget.Table
 * @memberof App#Widget
 * @namespace App.Widget
 */
App.Widget.TasksTable = Ext.extend(App.Widget.Table,{
    constructor: function(config) {
        config=App.Widget.Table.makeSelectable(config);
        //Ext.applyIf(config,App.Widget.Table.Selectable); //Make Table checkbox-selectable
        
        Ext.apply(config, {
             rowClass: App.Model.Task,
             actions: [
                  {
                           label: "Load tasks",
                           hint: "Loads all tasks from the database",
                           iconClass: "ico-btn ico-btn-group_delete",
                           noRowsAllowed: true,
                           multi:true,
                           scope: this,
                           validator: function() {
                                                              
                               return true;
                               
                           },
                           handler: function() 
                           {
                               var me=this;
                                App.mainBox = App.progressMsg("Tasks","Fetching tasks from MySQL database...");
                                 $.getJSON("/admin/youtube/tasks.php",function(r) {
                                        me.on("loaded",function() {
                                            App.mainBox.progress(100);
                                            App.mainBox.done();
                                        });
                                        App.mainBox.progress(50);
                                        me.load(r);    
                                        
                                        
                                        
                                  });
                                
                           }
                 }
                 ,
  
                 {
                     label: "Remove tasks",
                     hint: "Removes selected tasks from database",
                     iconClass:"ico-btn ico-btn-job_cancel",
                     multi: true,
                     validator: function(tasks) {
                         return true;
                         
                     },
                     handler: function(users) {
                         
                         if (!confirm("Are you sure?")) return;
                            
                         
                          App.mainBox = App.progressMsg("Tasks","Removing tasks...");
                          
                         
                     },
                     scope:this
                 },
                 {
                     label: "Export tasks to TeamWork",
                     hint: "Connects to TeamWorks and publishes selected tasks with comments",
                     iconClass:"ico-btn ico-btn-job_delete",
                     multi: true,
                     validator: function(tasks) {
                         return true;
                         
                     },
                     handler: function(tasks) {
                     
                          App.mainBox = App.progressMsg("Tasks","Exporting to TeamWork.com");
                          
                         
                     },
                     scope:this
                 }
             ]
             
        });
        
        
        App.Widget.TasksTable.superclass.constructor.call(this,config);
        
        this.on("loaded",function() {
            var me= this;
            
            this.$.on("click","button[data-taskid]",function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                me.cmtViewer = new App.Widget.CommentsViewer({id:"cmtViewer"});
                //me.cmtViewer.commentsTable.clear();
                me.cmtViewer.loadComments(this.getAttribute("data-taskid"));
                me.cmtViewer.show();
            }); 
        },this);
      
       
        
    }
});

