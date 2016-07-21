Ext.ns("App.Model.EditableProperty");
/**
 * 
 * 
 * @class App.Model.EditableProperty.Array
 * @extends App.Model.EditableProperty
 * @namespace App.Model.EditableProperty
 */
App.Model.EditableProperty.Array = {
   $className:"Array",
   
   inputType:"text", //default input type
   constructor: function Array(prop) {
       
       
       
       
     //  prop.values = ["deftest","deftest2","deftest3","test3","test4","test5"];
       
        //debug
       
       
       App.Model.EditableProperty.Array.superclass.constructor.apply(this,arguments);
       

   },
   setValue: function(value) {
       this._loadValuesList(value,true);
   }
   ,
   initPropertyView: function() {
        var me=this;
        var opts = {
                            placeholder_text_multiple:this.restrict=="1"?"Select value to add from the dropdown list":"Type a value, than press ENTER to add it.",
                            no_results_text: "<font color='red'>Incorrect value</font>",
                            max_selected_options: this.maxSize || Infinity,        
                            //search_contains: true,
                            include_group_lwabel_in_selected : true,
                            inherit_select_classes: true,
                            multiple: true,
                            width:"250px"
                        };
        this.$widget =  
                      this.restrict!="1" ? this.$input.editableChosen(opts): 
                                           this.$input.chosen(opts);
              
           var id =me.$input.attr("id")+"_chosen";
           
           if (Array.isArray(this.value))   //predefined values 
            this._loadValuesList(this.value,true);
           
        if (Array.isArray(this.values)) { //validator values list
                this._loadValuesList(this.values,false);
                
                function _resetList() {
                    $("#"+id+" li.result-selected")
                             .removeClass("result-selected")
                             .addClass("active-result").each(function(el) {
                                   $(el).attr("data-option-array-index",Math.round(Math.random()*10000000));
                             })
                }
                
                this.$widget.on("chosen:showing_dropdown",_resetList);
                
                $("#"+id+" input").on("keydown",/*HACK*/function() {_resetList.defer(50);_resetList.defer(100);_resetList.defer(300);_resetList.defer(500);_resetList.defer(1000);_resetList.defer(2000);});
                
                
               
         }
        
        
         if (this.restrict !== "1")
            this.$widget.on("chosen:no_results",function() {
                me.$widget.trigger("chosen:close");
            });
       
       $("#"+id+" input").keydown(function(e) {
         if (me.restrict == "1") return;  
           if (e.keyCode == 13 && $(this).val().length>0) //ENTER
           {
               
               if (me.maxSize && me.$input.val()!=null && me.$input.val().length>=me.maxSize)
               {
                   me.showError("This value list can contain maximum "+me.maxSize+" elements");
                   return;
               }
               
               
               me._loadValuesList([$(this).val()],true);
               this.value="";
               
               me.$widget.trigger("chosen:updated");
               
               e.preventDefault();
               e.stopImmediatePropagation();
               return false;
           } else if (e.keyCode == 8 && $(this).val().length == 0) { //backstroke
               if (me.$input.options.length>0)
               {
                   me.$input.remove(me.$input.options.length-1);
                   me.$widget.trigger("chosen:updated");
               }    
           }
       });
       
       $("#"+id+" input").on("focus",function() {
           me.$div.popover("destroy");
       })
       
       
   }, 
   _loadValuesList:function(list,selected) {
       
       list.forEach(function(v) {
           var opt=$("<option>")
               .attr("value",v)
               .attr("name",v)
               .attr("id",v);
               
               if (selected) opt.attr("selected","selected");
               opt.text(v).appendTo(this.$input);
           
       },this);
       
    this.$widget.trigger("chosen:updated");     
   },
   
   validate: function() {
       
       if ((this.minSize && Array.isArray(this.$input.val()) && this.$input.val().length<this.minSize) || (this.minSize && this.$input.val() == null))
       {
           this.showError("This value list must contain minimum "+this.minSize+" elements");
           return false;
       }
       
       return true;
   }
    
}
App.Model.EditableProperty.Array = Ext.extend(/*@parentClass*/App.Model.EditableProperty,
                                              /*@class*/ App.Model.EditableProperty.Array);