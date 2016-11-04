Ext.ns("App");
/** 
 * 
 * 
 * @class Panel
 * @namespace App
 * */
// var panel = function ()


/** Para los nuevos paneles
* panel_XXXX.html
* panel_XXXX.js
* define (a�adirlo a CONSTANT.panels)
* html_code.js (cargar el html)
* index.html (cargar el js)
* button_opn_tabs.html (a�adir id)
* button_opn_tabs.js (a�adir acccion de boton)
*/
App.Panel = Ext.extend(Ext.util.Observable,{
    
    constructor: function()
{
	
	
        App.Panel.superclass.constructor.apply(this,arguments);
        
        this.addEvents(
                /**
                 * @event loaded Fired when panel processes loaded_html();
                 */
                'loaded',
                /**
                 * @event show Fired when panel shows
                 */
                'show',
                /**
                 * @event hide Fired when panel hides
                 */
                'hide'
                
        );
	
        
        this.tables = [];
	this.html_id;
	this.url;
	
	this.loaded=false;
	
	this.tab_id;
	
	
	this.html_code="";
	this.htmlCodeId;
// 	this.type_panel="panel";
	
	
	/// ATRIBUTOS 
	
// 	this.html_id;
// 	this.url;
// 	
	/// CONSTRUCTOR AL FINAL PAR PODER USAR LOS METODOS DECLARADOS


	
	
	/// METODOS 
	///		PRIVADOS 
	///			var metodo =function()[];
	///		PUBLICOS 
	///			this.metodo =function()[];
	

// 		
		
	/// CONSTRUCTOR	 (despues de las declaraciones para poder usar los metodos delcarados
	



// 	/** Carga de p�gina. Normalmente llamada en el costructor, debne incluir en el callback la llamada a loaded_html
// 	*
// 	*/type_tab
	this.load_html= function ()	
	{
            
            console.warn("[App.Panel] loading html of "+this.html_id);
  		if(this.html_id)
 		{
// 			log4javascript.getRootLogger().info("#########panel  load_html html_id:"+this.html_id);
			
// 			
// 			log4javascript.getRootLogger().info("-----------panel  load_html html_id:"+HTML_CODE.panels.monitor);
// 			
			if(!existInHTML("#"+this.html_id))
			{
// 				log4javascript.getRootLogger().info("#########panel  load_html html_id:"+this.html_id+" NO EXITE -> CREAMOS");
				$("#main_container").append("<div id='"+this.html_id+"' ></div>");
                                
                                
                                  /*  $("#main_container").append(App.Widget.renderTemplate(this.constructor.length>1 ? "panel_data":"panel",{
                                        id: this.html_id,
                                        title:this.title || "Details",
                                        
                                  }));*/
				
				
			}
// 		
// 			$("#"+this.html_id).show();
			$("#"+this.html_id).hide();
// 	// 	$("#"+this.html_id).html(HTML_CODE.panels.monitor);

			if(this.htmlCodeId==undefined)
			{
// 				log4javascript.getRootLogger().info("#########panel  load_html html_id:"+this.html_id+"---->this.htmlCodeId==undefined");
				
				
				
// 				log4javascript.getRootLogger().info("#########panel  load_html class_panel:"+this.define.class_panel);
// 				log4javascript.getRootLogger().info(HTML_CODE.panels.button_open_new_tabs);
				
				
// 				$("#"+this.html_id).append(HTML_CODE.panels.button_open_new_tabs);
				$("#"+this.html_id).append(HTML_CODE.panels[this.define.class_panel]);
				
			}else
			{
// 				log4javascript.getRootLogger().info("#########panel  load_html html_id:"+this.html_id+"---->this.htmlCodeId!=undefined  ");
				
				
// 				log4javascript.getRootLogger().info(this.htmlCodeId);
				
				
// 				log4javascript.getRootLogger().info(HTML_CODE.panels.panel_monitor);
				
// 				log4javascript.getRootLogger().info(this.htmlCodeId);
				
// 				$("#"+this.html_id).append(replaceAll(HTML_CODE.panels.panel_monitor, this.htmlCodeId));
				
				$("#"+this.html_id).append(replaceAll(HTML_CODE.panels[this.define.class_panel], this.htmlCodeId));
				
// 				$("#"+this.html_id).append(HTML_CODE.panels.panel_monitor);
			}
				
// 		
// 			
			this.loaded=true;
			this.loaded_html();
                        
                        this.fireEvent('loaded');
// 			log4javascript.getRootLogger().info("#########panel  load_html html_id:"+this.html_id+"  END");
 		}
// 		
// 		
	}
	
	
	
	this.getTabId= function ()
	{
		return this.tab_id;
	}

//  	log4javascript.getRootLogger().info("panel html_id:"+this.html_id);

	this.load_html();
        
        
},
loaded_html: function() {
    
    
    
    /*console.log("Panel:: loaded_html()");
    if (!croupier.$allEventReceived) {
        croupier.on(croupier.ModificationType.__names__[croupier.ModificationType.all],this.initialLoad,this);
    } else {
        this.initialLoad();
    }
    
    Ext.query("section .max-min-trigger").forEach(function(btn) {
        
     $(btn).click(function() {
         
   
        var sect = Ext.fly(btn).parent("section");
        var iconBtn = Ext.fly(btn).child("span");
        
        var opt = {
            duration: 1,
            easing: 'elasticIn',
            //callback: this.foo,
            //scope: this
        };
        
        var lastH = sect.getAttribute("data-last-height");
        
        
        
        
        
        if (iconBtn.hasClass("glyphicon-minus")) { //close
            sect.dom.setAttribute("data-last-height",sect.getHeight());
            sect.setHeight(0,opt);
            iconBtn.removeClass("glyphicon-minus");
            iconBtn.addClass("glyphicon-plus");
        } else { //open
            
            sect.setHeight(lastH,opt);
            iconBtn.removeClass("glyphicon-plus");
            iconBtn.addClass("glyphicon-minus");
        }
     });
    });*/
    
    
},
show: function() {
   if (this.constructor.length>1) 
   {
       $("#"+this.html_id+"_popup").modal({backgrop:"static"}); 
   }
   
   $("#"+this.html_id).show(); 
   
   $("#"+this.html_id).css("z-index",App.Panel.zIndex++);
   
   if (App.mainBox)
        $("#"+App.mainBox.id).remove();
    
   $("a[data-toggle]").popover(); 

   this.fireEvent("show",this.tab_id);
},
hide: function() {
    $("#"+this.html_id).hide();
    
    this.fireEvent("hide",this.tab_id);
},
close: function() {
    console.debug("close " +this.html_id);
    $("#"+this.html_id).remove();
    
    this.fireEvent("close",this.tab_id);
}


});
/**
 * Last panel z-index
 * 
 * @type int 
 * @static
 */
App.Panel.zIndex = 0;

/**
 * @deprecated Global shortcut
 */
window.panel = App.Panel;