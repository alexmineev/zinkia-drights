Ext.ns("App.Model");

/**
 * Video data model class
 * 
 * @class Video
 * @memberOf App#Model
 * @namespace App.Model
 */
App.Model.Video = {
    $fields:[],
    constructor: function(video) {
        App.Model.Video.superclass.constructor.apply(this,arguments);
    },
    getThumb: function() {
        return '<a href="https://www.youtube.com/watch?v='+this.id+'" target="_blank"><img src="https://i3.ytimg.com/vi/'+this.id+'/default.jpg" /></a>';
    },
    toRowModelArray: function() {
        this.season = this.season>0 ? this.season:"---";
        this.episode = this.episode>0?this.episode:"---";
        return ["",this.getThumb(),this.title, this.serie,this.lang_id,this.season+" x "+this.episode,this.channel,this.views,parseFloat(this.earnings).toPrecision(2)+" USD"];
    },
   
};
App.Model.Video = Ext.extend(App.Model.Abstract, App.Model.Video);
