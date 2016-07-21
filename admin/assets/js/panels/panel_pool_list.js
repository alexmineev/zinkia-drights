Ext.ns("App.Panel");

App.Panel.Pools = Ext.extend(App.Panel,{
    constructor: function panel_pool_list(tab_id)
{
	this.html_id="pool_list";
// 	this.url='assets/html/user_list.html';
	this.tab_id=tab_id;

	
	this.define=C.panels.panel_pool_list;
	
        this.poolsTableId = "table-pools";

        this.initialLoad = function() {
            this.msgBox.setMsg("Loading pools list...");
            
            this.poolsTable.on("loaded",function() {
                this.msgBox.progress(100);
                this.msgBox.done();
            },this)
            
            this.poolsTable.load(App.API.Pools.getPools());
            
             croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.pool$list],function(data) {
                     App.mainBox = App.progressMsg("Croupier Server Syncronization","Reloading pools...");
                     this.poolsTable.load(App.API.Pools.getPools());
             },this);
            
        }
        
	this.loaded_html= function ()
	{
            var me=this;
            
            this.poolsTable = new App.Widget.PoolsTable({
                id: this.poolsTableId
                
            }); 
	this.tables.push(this.poolsTable);
            this.on("show",function() {
                this.poolsTable.adjust();  
            },this);
           this.msgBox = App.progressMsg("Pools","Waiting server data..."); 
           
           $("#addPoolBtn").click(function() {
                        App.tabs.tab_active.panelDetails=new App.Panel.PoolDetails(App.tabs.tab_active.tab_id, -1);
                        App.tabs.tab_active.panelDetails.show();
           });
           
           
           $("#removePoolBtn").click(function() {
               var pools = me.poolsTable.getSelectedRows();
               if (pools.length<=0) return;
               
                me.removePools(pools); 
               
           });
           
           
           
           this.constructor.superclass.loaded_html.apply(this,arguments);
	}  


	this.update= function ()
	{
	      this.poolsTable.adjust();  
        }
        
        this.removePools= function(pools) {
            
            App.mainBox = App.progressMsg("Pools","Removing pools...");
            
            App.API.Pools.removePools(pools,function() {
                App.mainBox.progress(100);
                App.mainBox.done();
                
               this.close.defer(1500);
            },this);
        }
        
 	App.Panel.Pools.superclass.constructor.apply(this,arguments);
}
});
window.panel_pool_list = App.Panel.Pools;



