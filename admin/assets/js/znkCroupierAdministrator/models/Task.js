Ext.ns("App.Model");

/**
 * Task data model class
 * 
 * @class Task
 * @memberOf App#Model
 * @namespace App.Model
 */
App.Model.Task = {
    $fields:[],
    constructor: function(task) {
        App.Model.Task.superclass.constructor.apply(this,arguments);
        
        
    },
    getComments: function() {
        
    }
    ,
    getDataLink: function() {
        return '<button type="button" class="btn btn-info" data-taskid="'+this.id+'">View comments ('+this.comments+') </button>';
    },
    toRowModelArray: function() {
        return ["",this.workspace,this.toSortableDate(this.created),this.author||"UNKNOWN",this.title||"[EMPTY]", this.task_group||"[EMPTY]",this.label||"",this.comments==0 ? "[NO COMMENTS]":this.getDataLink(),this.description];
    },
    remove: function() {
        
    },
    toSortableDate: function(date) {
        
        var day =  date.split("/")[0],
            month = date.split("/")[1],
            year = date.split("/")[2];
    
        var d = new Date();
        d.setDate(day)
        d.setMonth(month);
        d.setYear("20"+year);
        
        return d.getTime()+ " ("+d.toLocaleDateString()+")";
        
    }
    
    
};
App.Model.Task = Ext.extend(App.Model.Abstract, App.Model.Task);
