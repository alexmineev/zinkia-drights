Ext.ns("App.Widget");

/** 
 * Tabla de acciones de presets.
 * 
 * @class ActionsTable
 * @extends App.Widget.Table
 * @memberOf App#Widget
 * @namespace App.Widget 
 */
App.Widget.ActionsTable = Ext.extend(App.Widget.Table,{
    cssClass: "actionTable",
    constructor: function(config) {
        var me = this;
        //Ext.applyIf(config,App.Widget.Table.Selectable); //Make Table checkbox-selectable
        if (!config.noselectable)
            config=App.Widget.Table.makeSelectable(config);
        
        config.columnDefs.push({
            targets: 3,
            sortable:false,
        });
        
        config.columnDefs.push({
            targets: 1,
            sortable:false,
            
        });
        config.columnDefs.push({
            targets: 2,
            sortable:false,
            
        });
        Ext.apply(config, {
            rowClass: App.Model.Action,
             order:[[1,"asc"]],
             actions: [
                  {
                           label: "Add action(s)",
                           hint: "Add a new actions to execute in a preset",
                           iconClass: "ico-btn ico-btn-pool_add",
                           noRowsAllowed: true,
                           multi:true,
                           scope:this,
                           validator: function() {
                               return true;
                           },
                           handler: function() {
                               
                               var me=this;
                                 this.newActionDlg = new App.Widget({
                                                        id:this.id+"_dialog",
                                                        template:"newAction",
                                                        persistentContainer:true,
                                                        title:"Select functions to use"
                                                    });
                                                    
                                Object.keys(App.config.presetMethods).forEach(function(method) {
                                $("<option>")
                                       .attr("value",method)
                                       .text(method +" ["+App.config.presetMethods[method].description+"]")
                                       .appendTo($("#"+this.newActionDlg.id+"_sel"));
                               },this)
                               
                               $("#"+this.newActionDlg.id+"_sel").chosen({width:"250px",height:"100px"});
                               
                               
                               $("#"+this.newActionDlg.id+"_closeBtn").click(function() {
                                  me.newActionDlg.$.hide();
                               });
                                                                             
                               $("#"+this.newActionDlg.id+"_okBtn").click(function() {
                                   
                                  me.addActions($("#"+me.newActionDlg.id+"_sel").val()); 
                                  me.newActionDlg.$.hide();
                               });
                               
                               this.newActionDlg.$.modal({backdrop:"static"}).show();  
                               
                               
                               
                           }
                  }
                 /*,
                 {
                           label: "Edit",
                           hint: "Edit action method o parameters",
                           iconClass: "ico-btn ico-btn-view_details",
                           validator: function() {
                              
                               return true;
                               
                           },
                           handler: function(actions) {
                               
                              
                           }
                 }*/,
                 {
                     label: "Remove actions",
                     hint: "Removes selected actions",
                     iconClass:"ico-btn ico-btn-job_cancel",
                     multi: true,
                     
                     validator: function(actions) {
                         return true;
                        
                     },
                     handler: function(actions) {
                         
                         actions.forEach(function(act) {
                            this.deleteRowModel(act);
                         },this);   
                         
                         
                     },
                     scope:this
                 },{
                     label: "Move up",
                     hint: "Changes the order of selected actions moving them one row up",
                     multi: true,
                     iconClass: "glyphicon glyphicon-arrow-up",
                     scope:this,
                     validator: function(presets) {
                         return presets.some(function(preset) {
                             return preset.order>0;
                         });
                         
                     },
                     handler: function(actions) {
                         actions.forEach(function(act) {
                            this.moveUp(act);
                            
                         },this);
                         
                     } 
                 },
                 {
                     label: "Move down",
                     hint: "Changes the order of selected actions moving them one row down",
                     multi: true,
                     iconClass: "glyphicon glyphicon-arrow-down",
                     scope:this,
                     validator: function(presets) {
                         return presets.some(function(preset) {
                             return preset.order<me.rows.length-1;
                         });
                     },
                     handler: function(actions) {
                         actions.forEach(function(act) {
                            this.moveDown(act);
                         },this);
                     } 
                 }
             ]
            
        });
        
        App.Widget.ActionsTable.superclass.constructor.call(this,config);
       var me=this;
       
   
        
    },
    addRow: function() {
        if (action = this.constructor.superclass.addRow.apply(this,arguments))
        {
            action.initParametersTable();
        }
    }
    ,
    addActions: function(actions) {
        
        actions.forEach(function(act) {
            
            var actModel = new App.Model.Action({method:act,order:this.rows.length,parameters:[]});
            this.addRow(actModel);
            //actModel.initParametersTable();
        },this)
        
    },  
    initHeader: function() {
         $("#"+this.id+"_n").text(this.rows.length);
         
         $("#"+this.id+" td a[data-actionid]").off("click")
                              .click(function() { 
                                console.log("[ActionsTable] Loading actions data id:"+this.getAttribute("data-actionid"));
                                                                                             
                            });
    },
    moveUp: function(action) {
        action.order--;
        
        this.rows.forEach(function(row) {
            if (row.id != action.id && row.order==action.order) {
                row.order++;
                this.updateRow(row);
                row.initParametersTable();
            }
        },this);
       this.updateRow(action);
       action.initParametersTable();
       
    },
    moveDown: function(action) {
        action.order++;
        
        this.rows.forEach(function(row) {
            if (row.id != action.id && row.order==action.order) {
                row.order--;
                this.updateRow(row);
                row.initParametersTable();
            }
        },this);
       this.updateRow(action);
       action.initParametersTable();  
    }
});

