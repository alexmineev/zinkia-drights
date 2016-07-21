Ext.ns("App.Model");
/**
 * Modelo de un preset
 * 
 * @class App.Model.Preset
 * @extends App.Model
 * @namespace App.Model
 */
App.Model.Preset = {
   $fields: [],
   constructor: function Preset() {
       
       
       App.Model.Preset.superclass.constructor.apply(this,arguments);
       
       this.addEvents("executed");
       //this.actions = this.getActions();
       
   },
   toRowModelArray: function() {
       return ["",this.getDataLink(),this.description,this.getCronTabBox()];
   },
   getDataLink: function() {
       return this.hasPermission(croupier.PresetPermission.set)? $("<a>")
               .attr("href","#")
               .attr("data-presetid",this.id)
               .text(this.name)
               .get(0).outerHTML : this.name;
   }
   ,
   getCronTabBox: function() {
      return this.toLookupList(this.getCrons(),"crons",App.Model.Cron);
   },
   getCrons: function() {
       return App.API.Crons.getCrons().filter(function(cron) {
            return cron.preset == this.id;
       },this);
       
   },
   execute: function() {
       var me=this;
       croupier.api.preset$execute(this.id,function(r) {
           if (r.status == croupier.ResponseStatus.SUCCESS) 
                me.fireEvent("executed");
       });
   },
   setActions: function(actions) {
       this.actions =  actions.map(function(action) {
           var actObj = {};
           actObj.method = action.method;
           actObj.parameters = action.getMappedParameters();
           return actObj;
       });
   }
   ,
   getActions: function() {
       var i=0;
       return this.actions.map(function(act) {
           var o = new App.Model.Action(act);
           o.order =i;
           i++;
           return o;
       },this);
   },
   insert: function() {
       var me=this;
       croupier.api.preset$add(this.name,this.description,this.actions,function(r) {
            if (r.status == croupier.ResponseStatus.SUCCESS) 
                me.fireEvent("inserted",r.value);
       });
   },
   update: function() {
       var me=this;
       croupier.api.preset$set(this.id,this.name,this.description,this.actions,function(r) {
            if (r.status == croupier.ResponseStatus.SUCCESS) 
                me.fireEvent("updated");
       });
   }
   
   
    
}
App.Model.Preset = Ext.extend(/*@parentClass*/App.Model.Abstract,
                                              /*@class*/ App.Model.Preset);


