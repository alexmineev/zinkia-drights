Ext.ns("App.Model.EditableProperty");
/**
 * 
 * 
 * @class App.Model.EditableProperty.ArrayPath
 * @extends App.Model.EditableProperty
 * @namespace App.Model.EditableProperty
 */
App.Model.EditableProperty.ArrayPath = {
   //$className: "String",
   valType: "Path",
   constructor: function ArrayPath() {
       
       
       
       App.Model.EditableProperty.ArrayPath.superclass.constructor.apply(this,arguments);
       
   },
    
}
App.Model.EditableProperty.ArrayPath = Ext.extend(/*@parentClass*/App.Model.EditableProperty.Array,
                                              /*@class*/ App.Model.EditableProperty.ArrayPath);