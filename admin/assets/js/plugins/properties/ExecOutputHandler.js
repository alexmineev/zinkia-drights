Ext.ns("App.Model.EditableProperty");
/**
 * 
 * 
 * @class App.Model.EditableProperty.ExecOutputHandler
 * @extends App.Model.EditableProperty
 * @namespace App.Model.EditableProperty
 */
App.Model.EditableProperty.ExecOutputHandler = {
   $className: "EOH", 
   $fields: ["progress","path","encoding",
       "progressExclude","executed","executedExclude",
       "warning","warningExclude","error","errorExclude"],
   $inputs:{},
   constructor: function ExecOutputHandler() {
       
       
       App.Model.EditableProperty.ExecOutputHandler.superclass.constructor.apply(this,arguments);
      
       
   },
   getValue: function() {
       var ret= {};
       this.$fields.forEach(function(f) {
           if (this.getInput(f).val().length>0)
           ret[f] = this.getInput(f).val();
       },this);
       
       return ret;
   },
   
   getInput: function(field) {
       
        return $("#prop_"+this.id+"_"+field+"_input");
       
           
       
   },
   setValue: function(value) {
       this.$fields.forEach(function(f) {
               if (value[f]) {
                    this[f]=value[f];
                    this.getInput(f).val(value[f]);
                }
           
           
           },this);
   }
   ,
   initPropertyView: function() {
       
       if ($.isPlainObject(this.value)) {
          this.setValue(this.value);
       }
   },
   validate: function() {
       
       if (res= !this.$fields.some(function(f) {
           return this.getInput(f).val().length>0 && !RegExp.isRegExp(this.getInput(f).val());
       },this)) {
           this.showError("Any set value should be a regular expression");
       } 
       return res;    
       
   }
}
App.Model.EditableProperty.ExecOutputHandler = Ext.extend(/*@parentClass*/App.Model.EditableProperty,
                                                         /*@class*/App.Model.EditableProperty.ExecOutputHandler);
