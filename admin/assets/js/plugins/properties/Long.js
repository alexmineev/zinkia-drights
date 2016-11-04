Ext.ns("App.Model.EditableProperty");
/**
 * 
 * 
 * @class App.Model.EditableProperty.Long
 * @extends App.Model.EditableProperty
 * @namespace App.Model.EditableProperty
 */
App.Model.EditableProperty.Long = {
   $className: "Number", 
   constructor: function Long() {
       App.Model.EditableProperty.Long.superclass.constructor.apply(this,arguments);
       
   }
   ,
   validate: function() {
       var res= true;
       if (this.min && parseFloat(this.$input.val())<this.min) {
           res=false;
           this.showError("Value must be equal o greeter than "+this.min);
       }
       
       if (this.max && parseFloat(this.$input.val())>this.max) {
           res=false;
           this.showError("Value must be equal o less than "+this.max);
       }
       return res;
   }  
}
App.Model.EditableProperty.Long = Ext.extend(/* @parentClass*/App.Model.EditableProperty,
                                             /* @class */App.Model.EditableProperty.Long);