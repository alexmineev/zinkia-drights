var CONSTANT = {
 
	tcih: "�" /// texto para concatenar ids del html
	
	,panels : {
// 	,type_tabs : {
					panel_monitor : 
							{
								text_default : "reports"
								,in_tab: true
								,replicate : false
								,class_panel: "panel_monitor"
								,url: "assets/html/monitor.html"
							}
					,panel_user_list : 
							{
								text_default : "Tasks"
								,in_tab: true
								,replicate : false
								,class_panel: "panel_user_list"
								,url: "assets/html/user_list.html"
							}
					,panel_user_data : 
							{
								text_default : "Data list"
								,in_tab: false
								,replicate : false
								,class_panel: "panel_user_data"
								,url: "assets/html/user_data.html"
							}
					,button_open_new_tabs : 
							{
								text_default : ""
								,in_tab: false
								,replicate : false
								,class_panel: "button_open_new_tabs"
								,url: "assets/html/button_open_new_tabs.html"
							}
					,header : 
							{
								text_default : ""
								,in_tab: false
								,replicate : false
								,class_panel: "header"
								,url: "assets/html/header.html"
							}
					,new_job : 
							{
								text_default : ""
								,in_tab: false
								,replicate : false
								,class_panel: "new_job"
								,url: "assets/html/new_job.html"
							}
					,tabs : 
							{
								text_default : ""
								,in_tab: false
								,replicate : false
								,class_panel: "tabs"
								,url: null
							}
					,panel_group_list : 
							{
								text_default : "Groups"
								,in_tab: true
								,replicate : false
								,class_panel: "panel_group_list"
								,url: "assets/html/group_list.html"
							}
					,panel_group_data : 
							{
								text_default : "Data list"
								,in_tab: false
								,replicate : false
								,class_panel: "panel_group_data"
								,url: "assets/html/group_data.html"
							}
					,panel_history : 
							{
								text_default : "History"
								,in_tab: true
								,replicate : false
								,class_panel: "panel_history"
								,url: "assets/html/panel_history.html"
							}
					,panel_statistics : 
							{
								text_default : "Statistics"
								,in_tab: true
								,replicate : false
								,class_panel: "panel_statistics"
								,url: "assets/html/panel_statistics.html"
							}		
					,panel_node_list : 
							{
								text_default : "Nodes"
								,in_tab: true
								,replicate : false
								,class_panel: "panel_node_list"
								,url: "assets/html/panel_node_list.html"
							}			
					,panel_pool_list : 
							{
								text_default : "Pools"
								,in_tab: true
								,replicate : false
								,class_panel: "panel_pool_list"
								,url: "assets/html/panel_pool_list.html"
							}		
					,panel_preset_list : 
							{
								text_default : "Presets"
								,in_tab: true
								,replicate : false
								,class_panel: "panel_preset_list"
								,url: "assets/html/panel_preset_list.html"
							}			
					,panel_contrab_list : 
							{
								text_default : "Crontabs"
								,in_tab: true
								,replicate : false
								,class_panel: "panel_contrab_list"
								,url: "assets/html/panel_contrab_list.html"
							}	
					,panel_plugin_list : 
							{
								text_default : "Plugins"
								,in_tab: true
								,replicate : false
								,class_panel: "panel_plugin_list"
								,url: "assets/html/panel_plugin_list.html"
							},
                                         panel_pool_details: {
                                             text_default: "",
                                             in_tab: false,
                                             replicate: false,
                                             class_panel: "panel_pool_details",
                                             url: "assets/html/panel_pool_details.html"
                                         },
                                         panel_node_details: {
                                             text_default: "",
                                             in_tab: false,
                                             replicate: false,
                                             class_panel: "panel_pool_details",
                                             url: "assets/html/panel_pool_details.html"
                                         }
			
			
				}
				
				
	,A_PROGRESS_BY_STATUS: [
							-100 //DISABLED
							,-50 // ENABLED
							,101 //EXECUTED
							,100 // ERROR
							,-30 // RETRY
							,-10 //TIMEOUT
							,null //EXECUTING (siempre hay porcentaje, no es necesario forzarlo)
							,-85 // PAUSED
	  
						]
						
	, PRIORITY: {
					 MIN : -255
					,MAX :  255
					,MIN_USER: -100
					,MAX_USER: 100
					,DEFAULT : "NORMAL"
					,A_DEFINED : {					
									ULTRA_HIGH : 100
									,HIGH : 50
									,NORMAL : 0
									,LOW: -50
									,ULTRA_LOW : -100					
								}
				}
	, CLIENT_ADMIN_JAVA: "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.44 (KHTML, like Gecko) JavaFX/8.0 Safari/537.44"
						
						
						
  
};


//App.jsonpCb(jscbDefine());

//window.CONSTANT= jscbDefine();
var C = CONSTANT;