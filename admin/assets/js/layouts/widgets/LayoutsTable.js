Ext.ns("App.Widget");

/**
 * @class LayoutsTable
 * @extends App.Widget.Table
 * @memberof App#Widget
 * @namespace App.Widget
 */
App.Widget.LayoutsTable = Ext.extend(App.Widget.Table,{
    constructor: function(config) {
        config=App.Widget.Table.makeSelectable(config);
        //Ext.applyIf(config,App.Widget.Table.Selectable); //Make Table checkbox-selectable
        config.columnDefs.push({
            targets: 3,
            sortable:false
        });
        
        Ext.apply(config, {
             rowClass: App.Model.Layout,
             actions: [
                  {
                           label: "New",
                           hint: "Create a new layout",
                           iconClass: "ico-btn ico-btn-pool_add",
                           noRowsAllowed: true,
                           multi:true,
                           scope:this,
                           validator: function() {
                                                              
                               return true;
                               
                           },
                           handler: function() {
                               this.dialog = new App.Widget.LayoutsDialog({
                                   id: this.id+"newLayout",
                                   title: "New Layout",
                                   persistentContainer: true,
                                   
                               });
                               this.dialog.show();
                               
                           }
                  },
                  {
                           label: "Load",
                           hint: "Loads selected layout's configuration",
                           iconClass: "ico-btn ico-btn-node_reboot",
                          
                          
                           validator: function() {
                                                              
                               return true;
                               
                           },
                           handler: function(layouts) {
                               
                               var layout = layouts[0];
                               
                               //App.mainBox = App.progressMsg("Layouts","Loading layout:"+layout.name);
                               
                               App.user.load_layout(layout);
                                 
                           }
                  },
                  {
                           label: "Edit",
                           hint: "Edits selected layout name and description",
                           iconClass: "ico-btn ico-btn-view_details",
                           scope:this,
                           
                           validator: function() {
                                                              
                               return true;
                               
                           },
                           handler: function(layouts) {
                               var layout=layouts[0];
                               
                               this.dialog = new App.Widget.LayoutsDialog({
                                   id: this.id+"newLayout",
                                   title: "Edit Layout",
                                   persistentContainer: true,
                                   
                               });
                               this.dialog.editLayout(layout);
                               
                           }
                  }
                 ,
                 
                 {
                     label: "Remove",
                     hint: "Removes selected layouts",
                     iconClass:"ico-btn ico-btn-job_cancel",
                     multi: true,
                     scope:this,
                     validator: function(layouts) {
                         return true;
                         
                     },
                     handler: function(layouts) {
                         
                         if (!confirm("Are you sure?")) return;
                            
                         
                          layouts.forEach(function(layout) {
                              this.deleteRowModel(layout);
                          },this);
                          
                          App.layoutManager.saveLayouts(this.rows);
                     },
                     scope:this
                 }
             ]
             
        });
        
        
        App.Widget.LayoutsTable.superclass.constructor.call(this,config);
        
        var me=this;
        this.on("loaded",function() {
           $("#"+me.id+"_nodefault").off("click").click(function() {
                          if (lo = me.getDefaultLayout()){
                              lo.defaultLayout = false;
                              me.updateRow(lo);
                             
                              App.layoutManager.saveLayouts();
                        } 
        });
        
        this.$dt.on("draw.dt",function() {
            
            
             var def=me.rows.find(function(r) {return r.defaultLayout;});
            if (def) {
                
               window.setTimeout(function() {
                    $("#"+def.id+"_radioDefault").prop("checked",true).attr("checked","checked");
               },500); /*HACK: solves Browser bug*/
           }    
                 
            
            
              
                       $("#"+me.id+"_dt td a[data-layoutid]").off("click")
                              .click(function() { 
                                console.log("[LayoutsTable] Opening edit dialog for layout: "+this.getAttribute("data-layoutid"));
                                
                                var layout= me.rows.find(function(lo) {
                                    return lo.id == this.getAttribute("data-layoutid");
                                },this);
                                
                                me.dialog = new App.Widget.LayoutsDialog({
                                   id: me.id+"newLayout",
                                   title: "Edit Layout",
                                   persistentContainer: true,
                                   
                               });
                               me.dialog.editLayout(layout);
                                
                                
                        });
                        
                         $("#"+me.id+"_dt td input[type='radio']:not(.nodefault)").off("click")
                              .click(function() { 
                                console.log("[LayoutsTable] Setting as default layout: "+this.value);
                                
                                
                                me.rows.forEach(function(lo) {
                                    if (lo.id == this.value && this.checked)
                                    {

                                        lo.defaultLayout = true;
                                        me.updateRow(lo);
                                        
                                    } else if(lo.defaultLayout) {
                                        lo.defaultLayout = false;
                                        me.updateRow(lo);
                                    }
                                },this);
                               
                               App.layoutManager.saveLayouts(); 
                                
                        });
                        
                      
                         
                });  
                        
                        
        
          });
        
    },
    hasDefaultLayout: function() {
        return this.rows.some(function(row) {
            return row.defaultLayout;
        }); 
    },
    getDefaultLayout: function() {
        return this.rows.find(function(row) {
            return row.defaultLayout;
        }); 
    }
    
    
    
});

