Ext.ns("App.Widget");

/**
 * Tabla con una escructura extendida en la fila.
 * 
 * TODO: Actualmente implementa funcionalidad apta solo para Jobs.
 * TODO: Sacar en ExtendedJobsTable y borrar esta o implementar generica si es necesario.
 * 
 * @namespace App.Widget
 * @memberOf App#Widget
 * @extends Table
 * @class ExtendedTable
 */
App.Widget.JobsExtendedTable = Ext.extend(App.Widget.Table,{
    constructor: function ExtendedTable(config) {
        var me=this;
        
       // Ext.applyIf(config,App.Widget.Table.Selectable);
        var colsConfig = [];
                                colsConfig.push({
                                    className: "details-control",
                                    orderable: false,   
                                    defaultContent: '',
                                    targets: 0
                                 });
                               if (config.selectable !== false)     
                                 colsConfig.push({
                                    orderable: false,
                                    className: 'select-checkbox',
                                    targets:  1
                                });
                                
        Ext.applyIf(config,{ columnDefs: colsConfig
                               
                             ,
                             
                             pagingType: 'full_numbers',
                select: {
                    style:    'multi',
                    selector: 'td.select-checkbox'
                },
                orderMulti: true,
                order: [[ 0, 'asc' ],[1,'asc']]
});
          
        
        
        
        App.Widget.JobsExtendedTable.superclass.constructor.call(this,config);
        
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
            
            var childJobs= $(row.node())
                                .data()
                                .getJobs();
                        
            if (childJobs === null) {
                 row.child(App.Widget.getTemplate('no_child_jobs')).show();
                 tr.addClass('shown');
                return;
            }
            
            me.xTpl= new Ext.Template(App.Widget.getTemplate('jobs_children'));
            me.xTpl.compile();
           
            
            //$("#"+me.id+"_child_"+me.uniqid).DataTable();
            
            var tplHtml = me.xTpl.apply({id: me.id+"_child_"+rand});
            
            //console.log(tplHtml);
            row.child(tplHtml).show();
            
            me.childJobs = new App.Widget.JobsTable({
                id:me.id+"_child_"+rand,
                dom:"tp",
                selectable: false,
                template: "jobs_children",
                
                /*renderer: {
                    func: row.child,
                    scope: row
                }*/
            });
            
            
            
            
           
            
            
            me.childJobs.load(childJobs); 
            $("#"+me.id+"_child_"+rand).addClass("childTable");
            
            tr.addClass('shown');
            tr.attr("data-child-id",me.id+"_child_"+rand);    
            
        }
        } );
        
        
        
        
        
        
        
        
        
        
        
        
    }

});