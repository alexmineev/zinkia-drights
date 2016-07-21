/**
 * 
 * @class APISet
 */
App.Model.APISet = {
    $fields: ["id","name"],
    
    constructor: function APISet(set) {
        this.id = set.value;
        this.name = set.key;
        
      App.Model.APISet.superclass.constructor.apply(this,arguments);  
    } 
};
App.Model.APISet = Ext.extend(App.Model.Abstract,App.Model.APISet);