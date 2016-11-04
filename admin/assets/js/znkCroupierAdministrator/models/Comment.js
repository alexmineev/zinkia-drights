Ext.ns("App.Model");

/**
 * Comment data model class
 * 
 * @class Comment
 * @memberOf App#Model
 * @namespace App.Model
 */
App.Model.Comment = {
    $fields:[],
    constructor: function(comment) {
        App.Model.Comment.superclass.constructor.apply(this,arguments);
        
        
    }
    ,
    toRowModelArray: function() {
        return ["",this.author,this.date,this.message];
    },
    remove: function() {
        
    }
    
    
};
App.Model.Comment = Ext.extend(App.Model.Abstract, App.Model.Comment);
