Ext.ns("App.Model.EditableProperty");
/**
 * 
 * 
 * @class App.Model.EditableProperty.Path
 * @extends App.Model.EditableProperty
 * @namespace App.Model.EditableProperty
 */
App.Model.EditableProperty.Path = {
   $className: "Path", 
   constructor: function Path() {
       
       
       
       App.Model.EditableProperty.Path.superclass.constructor.apply(this,arguments);
       
   },
   
   validate: function() {
       if (this.getValue().length==0) {
           this.showError("Please enter a value o press Edit button to disable this option (if not required)");
           return false;
       }
       
      return true; 
   }
    
}
App.Model.EditableProperty.Path = Ext.extend(/*@parentClass*/App.Model.EditableProperty,
                                              /*@class*/ App.Model.EditableProperty.Path);
