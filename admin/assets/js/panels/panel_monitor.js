Ext.ns("App.Panel");

/**
 * @class Monitor
 * @namespace App.Panel
 * @memberOf App#Panel
 * @param {Number} tab_id
 * @returns {App.Panel.Monitor}
 */
App.Panel.Monitor = Ext.extend(App.Panel,{ 
        
        constructor: function(tab_id)
{

	this.html_id="reports_panel";
// 	this.html_id="monitor";
	this.tab_id=tab_id;
        
	
        
	this.loaded_html= function ()
	{
	   var me=this;	
             this.videosTable =  new App.Widget.VideosTable({
                 id: "table-videos",
                 "language": {
                     "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                 }
             });
             
             
            var curYear = new Date().getFullYear();
             
            for (y=curYear;y>curYear-10;y--)
            {
                $("<option>").attr("value",y).text(y)
                        .appendTo($("#videosYear"));
            }
             
            this.cmsList = new App.Widget.CmsSelectBox({
                id: "cmsList"
            });
            
            this.channelList = new App.Widget.ChannelSelectBox({
                id: "channelList"
            });
            
            this.cmsList.$chosen.on("change",function() {
               var cms_id = $(this).val();
               
               $.getJSON(App.config.API.getChannelList+"?cms_id="+cms_id,function(ret) {
                  
                   me.channelList.load(ret.data);
               });
               
               
            });
            
            
            
            
            var me = this;
            App.mainBox = App.progressMsg("CMS Reports","Obteniendo la lista de CMSs de la BB.DD.");
            $.getJSON(App.config.API.getCMSList,function(res) {
                
                if (res.success) {
                    me.cmsList.load(res.data);
                
                    App.mainBox.progress(100);
                    App.mainBox.done();
               } else {
                   App.errorMsg("CMS Reports","Error al obtener la lista de CMSs: "+res.error);
               }
                
            })
            
            
             this.videosTable.panel = this;    
             
               var me=this;
               
             
            $.getJSON(App.config.API.getSeries,function(res) {
                if (res.success) {
                    
                   res.data.forEach(function(serie) {
                       $("#seriesList").append(
                                    $("<option>")
                                        .attr("value",serie)
                                        .text(serie)
                                  );
                   },me); 
                   
                
                   
               } else {
                   App.errorMsg("YT CMS Reports","Error al obtener la lista de series: "+res.error);
               }    
            });
            
            this.langList = new App.Widget.LangSelectBox({
                id: "langList"
            });
            
            
            $.getJSON(App.config.API.getLangs,function(res) {
                
               if (res.success) {
                 me.langList.load(res.data); 
                   
               } else {
                   App.errorMsg("YT CMS Reports","Error al obtener la lista de idiomas: "+res.error);
               }    
                
            });
            
             this.constructor.superclass.loaded_html.call(this);
	}
        
	this.initialLoad = function() {
          
       
        };
	
	this.update=function()
	{
        
           
        }
		
		
	
	this.hide= function ()
	{
		this.constructor.superclass.hide.call(this);
		
	}
	
	this.show= function ()
	{
		
		this.constructor.superclass.show.call(this);
	}
	
	
	this.close= function ()
	{
            //TODO: destroy all data table widgets.
            this.constructor.superclass.close.call(this);
		
	}
	
        
        this.define=App.config.panels.panel_monitor;
            
	App.Panel.Monitor.superclass.constructor.apply(this,arguments);
	
}
});

/**
 * @deprecated back-compatibility
 * @type App.Panel.Monitor
 */
window.panel_monitor = App.Panel.Monitor;
