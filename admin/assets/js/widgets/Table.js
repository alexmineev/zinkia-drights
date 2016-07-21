Ext.ns("App.Widget");
/**
 * Generic data table class.
 * 
 * @class Table
 * @param {Object} config
 * @namespace App.Widget
 * @extends App.Widget
 * @memberOf App#Widget
 * @returns {App.Widget.Table}
 */
App.Widget.Table = {
    
    _dtButtonsInfoId: "datatables_buttons_info",
     defaultRenderMode: "full-hold",
    _addEvents: function() {
        this.addEvents(
                'loaded',
                'rowadded',
                'rowmodified',
                'rowdeleted',
                'beforeaddrow',
                'beforedeleterow',
                'beforemodifyrow',
                'rowselected',
                'rowunselected',
                'beforeselected',
                'beforeunselected'
        );
    },
    constructor: function Table(config) {
    var me =this;
    
    App.Widget.Table.superclass.constructor.call(this,config);
    
    this._addEvents();
    
    this.animation=App.config.table.animation;
    
    Ext.apply(this, 
              config || {});
    
   //this.uniqid= Math.floor(Math.random()*1000000000000);
   /*if (Ext.isObject(this.header))     
        this.header = new this.header.$class(this.header);
   
   if (Ext.isObject(this.footer))     
        this.footer = new this.footer.$class(this.footer);*/
            
     if (!Ext.isMac && !Ext.isSafari) 
     Ext.applyIf(config,{
            lengthChange: true,
            scrollY: false,
            searching: true,
            dom: 'Blcfrtip',
            pageLength: App.config.table.defaultPageSize ? App.config.table.defaultPageSize:30,
            buttons: [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5',
                'colvis'
            ],
            language: {
                buttons: {
                    colvis: 'Show/Hide columns'
                }
            },
            colReorder: true
            //buttons: ['copy','colvis','excel','pdf']
       });
      else
          Ext.applyIf(config,{
            lengthChange: true,
            scrollY: false,
            searching: true,
            dom: 'lcfrtip',
            pageLength: App.config.table.defaultPageSize ? App.config.table.defaultPageSize:30,
            colReorder: true,
            
            //buttons: ['copy','colvis','excel','pdf']
       });
   
       
   
      if (!$.isFunction(this.rowClass)) 
                this.rowClass=App.AbstractRow;
      
      this.rows=[];
      
      //try {
          
       // this.child('table').set({id: this.id+"_dt"});
        //this.render();
        console.info("[DataTable "+this.id+"] init");
        
        
        $("#"+this.id+"_dt tbody").empty();
        this.dtId = this.id+"_dt";
        //$("#"+this.id+"_dt").attr("id",this.dtId);
        console.warn(config);
        if (!config.columnDefs) config.columnDefs = [];
        
        var dtConf = {};
        
        
        $(document.body) //rendering filters dialog
                .append($(App.Widget.renderTemplate("filtersDialog",{id:this.id+"_filtersDialog",title:"Advanced column filter"})));
        
        $.extend(dtConf,config);
        
        this.$dt=$("#"+this.dtId).DataTable(Ext.applyIf(dtConf, {retrieve: true}));
        
        me._buildFilters();
        
        $(window).on("resize", function() {
           //me.$dt.draw("full-hold");
           me.adjust();
        });
        
        //window.setInterval(function() {me.adjust();},3000);
        //this.body = this.child("tbody").dom;
      /*} catch(e) {
          if (App.config.debug)
            throw new Error(e);
          else
             console.error(e);
            
      }*/
          
     
        
       /** Setting default listeners **/ 
        this.on("rowadded", function(index) {
            
         $(me.$dt.row(index).node()).data(me.rows[index]);
            
           if (me.animation) 
                me.playAnimation(index,"add");
           else
               me.$dt.draw();
           if (!App.config.table.disableHeaderUpdate) 
            me.initHeader(); 
        });
        
        this.on("rowdeleted", function(index) {
           if (me.animation) 
                me.playAnimation(index,"delete");
            else
               me.$dt.draw();
          if (!App.config.table.disableHeaderUpdate)   
           me.initHeader(); 
        });
        
        this.on("rowupdated", function(index) {
           if (me.animation) 
                me.playAnimation(index,"update");
          else
               me.$dt.draw();  
           if (!App.config.table.disableHeaderUpdate)  
                me.initHeader(); 
        });
        
        
        
        
        this.on("loaded",function() {
           me.$dt.buttons.info(false); //Hide "Loading" message
           me.initHeader();
           
           me.$dt.draw();
           
           me._loadFilters();
           
           if (Array.isArray(this.actions)){
                this._buildContextMenu();
                this._buildActionsButtons(this.id+"_actions",true);
                this._validateActionsButtons(this.id+"_actions");
                
            } else {
                $("#"+this.id).siblings("header").children("div.btn-actions").empty();
            }
            
        },this);
        
        this.$dt.on("select", function(e,dt,type,indexes) {
            
            if (type !== "rows" && type !== "row") return;
            
            $("a[data-button-type='multi']").removeClass("disabled");
            
            if (!me.fireEvent("rowselected",me.getModelByIndex(indexes)))
                dt.rows(indexes).deselect();
            
                
        });
        
        this.$dt.on("deselect", function(e,dt,type,indexes) {
            if (type !== "rows" && type !== "row") return;
            
                if (dt.rows(".selected").toArray()[0].length==0)
                    $("a[data-button-type='multi']").addClass("disabled");
            
            if (!me.fireEvent("rowunselected",me.getModelByIndex(indexes)))
                dt.rows(indexes).select();
        });
        
        $("#"+this.id+"_checkall").click(function() {
                  
                  me.$dt.rows("*")[this.checked?"select":"deselect"]();  
        });
        
        $("#"+this.id).siblings("header").children("div.pull-right").children("a:not(.max-min-trigger)").click(function() {
            me.showFilter();
        });
        
        $("#"+this.id).siblings("header").children("div.pull-right").children("a.max-min-trigger").children("span").click(function(e) {
            
             e.stopImmediatePropagation();
             
             
             if ($(this).hasClass("glyphicon-minus"))
             {   
                me.$.collapse('hide');
                $(this).removeClass("glyphicon-minus").addClass("glyphicon-plus");
             } else {
                 me.$.collapse('show');
                $(this).removeClass("glyphicon-plus").addClass("glyphicon-minus");
             }    
            return false;
        });
        
        this.on("rowselected",function(model) {
            if (Array.isArray(this.actions)) {
                this._validateActionsButtons(this.id+"_actions",true);
            }
        },this);
        
        this.on("rowunselected",function(model) {
            if (Array.isArray(this.actions)) {
                this._validateActionsButtons(this.id+"_actions");
            }
        },this);
        
        this.currentPageSize = this.getPageSize();
                
        //App.registerComponent("table",this);
        
        this.$dt.draw.defer(1000); 
    },
    
    destroy: function() {
        this.$dt.destroy();
        this.rows.forEach(function(row) {
            row.destroy();
        });
        
        delete this;
    }
    ,
/**
 * 
 * @param {Number} index
 * @returns {Object}
 */        
 getModelByIndex: function(index) {
     var id=$(this.$dt.rows(index).nodes()).data().id;
     
     return this.rows.find(function(model) {
       return model.id === id;  
     });
     
     return false;
 }
 
 ,
 /**
  * @param {Object} rowData data passed to row model class constructor.
  * @returns {App.Model.Abstract} newly created/added rowModel class instance.
  */
 addRow: function(rowData) {
        
        if (!rowData.isExtendedFrom(App.Model.Abstract) && $.isPlainObject(rowData))
            var row = new this.rowClass(rowData);
        else
            var row = rowData;
            
        if (!this.fireEvent('beforeaddrow',row)) return false;
            
        this.rows.push(row);
        
        var newRow = this.$dt.row.add(this._processRowModel(row.toRowModelArray(this.rowType || null)));
        $(newRow.node()).data(rowData);
        row.fireEvent("tableadded",this);
        this.fireEvent('rowadded',this.rows.length-1,row);
        //console.log(new this.rowClass(rowData));
        
        return row;
 },
 updateRow: function(rowData) {
        
        var row = App.Model.isModel(rowData) ?rowData: new this.rowClass(rowData);
        
        
        if (!App.Model.isModel(row)) 
                throw new Error("[App.Widget.Table::updateRow] rowClass of row doesn't extend App.Model.Abstract class");        
        
        if (!this.fireEvent('beforemodifyrow',row)) return false;
        
        if ((rowIndex =this.getRowIndex(row)) != -1) {
          if($.isFunction(this.rows[rowIndex].destroy)) 
                this.rows[rowIndex].destroy();
            
          delete this.rows[rowIndex];
          
          this.rows[rowIndex] = row;
          var data=this._processRowModel(row.toRowModelArray(this.rowType || null));
          this.$dt.row(rowIndex).data(data);
          $(this.$dt.row(rowIndex).node()).data(data);
          
          row.fireEvent("tableupdated",this);
          
          this.fireEvent("rowupdated",rowIndex,row);
        } else {
            console.warn("[App.Widget.Table::updateRow] No Row with such row model data id");
        }
        
        
 },
 deleteRowModel: function(row) {
     
     if ($.isNumeric(row)) row = {id: row};
     
     if ((rowIndex =this.getRowIndex(row)) !== -1) {
          this.deleteRow(rowIndex);
     } else {
         console.warn("[Table::deleteRowModel()]: No row-model with such id.");
     }
 },
 deleteRow: function(rowIndex) {
     
        var me= this;
        
        if (!this.fireEvent('rowbeforedeleted',this.rows[rowIndex])) return false;
        
        this.rows[rowIndex].fireEvent("tabledeleted",this);        
        if (this.rows[rowIndex]) 
             this.rows.remove(this.rows[rowIndex]);
         
        if (this.animation) {
            
          window.setTimeout(function() {
            
            me.fireEvent("rowdeleted",rowIndex); 
          },100);  
          window.setTimeout(function() {
              me.$dt.row(rowIndex).remove();
              me.$dt.draw('full-hold');  
           },2000); 
          
            
        } else {
            
            this.fireEvent("rowdeleted",rowIndex); 
            me.$dt.row(rowIndex).remove();
            me.$dt.draw('full-hold');  
        }
        
        
 },
 clear: function() {
     this.$dt.clear();
     this.fireEvent('cleared');
     
     if (!this.trans) this.render();
     
     
     return this;
     
 },/*
 render: function() {
    //this.$dt.draw(this.defaultRenderMode);  
    
    
    //return this.constructor.superclass.render.apply(this,arguments); 
    
 },*/
 attachRowModelListeners: function() {
    
    
 },
 showLoadingMask: function() {
     this.$dt.buttons.info("Loading","Please wait...");
 },
 msgBox:function(style,header,msg,sec){
     if (this.$dt.buttons,arguments.length==0)
             this.$dt.buttons.info(false);
     else 
     {
         
            this.$dt.buttons.info(header,msg,sec);
         switch (style) {
             case "success":
                $("#"+this.dtButtonsInfoId+" h2").addClass("msg-success");
             break;
             case "error" :
                 $("#"+this.dtButtonsInfoId+" h2").addClass("msg-error");
             break;
             default:
                $("#"+this.dtButtonsInfoId+" h2").removeClass("msg-success");
                $("#"+this.dtButtonsInfoId+" h2").removeClass("msg-error");
         }
         
     }
},
 playAnimation: function(rowIndex,animType) {
     return;
     //var color= $(this.$dt.row(this.$dt.row().index(rowIndex)).node()).css("background-color");
     
     var rowNode = $(this.$dt.row(rowIndex).node());
     //console.log(rowNode);
     
    //Ext.get(rowNode[0]).highlight(); 
 
    switch(animType) {  
        case "add":  q 
            this.$dt.draw('full-hold'); //FIXME: a hack, looking for a better solution
            rowNode.addClass.defer(300,rowNode,['added']);
            rowNode.removeClass.defer(2000,rowNode,["added"]);
        break;
        case "update":
            this.$dt.draw('full-hold'); //FIXME: a hack, looking for a better solution
            rowNode.addClass.defer(500,rowNode,['modified']);
            rowNode.removeClass.defer(2000,rowNode,["modified"]);
        break;
        case "delete":
            rowNode.addClass.defer(300,rowNode,['deleted']);
            rowNode.removeClass.defer(2000,rowNode,["deleted"]);
            
            this.$dt.draw.defer(2000,this.$dt,['full-hold']); //FIXME: a hack, looking for a better solution
        break;
    }
    
    rowNode.fadeOut.defer(600,rowNode);
    rowNode.fadeIn.defer(1000,rowNode);
    rowNode.fadeOut.defer(600,rowNode);
    rowNode.fadeIn.defer(1000,rowNode);
    //Ext.get(rowNode[0]).highlight();
    
 },
 /**
  * 
  * @param {type} rows
  * @returns {undefined}
  */
 load: function(rows) {
                
                var me = this;
                
               
                
                if (!$.isArray(rows)) throw Error("[App.Widget.Table] rows should be an array");
                               
                
                if ($.isArray(this.rows)) delete this.rows;
                
                this.rows = [];
                
               // this.begin()
                this.$dt.clear();
                
                
                rows.forEach(function(row) {
                  //  me.attachRowModelListeners(row);
                  me.addRow(row);
                })
                
                //this.commit();
                this.fireEvent('loaded');
                this.$dt.draw.defer(300,this.$dt);
                
                this.initHeader();
    },
    getRowIndex: function(rowModel) {
         return this.rows.findIndex(function(row) {
             return row.id == rowModel.id;
         });
    },
    getPageSize: function() {
      return this.$dt.page.len();  
    },
    setPageSize: function(size) {
        this.$dt.page.len(size<=0 ? 1: size);
        this.$dt.draw();
       return this; 
    },
    adjust: function() {
        
        //console.info("[DataTable]: ADJUST COLUMNS");
        
        this.$dt.columns.adjust()
                .responsive.recalc();
        this.$dt.draw.defer(400,this.$dt);
        this.msgBox();
        
    },
    getSelectedRows: function() {
        if (!this.$dt.rows(".selected").toArray()[0]) return [];
        
        return this.$dt.rows(".selected")
                .toArray()[0]
                .map(function(i) {
                    return this.rows[i];
                },this);
    },
    _loadFilters: function() {
        var i=0;
              this.filters.forEach(function(input){
                  
                  var id = input.attr("id"),
                  column = this.$dt.column(i), 
                  datalist =  $("#"+id+"_list");
                datalist.empty();
                column.data().unique().sort().each( function ( d, j ) {
                    if (Ext.isString(d)) {
                        d = d.replace(/<\/?[^>]+(>|$)/g,"").replace("/&nbsp/g","");
                    } 
                    
                    $("<option>")
                            .attr("value",d)
                            .text(d)
                            .appendTo(datalist);
                } );
                
                i++;  
              },this);
           
                
                
    },
    
    _buildFilters: function() {
        var me=this;
        var table = $("#"+this.id+"_filtersDialog_filters");
        var i=0;
        table.empty();
        me.filters = [];
        
        this.$dt.columns().every(function() {
            var column=this;
            var name =$(this.header()).text(); 
            var hidden = name.length==0 ? "display:none":"";
            
            var id=me.id+"_filter_"+i;
            
            table.append($(App.Widget.renderTemplate("filter",{id:id,label:name,hidden:hidden})));
            
            
            var input=$("#"+id);
                   
                input.data(column);
            me.filters.push(input);    
                
            i++;
            
        });
        
        $("#"+this.id+"_filtersDialog_okBtn").click(function() {
            var i=0;
            me.filters.forEach(function(filter) {
                var regex = $("#"+filter.attr("id")+"_regex");
                
                me.$dt.column(i).search(filter.val(),regex,true);
                me.$dt.draw();
                i++;
            });
            
            me.hideFilter();
        });
        
        $("#"+this.id+"_filtersDialog_closeBtn").click(function() {
            me.hideFilter();
        });
        
    },
    hideFilter: function() {
        $("#"+this.id+"_filtersDialog").hide();
    }
    ,
    showFilter: function() {
        
        $("#"+this.id+"_filtersDialog").modal({backdrop:"static"}).show();
    },
    /**
     * 
     * @override
     */
    initHeader: function() {
        
        
        var  me=this;
        
        $("#"+this.id+"_n").text(this.rows.length);
         
    },
     _buildActionsButtons: function(id,multi) {
        var me=this,
            
            i=0, div=$("#"+id);
    
            div.empty();
            
             this.actions
             
             .filter(function(act) {return !act.menuOnly /*&& (multi ? act.multi: !act.multi)*/;})
             .forEach(function(act) {
            
            var a=$("<a>")
                .addClass("action-button")
                .attr("id","action-item-"+i)
                .attr("data-toggle","popover")
                .attr("data-placement","top")
                .attr("data-trigger","hover")
                .attr("title",act.label)
                .attr("data-content",act.hint)
                .appendTo(div);
        
                $("<span>").addClass(act.iconClass).appendTo(a);
        
                a.data(act);
        
                $("#"+id).on("click","#action-item-"+i,function(e,btn) {
                     e.stopImmediatePropagation();
                   
                   
                   
                   var rows=me.getSelectedRows();
                   if (rows.length==0 && !act.noRowsAllowed) {
                       me.msgBox("error","No rows selected!","Please select any row by clicking on the checkbox column.",2000);
                       return;
                   } else if (rows.length>1 && !act.multi) {
                       me.msgBox("error","Select only one row","Cannot perform this operation on more than one row at time. Please select only one row.",3500);
                       return;
                   }
                   
                   if (!act.validator(rows)) {
                       me.msgBox("error","Action unauthorized","You do not have permission to execute this action on selected row(s)",2000);
                       return;
                   } else if(rows.length>1) { //multiple rows check
                       if ((pRows=rows.filter(function(row) { //check if some of selected rows don't have permision for the action.
                           
                           return !act.validator([row]);
                       })).length>0) {
                         
                         pRows.forEach(function(row) {
                             var idx=me.getRowIndex(row);
                             me.$dt.rows(idx).deselect();
                             $(me.$dt.rows(idx).nodes()).addClass("deleted");
                         },me); 
                           
                         if (confirm("You don't have permission to execute this action for some of selected rows (they are marked with red color now). Do you wish to unselect them and do an operation only on permitted rows?"))
                         {
                           rows = me.getSelectedRows();
                           
                           pRows.forEach(function(row) {
                             var idx=me.getRowIndex(row);
                             
                             $(me.$dt.rows(idx).nodes()).removeClass("deleted");
                         },me);
                           
                         
                         } else {
                             
                             
                             pRows.forEach(function(row) {
                             var idx=me.getRowIndex(row);
                             
                             $(me.$dt.rows(idx).nodes()).removeClass("deleted");
                         },me);
                             
                             return;
                         }
                                
                           
                       } 
                       
                   }
                   
                   act.handler.call(act.scope,rows);
                   
                });
                
        
          i++;  
        },this);
        
        $("#"+id+" a").popover();
        
     },
     _validateActionsButtons: function(id,multi) {
         var btns= $("#"+id+" a"),
             me = this;
         
         var rows=this.getSelectedRows();
         
         btns.each(function(i,btn) {
            var act=             
              $(btn).data();
      
            if (rows.length>0 && !act.noRowsAllowed)
            { //some of models has permission
               if (!act.validator(rows)) 
                $(btn).addClass("disabled");
               else 
                $(btn).removeClass("disabled");   
            } else {
                if (!act.noRowsAllowed) $(btn).addClass("disabled");
                    else $(btn).removeClass("disabled");
            }
              
         });
         
         
     }
    ,
    _buildContextMenu: function() {
        var me=this;
        var i=0;
        console.info("[Table] Generating context menu for "+this.id);
        var id =this.id+"_contextMenu";
        
        var optList=this.actions.map(function(act) {
            var li= $("<li>").addClass("context-menu-item list-group-item list-group-item-info");
            
            
            var uniqId= Math.round(Math.random() *100000000000);
            li.attr("data-objectid",uniqId);
            App["object"+uniqId] = act;
            
            /*$("<a>")
                .text(act.label)
                .attr("id","context-menu-item-"+i)
                .attr("data-toggle","popover")
                .attr("data-placement","right")
                .attr("data-trigger","hover")
                .attr("title",act.hint)
                .css("clear","none")
                .css("float","right")
                .appendTo(li);*/
        
            li.text(act.label)
                .attr("id","context-menu-item-"+i)
                .attr("data-toggle","popover")
                .attr("data-placement","right")
                .attr("data-trigger","hover")
                .attr("data-content",act.hint)
                .append(
                     $("<span>")
                      .addClass(act.iconClass)
                      .css("float","left")
                      //.css("clear","left")
                  

                  );
        
                $("#"+this.id).on("click","#context-menu-item-"+i,function(e,li) {
                   e.stopImmediatePropagation();
                   
                   
                   
                   var rows=me.getSelectedRows();
                   if (rows.length==0 && !act.noRowsAllowed) {
                       me.msgBox("error","No rows selected!","Please select any row by clicking on the checkbox column.",2000);
                       return;
                   } else if (rows.length>1 && !act.multi) {
                       me.msgBox("error","Select only one row","Cannot perform this operation on more than one row at time. Please select only one row.",3500);
                       return;
                   }
                   
                   if (!act.validator(rows)) {
                       me.msgBox("error","Action unauthorized","You do not have permission yo execute this action on selected row(s)",2000);
                       return;
                   } else if(rows.length>1) { //multiple rows check
                       if ((pRows=rows.filter(function(row) { //check if some of selected rows don't have permision for the action.
                           
                           return !act.validator([row]);
                       })).length>0) {
                         
                         pRows.forEach(function(row) {
                             var idx=me.getRowIndex(row);
                             me.$dt.rows(idx).deselect();
                             $(me.$dt.rows(idx).nodes()).addClass("deleted");
                         },me); 
                           
                         if (confirm("You don't have permission to execute this action for some of selected rows (they are marked with red color now). Do you wish to unselect them and do an operation only on permitted rows?"))
                         {
                           rows = me.getSelectedRows();
                           
                           pRows.forEach(function(row) {
                             var idx=me.getRowIndex(row);
                             
                             $(me.$dt.rows(idx).nodes()).removeClass("deleted");
                         },me);
                           
                         
                         } else {
                             
                             
                             pRows.forEach(function(row) {
                             var idx=me.getRowIndex(row);
                             
                             $(me.$dt.rows(idx).nodes()).removeClass("deleted");
                         },me);
                             
                             return;
                         }
                                
                           
                       } 
                       
                   }
                   
                   act.handler.call(act.scope,rows);
                   $("#"+id).hide(); 
                   me.$dt.rows("*").deselect();
                });
        
                i++;
                return li.get(0).outerHTML;
        },this);
        
        $(document.body).click(function() { //backdrop
            $("#"+id).hide(); 
        });
        
        $("#"+this.id).append(App.Widget.renderTemplate("contextMenu",{id:this.id+"_contextMenu",optList:optList.join("")}));
        $("#"+id+" li").mouseenter(function() {
            $(this).addClass("active_item");
        })
                            .mouseleave(function() {
                                $(this).removeClass("active_item");
                            });
         $("#"+id).hide();
         
         $("#"+this.id).on("contextmenu","table tr td",function(e) {
            
            
           // positionMenu(e.originalEvent,$("#"+id).get(0))
           
            var x = this.offsetLeft+document.body.scrollLeft,
                y = this.offsetTop+document.body.scrollTop;
            
               me.$dt.rows($(this).parent("tr")).select();
               
            $("#"+id)
                    .css("left",x+100)  
                    .css("top",y+250)  
                  .show();
            e.preventDefault();
            e.stopImmediatePropagation();
            
            $("#"+id+" li").popover();
            
            var selNodes = me.getSelectedRows();
            $("#"+id+" .context-menu-item").each(function(i,item) {
                var act = App["object"+$(item).attr("data-objectid")];
                
                if (selNodes.length==0 || !act.validator(selNodes)) {
                    $(item).addClass("disabled");
                } else {
                    $(item).removeClass("disabled");
                }    
                console.log($(item).text()+":"+act.validator(selNodes));
               //var validator = new Function(atob($(act).attr("data-validator")));
               
               
            });
            
            return false;
            
         });
         
    },
    getTableConfig: function() {
        var me=this;
        var config = {
            columns: []
        };
        var i=0;
        this.$dt.columns().every(function() {
            
                var filter = me.filters[i] ? {
                                value: me.filters[i].val(),
                                regex:$("#"+me.filters[i].attr("id")+"_regex").prop("checked")
                              } : false;
            
            config.columns.push({
                visible: this.visible(),
                filter:  filter,
                //order: me.$dt.order()[i] ? me.$dt.order()[i][1]:false         
                         
             });
            
           i++; 
        });
      config.order = this.$dt.order(); 
      config.colReorder= this.$dt.colReorder.order();  
      config.filter = this.$dt.search().length>0?this.$dt.search():false;
      config.pageSize = this.$dt.page.len();
      return config;  
    },
    setTableConfig: function(config) {
        
        
        
        var i=0;
        config.columns.forEach(function(col) {
            var column=this.$dt.column(i);
            
            column.visible(col.visible);
            if (col.filter) {
                this.filters[i].val(col.filter.value);
                $("#"+this.filters[i].attr("id")+"_regex").prop("checked",col.filter.regex);
                
                
            }
            
            //column.order(col.order).draw();
            i++;
        },this);
        
        this.$dt.order(config.order).draw();
        
        $("#"+this.id+"_filtersDialog_okBtn").triggerHandler("click");
        this.hideFilter();
        
        if (config.filter) {
            this.$dt.search(config.filter);
        }
        
        this.$dt.colReorder.order(config.colReorder);
        if (config.pageSize)
        {
            this.$dt.page.len(config.pageSize);
        }
        
        this.adjust();
        
    },
    _processRowModel: function(rowArr) {
        var order = this.$dt.colReorder.order();
        var nArr = [];
        
        if (order == null) return rowArr; 
        
        if (!Array.isArray(rowArr)) return rowArr;
        
        for (i=0;i<rowArr.length;i++)
        {
            
               nArr.push(rowArr[order[i]]);
        }
        
        return nArr;
        
    },
    show: function() {
        this.$.show()
        this.adjust();
    },
    hide: function() {
        this.$.hide();
    }
 
 
 };
App.Widget.Table=Ext.extend(App.Widget,App.Widget.Table);


/**
 * Pre-defined table config that makes datatable selectable. 
 * @static
 * @returns {Object}
 */
App.Widget.Table.makeSelectable= function(config) {
    
    config=new Object(config);
    
    config.columnDefs = [];
    config.columnDefs.push({
                                    orderable: false,
                                    className: 'select-checkbox',
                                    targets:   0
                                 });
                                 
    Ext.apply(config,{
                             
                pagingType: 'full_numbers',
                select: {
                    style:    'multi',
                    selector: 'td.select-checkbox'
                },
                orderMulti: true,
                order: [[ 0, 'asc' ]]
            });
    return config;        

};