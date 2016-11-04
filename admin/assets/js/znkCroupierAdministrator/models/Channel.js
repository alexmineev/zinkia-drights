/**
 * 
 * @class Channel
 */
App.Model.Channel = {
    $fields: ["id","name"],
    
    constructor: function Channel(channel) {
        
      
      App.Model.Channel.superclass.constructor.apply(this,arguments);  
      
      //this.description = this.description || "";
      
    },
    toOptionElement: function() {
         var opt = document.createElement("option");
            
                opt.text = this.name;
                opt.value = this.id;
                
                opt.setAttribute("id",this.id);
                opt.setAttribute("title",this.id);
                
                               
                return opt;
    }
    /*toRowModelArray: function() {
        //throw this.name;
        return ["",this.getIcon(40),this.name,this.description,(this.vendor && this.vendor.name) || "[NOT SET]",this.configurations.length];
    },*/
    
    
    
};
App.Model.Channel = Ext.extend(App.Model.Abstract,App.Model.Channel);
