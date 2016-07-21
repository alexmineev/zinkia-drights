/**
 * Abstract property model class
 * 
 * @abstract
 * @class EditableProperty
 * @extends App.Model
 */
App.Model.EditableProperty = {
    $fields: ["id","name"],
    $className: "EditableProperty",
    selected: false,
    
    constructor: function EditableProperty(property) {
        if(!property.id) throw new Error("[App.Model.EditableProperty] Malformed property: "+property);
      
        
      App.Model.EditableProperty.superclass.constructor.apply(this,arguments);  
      
      if (this.$className == "EditableProperty") 
                throw new Error("EditableProperty is an abstract class. No direct instances.");
      
      if (this.validator)
               Ext.apply(this,this.validator);
           
     
      if (Array.isArray(this.values)) {
          this.$className+="_values";
      }
      
      if (this.restrict == "1") {
          this.$className+="_restrict";
      }
      
      if (this.ui) Ext.applyIf(this,this.ui);
      
       if (!this.label) this.label = this.name;
       if (!this.description) this.nodesc="display:none";
       if (!this.ui) this.noui="display:none";
      
      this.__defineGetter__("$input",function() {return $(this.getInput());});
      this.__defineGetter__("$div",function() {return $("#prop_"+this.id);});
      
      
      var me=this;
      this.$input.on("change",function() {me.$input.popover("destroy")});
      
    },
    toRowModelArray: function() {
       
        
       return [this.required=="1" ? App.Widget.renderTemplate("propRequired",this):App.Widget.renderTemplate("checkButton",{label:"Edit"})
           ,this.ui ? App.Widget.renderTemplate("propertyUI",{label:this.ui.label||"",description:this.ui.description||"",nodesc:!this.description?"display:none":""}):"<b>"+this.name+"</b>",
           App.Widget.renderTemplate("property_"+this.$className,this),
           this.group||"default"];
       
    },
    getValue: function() {
      
        return this.$input.val();
        
    },
    setValue: function(value) {
        this.$input.val(value);
        if (this.$widget) this.$widget.trigger("chosen:updated"); 
    }
    ,
    showError: function(msg) {
        try {
            this.$div.popover("destroy");
        } catch(e) {
            
        }
        
        this.$div
            .attr("data-toggle","popover")
            .attr("data-placement","right")
            .attr("title","Invalid value")
            .attr("data-content",msg)
            .addClass("error")
            .popover({trigger:"manual"});
            
       this.$div.popover.defer(300,this.$div,["show"]);     
    }
    ,
    validate: function() {
        /**
         * @abstract
         */
       return true; 
    },
    initPropertyView: function() {
        if (Array.isArray(this.values)) //default values
        {
            this._buildValuesList();
            
            if (this.restrict=="1") //select
           {
            
            
             this.$widget =  
                      this.$input.chosen({
                        search_contains: true,
                        include_group_label_in_selected : true,
                        inherit_select_classes: true,
                        multiple: false,
                        width:"174px"
                        });
            
            this.$widget.trigger("chosen:updated"); 
            
            
            } else { // datalist (editable select)
            
               // console.warn(this.name);
            
            }
            
            
            
            
        }
        
        
    },
    _buildValuesList: function() {
        this.values.forEach(function(value) {
            var opt= $("<option>")
                      .attr("value",value)
                      .attr("id",value)
                      .attr("name",value)
                      .text(value);
              
            if (value==this.value) opt.attr("selected","selected");  
            
            if (Array.isArray(this.values) && !(this.restrict=="1"))
                $("#prop_"+this.id+"_list").append(opt);
            else
                this.$input.append(opt);
                
            
        },this);
        
    },
    getInput: function() {
        return document.getElementById("prop_"+this.id+"_input");
    }
    
    
};
App.Model.EditableProperty = Ext.extend(App.Model.Abstract,App.Model.EditableProperty);

App.Model.EditableProperty.isPropertyClass = function(prop) {
    return typeof prop === "function" && 
           typeof prop.superclass =="object" && 
           typeof prop.superclass.constructor == "function" && 
           (prop.superclass.constructor == App.Model.EditableProperty || prop.superclass.constructor == App.Model.EditableProperty.Array);
}