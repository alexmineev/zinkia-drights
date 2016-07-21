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
    getThumb: function(text) {
        return '<img src="https://i3.ytimg.com/vi/'+this.id+'/default.jpg" />';
    },
    toRowModelArray: function() {
        return ["",this.getThumb(),this.title, this.channel,this.views,parseFloat(this.earnings).toPrecision(2)+" USD"];
    },
    
    
    
};
App.Model.Video = Ext.extend(App.Model.Abstract, App.Model.Video);
