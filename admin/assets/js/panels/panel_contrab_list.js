Ext.ns("App.Panel");


App.Panel.CronTab = {
constructor:

function panel_contrab_list(tab_id)
{

	

	
	this.html_id="contrab_list";
// 	this.url='assets/html/user_list.html';
	this.tab_id=tab_id;

	
	this.define=C.panels.panel_contrab_list;
	
	App.Panel.CronTab.superclass.constructor.apply(this,arguments);
	

},
loaded_html: function() {
    
    this.cronsTable = new App.Widget.CronsTable({
        id:"table-cron"
    }); 
    
    this.tables.push(this.cronsTable);
    this.constructor.superclass.loaded_html.call(this);
},
initialLoad: function() {
    this.cronsTable.on("loaded",function() {
        App.mainBox.progress(100);
        App.mainBox.done();
    },this);
    
    App.mainBox = App.progressMsg("Cronstab","Loading crons...");
    
    this.cronsTable.load(App.API.Crons.getCrons());
}


}
App.Panel.CronTab = Ext.extend(App.Panel,App.Panel.CronTab);

window.panel_contrab_list = App.Panel.CronTab;