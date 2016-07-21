Ext.ns("App.Widget");

App.Widget.LogViewer = {
    cssClass: "logViewer widget",
    constructor: function(config) {
        
        var me=this;
        
        Ext.applyIf(config,{
            template: "nodeLog",
            persistentContainer: true
        });
        
        App.Widget.LogViewer.superclass.constructor.call(this,config);
        
        
        //$("#"+this.id).modal({backdrop:"static"}).show();
        
        this.$doc = $("#"+this.id+"_textarea");
        
        $("#btn_log_close").click(function() {
            me.close();
        });
        
    },
    loadLog:function(logData) {
        this.$doc.val(logData);
        
    },
    show: function() {
          $("#"+this.id).modal({backdrop:"static"}).show();
    },
    close: function() {
        $("#"+this.id).remove();
    }
 }    
App.Widget.LogViewer = Ext.extend(App.Widget,App.Widget.LogViewer);

