Ext.ns("App.Model.EditableProperty");
/**
 * 
 * 
 * @class App.Model.EditableProperty.Boolean
 * @extends App.Model.EditableProperty
 * @namespace App.Model.EditableProperty
 */
App.Model.EditableProperty.Boolean = {
   $className: "Boolean", 
   constructor: function() {
       App.Model.EditableProperty.Boolean.superclass.constructor.apply(this,arguments);
       
   },
    
}
App.Model.EditableProperty.Boolean = Ext.extend(/* @parentClass*/App.Model.EditableProperty,
                                             /* @class */App.Model.EditableProperty.Boolean);