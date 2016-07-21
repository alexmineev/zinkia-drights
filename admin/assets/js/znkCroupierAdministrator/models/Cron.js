Ext.ns("App.Model");
/**
 * Modelo de un cron
 * 
 * @class App.Model.Cron
 * @extends App.Model
 * @namespace App.Model
 */
App.Model.Cron = {
   $fields: [],
    WEEKDAYS: ["Monday","Thusday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    MONTH:["January","Febrary","March","April","May","June","July","August","September","October","November","December"],
   constructor: function Cron() {
       
       
       
       App.Model.Cron.superclass.constructor.apply(this,arguments);
       
       this.$preset = this.preset;
       this.preset = App.API.Presets.getPreset(this.preset);
       
       this.enabled = this.enabled || true;
       this.timezone = this.getCurrentTimeZone();
       
   },
   getMonth: function() {
       if (this.month=="*") return "ANY";
        
        return this.month.split(",").map(function(dw) {
            return this.MONTH[parseInt(dw)];
        },this);
   },
   getDayWeek: function() {
        if (this.dayOfWeek=="*") return "ANY";
        
        return this.dayOfWeek.split(",").map(function(dw) {
            return this.WEEKDAYS[parseInt(dw)];
        },this);
        
        
        
        
   },
    getDataLink: function() {
        return $("<a>")
                .attr("data-cronid",this.id)
                .attr("href","#")
                .text(this.name)
                .get(0).outerHTML;
    }
   ,
   toRowModelArray: function(rowType) {
       return ["",rowType!="nodatalink"?this.getDataLink():this.name,this.minute,this.hour,this.day,this.getDayWeek(this.dayOfWeek),this.getMonth(this.month),this.year,this.preset.name];
   },
   insert: function() {
    
       var me=this;
       croupier.api.cron$add(this.name,this.description||"",this.hour,this.minute,this.day,this.month,this.year,this.dayOfWeek,this.getCurrentTimeZone(),this.preset.id,this.enabled,function(res) {
         if (res.status==croupier.ResponseStatus.SUCCESS) {
             me.fireEvent("inserted",res);
         }
       } );
       
   },
   getCurrentTimeZone: function() {
       var offset = new Date().getTimezoneOffset()*-1, //converting offset in real UTC timezone
           hours =  (offset/60),
           hoursStr = Math.abs(hours).toString().length==1? "0"+Math.abs(hours):Math.abs(hours).toString(),
           symbol = hours>0? "+":"-";
          
          
       return hours!=0 ? symbol+hoursStr+":00": "00:00";
       
   },
   update: function() {
       var me=this;
       
       croupier.api.cron$set(this.id,this.name,this.description||"",this.hour,this.minute,this.day,this.month,this.year,this.dayOfWeek,this.getCurrentTimeZone(),this.preset.id,this.enabled,function(res) {
         if (res.status==croupier.ResponseStatus.SUCCESS) {
             me.fireEvent("updated",res);
         }
       } );
       
   }
   
   
    
}
App.Model.Cron = Ext.extend(/*@parentClass*/App.Model.Abstract,
                                              /*@class*/ App.Model.Cron);


