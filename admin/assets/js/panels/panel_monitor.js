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
                 id: "table-videos"
             });
             
                 
             this.videosTable.panel = this;    
                      
             /*this.videosTable.on("loaded",function() {
                this.videos =  this.videosTable.rows;
                this.videosTable.load(me.processVideoDuplicates());
                 
             },this);*/
                 
                 
               var me=this;
               
            /* $.getJSON(App.config.API.loadReports+"?year=2016&trimester=2",function(json) {
                
                
                
                me.videosTable.load(json.videos.map(function(vid) {
                    
                    return new App.Model.Video(vid);
                    
                }));
                
                
            });*/  
            
                   
            
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
