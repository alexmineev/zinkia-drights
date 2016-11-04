Ext.ns("App.Model.EditableProperty");
/**
 * 
 * 
 * @class App.Model.EditableProperty.URI
 * @extends App.Model.EditableProperty
 * @namespace App.Model.EditableProperty
 */
App.Model.EditableProperty.URI = {
   $className: "String", //use the same template as String type.
   constructor: function URI() {
       
       
       
       App.Model.EditableProperty.URI.superclass.constructor.apply(this,arguments);
       
   },
   
   validate: function() {
       try {
        new URL(this.getValue());
        
        return true;
      } catch(e) {
          
          this.showError("This option must be a valid URI");
          return false;
      }  
   }
    
}
App.Model.EditableProperty.URI = Ext.extend(/*@parentClass*/App.Model.EditableProperty,
                                              /*@class*/ App.Model.EditableProperty.URI);
