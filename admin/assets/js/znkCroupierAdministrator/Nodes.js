Ext.ns("App.API");

/**
 * 
 * Singelton Nodes Class 
 * 
 * HACK: All of the App.API.* Classes are pseudo-extended and will be flushed into croupier singelton instance,
 *       so they MUST NOT contain any function with the same name.
 * 
 * @class Nodes 
 * @memberOf App#API
 * @static
 */
App.API.Nodes = 
{
        getNodes: function() {
            return this.data.nodes.values(true).map(function(n) {
                return this.getNode(n.id);
            },this) ;
        },
        /**
         * 
         * @param {Number} nid
         * @returns {App.Model.Node}
         */
        getNode: function(nid) {
            if ((node = this.data.nodes.get(nid)) === null)
            {
                throw new Error("[App.API.Nodes::get()]: No Node with ID:"+nid);
            }
            
            return new App.Model.Node(node);
        },
        /**
         * @deprecated use multiAction instead*/
        removeNodes: function(nodes,cbDone,scope)
        {
            this.api.node$remove(nodes.toIds(),function(result) {
                if (result.status == croupier.ResponseStatus.SUCCESS)
                    cbDone.call(scope || this);
            });
            
        },
        
        pauseNodes: function(nodes,cancelJobs,cbDone,scope) {
            this.api.node$pause(nodes.toIds(),cancelJobs,function(result) {
                if (result.status == croupier.ResponseStatus.SUCCESS)
                    cbDone.call(scope || this);
            })
        },
        /**
         * @deprecated use multiAction instead*/
        resumeNodes: function(nodes,cbDone,scope) {
            this.api.node$resume(nodes.toIds(),function(result) {
                if (result.status == croupier.ResponseStatus.SUCCESS)
                    cbDone.call(scope || this);
            })
        },
        enableNodes: function(nodes,enable) {
            this.api.node$setEnabled(nodes.toIds(),enable,function(result) {
                if (result.status == croupier.ResponseStatus.SUCCESS)
                    if (App.mainBox)
                        {
                            App.mainBox.progress(100);
                            App.mainBox.done();
                        }
            })
        } 
          
        
};
App.API.Nodes = $.extend(croupier,App.API.Nodes);

 



