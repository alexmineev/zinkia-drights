Ext.ns("App.Widget");

App.Widget.PermissionsDuoTables = Ext.extend(App.Widget.DuoTables,{
    constructor: function(config) {
        
        if (config.permissionColumn) {
            
            if (!config.leftTable.config.columnDefs) config.leftTable.config.columnDefs = [];
                config.leftTable.config.columnDefs.push(
                    {
                        orderable: false,
                        className: 'select-checkbox',
                        targets:   0
                    }
                );
        
                config.leftTable.config.columnDefs.push({
                    targets: 3,
                    className: 'permissions-select',
                    orderable: false,
                    data: null,
                    defaultContent: App.Widget.renderTemplate('permissionsSelect',config)
                });
                
                Ext.apply(config.leftTable.config,{
                    pagingType: 'full_numbers',
                    select: {
                        style:    'multi',
                        selector: 'td:first-child'
                    },
                   orderMulti: true,
                   order: [[ 0, 'asc' ]]
                 });
                
                config.leftTable.config.selectable = false;
                
        }
                       
       App.Widget.PermissionsDuoTables.superclass.constructor.call(this,config); 
       
       var me=this;
       
       $("#"+this.id+"_all").click(function() {
           if (this.checked) {
             $("#"+me.id+"_all_perm").removeAttr("disabled");
             
             $("#"+me.id).css("opacity","0.5")
                          .addClass("disabled");
             
             me.rightTable.msgBox("Assign to All","Permissions will be assigned to all elements","",1000);
             
             /*me.rightTable.rows.forEach(function(row) {
                 this.leftTable.addRow(row);
                 this.rightTable.deleteRowModel(row);
             },me);*/
               me.rightTable.$dt.rows("*").select();
               
               me.leftTrigger();
             
           } else {
             $("#"+me.id+"_all_perm").attr("disabled","disabled");
             
             $("#"+me.id).css("opacity","1")
                         .removeClass("disabled");
                 
             me.rightTable.msgBox();
           }
       });
       
       this.$all = $("#"+this.id+"_all_perm");
       if (this.apiSet)
       this.leftTable.on("rowadded",function(index,model) {
           var select = $(this.leftTable.$dt.row(index).node()).find(".permissionsSelect");
           
            this.loadPermissionSelect(select);
            
       },this);
       
       this.loadPermissionSelect(this.$all);
       
    },
    isAll: function() {
        return $("#"+this.id+"_all").get(0).checked;
    },
    loadPermissionSelect: function(select) {
        if (!this.apiSet) return;
        select.empty();
        this.apiSet.__names__.forEach(function(val) {
            
            var set = new App.Model.APISet({key:val,value:this.apiSet[val]});
            $(set.toOptionElement()).appendTo(select);
        },this);
        
    },
    
});


