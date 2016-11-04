/**
 * Layout model class
 * 
 * @class App.Model.Layout
 * @extends App.Model.Abstract
 */
App.Model.Layout = {
    $fields: [],
    constructor: function(layout) {
      layout.id = layout.name;  
        
      App.Model.Layout.superclass.constructor.call(this,layout);
      
      
    },
    toString: function() {
        return JSON.stringify(this);
    },
    toRowModelArray: function() {
        return [
            "",
            this.getDataLink(),
            this.description,
            this.getDefaultBox()
        ];
    },
    getDataLink: function() {
        return $("<a>")
                .attr("href","#")
                .attr("data-layoutid",this.id)
                .text(this.name)
                .get(0).outerHTML;
    }
    ,
    getDefaultBox: function() {
        var radio= $("<input>")
                    .attr("type","radio")
                    .attr("name","layouts_default")
                    .attr("value",this.id)
                    .attr("id",this.id+"_radioDefault");
                    
            
           if (this.defaultLayout) {
               console.debug(this.id);
               radio.attr("checked","checked"); radio.prop("checked",true);
           }
           
         return radio.get(0).outerHTML;  
                    
    },
    saveState: function() {
        var me=this;
        var tabs = [];
        $("#tabs li > a > span:not(.glyphicon)").each(function(i,el) {
            var panel = $(el).data();
                    var config ={
                        panelClass:panel.$class, 
                        name:$(el).text(),
                        active: $(el).parent("a").parent("li").hasClass("active"),
                        tables: {}    
                     };
                     
                 panel.tables.forEach(function(table) {
                      config.tables[table.id]=table.getTableConfig(); 
                 },this)     
                     
                     
          tabs.push(config);           
                     
        });
        
        this.config = {
            tabs: tabs
        } 
        console.debug(this.config.tabs);
    }
    
};

App.Model.Layout = Ext.extend(App.Model.Abstract,App.Model.Layout);


