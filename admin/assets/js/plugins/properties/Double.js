Ext.ns("App.Model.EditableProperty");
/**
 * 
 * 
 * @class App.Model.EditableProperty.Double
 * @extends App.Model.EditableProperty
 * @namespace App.Model.EditableProperty
 */
App.Model.EditableProperty.Double = {
   $className: "Number", 
   constructor: function() {
       App.Model.EditableProperty.Double.superclass.constructor.apply(this,arguments);
       
   },
   
   validate: function() {
       var res= true;
       if (this.min && this.$input.val()<this.min) {
           res=false;
           this.showError("Value must be equal o greeter than "+this.min);
       }
       
       if (this.max && this.$input.val()>this.max) {
           res=false;
           this.showError("Value must be equal o less than "+this.max);
       }
       return res;
   }  
}
App.Model.EditableProperty.Double = Ext.extend(/*@parentClass*/App.Model.EditableProperty,
                                              /*@class*/ App.Model.EditableProperty.Double);