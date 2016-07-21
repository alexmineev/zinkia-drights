Ext.ns("App.Model");

/**
 * Pool data model class
 * 
 * @class Pool
 * @memberOf App#Model
 * @namespace App.Model
 */

App.Model.Pool = {
    $fields: [],
    constructor: function Pool(pool) {
        App.Model.Pool.superclass.constructor.apply(this,arguments);
        
        
                
        this.addEvents(
                    /**
                     * 
                     * @event Fires when setNodes method succeeds.
                     */
                    'nodesupdated'
                );
       // Ext.apply(this,pool);
       
       if (!this.description) this.description = "";
        
    },

    toRowModelArray: function(rowType) {
        if (!rowType)
            return ["","",this.id,this.getDataLink(this.name),this.description,Array.isArray(this.nodes) ? this.nodes.length:"[NO DATA]"];
        else
            return ["","",this.getDataLink(this.name)];
    },
    getNodes: function() {
        return this.nodes.toModelArray("nodes",App.Model.Node);
    },
    canUseAsPrimary: function() {
        return this.hasPermission(croupier.PoolPermission.usePrimary);    
    },
    canUseAsSecondary: function() {
        return this.hasPermission(croupier.PoolPermission.useSecondary);
    },
    getDataLink: function() {
        if (this.hasPermission(croupier.PoolPermission.set) || this.hasPermission(croupier.PoolPermission.moveNodes))
            return '<a href="#" data-poolid='+this.id+'>'+this.name+'</a>';
        else
            return this.name;
    },
    update: function() {
        var me= this;
        var nodes = (this.nodes.length>0 && App.Model.isModel(this.nodes[0])) ? this.nodes.toIds(): this.nodes;
        
        croupier.api.pool$set(this.id,this.name,this.description,this.enabled,nodes,function(res) {
            if (res.status == croupier.ResponseStatus.SUCCESS)
            {
                me.fireEvent("updated",this);
            }
        },this);
    },
    setNodes: function(nodes) {
        var me= this;
        if (nodes.length>0 && App.Model.isModel(nodes[0])) nodes=nodes.toIds();
        croupier.api.pool$setNodes(this.id,nodes,function(res) {
            if (res.status == croupier.ResponseStatus.SUCCESS)
            {
                me.fireEvent("nodesupdated",nodes);
            }
        },this);
    },
    addNodes: function(nodes) {
          var me= this;
        if (nodes.length>0 && App.Model.isModel(nodes[0])) nodes=nodes.toIds();
        croupier.api.pool$addNodes(this.id,nodes,function(res) {
            if (res.status == croupier.ResponseStatus.SUCCESS)
            {
                me.fireEvent("nodesupdated",nodes);
            }
        },this);
    },
    canModify: function() {
        return App.Users.getCurrentUser()
                 .getGroups()
                 .some(function(group) {
                     return group.hasPoolPermission(this.id,croupier.UserGroupPoolPermission.MODIFY);
                 },this);
                
        
    },
    insert: function() {
        var  me= this;
       var nodesIds =  
               this.nodes && Array.isArray(this.nodes) && this.nodes.length>0 && App.Model.isModel(this.nodes[0]) ?
                this.nodes.toIds() :
                        this.nodes;
        
        console.debug(this.nodes);
        croupier.api.pool$add(this.name,this.description,this.enabled,nodesIds,function(res) {
            if (res.status == croupier.ResponseStatus.SUCCESS)
                
                me.fireEvent("inserted",me);
            
            console.debug(croupier.data.pools.get(res.value));
            
        });
    }
    /*toOptionElement: function() {
        
    }*/
    
};
App.Model.Pool = Ext.extend(App.Model.Abstract,App.Model.Pool);