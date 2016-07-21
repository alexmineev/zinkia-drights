Ext.ns("App.Widget");

/** 
 * Tabla de configuracion de propiedades de plugin.
 * 
 * @class PropertiesTable
 * @extends App.Widget.Table
 * @memberOf App#Widget
 * @namespace App.Widget 
 */
App.Widget.PropertiesTable = Ext.extend(App.Widget.Table,{
    cssClass:"widget datatable propertiesTable",
    constructor: function(config) {
        //Ext.applyIf(config,App.Widget.Table.Selectable); //Make Table checkbox-selectable
        
        Ext.applyIf(config, {
            rowClass: App.Model.EditableProperty,
            dom: "lftpr",
            columnDefs: [
            
                    {
                        orderable: false,
                        className: 'prop-select',
                        targets:  0,
                        
                    },
                    {
                        targets:1,
                        className:"prop-name",
                        orderable:true,
                    },
                    {
                        targets:2,
                        className:"prop-value",
                        orderable:false,
                    },
                    {
                        visible: false,
                        targets:3
                    }
                    
            ],
            select: {
                    style:    'multi',
                    selector: 'td:first-child > div'
            },
            orderMulti:true,
            order: [[1,'desc'],[0,'asc']],
            scrollY:        900,
            scrollCollapse: true,
            paging:         false,
            
            /*drawCallback: function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;
 
            api.column(3, {page:'current'} ).data().each( function ( group, i ) {
                if (group=="default") return;
                
                if ( last !== group ) {
                    
                    $(rows).eq( i ).before(
                        //App.Widget.renderTemplate('propertyGroup',{id:group+"_id",name:group})
                    );
            
                    
 
                    last = group;
                }
                
                
            } );
            
           
        }*/
            
           
        });
        
        
        
        App.Widget.PropertiesTable.superclass.constructor.call(this,config);
        
        var me=this;
        
        this.on("rowselected",function(property) {
            console.info("selected:"+property.name);
            property.selected = true;
            
            if (property.$className=="Group") //DataTables header bugfix
                property.propTable.adjust();
            
        },this);
        
        this.on("rowunselected",function(property) {
            console.info("unselected:"+property.name);
            if (property.required==1) {
                App.errorMsg("Plugin properties","Property "+property.name+" is required.");
                return false;
            } else {
                property.selected = false;
                return true;
            }
        },this);
        
        this.on("rowadded",function(index,model) {
            if (model.required=="1") {
                this.$dt.rows(index).select();
                model.selected = true;
            } 
            
            if (model.$className == "Group") {
                $(this.$dt.rows(index).nodes())
                        .children(".prop-name")
                        .attr("colspan","2");
            }
        },this);
        
        $("#"+this.id+"_checkall").parents("div").first().click(function() {
            
            me.$dt.rows("*")[$(this).children("label").hasClass("active")?"select":"deselect"]();
            
        }
        );
       // this.setPageSize(0);
        var me= this;
        
        this.$dt.on("draw.dt",function() {
            me.initHeader();
            console.info("[propTable]: redraw");
        });
        
        
        
    },
    initHeader: function() {
         $(".ico-info").mouseenter(function() {
                $(this).popover('show');
            
         }).mouseleave(function() {
             $(this).popover('hide');
         });
       
       
    
    },
    
    addRow: function() {
        
            if (property = this.constructor.superclass.addRow.apply(this,arguments)) {
                property.initPropertyView();
            };
        
    },
    loadFromTypedProperties: function(props,group) {
            
        this.rows.forEach(function(prop) {
            
           if (prop.originalName.search("-") === -1) { //group
          
                        if (Object.keys(props).some(function(k) {
                            
                            return k.search(prop.originalName)===0;
                        })) {
                            console.debug("FOUND:"+prop.originalName);
                        
                        this.$dt.rows(this.getRowIndex(prop)).select();
                        prop.propTable.loadFromTypedProperties(props,group?group+"."+prop.originalName:prop.originalName);
                       } 
                   
               
           } else {
               
            if (value = props[prop.originalName]) {
                this.$dt.rows(this.getRowIndex(prop)).select();
                prop.setValue(value);
               
            }
          } 
        },this);
        
     
    },
    toTypedProperties: function() {
         var tp={};
         
         this.rows
                .forEach(function(prop) {
                                    
                       
                        
                        if (!prop.selected) return;
                     
                        console.info(prop);
                       if (prop.$className == "Group")
                       {
                            Ext.apply(tp,
                                        prop.getValue());
                       }
                       else {    
                               
                                tp[prop.originalName]=prop.getValue();
                       }
                });
                
               return tp; 
    },
    isValid: function() {
        return !this.rows
                    .filter(function(prop) {return prop.selected;})
                    .map(function(prop) {
                        res= prop.validate();
                        if (!res) {
                            var idx=this.getRowIndex(prop);
                            $(this.$dt.row(idx).node()).addClass("with-error");
                            
                            (function() {
                                $(this.$dt.row(idx).node()).removeClass("with-error");
                            }).defer(10000,this);
                            
                        }
                        console.info("["+prop.name+" validate()]: "+res);
                        return !res;
                    },this)
                    .some(function(p) {return p;});
    }
    
});

