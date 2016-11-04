Ext.ns("App.Widget");

/**
 * Clase generica para un combo-selector inteligente.
 * 
 * @class Selectbox
 * @extends App.Widget
 * @namespace App.Widget
 * @requires Chosen v>=1.4.2
 */
App.Widget.SelectBox = Ext.extend(App.Widget,{
    cssClass: "widget selectbox",
    constructor: function SelectBox(config) {
        
        Ext.applyIf(config, {
            template: "SelectBox",
            search_contains: true,
            include_group_label_in_selected : true,
            inherit_select_classes: true,
            multiple: true,
            posClass: "col-sm-2" 
        });
        
        
        this.mult = config.multiple ? "multiple" : ""; 
        
        
        App.Widget.SelectBox.superclass.constructor.apply(this,arguments);
        
        this.selectId= this.id+"_select";
        this.$chosen = $("#"+this.selectId).chosen(config);
        this.$select = this.$chosen.filter("select:first-child")[0];
        
        
        
        
        if ($.isFunction(config.modelClass) && config.modelClass.superclass.constructor == App.Model.Abstract)
            this.modelClass = config.modelClass;
        else 
            throw new TypeError("[App.Widget.SelectBox]: modelClass undefined or not implement App.Model.Abstract");
        
       this.options = []; 
       
       
       this.addEvents(
               'loaded',
               /**
                * 
                * @event Fires when chosen is rendered.
                */
               'ready',
               /**
                * @event Fires when select box adds an option
                */
               'optionadded',
               /**
                * @event Fires when option name changes
                */
               'optionchanged',
               /**
                * @event Fires when option is goin to be removed
                */
               'optionremoved'
       );
       var me=this;
       
       this.$chosen.on("chosen:ready",function() {
           me.fireEvent("ready");
       });
      
      this.$chosen.on("change",function(e,changes) {
         
          
         me.fireEvent("change",changes);
      });
      
            
           this.$chosen.on("chosen:ready",function() {
               if (me.disabled)
                    me.disable();
           });
       
    },
    setLoadingMask: function() {
        if (arguments.length==0)
        {
           $("#"+this.id+" .chosen-container")
                    
                   .attr("class","chosen-container progress-bar progress-bar-success progress-bar-striped active").children("a")
                   .children("span").text("Loading");
            
        } else {
           $("#"+this.id+" .chosen-container").attr("class","chosen-container chosen-container-single"); 
           this._syncChosen();
        }
    },
    val: function(v) {
        console.debug(v);
       if (v) {
           $("#"+this.selectId).val(v);
           this._syncChosen();
       } else
      return $("#"+this.selectId).val();
    },
    disable: function()
    {
        $("#"+this.id+" *").attr("disabled","disabled").addClass("disabled").prop("disabled",true);
        this._syncChosen();
    },
    enable: function()
    {
        $("#"+this.id+" *").removeAttr("disabled").removeClass("disabled").prop("disabled",false);
        this._syncChosen();
    },
    clear: function() {
        if (Array.isArray(this.options)) delete this.options;
        this.options = [];
        $(this.$select).empty();
        
        if (this.emptyOption)
        {
            $("<option>")
                   .attr("name","empty")
                   .attr("id","empty")
                   .attr("value","empty")
                   .attr("disabled","disabled")
                   .attr("selected","selected")
                   .text(this.emptyOption)
                   .appendTo($(this.$select));
        }
        this._syncChosen();
        
        return this;
    }
    ,
    load: function(optList) {
        if (!Array.isArray(optList)) 
                throw new TypeError("[SelectBox::load()] optList is not an Array. ("+optList+")");
            
        
        this.clear();
        
        optList.forEach(function(opt) {
            this.addOption(opt);
        },this);
            
        
        //this._syncChosen();
        
        this.fireEvent("loaded",this.options.length);
      //  window.setInterval(function() {me._syncChosen();},1000);
        
        return this;
    },
    addOption: function(modelObj) {
        var model = !modelObj.isExtendedFrom(App.Model.Abstract) ? new this.modelClass(modelObj):modelObj;
        this.$select.add(model.toOptionElement());
        
        this.options.push(model);
        
        this.fireEvent("optionadded",model);
        
        this._syncChosen();
        return this;
        
    },
    deleteOption: function(index) {
        
        this.options.remove(this.options[index]);
        this.$select.remove(index);
        this._syncChosen();
        
        return this;
    },
    deleteModel:function(model) {
        this.deleteOption(this.getIndexByModelId(model));
        return this;
    },
    getIndexByModelId: function(model) {
        var id= $.isPlainObject(model) ? model.id : model;
        
        var opt=this.$select.namedItem(id);//this.options.findIndex(function(opt) {return opt.id === id;});
        
        return Array.from(this.$select.options).indexOf(opt);
    }
    ,
    updateOption: function(modelObj)
    {
        var model =new this.modelClass(modelObj);
        var index = this.getIndexByModelId(model);
        
        this.options[index]=model;
        
        this.$select.options[index] = model.toOptionElement();
        
        this._syncChosen();
        
    }
    ,
    _syncChosen: function() {
        this.$chosen.trigger("chosen:updated");
    },
    syncListWith: function(selBox) {
        var me= this;
        if (selBox.constructor.superclass.constructor !== App.Widget.SelectBox) 
                throw new Error("[SelectBox::syncWithList()]: selBox is not a valid App.Widget.SelectBox instance");
        
        selBox.$chosen.on("change",function(e,chx) {
            if (Ext.isString(chx.deselected))
            {
               // console.info("Deselected: "+chx.deselected);
                /*var model = selBox.options.find(function(o) {return o.id == chx.deselected;});
                me.addOption(model);*/
               me.$select.namedItem(chx.deselected).removeAttribute("disabled");
            }
            
            if (Ext.isString(chx.selected))
            {
               // console.info("Selected: "+chx.selected);
                /*var model = selBox.options.find(function(o) {return o.id == chx.selected;});
                me.deleteModel(model);*/
                me.$select.namedItem(chx.selected).setAttribute("disabled","disabled");
            }
            me._syncChosen();
        });
        
    },
    getSelectedModel: function() {
        return this.options.find(function(opt) {
            return opt.id == this.val();
        },this)
    }
    
    
    
    
});
