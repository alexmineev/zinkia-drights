Ext.ns("App.Model.EditableProperty");
/**
 * 
 * 
 * @class App.Model.EditableProperty.String
 * @extends App.Model.EditableProperty
 * @namespace App.Model.EditableProperty
 */
App.Model.EditableProperty.String = {
   $className: "String", 
   constructor: function String(property) {
       
       
       App.Model.EditableProperty.String.superclass.constructor.apply(this,arguments);       
       
       if (this.multiline == "1")    
        this.$className += "_multiline";
       
       
   },
   validate: function() {
       
       
       if (this.getValue().length==0) {
           this.showError("Please enter a value o press Edit button to disable this option (if not required)");
           return false;
       }
       
       if (this.pattern)
       {
           var r= new RegExp(this.pattern);
           if (!r.test(this.getValue()))
           {
               this.showError("Value should match the pattern: "+this.pattern);
               return false;
           }
       }
       if (this.regex=="1")
       {
           try {
              
               new RegExp(this.getValue());
               
               
           } catch(e) {
               
               this.showError("Value is not a valid regular expression");
               return false;
           }
       }

       
       
       return true; 
   }
   
    
}
App.Model.EditableProperty.String = Ext.extend(/*@parentClass*/App.Model.EditableProperty,
                                              /*@class*/ App.Model.EditableProperty.String);