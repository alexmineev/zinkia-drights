Ext.ns("App.Widget");

/**
 * @class PoolsTable
 * @extends App.Widget.Table
 * @memberof App#Widget
 * @namespace App.Widget
 */


App.Widget.PoolsTable = {
    constructor: function(config) {
        if (config.selectable !== false)
            //Ext.applyIf(config,App.Widget.Table.Selectable); //Make Table checkbox-selectable
                config=App.Widget.Table.makeSelectable(config);
        
        
        Ext.apply(config, {
             rowClass: App.Model.Pool,
             
             
             actions: [
                 {
                           label: "New pool",
                           hint: "Create a new pool",
                           iconClass: "ico-btn ico-btn-pool_add",
                           noRowsAllowed: true,
                           multi:true,
                           validator: function() {
                                                              
                               return App.canUserDo(croupier.ModificationDataAllPermission.pool$add);
                               
                           },
                           handler: function() {
                               
                               
                               
                               App.tabs.tab_active.panelDetails=new App.Panel.PoolDetails(App.tabs.tab_active.tab_id, -1);
                               App.tabs.tab_active.panelDetails.show();
                           }
                  }
                 ,
                 {
                           label: "Show details",
                           hint: "Shows detailed information of the pool and permits add/remove nodes from it.",
                           iconClass: "ico-btn ico-btn-view_details",
                           menuOnly: true,
                           validator: function(pools) {
                               var pool = pools[0];
                               
                               return pool.hasPermission(croupier.PoolPermission.moveNodes);
                               
                           },
                           handler: function(pools) {
                               var pool = pools[0];
                               
                               
                               App.tabs.tab_active.panelDetails=new App.Panel.PoolDetails(App.tabs.tab_active.tab_id, pool.id);
                               App.tabs.tab_active.panelDetails.show();
                           }
                 },
                 {
                     label: "Remove pools",
                     hint: "Removes selected pools",
                     iconClass:"ico-btn ico-btn-pool_delete",
                     multi: true,
                     
                     validator: function(pools) {
                         
                         return pools.some(function(pool) {
                            return pool.hasPermission(croupier.PoolPermission.remove);
                         });
                     },
                     handler: function(pools) {
                          App.mainBox = App.progressMsg("Pools","Removing pools...");
            
                          App.API.Pools.removePools(pools,function() {
                            App.mainBox.progress(100);
                            App.mainBox.done();
                   
                          },this);
                     },
                     scope:this
                 }
             ]
             
             
        });
        config.columnDefs.push({
                                    className: "details-control",
                                    orderable: false,   
                                    defaultContent: '',
                                    targets: 1
                                 }); 
        
        App.Widget.PoolsTable.superclass.constructor.call(this,config);
        
        if (croupier && !config.noSync) {
           
            croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.pool$add],function(data) {
                console.info("[Pools] new model added. ID:"+data.id);
                    this.addRow(data);
                    //this.initHeader();
            },this);
            croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.pool$set],function(data,id) {
                console.info("[Pools] model updated. ID:"+id);
                    this.updateRow(App.API.Pools.getPool(id));
                    //this.initHeader();
            },this);
            
            croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.pool$addNode],function(data,id) {
                console.info("[Pools] model updated. ID:"+id);
                    this.updateRow(App.API.Pools.getPool(id));
                    //this.initHeader();
            },this);
            
            croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.pool$removeNode],function(data,id) {
                console.info("[Pools] model updated. ID:"+id);
                    this.updateRow(App.API.Pools.getPool(id));
                    //this.initHeader();
            },this);
            
            croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.pool$remove],function(data,id) {
                console.info("[pools] captured remove event");
                
                    
                    this.deleteRowModel(id);
                   //this.initHeader();
            },this);
        }
        var me=this;
        
        this._setExtraInfo();
        
        
        $("#"+me.id+"_dt").on("draw.dt",function() {
              
                       $("#"+me.id+"_dt td a[data-poolid]").off("click")
                              .click(function() { 
                                console.log("[PoolsTable] Loading pool data id:"+this.getAttribute("data-poolid"));
                                //App.tabs.tab_active.userDetails(this.getAttribute("data-userid"));
                                //App.tabs.tab_active.hide();
                                App.tabs.tab_active.panelDetails=new App.Panel.PoolDetails(App.tabs.tab_active.tab_id, this.getAttribute("data-poolid"));
                                App.tabs.tab_active.panelDetails.show();
                                
                        });
        
          });
        
        
        
    },
    
    initHeader: function() {
        var me=this;
                    
    
        $("#"+this.id+"_nu").text(this.rows.filter(function(pool) {
            return pool.groupPermission==croupier.UserGroupPoolPermission.USE_PRIMARY ||
                   pool.groupPermission==croupier.UserGroupPoolPermission.USE_SECONDARY;
        }).length);
        
        $("#"+this.id+"_nm").text(this.rows.filter(function(pool) {
            return pool.groupPermission==croupier.UserGroupPoolPermission.MODIFY;
        }).length);
        
        this.constructor.superclass.initHeader.call(this);
        
    },
    addRow: function(rowData) {
        if (rowData.id == 0) return this;
        else
            return this.constructor.superclass.addRow.apply(this,arguments);
        
    },
    _setExtraInfo: function() {
         var me=this;
        
         $("#"+this.id+"_dt tbody").on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = me.$dt.row( tr );
 
        if ( row.child.isShown() ) {
            // This row is already open - close it
            //tr.getAttribute();
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            var rand = Math.floor(Math.random()*1000000000000);
            
            var childNodes= $(row.node())
                                .data()
                                .getNodes();
                        
            if (childNodes === null) {
                 row.child(App.Widget.getTemplate('no_pool_nodes')).show();
                 tr.addClass('shown');
                return;
            }
            
            me.xTpl= new Ext.Template(App.Widget.getTemplate('pool_nodes'));
            me.xTpl.compile();
           
            
            //$("#"+me.id+"_child_"+me.uniqid).DataTable();
            
            var tplHtml = me.xTpl.apply({id: me.id+"_child_"+rand});
            
            //console.log(tplHtml);
            row.child(tplHtml).show();
            
            me.nodesTable = new App.Widget.NodesTable({
                id:me.id+"_child_"+rand,
                dom:"t",
                selectable: false,
                template: "pool_nodes",
                
                /*renderer: {
                    func: row.child,
                    scope: row
                }*/
            });
            
            
            
            
           
            
            
            me.nodesTable.load(childNodes); 
            $("#"+me.id+"_child_"+rand).addClass("childTable");
            
            tr.addClass('shown');
            tr.attr("data-child-id",me.id+"_child_"+rand);    
            
        }
        } );
    }
};
App.Widget.PoolsTable = Ext.extend(App.Widget.Table,App.Widget.PoolsTable);

