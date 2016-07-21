Ext.ns("App.API");

/**
 * 
 * Singelton Jobs Class 
 * 
 * @class Jobs 
 * @memberOf App#API
 * @static
 */
App.API.Jobs = 
{
        getJobs: function() {
            return this.data.jobs.values(true).map(function(job) {
                  return this.getJob(job.id);
            },this);
        },
        getJob: function(id) {
             if (!id || ((job = this.data.jobs.get(id)) === null))
                    throw new Error("[Jobs]: No Job with id:"+id);
             
             return new App.Model.Job(job);
        },
        addJob: function(job,cbDone,scope) {
            /*
             * , $("#jobAddRadioNode").val()=="on" ? $("#jobAddPrimaryNode select").val() : null				///primaryNodes:JSON.stringify(primaryNodes),
  							, $("#jobAddRadioNode").val()=="on" ? $("#jobAddSecondaryNode select").val() : null
							, $("#jobAddRadioPool").val()=="on" ? $("#jobAddPrimaryPool select").val() : null				///primaryPools:JSON.stringify(primaryPools),
  							, $("#jobAddRadioPool").val()=="on" ? $("#jobAddSecondaryPool select").val() : null
             * 
             */
           
            croupier.api.job$add(	job.name,   			///name:name,
                                        job.description, 		///description:description,
					job.plugin,	///plugin:plugin,
					job.properties,
					job.priority,
					job.retries,
                                        job.timeout,
					job.userGroup,
                                        job.enabled,
                                        job.os,
					job.$primaryNodes || null,
					job.$secondaryNodes || null,
                                        job.$primaryPools || null,
                                        job.$secondaryPools || null,
                                        job.postJobs || null,
                                        function() {
                                            return cbDone.apply(scope,arguments);
                                        }
                                        ///postJobs:JSON.stringify(postJobs)
				);
	
// 	croupier.api.job$add(	"nombre"
// 							, null
// 							, "arnold:2.x"
// 							, {"i-path[]":["${croupier.repository}/../test/test.ass"]}
// 							, 0
// 							, 0
// 							, 0
// 							, 1
// 							, true
// 							, [1]
// 							, null
// 							, null
// 							, null
// 							, null
// 						);
	
        },
        setPriority: function(jobs,priority) {
            this.api.job$setPriority(jobs.toIds(),priority,function(res) {
              if (res.status == croupier.ResponseStatus.SUCCESS)  
                if (App.mainBox) {
                    App.mainBox.progress(100);
                    App.mainBox.done();
                }   
            });
        },
        pauseJobs: function(jobs,cancel) {
            this.api.job$pause(jobs.toIds(),cancel,function(res) {
              if (res.status == croupier.ResponseStatus.SUCCESS)  
                if(App.mainBox) {
                    App.mainBox.progress(100);
                    App.mainBox.done();
                }
            });
        },
        enableJobs: function(jobs,enabled) {
            this.api.job$setEnabled(jobs.toIds(),enabled,function(res) {
                if (res.status == croupier.ResponseStatus.SUCCESS)  
                if(App.mainBox) {
                    App.mainBox.progress(100);
                    App.mainBox.done();
                }
            });
        },
        removeJobs:function(jobs,perm) {
            this.api.job$remove(jobs.toIds(),perm,function(res) {
                if (res.status == croupier.ResponseStatus.SUCCESS)  
                if(App.mainBox) {
                    App.mainBox.progress(100);
                    App.mainBox.done();
                }
            })
        }
        
};

App.API.Jobs = $.extend(croupier,App.API.Jobs);



function getConfigurationProperties(plugin_properties, configuration_name)
{
	var configuration;
	var properties;
// 	var properties_configuration=
	
	/// Buscamos la configuracion en el listado de configuraciones
	var result = $.grep	(
							plugin_properties.configurations
							, 
							function(e)
							{
								return e.name == configuration_name; 
								
							}
						); 
	
// 	var pos=buscar_elemento(
// 									plugin_properties.configurations
// 									,
// 									function (elem)
// 									{
// 										return elem.name==configuration_name;
// 									}
// 							   )
// 	
// 	log4javascript.getRootLogger().info("pos:"+pos);
// 	if(pos!==false)
// 	{
// 		configuration=plugin_properties.configurations[pos];
// 	}else
// 	{
// 		/// error TODO
// 		
// 	}
	
	
	if (result.length !== 1) 
	{
//		ERROR		
// 		TODO �
// 		log4javascript.getRootLogger().info("configuration.length !== 1");
		
	}else
	{
		
		configuration=result[0];
// 		log4javascript.getRootLogger().info(configuration);
	}
// 	
	var result = $.grep(
							plugin_properties.properties
							,
							function(e)
							{
								return e.id == configuration.properties; 
								
							}
						); 
	
	if (result.length !== 1) 
	{
//		ERROR		
// 		TODO 
// 		log4javascript.getRootLogger().info("propierties.length !== 1");
	}else
	{
		properties=result[0].properties;
// 		log4javascript.getRootLogger().info(propierties);
	}

// 	log4javascript.getRootLogger().info(plugin_properties.properties);
// 	var pos=buscar_elemento(
// 									plugin_properties.properties
// 									,
// 									function (elem)
// 									{
// 										return elem.file==plugin_properties.configurations[pos].properties;
// 									}
// 							   )
// 	
// 	log4javascript.getRootLogger().info("pos:"+pos);
// 	if(pos!==false)
// 	{

// 		properties=plugin_properties.properties[pos].properties;
// //		ERROR		
// // 		TODO 
// // 		log4javascript.getRootLogger().info("configuration.length !== 1");
// 		
// 	}else
// 	{
// 		/// error TODO
// 		
// 	}
// 	
// 	log4javascript.getRootLogger().info(propierties);
	
// 	var lista_propiedades=arrayKeys(propierties);
	
	
// 	log4javascript.getRootLogger().info(configuration.overwrite);
	
	
	
	/// TODO
	/// TODO preguntar a carlos si es as� o con un "value"
	/// miramos si hay overwrite
	for (var k in configuration.overwrite)
	{
// 		log4javascript.getRootLogger().info(k);
/*
		var attri = properties.indexOf(k); 
		
		if(attri!=undefined)*/
	    if (!properties) continue;		
		if( properties.hasOwnProperty(k) )
		{
			propierties[k]=plugin_properties.configurations[pos].overwrite[k];
		}
	}
	
	
	
	
	return (properties);
}

	
function getTypeProperty(nameProperty)
{
	
	var fragmentos = nameProperty.split("-"); 
	
	
	if(fragmentos[1]==="s")
	{
		return "string";
		
	}else if(fragmentos[1]=="path")
	{
		return "path";
		
	}else if(fragmentos[1]=="path[]")
	{
		return "multipath";
		
	}else if(fragmentos[1]=="eoh")
	{
		return "exec_output_handler";//exec output handler
		
	}
	
	return "TypeProperty not procesable";
	
}
	
function add_job (name, description, id_configuration, propierties, priority)
{
	
// 	{"i-path[]":["${croupier.repository}/../test/test.ass"]}
// 
// 	{"i-path[]":["${croupier.repository}/../test/test_%02d[1-3#2].ass"]}
	
// // 	        =function(name,description,plugin,properties,priority,retries,timeout,userGroup,enabled,primaryNodes,secundaryNodes,primaryPools,secundaryPools,postJobs,callback)        {return request("job/add",
// 					{
// 					1.name:name,
// 					2.description:description,
// 					3.plugin:plugin,
// 					4.properties:JSON.stringify(properties),
// 					5.priority:priority,
// 					retries:retries,
// 					timeout:timeout,
// 					userGroup:userGroup,
// 					enabled:enabled,
// 					primaryNodes:JSON.stringify(primaryNodes),
// 					secundaryNodes:JSON.stringify(secundaryNodes),
// 					primaryPools:JSON.stringify(primaryPools),
// 					secundaryPools:JSON.stringify(secundaryPools),
// 					postJobs:JSON.stringify(postJobs)
// 					},
// 					callback)};
	
// 		log4javascript.getRootLogger().info(JSON.stringify(propierties));
			
			
		croupier.api.job$add(	name   			///name:name,
							, description 		///description:description,
							, id_configuration	///plugin:plugin,
							, propierties		///properties:JSON.stringify(properties),
							, priority			///priority:priority,
							, 0					///retries:retries,
							, 0					///timeout:timeout,
							, $("#jobAddGroup select").val()					///userGroup:userGroup,
							, true				///enabled:enabled,
							, $("#jobAddRadioNode").val()=="on" ? $("#jobAddPrimaryNode select").val() : null				///primaryNodes:JSON.stringify(primaryNodes),
  							, $("#jobAddRadioNode").val()=="on" ? $("#jobAddSecondaryNode select").val() : null
							, $("#jobAddRadioPool").val()=="on" ? $("#jobAddPrimaryPool select").val() : null				///primaryPools:JSON.stringify(primaryPools),
  							, $("#jobAddRadioPool").val()=="on" ? $("#jobAddSecondaryPool select").val() : null
							, null				///secundaryPools:JSON.stringify(secundaryPools),
							, null				///postJobs:JSON.stringify(postJobs)
						);
	
// 	croupier.api.job$add(	"nombre"
// 							, null
// 							, "arnold:2.x"
// 							, {"i-path[]":["${croupier.repository}/../test/test.ass"]}
// 							, 0
// 							, 0
// 							, 0
// 							, 1
// 							, true
// 							, [1]
// 							, null
// 							, null
// 							, null
// 							, null
// 						);
	
}

