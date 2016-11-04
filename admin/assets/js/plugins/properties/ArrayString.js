Ext.ns("App.Model.EditableProperty");
/**
 * 
 * 
 * @class App.Model.EditableProperty.ArrayString
 * @extends App.Model.EditableProperty
 * @namespace App.Model.EditableProperty
 */
App.Model.EditableProperty.ArrayString = {
   //$className: "ArrayString", 
   constructor: function ArrayString() {
       
       
       
       App.Model.EditableProperty.ArrayString.superclass.constructor.apply(this,arguments);
       
   },
    
}
App.Model.EditableProperty.ArrayString = Ext.extend(/*@parentClass*/App.Model.EditableProperty.Array,
                                              /*@class*/ App.Model.EditableProperty.ArrayString);