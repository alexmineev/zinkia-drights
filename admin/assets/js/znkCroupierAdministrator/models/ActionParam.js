/**
 * 
 * @class ActionParam
 */
App.Model.ActionParam = {
    $fields: [],
    
    constructor: function ActionParam(param) {
        
        
      App.Model.ActionParam.superclass.constructor.apply(this,arguments);  
      
      this.id = this.method.replace("$","_")+"_"+this.name.replace(" ","_")+this.order;
      
    },
    _getUI: function() {
        //return App.Widget.renderTemplate("propertyUI",{label:this.name,description:this.description});
        return this.name+" ("+this.description+")";
    },
    getValue: function() {
      switch (this.type) {
          case "boolean":
              return $("#"+this.id).prop("checked").toString();
          break;
          case "string":
          case "number":
                return $("#"+this.id).val();
          break;      
          default:      
              return JSON.stringify($("#"+this.id+"_select").val());
          break;
      }  
      
    },
    setValue: function(value) {
        switch (this.type) {
          case "boolean":
              $("#"+this.id).prop("checked",value);
          break;
          case "string":
          case "number":
                $("#"+this.id).val(value);
          break;      
          default:      
              if (!Array.isArray(value)) eval("value="+value);
              this.selBox.val(value);
          break;
      }  
    }
    ,
    toRowModelArray: function() {
        return ["",this._getUI(),this.getEditableParam()];
    },
    getEditableParam: function() {
        switch (this.type) {
            case "boolean" : 
                var inp = $("<input>")
                        .attr("type","checkbox")
                        .attr("id",this.id);
                if (this.value === true) inp.attr("checked","checked");
                return inp.get(0).outerHTML;
            break;
            case "string":
                var inp=$("<input>")
                        .attr("type","text")
                        .attr("id",this.id);
                if (this.value && this.value.length>0) inp.attr("value",this.value);
                return inp.get(0).outerHTML;
            break;
            case "number":
                var inp=$("<input>")
                        .attr("type","number")
                        .attr("id",this.id);
                if (this.value && this.value.length>0) inp.attr("value",this.value);
                return inp.get(0).outerHTML;
            break;
            case "nodes":
            case "pools":    
                return $("<div>").attr("id",this.id+"_container").get(0).outerHTML;
            break;
        }
    }
  
    
    
};
App.Model.ActionParam = Ext.extend(App.Model.Abstract,App.Model.ActionParam);