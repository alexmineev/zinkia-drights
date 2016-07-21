Ext.ns("App.Model.EditableProperty");
/**
 * 
 * 
 * @class App.Model.EditableProperty.Integer
 * @extends App.Model.EditableProperty
 * @namespace App.Model.EditableProperty
 */
App.Model.EditableProperty.Integer = {
   $className: "Number", 
   constructor: function Integer() {
       App.Model.EditableProperty.Integer.superclass.constructor.apply(this,arguments);
       
   },
   validate: function() {
       var res= true;
       if (this.min && parseInt(this.$input.val())<this.min) {
           res=false;
           this.showError("Value must be equal o greeter than "+this.min);
       }
       
       if (this.max && parseInt(this.$input.val())>this.max) {
           res=false;
           this.showError("Value must be equal o less than "+this.max);
       }
       return res;
   } 
}
App.Model.EditableProperty.Integer = Ext.extend(/*@parentClass*/App.Model.EditableProperty,
                                              /*@class*/ App.Model.EditableProperty.Integer);