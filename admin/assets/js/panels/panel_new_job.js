Ext.ns("App.Panel");
//panel_new_job.prototype = new panel();

// var panel_new_job = function ()
App.Panel.NewJob = Ext.extend(App.Panel,{
        constructor: function panel_new_job()
{

	
	/// ATRIBUTOS 
	
	this.html_id="new_job";
// 	this.url='assets/html/new_job.html';
	
	
	this.define=C.panels.new_job;
	
	
	this.plugin_selected;
	this.configuration_selected;
	this.data_plugin;
	
        this.primaryPoolsId = "jobAddPrimaryPool";
        this.secondaryPoolsId = "jobAddSecondaryPool";
        
        this.primaryNodesId = "jobAddPrimaryNode";
        this.secondaryNodesId = "jobAddSecondaryNode";
        this.initStatusBoxId ="jobAddStatus";
        this.groupBoxId = "jobAddGroup";

	
	/// CONSTRUCTOR AL FINAL PAR PODER USAR LOS METODOS DECLARADOS
	
	/// METODOS 
	///		PRIVADOS 
	///			var metodo =function()[];
	///		PUBLICOS 
	///			this.metodo =function()[];
	
	this.initialLoad = function() {
            
            this.plugins = App.API.Plugins.getPlugins();
            
            this.pluginsBox.load(this.plugins);
            
            
            this.pluginsBox.on("change",function(changed) {
                if (changed.selected && ((id = changed.selected) !== "empty")) {
                    this.pluginConfigBox.on("loaded",function() {
                        this.pluginConfigBox.setLoadingMask("hide");
                    },this);
                    
                    this.pluginConfigBox.setLoadingMask();
                    
                    this.pluginConfig = App.API.Plugins.getPluginData(id,function(data) {
                        this.pluginConfig = data;
                        
                        
                        this.pluginConfigBox.load(data);
                        
                        this.pluginConfigBox.setLoadingMask("hide");
                                
                    },this);
                    
                    
                    if (this.pluginConfig) {
                        this.pluginConfigBox.load(this.pluginConfig);
                        this.pluginConfigBox.setLoadingMask("hide");
                    }
                    
                   /* this.pluginConfigBox.clear();
                    this.pluginConfigBox.load(this.pluginConfig);
                    
                    this.pluginConfigBox.setLoadingMask("hide");*/
                }
                
                
            },this)
            
            var me= this;
            
            this.pluginConfigBox.on("change",function(changed,notshow) {
                var configId = changed.selected;
                
                me.plugin = me.pluginsBox.getSelectedModel();
                me.pluginConfig =me.pluginConfigBox.getSelectedModel();
                console.debug(me.pluginConfigBox.options);
                me.pluginEditor = new App.Widget.PluginConfigurator({
                    id:"pluginConfig",
                    pluginName: me.plugin.name,
                    pluginConfig: me.pluginConfig.name,
                    icon: me.plugin.icon,
                    pluginProperties: me.pluginConfig.getProperties(),
                    persistentContainer: true,
                });
                console.info("Loading editor with configuration: "+ me.plugin.name+" - "+me.pluginConfig.name);
                console.dir(me.pluginConfig);
                
                
                me.pluginEditor.on("apply",function(typedProperties) { //apply btn pressed
                        
                       this.typedProps=typedProperties;     
                       
                                              
                       $("#jobAdd_Properties").html(App.Widget.renderTemplate("typedProps",{code:JSON.stringify(this.typedProps)}));
                       
                       $("#addJobPropsPanel").show();
                       
                       $("#jobAddEditProps").click(function() {
                           me.pluginEditor.show();
                       });
                       
                       $("#jobAddDeleteProps").click(function() {
                           me.pluginEditor.close();
                           delete me.pluginEditor;
                           delete me.typedProps;
                           $("#jobAdd_Properties").empty();
                           
                           //$("#addJobPropsPanel").hide();
                           
                       });
                      
                },me);
                
                
                if (!notshow) me.pluginEditor.show();
                
            });
            
            this.nodes = App.API.Nodes.getNodes(); //croupier.data.nodes.values(true);
            
            //console.log(croupier.data.users.get());
            
            this.groups = App.API.Users.getCurrentUser().getGroups();
            
            
            
            this.groupsBox.load(this.groups);
            
            this.primaryNodes.on("loaded",function() {
                console.info("[NewJob] primaryNodes loaded");
                this.primaryNodes.syncListWith(this.secondaryNodes);
            },this);
            
            this.secondaryNodes.on("loaded",function() {
                console.info("[NewJob] secondaryNodes loaded");
                this.secondaryNodes.syncListWith(this.primaryNodes);
            },this);

            this.nodesPrimary = this.nodes.filter(function(node) {
                return node.hasPermission(croupier.NodePermission.usePrimary);  
            });
            
            this.nodesSecondary = this.nodes.filter(function(node) {
                return node.hasPermission(croupier.NodePermission.useSecondary);  
            });
            
            this.primaryNodes.load(this.nodesPrimary);
            this.secondaryNodes.load(this.nodesSecondary);
            
            
            
            this.pools = App.API.Pools.getPools();
            
            this.poolsPrimary = this.pools.filter(function(pool) {
                return pool.canUseAsPrimary();
            });
        this.poolsSecondary = this.pools.filter(function(pool) {
                return pool.canUseAsSecondary();
        },this); 
            
            this.primaryPools.on("loaded",function() {
                console.info("[NewJob] primaryPools loaded");
                this.primaryPools.syncListWith(this.secondaryPools);
            },this);
            
            this.secondaryPools.on("loaded",function() {
                console.info("[NewJob] secondaryPools loaded");
                this.secondaryPools.syncListWith(this.primaryPools);
            },this);
            
            
            
            
            this.primaryPools.load(this.poolsPrimary);
            this.secondaryPools.load(this.poolsSecondary);
            
            
             /* $("li.search-choice span").each(function() {
                $(this).html("<span class='ico-os ico-os-linux'>Linux</span>&nbsp;"+$(this).html())
            })*/
            
            
            
        }

	this.loaded_html= function ()
	{
 		
            var me=this;
            
            this.groupsBox = new App.Widget.GroupsSelectBox({
                    id: this.groupBoxId,
                    label: "Group",
                    multiple: false
            }); 
               
            
           /* this.initStatus = new App.Widget.JobStatusSelectBox({
                id: "__test",
                label: "Initial Status",
                multiple:false,
            });*/
            
            this.pluginsBox = new App.Widget.PluginsSelectBox({
                id:"jobAddPlugin",
                multiple:false,
            });
            
           this.pluginConfigBox = new App.Widget.PluginConfigSelectBox({
                id:"jobAddConfiguration",
                multiple:false,
                disabled:true,
                defaultMessage:"Select a plugin first"
            });
            
            
            
            this.primaryPools = new App.Widget.PoolsSelectBox({
                    id: this.primaryPoolsId,
                    label: "Primary:",
                    include_group_label_in_selected:true
             });
            this.secondaryPools = new App.Widget.PoolsSelectBox({
                id: this.secondaryPoolsId,
                label: "Secondary:",
            });
            
            this.primaryNodes = new App.Widget.NodesSelectBox({
                    id: this.primaryNodesId,
                    label: "Primary:"
             });
            this.secondaryNodes = new App.Widget.NodesSelectBox({
                id: this.secondaryNodesId,
                label: "Secondary:",
            });
         
         
                $("#btnJobEdit").off("click").click(function() {
                    if (!me.pluginEditor) {
                        me.pluginConfigBox.fireEvent("change",{selected:me.pluginConfigBox.val()});
                        me.pluginEditor.propTable.loadFromTypedProperties(me.typedProps);
                    } else {
                        
                        me.pluginEditor.show();
                    }
                });
		
		$('#btnAddJob').off("click").click(
                        
								function(e)
								{
                                                                    
                                                                    if (me.validate())
									      me.add_job();
												
								}
							);
		$('#jobAddPriority').change(
									function()
									{
// 										log4javascript.getRootLogger().info("jobAddPriority__change");
										me.select_priority();
										
									});
                                                                      
               $("#jobAddRadioNodes,#jobAddRadioPool").change(function() {
                   if($(this).val() =="on") {
                        if ($(this).attr("data-disable")=="nodes") {
                            me.primaryNodes.disable();
                            me.secondaryNodes.disable();
                            
                            me.primaryPools.enable()
                            me.secondaryPools.enable();
                        
                        } else {
                            me.primaryNodes.enable();
                            me.secondaryNodes.enable();
                            
                            me.primaryPools.disable()
                            me.secondaryPools.disable();
                        }
                        
                        
                   }
               });
                                                                        
                                                                        
		this.primaryNodes.disable();
                this.secondaryNodes.disable();
                
                
                this.primaryNodes._syncChosen();
                this.secondaryNodes._syncChosen();
                
		this.load_priority();
		$("#"+this.html_id).show();
		// the_panel_new_job.load_status();
                this.constructor.superclass.loaded_html.apply(this,arguments);
					    
	 }  

         this.load_data = function() {
             $("#jobAddName").val("");
             $("#jobAddDescription").val("");
             $("#jobAddPriorityLevel").val("");
             
             $("#jobAddTimeout").val("");
             $("#jobAddRetries").val("");
             $("#jobAddStatus").prop("checked",true)
             ;
         }
         this.validate= function() {
             
             if (!$("#jobAddName").formValidate() || !$("#jobAddPriorityLevel").formValidate()) return false;
             
             if ($("#jobAddGroup_select").val()==null) {
                 
                 App.errorMsg("Add Job","You must select a job group");
                 return false;
             }
             if (!this.typedProps) {
                    App.errorMsg("Add Job","You must configure a plugin first");
                    return false;
                }       
             
             return true;
             
         };
	 this.loadJobData= function (job)
	{
	
            App.mainBox =App.progressMsg("Duplicate Job","Loading form with job data...");
             this.$job = job;
             
             $("#jobAddName").val(job.name);
             $("#jobAddDescription").val(job.description);
             $("#jobAddPriorityLevel").val(job.priority);
             $("#jobAddGroup").val(job.userGroup);
             $("#jobAddTimeout").val(job.timeout);
             $("#jobAddRetries").val(job.retries);
             $("#jobAddStatus").prop("checked",job.enabled);
             
             if (Array.isArray(job.$primaryNodes) && job.$primaryNodes.length>0)
             {   
                $(this.primaryNodes.$select).val(job.$primaryNodes);
                  this.primaryNodes._syncChosen();
                  
                $("#jobAddRadioNodes").prop("checked",true);  
                 this.primaryNodes.enable();
                 this.secondaryNodes.enable();
             }   
             
             if (Array.isArray(job.$secondaryNodes) && job.$secondaryNodes.length>0)
             {   
                $(this.secondaryNodes.$select).val(job.$secondaryNodes);
                  this.secondaryNodes._syncChosen();
                  
                  $("#jobAddRadioNodes").prop("checked",true);  
                  this.primaryNodes.enable();
                  this.secondaryNodes.enable();
             }
             
             if (Array.isArray(job.$primaryPools) && job.$primaryPools.length>0)
             {   
                $(this.primaryPools.$select).val(job.$primaryPools);
                  this.primaryPools._syncChosen();
                  
                  $("#jobAddRadioPools").prop("checked",true);  
                  
                  this.primaryPools.enable();
                  this.secondaryPools.enable();
             }   
             
             if (Array.isArray(job.$secondaryPools) && job.$secondaryPools.length>0)
             {   
                $(this.secondaryPools.$select).val(job.$secondaryPools);
                  this.secondaryPools._syncChosen();
                  
                  $("#jobAddRadioPools").prop("checked",true);  
                  this.primaryPools.enable();
                  this.secondaryPools.enable();
             }
             
             var plugin = job.plugin.split(":")[0],
                 config = job.plugin.split(":")[1];
                 
                 
             this.pluginConfigBox.on("loaded",function() {
                 App.mainBox.progress(50);
                
                this.pluginConfigBox.val(config);
                $("#addJobPropsPanel").show();
                
                job.on("properties",function(props) {
                     
                     var me = this;
                    // this.pluginConfigBox.fireEvent("change",{selected:config},true);
                     
                         this.typedProps=props;     
                       
                                              
                       $("#jobAdd_Properties").html(App.Widget.renderTemplate("typedProps",{code:JSON.stringify(this.typedProps)}));
                       
                       $("#addJobPropsPanel").show();
                       
                       /*$("#jobAddEditProps").click(function() {
                           me.pluginEditor.show();
                       });*/
                       
                       $("#jobAddDeleteProps").off("click").click(function() {
                           me.pluginEditor.close();
                           delete me.pluginEditor;
                           delete me.typedProps;
                           $("#jobAdd_Properties").empty();
                           
                           //$("#addJobPropsPanel").hide();
                           
                       });
                      
                     
                     App.mainBox.progress(100);
                     App.mainBox.done();
                },this);
                
                job.requestProperties();
                
                
                
                
                
             },this);    
                 
             
             this.pluginsBox.val(plugin);
             
             this.pluginsBox.fireEvent("change",{selected: plugin});
             
             
             
             
	}
	 

	 
	this.add_job= function ()
	{
// 		log4javascript.getRootLogger().info("#btnAddJob ---> add_job");
		
		var id_property;
		
		var new_job_properties = new Object();
		
		var jobAddName =  $('#jobAddName').val();
		
		var jobAddDescription =  $('#jobAddDescription').val();
		
		var jobAddPriorityLevel =  $('#jobAddPriorityLevel').val();
		
		if (jobAddPriorityLevel >= -255 && jobAddPriorityLevel <= 255)
		{
			jobAddPriorityV = jobAddPriorityLevel;
		}else
		{
			App.errorMsg("Add Job","Priority has an incorrect value. It must be between "+App.Users.getCurrentUser().isSuperAdministrator()?"-255 and +255" : "-100 and +100");
			return (false);
		}
		
		/// Sacamos las propierdades particulares de ese job
		/*var configuration_properties=getConfigurationProperties(this.data_plugin.value, this.configuration_selected);
		
			
		
		for (var k in configuration_properties)
		{

			
			id_property="id_propierty_"+k;
			
			/// Hay que remplazar "[" y "]" porque son caracteres que usa el Jquery para indicar el ID de manera "especial2
			id_property=id_property.replace("[", "\\[");
			id_property=id_property.replace("]", "\\]");
			

			
			if(getTypeProperty(k)=="multipath")
			{
				new_job_properties[k]=[$('#'+id_property).val()];
				
			}
			else if(getTypeProperty(k)=="exec_output_handler")
			{
				/// Habr�a que cargarlo de un inteface nuevo donde configurar todos los elementos
				
				if($('#'+id_property).val()!=="")
				{
					new_job_properties[k]=new Object();
					new_job_properties[k].progress=$('#'+id_property).val();
					
// 					new_job_properties["process"]=$('#'+id_property).val();
				}
			}
			else
			{
				if($('#'+id_property).val()!=="")
				{
 					new_job_properties[k]=$('#'+id_property).val();
				}
			}
		}
		
		
		var id_configuration=this.plugin_selected+":"+ this.configuration_selected;*/

                if (!App.config.debug || $("#jobsDebug").val()=="")  {  
                 
                    this.addJob(jobAddName, jobAddDescription,  jobAddPriorityV);
                }
                else {
                    if (!$.isNumeric($("#jobsDebug").val()))
                        alert("Enter number of jobs to generate");
                    else
                    {
                        var n =parseInt($("#jobsDebug").val());
                        App.mainBox= App.progressMsg("New Job","Generating jobs...");
                        $.ajaxSetup({async:false});
                        for (i=0;i<n;i++)
                        {
                            
                            
                            this.addJob(jobAddName+"_"+i, jobAddDescription,  jobAddPriorityV,true);
                         //   App.mainBox.progress(Math.round(i*100 / n));
                            
                        }
                        
                        //App.mainBox.progress(100);
                        //App.mainBox.done();
                        $.ajaxSetup({async:true}); 
                    }
                    
                }
		
	}
	
	
	this.addJob = function(name,description,priority,nomsg) {
           
           var me=this;
           
           this.plugin = App.API.Plugins.getPlugin(this.pluginsBox.val());
           this.pluginConfig=this.plugin.getConfigurations();//.find(function(conf) {return conf.id == this.pluginConfigBox.val(this);
           console.debug(this.pluginConfig);
           this.pluginConfig =this.pluginConfigBox.getSelectedModel();
            this.newJob = new App.Model.Job({
                id:0,
                name: name,
                description:description,
                plugin:this.plugin.id+":"+this.pluginConfig.id,
                properties: this.typedProps,
                priority: priority,
                retries: $("#jobAddRetries").val()=="" ? undefined : $("#jobAddRetries").val(),
                timeout: $("#jobAddTimeout").val()=="" ? undefined : $("#jobAddTimeout").val(),
                userGroup: $("#jobAddGroup select").val(),
                enabled: $("#jobAddStatus").get(0).checked,
                primaryNodes: $("#jobAddRadioNodes").get(0).checked ? $("#jobAddPrimaryNode select").val() : null,
                secondaryNodes: $("#jobAddRadioNodes").get(0).checked ? $("#jobAddSecondaryNode select").val() : null,
                primaryPools: $("#jobAddRadioPool").get(0).checked ? $("#jobAddPrimaryPool select").val() : null,
                secondaryPools: $("#jobAddRadioPool").get(0).checked ? $("#jobAddSecondaryPool select").val() : null,
                postJobs: undefined,
                
            });
            if (!nomsg)
            var pr = App.progressMsg("New Job","Adding a job: "+ this.newJob.name);
            
            App.API.Jobs.addJob(this.newJob,function(result) {
                if (result.status == croupier.ResponseStatus.SUCCESS)
                {
                        pr.progress(100);
                        pr.done();
                }else
                {
                    pr.abort();
                }
                
                me.close();
            })
            
        };
// 	function new_job_selected_plugin ()
	
	
	this.load_priority= function()
	{


		
		for (var k in CONSTANT.PRIORITY.A_DEFINED)
		{
			
			var map_var={
							$VAR_VALUE$: CONSTANT.PRIORITY.A_DEFINED[k]
							,$VAR_TEXT$: k+ " ("+CONSTANT.PRIORITY.A_DEFINED[k]+")"
						};
			
			
			// html='<option ';
			if( CONSTANT.PRIORITY.DEFAULT == k)
			{
				// html+=' selected ';		
				// log4javascript.getRootLogger().info("k =>"+k+ " = valor => "+CONSTANT.PRIORITY.A_DEFINED[k]);	
				$("#jobAddPriorityLevel").val(CONSTANT.PRIORITY.A_DEFINED[k]);
				
				map_var["$VAR_SELECTED$"]="selected";
			}
			else
			{
				map_var["$VAR_SELECTED$"]="";
			}

			// 				html='<option data-icon="glyphicon-heart">Ketchup</option>';
			html=replaceAll(HTML_CODE.new_job.data_plugin,map_var);	
			$("#jobAddPriority").append(html);				
		}		
	}
	
	// 	function selected_priority ()
	this.select_priority= function ()
	{		
		
		// LO QUE SE HACE ES A�ADIR LO SELECCIONADO AL CAMPO DE AL LADO QUE MUESTRE LA INFORMACION Y SE A�ADA AL JOB.		
		// recoger el valor
		var priority_selected=$('#jobAddPriority').val();
		
		// log4javascript.getRootLogger().info("priority_selected =>"+priority_selected);	

		if(this.select_priority)
		{
			
			$("#jobAddPriorityLevel").val(priority_selected);
			
			// log4javascript.getRootLogger().info("jobAddPriorityLevel:"+jobAddPriorityLevel);
			jobAddPriorityV = jobAddPriorityLevel;		
		}
	}
	

	
	
	App.Panel.NewJob.superclass.constructor.apply(this,arguments);



},


    
});


window.panel_new_job = App.Panel.NewJob;
