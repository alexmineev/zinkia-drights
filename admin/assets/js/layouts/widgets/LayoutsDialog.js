Ext.ns("App.Widget")
/**
 * @class App.Widget.LayoutsDialog
 * @extends App.Widget
 * 
 */
App.Widget.LayoutsDialog = {
    constructor: function(config) {
         var me=this;
         
         config.template = config.saveMode? "saveLayout":"newLayout";
           
        
        App.Widget.LayoutsDialog.superclass.constructor.call(this,config);
        
        if (!this.saveMode)
            $("#"+this.id+"_okBtn").click(function() {
            
                if (!$("#"+me.id+"_name").formValidate()) return;
                me.createLayout($("#"+me.id+"_name").val(),$("#"+me.id+"_desc").val());
                me.hide();
            });
        else { //Save Mode
            
            App.layoutManager.layoutsTable.rows.forEach(function(lo) {
                var opt = $("<option>")
                        .attr("value",lo.name)
                        .text(lo.name);
                if (App.currentLayout && App.currentLayout.name == lo.name)
                        opt.attr("selected","selected");
                    
                opt.appendTo($("#"+this.id+"_nameList"));
                        
            },this);
            
            if (App.currentLayout) {
                $("#"+this.id+"_name").val(App.currentLayout.name);
            }
            
            $("#"+this.id+"_name").change(function() {
                if (layout=App.layoutManager.layoutsTable.rows.find(function(lo) {
                    return lo.name==$(this).val();
                },this)) {
                    $("#"+me.id+"_desc").val(layout.description);
                }
            });
            //$("#"+this.id+"_name").
            
            $("#"+this.id+"_okBtn").click(function() {
            
                if (!$("#"+me.id+"_name").formValidate()) return;
                
                var name=$("#"+me.id+"_name").val(),
                    desc=$("#"+me.id+"_desc").val();
                
                
                
                if (lo=App.layoutManager.layoutsTable.rows.find(function(layout) {
                   return layout.name == name; 
                })) //save layout
                {
                   me.layout = lo; 
                   me.layout.saveState();
                   me.saveLayout(name,desc);
                   
                } else { //new layout
                    me.createLayout(name,desc);
                }
                me.hide();
            });
        }
               
    },
    show: function() {
        $("#"+this.id).modal({backdrop: "static"}).show();
        
    },
    hide: function() {
        $("#"+this.id).modal({backdrop: "static"}).hide();
    },
    createLayout: function(name,description) {
        
        var defaultLo = !App.layoutManager.layoutsTable.rows.some(function(lo) {
            return lo.defaultLayout;
        });
             
        
        var layout= {name: name,description:description,defaultLayout:defaultLo,config:{}};
        
        layout=new App.Model.Layout(layout);
        layout.saveState();
        App.layoutManager.layoutsTable.addRow(layout);
        App.layoutManager.saveLayouts();
        
    },
    editLayout: function(layout) {
        var me=this;
        this.layout = layout;
        $("#"+this.id+"_name").val(layout.name);
        $("#"+this.id+"_desc").val(layout.description);
        
        $("#"+this.id+"_okBtn").off("click").click(function() {
            
            if (!$("#"+me.id+"_name").formValidate()) return;
            me.saveLayout($("#"+me.id+"_name").val(),$("#"+me.id+"_desc").val());
            me.hide();
        });
        this.show();
        
    },
    saveLayout: function(name,desc) {
        
        this.layout.name=name;
        this.layout.description=desc;
        App.layoutManager.layoutsTable.updateRow(this.layout);
        App.layoutManager.saveLayouts();
    }
    
};
App.Widget.LayoutsDialog = Ext.extend(App.Widget,App.Widget.LayoutsDialog);





