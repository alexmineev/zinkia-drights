Ext.ns("App.Model.EditableProperty");
/**
 * 
 * 
 * @class App.Model.EditableProperty.Group
 * @extends App.Model.EditableProperty
 * @namespace App.Model.EditableProperty
 */
App.Model.EditableProperty.Group = {
   $className: "Group", 
   constructor: function(property) {
       
       
       App.Model.EditableProperty.Group.superclass.constructor.apply(this,arguments);
       
       
       
   },
   
   initPropertyView: function() {
       
       
       this.propData = new App.Model.PluginData({
           id:"prop_"+this.id+"_data",
           name:"group_"+this.id,
           properties:this.properties
       });
      // console.dir(this.propData);
       
       this.propTable = new App.Widget.PropertiesTable({
           id: "prop_"+this.id,
           dom:"t",
           cssClass: "widget datatable propertiesTable nested",
           nested: true,
       });
       
       this.propTable.group = this;
       this.propTable.on("rowadded", function(index,model) {
           model.originalName=this.originalName+"."+model.originalName; 
       },this);
       
       this.propTable.load(this.propData.getProperties());
       
   },
   toRowModelArray: function() {
           
       return [App.Widget.renderTemplate("checkButton",{_class:"editGroup",label:"<h4 class='modal-title'>Edit "+/*this.ui?App.Widget.renderTemplate("propertyUI",this.ui):*/this.name+"</h4>"}),
            App.Widget.renderTemplate("property_Group",this),
            "",this.name];
   },
   getValue: function() {
       return this.propTable.toTypedProperties();
       
       
   },
   validate: function() {
       return this.propTable.isValid();
   },
   setValue: function(val) {
       console.debug(val);
   }
    
}
App.Model.EditableProperty.Group = Ext.extend(/*@parentClass*/App.Model.EditableProperty,
                                              /*@class*/ App.Model.EditableProperty.Group);