Ext.namespace("App");
$.extend(Ext.Element.prototype,App.AbstractClass.prototype); //HACK: double extension

/**
 * Abstract widget class
 * @class Widget
 * @extends Ext.Element
 * @namespace App
 * @memberOf App
 * @param {Object} config
 * @returns {App.Widget}
 */
App.Widget ={
    cssClass: "widget",
    /**
     * @constructor
     * @param {type} config
     * @returns {void}
     */
    constructor:  function Widget(config) {
        
            
            if (!config.id) {throw Error("No ID provided at config");return;}
            
            Ext.apply(this,config);            
            
            this.trans = false;
            
            
            this.tpl = config.template ? new Ext.Template(App.Widget.getTemplate(config.template)) : null;
            
            this.config = config;
            this.id = config.id;
            
            this.__defineGetter__("$",function() {return $("#"+this.id);});
            
            this.listeners = config.listeners;
            
            App.Widget.superclass.constructor.call(this,config.id);
            
            
            
            if (config.template) //Template mode
                this.render();
            else { //Preloaded HTML mode
                //this.id = this.id+Math.round(Math.random()*100000);
            }
                
            /**
             * jQuery element object
             * @type jQuery
             */
            this.$jq = this.$;
            /**
             * @type Ext.Element
             * @description En teoria ya en si mismo ya tiene que ser Ext.Element ya que hereda del mismo
             * pero por alguna razon solo funciona el sistema de eventos de Ext.util.Observable
             * Apartir de ahora se usara el sistema de eventos de jQuery o DOM Nativo ya que es preferible para trabajar con componentes graficos.
             */
            this.$ext = Ext.get(this.id); 
            
            /**
             * @type HTMLElement
             */
            this.dom = Ext.getDom(this.id);
            
            this.setCSSClass(this.cssClass);
                   
            
     },
     setCSSClass: function(className) {
         this.$jq.addClass(className);
     },
     /**
      *  Start batch mode operation
      * @deprecated TODO: Si necesario, cambiar a cola usando jQuery Defered
      * 
      * @returns {App.Widget}
      */
     begin: function() {
         this.trans = true;
         return this;
     },
     /**
      * @deprecated No se usa actualmente ()
      * @returns {undefined}
      */
     commit: function()
     {
         this.trans = false;
         this.render();
     },
    /**
     * Renders widget's DOM object
     * 
     * @returns {this}
     */
    render: function() {
        if (!this.tpl instanceof Ext.Template) return;
        
        
        this.html = this.tpl.compile()
                            .apply(this);
        
        
        
        if ($.isPlainObject(this.config.renderer) && $.isFunction(this.config.renderer.func))
                this.config.renderer.func.call(this.config.renderer.scope,html);
         else
         {
             this.container = $("#"+this.id+"_container"); 
             
             if (this.container.length==0) {
                 console.warn("[App.Widget] Widget container element: #"+this.id+"_container Not Found!");
                 $(document.body)
                              .append($("<div>")
                                .attr("id",this.id+"_container"));
             }
                 
             
             if (this.container.has(":first-child"))
                    this.container.empty();
             
             this.container[this.persistentContainer?"append":"replaceWith"]($(this.html));
             
             console.info("[App.Widget] Widget #"+this.id+" HTML template rendered");
             this.fireEvent("rendered",this.id);
             
         }
         
         return this;
        //this.repaint();
        
    },
    
    /**
     * @overriden
     * @see Ext.util.Observable
     * @param {String} eventName
     * @returns {Boolean}
     */
    fireEvent: function(eventName) {
        
        if (!(Array.isArray(this.disableEvents) && this.disableEvents.contains(eventName)))
                return Ext.util.Observable.prototype.fireEvent.apply(this,arguments);
        else
            return true;
    },
    destroy: function() {
        delete this;
    }/*
    ,
    on: function(eventName,handler,scope) {
        var handler = handler.bind(scope);
        
        this.$.on(eventName,handler);
        
    }*/
        
};

App.Widget = Ext.extend(Ext.util.Observable,App.Widget);

/**
 * Returns template's HTML
 * 
 * @static
 * @param {String} tplName
 * @returns {String}
 */
App.Widget.getTemplate = function(tplName) {
    var tpl = $("template[name='"+tplName+"']");
    
    if (tpl.length !== 1) 
        throw new Error("[App.Widget::getTemplate] Template "+tplName+" not found. Or duplicated template names.");
    else 
        return tpl.html();
    
};

/**
 * Returns HTML of template tplName compiled with data.
 * 
 * @static
 * @param {String} tplName
 * @param {Object} data
 * @returns {String}
 */
App.Widget.renderTemplate = function(tplName,data) {
    var tpl= new Ext.Template(this.getTemplate(tplName));
    return tpl.compile().apply(data);
    
};