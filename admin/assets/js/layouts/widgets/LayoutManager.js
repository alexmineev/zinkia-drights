Ext.ns("App.Widget")
/**
 * @class App.Widget.LayoutManager
 * @extends App.Widget
 * 
 */
App.Widget.LayoutManager = {
    constructor: function(config) {
         Ext.applyIf(config, {
             template: "layoutManager",
             propTableId: "layoutsTable"
         });
        
        App.Widget.LayoutManager.superclass.constructor.call(this,config);
        
        this.addEvents('loaded');
        
        this.layoutsTable = new App.Widget.LayoutsTable({
             id:"layoutsTable",
             
         });
         
         var me=this;
        
        
         $("#openLayoutsBtn").click(function() {
            me.show();
          });      
        
        $("#saveLayoutsBtn").click(function() {
            me.saveDialog = new App.Widget.LayoutsDialog({
                  id:me.layoutsTable.id+"newLayout",
                  title: "Save Layout As",
                  persistentContainer: true,
                  saveMode: true
            });
            
           me.saveDialog.show(); 
            
        });
         
        
    },
    show: function() {
        $("#"+this.id).modal({backdrop: "static"}).show();
        this.layoutsTable.adjust();
    },
    hide: function() {
        $("#"+this.id).modal({backdrop: "static"}).hide();
    },
    loadLayouts: function() {
        var layouts = App.API.Users.getClientData();
         
        this.layoutsTable.load(layouts);
        
                    
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
App.Widget.LayoutManager = Ext.extend(App.Widget,App.Widget.LayoutManager);


