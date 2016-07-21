Ext.ns("App.Model");

/**
 * Abstract data model class
 * 
 * @class Abstract
 * @memberOf App#Model
 * @namespace App.Model
 */
App.Model.Abstract = Ext.extend(App.AbstractClass,{
            constructor: function(modelObj) {
                App.Model.Abstract.superclass.constructor.apply(this,arguments);
                if (this.$fields == null) throw Error("This is an abstract class. Do not direct instance.")
                
                this.addEvents(
                            'updated',
                            'inserted',
                             'removed',
                            'tableadded',
                            'tableupdated',
                            'tableremoved'
                        );
                Ext.apply(this,modelObj);
                
            },
            toRowModelArray: function() {
                
                var me= this;
                
                if (!$.isArray(this.$fields)) throw Error("$fields array should be overridden in child class");
                
                return this.$fields.map(function(f) {
                        
                       return $.isFunction(me[f]) ? me[f].call(this):me[f];
                });
            },
            toOptionElement: function() {
                var opt = document.createElement("option");
            
                opt.text = this.name;
                opt.value = this.id;
                
                opt.setAttribute("id",this.id);
                opt.setAttribute("name",this.id);
                
                if (this.enabled === 0)
                    opt.setAttribute("disabled",true); 
                
                return opt;
            },
            toLookupList: function(items,modelType,modelClass) {
             var list = "", 
                me= this;
                
                
            
            if (!Array.isArray(items)) return "[NOT SET]";
            
            
            if (items.length==0) return "[NONE]";
            var models = $.isNumeric(items[0])?items.toModelArray(modelType,modelClass):items;
            
          
            if (firstItem = models.shift())
            {
                list=firstItem.name;
            } else {
                list="[HIDDEN]";
            } 
            
            var listNames = models.map(function(model) {
                return  model.name || "[HIDDEN]";
                    
            });
          var tpl= new Ext.Template(App.Widget.getTemplate("table_popup_list")); tpl.compile();
          
         if (items.length>1) list+='&nbsp;&nbsp;'+tpl.apply({content: listNames.join(",\r\n")});
            
            return list;
        },
        hasPermission: function(perm) {
            if (!this.permissions) return true;
           /* console.info("mascara:");
            console.info(this.permissions);
            console.info("permisso:");
            console.info(perm);*/
            return (this.permissions & (1 << perm)) !== 0;
        },
        toString: function() {
            return this.id;
        },
        destroy: function() {
            console.info("[App.Model] Model id:"+this.id+" destroyed");
            delete this;
        }
        
            
});

App.Model.isModel = function(model) {
    return typeof model == "object" && model.isExtendedFrom(App.Model.Abstract);
}
