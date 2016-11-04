/**
 * 
 * @class Cms
 */
App.Model.Cms = {
    $fields: ["id","name"],
    
    constructor: function Cms(cms) {
        
      
      App.Model.Cms.superclass.constructor.apply(this,arguments);  
      
      this.description = this.description || "";
      
    },
    getIcon: function(height) {
        return $("<img>").attr("src","data:image/png;base64,"+this.icon)//.css("background-image","url(data:image/png;base64,"+this.icon+")")
                         .attr("height",height+"px")
                         .get(0).outerHTML;
    },
    
    /*toRowModelArray: function() {
        //throw this.name;
        return ["",this.getIcon(40),this.name,this.description,(this.vendor && this.vendor.name) || "[NOT SET]",this.configurations.length];
    },*/
    
    
    
};
App.Model.Cms = Ext.extend(App.Model.Abstract,App.Model.Cms);
