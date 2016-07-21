/**
 * 
 * @class PluginData
 */
App.Model.PluginData = {
    $fields: ["id","name"],
    propClasses: {
        "s" : App.Model.EditableProperty.String,
        "i" : App.Model.EditableProperty.Integer,
        "l" : App.Model.EditableProperty.Long,
        "d" : App.Model.EditableProperty.Double,
        "b":  App.Model.EditableProperty.Boolean,
        "eoh" : App.Model.EditableProperty.ExecOutputHandler,
        "path": App.Model.EditableProperty.Path,
        "uri": App.Model.EditableProperty.URI,
        
        "s[]" : App.Model.EditableProperty.ArrayString,
        "i[]" : App.Model.EditableProperty.ArrayInteger,
        "l[]" : App.Model.EditableProperty.ArrayLong,
        "d[]" : App.Model.EditableProperty.ArrayDouble,
        "b[]" : App.Model.EditableProperty.ArrayBoolean,
        "eoh[]" : App.Model.EditableProperty.ArrayExecOutputHandler,
        "path[]": App.Model.EditableProperty.ArrayPath,
        "uri[]": App.Model.EditableProperty.ArrayURI,
        
        "group" : App.Model.EditableProperty.Group,
        
        
    },
    constructor: function PluginData(plugin) {
            var me=this;
            function _processGroups(properties,group) {
                
               $.each(properties,function(name,value) {
                    if (name.indexOf("-") === -1) {
                        Ext.apply(value,value.properties);
                        _processGroups(value.properties,group);
                        
                    } else {
                      
                        //value.group = group||"default";
                        var $propInfo = me.getPropertyInfo(name); 
                                    $propInfo.data = value;
                                    
                                    Ext.applyIf($propInfo,value);
                                    
                         me.properties.push($propInfo);
                        
                    }
                        
                    
                });
                
                 
                    /*    if (prop.$class=="group") {  //is group
                            
                                  _processGroups(prop.properties)                      
                           
                        } else {
                            
                            $.each(properties, function(name,property) {
                                    var $propInfo = me.getPropertyInfo(name); 
                                    $propInfo.data = property;
                                    
                                    Ext.applyIf($propInfo,property);
                                    
                                    me.properties.push($propInfo);
                            });
                            
                            
                        }*/
                
            }     
                
            
      
      
      
      if (plugin.name)
        plugin.id=plugin.name; 
      else 
          throw this;
      
      //console.log(this.overwrite);
      
      
      App.Model.PluginData.superclass.constructor.apply(this,arguments);  
      
      //this.properties = Array.from(plugin.properties);
      var me=this;
      this.props=this.properties;
      this.properties = [];
      
      if (this.overwrite)
             this._processOverwrite();
      
      
      $.each(this.props, function(name,property) {
          var $propInfo = me.getPropertyInfo(name); 
          
          $propInfo.data = property;
          Ext.applyIf($propInfo,property);
          me.properties.push($propInfo); 
          
          
      });
      
       //_processGroups(this.props);
       //console.debug(this.overwrite);
       
       
      /*if (this.overwrite)
        this.properties.overwrite=this.overwrite;*/
      
      //console.dir(this);
    }
    ,
    getProperties:function() {
        
        return this.properties
                .filter(function(prop) {return App.Model.EditableProperty.isPropertyClass(prop.$class)})
                .map(function(prop) {
                    
            
                return new prop.$class(prop);
            
            //console.warn("Property: "+prop.name+" is not a valid EditableProperty");
        })
    },
    getPropertyInfo: function(propName) {
        
        var name = propName.split("-")[0],
            type = propName.split("-")[1];
    
        
        
        return  {id:name,
                 group: type ? "default":name, 
                 name: name,
                 originalName:propName,
                 $class: this.propClasses[type||"group"]};    
            
    },
    _processOverwrite: function() {
        var me=this;
        
        $.each(this.props,function(propName,prop) {
            if (propName in me.overwrite)
            {
                console.info("[PluginData] overwrite: "+propName);
                prop.value = me.overwrite[propName];
                
            }
                
        });
        
    }
    
    
    
};
App.Model.PluginData = Ext.extend(App.Model.Abstract,App.Model.PluginData);