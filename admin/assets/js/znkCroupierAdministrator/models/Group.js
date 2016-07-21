Ext.ns("App.Model");

/**
 * UserGroup data model class
 * 
 * @class Group
 * @memberOf App#Model
 * @namespace App.Model
 */
App.Model.Group = {
    $fields:[],
    constructor: function(group) {
        App.Model.Group.superclass.constructor.apply(this,arguments);
    
        Ext.apply(this,group);
        
                
        
  
    },
    getDataLink: function() {
        return '<a href="#" data-groupid='+this.id+'>'+this.name+'</a>';
    },
    toRowModelArray: function(rowType) {
        if (rowType!=="permission")
        return ["",this.id,this.getDataLink(), 
            Array.isArray(this.users) ? this.users.length:"[UNKNOWN]",
            Array.isArray(this.plugins) ? this.plugins.length:"[UNKNOWN]",
                $.isFunction(this.pools.size)? this.pools.size(): "[UNKNOWN]"];
        else
            return ["",this.name,Array.isArray(this.users) ? this.users.length:"[UNKNOWN]"];
        
        
    },
    hasPoolPermission: function(poolId,permission) {
        return 
             App.Model.Abstract.prototype.hasPermissions.call(this.pools.get(poolId),
                                                                permission);
        
    },
    hasPlugin: function(plugin) {
        return this.plugins.some(function(pluginMask) {
            return pluginMask=="*" || plugin==pluginMask;
        },this);
    },
    getPluginConfigs: function() {
       if (this.plugins.contains("*")) 
       {
           var all=App.API.Plugins.getPlugins(),
               confs = [];    
       
           all.forEach(function(pl) {
               $.merge(confs,pl.getConfigurations());
           })
           
           return confs;
       }
           
       
      return this.plugins.map(function(pl) {
          var plugin =pl.split(":")[0],
             config = pl.split(":")[1];
          
          return new App.Model.PluginConfig({id:config,name:config,plugin:App.API.Plugins.getPlugin(plugin)});
      },this);  
    },
    getUsers: function() {
        return this.users.map(function(user) {
            return App.Model.isModel(user)?user: App.API.Users.getUser(user);
        },this);
    },
    hasAllPools: function() {
        return this.pools.values().some(function(perm) {
            return perm.pool == 0;
        });
    },
    hasAllGroups: function() {
        return this.groups.values().some(function(perm) {
            return perm.other == 0;
        });
    }
    ,
    getPools: function() {
        pools=this.pools.values();
        
        if (pools.some(function(perm) {
            if (perm.pool==0) {
                this.poolAllPerm = perm.permission;
                return true;
            } else
                return false;
        },this)) {
            return App.API.Pools.getPools()
                   .map(function(pool) {
                        pool.groupPermission = this.poolAllPerm;
                        return pool;
            },this);
        }
        
        return pools.map(function(perm) {
            var pool = App.API.Pools.getPool(perm.pool);
                pool.groupPermission = perm.permission;
                
              return pool;  
        },this);
    },
    getGroups: function() {
        
         groups=this.groups.values();
        
        if (groups.some(function(perm) {
            if (perm.other==0) {
                this.groupAllPerm = perm.modify;
                return true;
            } else
                   return false; 
        },this)) {
            return App.API.Groups.getGroups()
                   .map(function(group) {
                        group.groupCanModify = this.groupAllPerm;
                        return group;
            },this);
        }
        
        
        
        
        return this.groups.values().map(function(perm) {
           var group= App.API.Groups.getGroup(perm.other); 
               group.groupCanModify =perm.modify;
             
            return group;
        },this);
    },
    
    canModifyGroup: function(groupId) {
       return 
             this.groups.get(groupId).modify == "1";
                                                
    },
    setUsers: function(users) {
        this.$users = users.toIds();
        this.users =users;
    }
    ,
    setPools: function(pools) {
        this.$pools = pools.map(function(pool) {
           return {pool:pool.id,permission:pool.groupPermission}; 
        });
        if (this.pools && $.isFunction(this.pools.setAll))
            this.pools.setAll(this.$pools);
    }
    ,
    setGroups: function(groups) {
        this.$groups = groups.map(function(group) {
           return {other:group.id,modify:group.groupCanModify ? "1":"0"}; 
        });
        if (this.groups && $.isFunction(this.groups.setAll))
            this.groups.setAll(this.$groups);
    }
    ,
    setPlugins: function(plugins) {
        this.$plugins = plugins.toIds();
        this.plugins = plugins;
    }
    ,
    update: function() {
          var me=this;
          App.API.Groups.api.userGroup$set(this.id,this.name,this.description,this.$users,this.$plugins,this.$pools,this.$groups,function(res) {
              if (res.status == croupier.ResponseStatus.SUCCESS)
              {
                  me.fireEvent("updated",this);
              }
          });  
    },
    insert: function() {
        var me=this;
        
         App.API.Groups.api.userGroup$add(this.name,this.description,this.$users,this.$plugins,this.$pools,this.$groups,this.permission,function(res) {
              if (res.status == croupier.ResponseStatus.SUCCESS)
              {
                  me.fireEvent("inserted",this);
              }
          });  
    }
    
};
App.Model.Group = Ext.extend(App.Model.Abstract, App.Model.Group);