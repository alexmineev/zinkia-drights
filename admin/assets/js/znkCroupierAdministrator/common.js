
function in_array(elemnt, myarray)
{
	if(jQuery.inArray(elemnt, myarray) != -1) 
	{
		return true;
// 		console.log("is in array");
	}else 
	{
		return false;
// 		console.log("is NOT in array");
	} 
}

function existInHTML(element)
{
	if ($(element).length)
	{
		return true;
	}else
	{
		return false;
	}
 

}

function arrayKeys(input) 
{
    var output = new Array();
    var counter = 0;
    for (i in input) 
	{
        output[counter++] = i;
    } 
    return output; 
}


function disableButton(id_button
)
{
	
	$(id_button).removeAttr('href');
	
// 	$(id_button).find("img").addClass('grayscale');
	var path_img =$(id_button).find("img").attr("src");
	path_img = path_img.replace("/active/", "/desactive/"); 
	$(id_button).find("img").attr("src", path_img);
	
	$(id_button).off( "click");
// 	$('#'+id_button).click(false);
// 	$('#'+id_button).unbind();
	
}

function enableButton(id_button, function_button)
{
	
	$(id_button).attr("href", "#");
	
	var path_img =$(id_button).find("img").attr("src");
	path_img = path_img.replace("/desactive/", "/active/"); 
	$(id_button).find("img").attr("src", path_img);
	
// 	$('body').on( "click", "#"+id_button , function_button);
	

 	$(id_button).click(function_button);
	
// 	$('#'+id_button).on( "click");
}

function buscar_elemento(listado, funcion_encontrado)
{


// 		
		
	if(!jQuery.isArray( listado ))
	{
		log4javascript.getRootLogger().error("La funci�n buscar_elemento necesita un array ");
		return(false);
	}else
	{
// 		log4javascript.getRootLogger().info("buscar_elemento ES ARRAY: ");
	}
	
// 	log4javascript.getRootLogger().info("listado");
// 	log4javascript.getRootLogger().info(listado);
	
	var encontrado=false;
	var cont=0;
// 	var tam=listado.length;
	
	var listado_keys=Object.keys(listado);
	var tam=listado_keys.length;
	
	
// 	log4javascript.getRootLogger().info(cont+"<"+tam);
	
// 	log4javascript.getRootLogger().info("buscar_elemento tam: "+tam);
	
	
 	while(encontrado==false && cont<tam)
 	{
		
// 		log4javascript.getRootLogger().info("buscar_elemento:"+cont+" ===> "+JSON.stringify(listado[cont]));
		encontrado=funcion_encontrado(listado[listado_keys[cont]]);
		cont++;
		
	}
	
	if(encontrado===false)
	{
		return false;
	}else
	{
		
// 		log4javascript.getRootLogger().info("buscar_elemento:"+cont+" ===> "+JSON.stringify(listado[cont-1]));
		
// 		log4javascript.getRootLogger().info("buscar_elemento:"+cont+" ===> "+JSON.stringify(listado[cont]));
		return listado_keys[cont-1];
	}
}


Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}

function getHourMinSec (my_date)
{
	if(my_date==undefined)
	{
		var my_date = new Date;
	}
	
   return (my_date.getHours().padLeft()+":"+my_date.getMinutes().padLeft()+":"+my_date.getSeconds().padLeft());
}


function escapeRegExp(string) 
{
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

// Para qeu con ".last" devuelva el �ltimo elemento del array
// Array.prototype.last = function() 
// {
//     return this[this.length-1];
// }

function select_all(idForm, prefix, value)
{

	if(value==undefined)	{	value=true;		}
	else if(value=='1')		{	value=true;		}
	else if(value=='0')		{	value=false;	}
	
	
	log4javascript.getRootLogger().info("select_all: "+value);
// 	alert ("SSSSSSSSSSSSSS");
//  	debug('in submitToThis');

	var prefix_element;
	var str;

	var form=document.getElementById(idForm);


	for (var i=0;i<form.elements.length;i++)
	{
		poner_a_true=false;

// 		alert (form.elements[i].name+'---->'+form.elements[i].type);
		if(form.elements[i].type=='checkbox' )
		{

			if(prefix!=undefined)
			{
				str=form.elements[i].name;
				prefix_element=str.substr(0,prefix.length);
// 				alert (form.elements[i].name+'---->'+prefix_element);

				if(prefix_element==prefix)
				{
					poner_a_true=true;
				}
			}else
			{
	// 			alert (form.elements[i].name);
				poner_a_true=true;

			}


			if(poner_a_true)
			{
				form.elements[i].checked = value;
			}

		}
	}






// 	debug('url='+url);
// 	debug('form.action='+form.action);
}

function replaceAll(str,mapObj)
{
	if(typeof str != "string")
	{
		log4javascript.getRootLogger().error("replaceAll() need a string in first parameter");
		return false;
	}
	
	var a_keys=Object.keys(mapObj);
	
	for (var k in a_keys)
	{
// 		a_keys[k]=a_keys[k].replace(new RegExp("$", 'g'),"\\$");
		
		a_keys[k]=escapeRegExp(a_keys[k]);

	}


/*	
	log4javascript.getRootLogger().info(" a_keys:");
	
	log4javascript.getRootLogger().info(a_keys);
	*/
	
	
	var re = new RegExp(a_keys.join("|"),"gi");
	  
	  
//     var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
	
// 	re=re.replace("$","\\$");
/*	
	log4javascript.getRootLogger().info("str:"+str);
	
	log4javascript.getRootLogger().info("re:"+re);
	
	log4javascript.getRootLogger().info("mapObj create_tab:");
	
	log4javascript.getRootLogger().info(mapObj);
	*/
	

    return str.replace(re, function(matched){
												return mapObj[matched];
											}
						);
}