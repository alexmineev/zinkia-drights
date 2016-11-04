Ext.ns("App.Widget");

/**
 * Componente generico que implementa 2 tablas (ambas hijos del App.Widget.Table) y habilita la interacción entre ellas.
 * 
 * @class DuoTables
 * @extends Widget
 * @namespace App.Widget 
 */
App.Widget.DuoTables= Ext.extend(App.Widget,{
    constructor: function DuoTables(config) {
        
                
        Ext.apply(this,config);
        
        if(this.leftTable && this.rightTable && this.leftTable.config && this.rightTable.config)
        {
            this.leftTable.config.id=this.id+"_left";
            this.rightTable.config.id=this.id+"_right";
            console.warn(this.leftTable.config);
            this.leftTable= new this.leftTable.$class(Ext.applyIf(this.leftTable.config,{
               
                dom:"lcfrtip",
                animation:false,
                noSync: true
            }));
            
            
            this.rightTable = new this.rightTable.$class(Ext.applyIf(this.rightTable.config,{
                //id:this.id+"_right",
                dom:"lcfrtip",
                animation:false,
               
            }));
            
            
            this.leftTable.on("beforeaddrow",function(rowModel) {
                return this.rightTable.getRowIndex(rowModel) === -1; //true if rowModel not exists
                
            },this);
            this.rightTable.on("beforeaddrow",function(rowModel) {
                return this.leftTable.getRowIndex(rowModel) === -1; //true if rowModel not exists
            },this);
            
        }
        else {
            throw new Error("[DuoTables]: Config error");
        }
        
        var me =this;
        
        
        $("#"+this.id+"_left_trigger span").click(function() {me.leftTrigger()}); 
        
        $("#"+this.id+"_right_trigger span").click(function() {me.rightTrigger()});
        
        this.rightTable.on("rowdeleted",function() {
            this.$dt.draw();
            this.initHeader();
        },this.rightTable);
        
        this.leftTable.on("rowdeleted",function() {
            this.$dt.draw();
            this.initHeader();
        },this.leftTable);
        
        this.rightTable.on("rowadded",function() {
            this.$dt.draw();
            this.initHeader();
        },this.rightTable);
        
        this.leftTable.on("rowadded",function() {
            this.$dt.draw();
            this.initHeader();
        },this.leftTable);
        
     
    },
    leftTrigger: function() {
        
        
       // this.leftTable.msgBox("Moving...");
        var rows = this.rightTable.getSelectedRows();
        this.rightTable.$dt.rows(".selected").deselect();
        if (rows.length>0) {
            rows.forEach(function(row) {
                this.rightTable.deleteRowModel(row);
                this.leftTable.addRow(row);
                
            },this);  
            
        } else {
            console.info("[DuoTables::leftTrigger] No rows selected");
        }
        
        //this.leftTable.msgBox();
        
        this.leftTable.initHeader();
        this.rightTable.initHeader();
    },
    rightTrigger: function() {
       // this.rightTable.msgBox("Moving...");
        var rows = this.leftTable.getSelectedRows();
        this.leftTable.$dt.rows(".selected").deselect();
        if (rows.length>0) {
            rows.forEach(function(row) {
                this.leftTable.deleteRowModel(row);
                this.rightTable.addRow(row);
                
            },this);  
            
        } else {
            console.info("[DuoTables::rightTrigger] No rows selected");
        }
        //this.rightTable.msgBox();
        
        
    },
    refresh: function() {
        this.rightTable.adjust();
        this.leftTable.adjust();
    },
    getAssigned: function() {
        return this.leftTable.rows;
    }
    
    
    
});

