Ext.ns("App.Model.EditableProperty");
/**
 * 
 * 
 * @class App.Model.EditableProperty.ArrayInteger
 * @extends App.Model.EditableProperty
 * @namespace App.Model.EditableProperty
 */
App.Model.EditableProperty.ArrayInteger = {
   $className: "String", 
   constructor: function() {
       
       
       
       App.Model.EditableProperty.ArrayInteger.superclass.constructor.apply(this,arguments);
       
   },
    
}
App.Model.EditableProperty.ArrayInteger = Ext.extend(/*@parentClass*/App.Model.EditableProperty.Array,
                                              /*@class*/ App.Model.EditableProperty.ArrayInteger);