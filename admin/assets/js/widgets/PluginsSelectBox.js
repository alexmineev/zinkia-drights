Ext.ns("App.Widget");
/**
 * Selector de multiples Nodos
 *   
 * @class PluginsSelectBox
 * @memberOf App#Widget
 * @namespace App.Widget
 * @extends App.Widget.SelectBox
 */
App.Widget.PluginsSelectBox = Ext.extend(App.Widget.SelectBox,{
    
       
    constructor:  function PluginsSelectBox(config) {
       var me=this; 
      this._defConfig =  {
               cssClass: "widget selectbox plugins",
               
               label: "Plugins",
               width: "260px",
               no_results_text: "No plugins found!",
               defaultMessage: "Select plugin",
               modelClass: App.Model.Plugin,
               template: "defSelectBox",
               emptyOption: "Select plugin"
               
        }; 
        
        
      Ext.applyIf(config, this._defConfig);
           
      App.Widget.PluginsSelectBox.superclass.constructor.apply(this,arguments);
      
      
      
      
      this.$chosen.on("chosen:showing_dropdown",function($chosen) {
          me._setListDecoration();
      });
      this.$chosen.on("chosen:hiding_dropdown",function($chosen) {
          me._setSelectedDecoration();
      });
      this.$chosen.on("chosen:ready",function($chosen) {
          me._setSelectedDecoration();
      });  
      
      /*this.$chosen.on("chosen:no_results", function(e,obj) {
          
          me.$chosen.trigger("chosen:close");
      })*/
      
    },
    _setListDecoration: function() {
        var me= this;
        console.info("[PluginsSelectBox]: setListDecoration()");
        $("#"+this.id+" .chosen-results > li.active-result")
            .each(function(i,pluginItem) {
                
                        
                //$(pluginItem).html("<span class='ico-os ico-os-linux'>Linux</span>"+$(e).html())
        
               var pluginModel = me.options[pluginItem.getAttribute("data-option-array-index")-1];
               
               //console.dir(pluginModel);
              
                $(pluginItem).html('<div class="pluginInfo" data-container="body" data-toggle="popover" data-placement="left" data-content="'+pluginModel.description+'" title="'+pluginModel.name+'">'+pluginModel.getIcon(40)+'&nbsp&nbsp'+pluginModel.name+'</div>');
               //$(pluginItem).addClass(pluginModel.getStatusClass());
              //$(pluginItem).html("<span style='float:left'>"+pluginModel.getIcon(40)+"</span><span style='float:left;margin-left:5px;'>"+pluginModel.name+"</span><span style='float:right'>"+pluginModel.description+"</span>"); 
               /*$(this).hover(function(e) {
                   
                   //$(this).children(".pluginInfo").popover('show');
               }).on("mouseout",function(e) {
                   //e.stopImmediatePropagation();
                   //$(this).children(".pluginInfo").popover('hide');
               });*/
                               
         });
         
         $(".pluginInfo").mouseenter(function() {
              try {
                    if ($(this).attr("title").length>0 || $(this).attr("data-original-title").length>0)
                        $(this).popover('show'); 
                } catch(e) {}
                    
                 }).mouseleave(function() {
                       $(this).popover('hide'); 
                });
                
        
    },
    _setSelectedDecoration: function() {
        var me=this;
         
                //if (this.options.length==0) return;
                console.info("plugin model:"+$(this.$select).val())
                var pluginModel = App.API.Plugins.getPlugin($(this.$select).val());
                if (!App.Model.isModel(pluginModel)) return;
                
                
                $("#"+this.id+" a.chosen-single > span").html(pluginModel.getIcon(25)+"&nbsp;"+pluginModel.name);
                              
          
    },
    _syncChosen: function() {
        this.constructor.superclass._syncChosen.apply(this,arguments);
        this._setSelectedDecoration();
    }
});


