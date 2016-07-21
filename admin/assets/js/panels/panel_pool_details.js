Ext.ns("App.Panel");

App.Panel.PoolDetails = {
    constructor: function PoolDetails(tab_id,poolId)
{

	
// 	panel_header.prototype = panel; /// P�ra que "herede" pero no vale de mucho de momento
	
/// ATRIBUTOS 
	
	this.html_id="pool_details";
// 	this.url='assets/html/header.html';

	this.define=C.panels.panel_pool_details;
	
        this.poolId = poolId;
        
	this.tab_id = tab_id;
	/// CONSTRUCTOR AL FINAL PAR PODER USAR LOS METODOS DECLARADOS

		
	
	
/// METODOS 
///		PRIVADOS 
///			var metodo =function()[];
///		PUBLICOS 
///			this.metodo =function()[];
	

	this.loaded_html= function ()
	{
            
            //this.poolId= 3; //DEBUG
            var me=this;
            
             $(".save_pool_btn").off("click").click(function() {
                 me[me.poolId != -1 ? "saveData":"insertData"]();
             });
             
             $(".close_pool_btn").click(function() {
                 
                 me.close();
                 //App.tabs.tab_active.show();
             });
                
            
            
                this.duoNodes = new App.Widget.NodesDuoTable({
                    
                    id:"duonodes",
                    
                });
             
             if (this.poolId ==-1) {
                 $("#pool_title").text("Add pool");
                 $("#pool_data_title").text("Pool details");
             } else {
                 $("#pool_title").text("Update pool");
                 $("#pool_data_title").text("Pool details");
             }
             this.constructor.superclass.loaded_html.call(this);   
             
             
             
	}  



         this.saveData = function() {
            
                 
                 
                 this.pool.on("updated",function() {
                   App.mainBox.progress(100);
                   App.mainBox.done();
                   
                   this.close.defer(2000,this);
                 },this);
                 
                 this.pool.on("nodesupdated",function() {
                   App.mainBox.progress(100);
                   App.mainBox.done();
                   
                   this.close.defer(2000,this);
                 },this);
                 
                 this.pool.nodes = this.duoNodes.leftTable.rows.toIds();  
                 
                 if (App.API.Users.getCurrentUser().isSuperAdministrator())
                 {
                   App.mainBox= App.progressMsg("Pool details","Saving pool data...");
                   this.pool.name = $("#poolName").val();
                   this.pool.description = $("#poolDescription").text();
                   this.pool.enabled = $("#poolEnabled").get(0).checked;
                   
                   this.pool.update();
                   
                 } else {
                    App.mainBox= App.progressMsg("Pool details","Saving pool nodes..."); 
                    this.pool.setNodes(this.pool.nodes); 
                 }
                  
                 
                 
                 
            
                 
         };   
        
         this.insertData= function() {
             if (!$("#poolName").formValidate()) return;
             
             
             App.mainBox = App.progressMsg("Add Pool","Adding a pool...");
             
             this.pool = new App.Model.Pool({id: -1});
             
             this.pool.on("inserted",function() {
                App.mainBox.progress(100);
                App.mainBox.done();
                
                this.close.defer(1000,this);
             },this);
             
             this.pool.name = $("#poolName").val();
             this.pool.description = $("#poolDescription").val();
             this.pool.enabled = $("#poolEnabled").get(0).checked;
             
             this.pool.nodes = this.duoNodes.leftTable.rows.toIds();
             console.debug(this.pool.nodes);
             this.pool.insert();
             
         }
         
         this.initialLoad = function() {
             
            if (this.poolId != -1) { 
                
            this.pool = App.API.Pools.getPool(this.poolId);
	

            
            $("#poolName").attr("value",this.pool.name);
            $("#poolDescription").text(this.pool.description);
            $("#poolEnabled").get(0).checked = this.pool.enabled == "1";
            
            
            if (!App.API.Users.getCurrentUser().isSuperAdministrator())
                $("#poolName,#poolDescription").attr("disabled","disabled")
                                               .addClass("disabled");
            
            App.mainBox = App.progressMsg("Pool Details","Loading pool nodes...");
             
             this.poolNodes = this.pool.getNodes();
             
             
             this.duoNodes.rightTable.on("loaded",function() {
                 App.mainBox.progress(100);
                 App.mainBox.done();
             },this);
             
             this.duoNodes.leftTable.on("loaded", function() {
                
                App.mainBox.progress(50);
                this.duoNodes.rightTable.load(App.API.Nodes.getNodes());
                
             },this);
             
             this.duoNodes.leftTable.load(this.poolNodes);
             
           } else { //ADD POOL
               
               this.duoNodes.rightTable.on("loaded",function() {
                 App.mainBox.progress(100);
                 App.mainBox.done();
                 
                 
             },this);
             
             App.mainBox = App.progressMsg("Add Pool","Loading nodes list...");
             
             this.duoNodes.rightTable.load(App.API.Nodes.getNodes());
               
           }
             
         };
         

        this.update = function() {
            $("#pool_details").show();
        }

        this.close = function() {
            
            //this.constructor.superclass.close.call(this);
            $("#pool_data_popup")
                              .remove();
            
            App.tabs.tab_active.update();
        };
        this.show= function() {
            $("#pool_data_popup").modal({backdrop:"static"});
            $("#pool_details").show();
            this.constructor.superclass.show.apply(this,arguments);
        }
/// CONSTRUCTOR	 (despues de las declaraciones para poder usar los metodos delcarados
	


	
 	App.Panel.PoolDetails.superclass.constructor.apply(this,arguments);


}

};
App.Panel.PoolDetails = Ext.extend(App.Panel,App.Panel.PoolDetails);

/**
 * @deprecated text
 * @type App.Panel.PoolDetails
 */
window.panel_pool_details = App.Panel.PoolDetails;
// var panel_header= function ()


