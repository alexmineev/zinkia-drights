Ext.ns("App.Widget")
/**
 * @class App.Widget.CommentsViewer
 * @extends App.Widget
 * 
 */
App.Widget.CommentsViewer = {
    constructor: function(config) {
         Ext.applyIf(config, {
             template: "comments",
             cmtTableId: "commentsTable"
         });
        
        App.Widget.CommentsViewer.superclass.constructor.call(this,config);
        
        this.addEvents('loaded');
        
        this.commentsTable = new App.Widget.CommentsTable({
             id:"commentsTable",
             
         });
         
         var me=this;
         
        
    },
    show: function() {
        $("#"+this.id).modal({backdrop: "static"}).show();
        this.commentsTable.adjust();
    },
    hide: function() {
        $("#"+this.id).modal({backdrop: "static"}).hide();
    },
    loadComments: function(taskId) {
        var me = this;
        
        App.mainBox = App.progressMsg("Comments","Loading comments...");
        
        this.commentsTable.on("loaded",function() {
           App.mainBox.progress(100);
           App.mainBox.done();
        });
         
         
        $.getJSON("/admin/youtube/comments.php",{taskid:taskId},function(j) {
            me.commentsTable.load(j);
        }); 
        
        
                    
    },
    saveLayouts: function() {
        
        App.mainBox=App.progressMsg("Layouts","Saving layouts changes...");
        App.API.Users.setClientData(this.layoutsTable.rows,function() {
            App.mainBox.progress(100);
            App.mainBox.done();
        });
    }
    ,
    hasDefaultLayout: function() {
        if (this.layoutsTable.rows.length==0) return false;
        return this.layoutsTable.hasDefaultLayout();
    },
    getDefaultLayout: function() {
        return this.layoutsTable.getDefaultLayout();
    }
    
    
};
App.Widget.CommentsViewer = Ext.extend(App.Widget,App.Widget.CommentsViewer);


