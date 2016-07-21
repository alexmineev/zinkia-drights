Ext.ns("App.Widget");
/**
 * Selector de multiples Nodos
 *   
 * @class NodesSelectBox
 * @memberOf App#Widget
 * @namespace App.Widget
 * @extends App.Widget.SelectBox
 */
App.Widget.NodesSelectBox = Ext.extend(App.Widget.SelectBox,{
    
       
    constructor:  function NodesSelectBox(config) {
       var me=this; 
      this._defConfig =  {
               cssClass: "widget selectbox nodes",
               
               label: "Nodes",
               width: "260px",
               no_results_text: "No nodes found!",
               defaultMessage: "Select nodes",
               modelClass: App.Model.Node,
               
        }; 
        
        
      Ext.applyIf(config, this._defConfig);
           
      App.Widget.NodesSelectBox.superclass.constructor.apply(this,arguments);
      
      
      this.$chosen.on("chosen:showing_dropdown",function($chosen) {
          me._setListDecoration();
      });
      this.$chosen.on("chosen:hiding_dropdown",function($chosen) {
          me._setSelectedDecoration();
      });
      this.$chosen.on("chosen:ready",function($chosen) {
          me._setSelectedDecoration();
      });  
        
    },
    _setListDecoration: function() {
        var me= this;
        console.info("[NodesSelectBox]: setListDecoration()");
        $("#"+this.id+" .chosen-results > li.active-result")
            .each(function(i,nodeItem) {
                
                        
                //$(nodeItem).html("<span class='ico-os ico-os-linux'>Linux</span>"+$(e).html())
        
               var nodeModel = me.options[nodeItem.getAttribute("data-option-array-index")];
               $(nodeItem).html(nodeModel.getOsIcon()+"&nbsp;"+nodeModel.name);
               $(nodeItem).addClass(nodeModel.getStatusClass());
               
               
         });
        
    },
    _setSelectedDecoration: function() {
        var me=this;
         $("#"+this.$chosen.attr("id")+"_chosen li.search-choice").each(function(i,listItem) {
                var $list= $(listItem);
                
                
                if (!$list.children("a")[0]) return;
                var nodeModel = me.options[$list.children("a")[0].getAttribute("data-option-array-index")];
                
                $list.addClass(nodeModel.getStatusClass());
                $list.children("span").html(nodeModel.getOsIcon()+"&nbsp;"+nodeModel.name);
                              
          })
    },
    _syncChosen: function() {
        this.constructor.superclass._syncChosen.apply(this,arguments);
        this._setSelectedDecoration();
    }
});
