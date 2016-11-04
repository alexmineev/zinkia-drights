/**
 * 
 * @class Lang
 */
App.Model.Lang = {
    $fields: ["code","name"],
    
    constructor: function Lang(lang) {
        
      
      App.Model.Lang.superclass.constructor.apply(this,arguments);  
      
      //this.description = this.description || "";
      this.id = this.code;
      this.description = this.name;
      
    },
    toOptionElement: function() {
         var opt = document.createElement("option");
            
                opt.text = this.name;
                opt.value = this.name;
                
                opt.setAttribute("id",this.name);
                opt.setAttribute("title",this.name);
                
                               
                return opt;
    }
  
    
    
};
App.Model.Lang = Ext.extend(App.Model.Abstract,App.Model.Lang);
