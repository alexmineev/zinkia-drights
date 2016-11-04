Ext.ns("App.Model.EditableProperty");
/**
 * 
 * 
 * @class App.Model.EditableProperty.ArrayURI
 * @extends App.Model.EditableProperty
 * @namespace App.Model.EditableProperty
 */
App.Model.EditableProperty.ArrayURI = {
   //$className: "String", 
   valType:"URI",
   constructor: function ArrayURI() {
       
       
       
       App.Model.EditableProperty.ArrayURI.superclass.constructor.apply(this,arguments);
       
   },
    
}
App.Model.EditableProperty.ArrayURI = Ext.extend(/*@parentClass*/App.Model.EditableProperty.Array,
                                              /*@class*/ App.Model.EditableProperty.ArrayURI);