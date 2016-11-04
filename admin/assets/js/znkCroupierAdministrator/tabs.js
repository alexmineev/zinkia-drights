/**
 * Clase para controlar el widget de tabs.
 * 
 * @class Tabs 
 * @param {Object} config {html_id,scrollBarWidths,wrapperClass,listClass,scrollerLeftClass,scrollerRightClass}
 * 
 * @namespace App
 * @requires jQuery
 */

Ext.namespace("App");
App.Tabs = function(config) {
                
        Ext.apply(this,config);
        
	this.a_tabs=[];
	this.tab_active=null;
	
// 	this.id_monitor_active=null;
// 	this.url='assets/html/tabs.html';


	/// estatico
	App.Tabs.cont_tab=0;
        
        
        this.__defineGetter__("widthOfList",this._widthOfList);
        this.__defineGetter__("widthOfHidden",this._widthOfHidden);
        this.__defineGetter__("leftPosition",this._leftPos);
        
        this.$init();
        
}

App.Tabs.prototype.destroy = function() {
    console.debug(this.a_tabs);
    for (tab in this.a_tabs) {
         console.debug(tab);
         $("#"+this.a_tabs[tab].html_id).remove();
         this.close_tab(tab);
         
         
    }
}

App.Tabs.prototype._widthOfList = function(){
  var itemsWidth = 0;
  $('.'+ this.listClass+' li').each(function(){
    var itemWidth = $(this).outerWidth();
    itemsWidth+=itemWidth;
  });
  return itemsWidth;
};

App.Tabs.prototype._widthOfHidden = function(){
  return (($("."+this.wrapperClass).outerWidth())-this.widthOfList-this.leftPosition)-this.scrollBarWidths;
};

App.Tabs.prototype._leftPos = function(){
  return $('.'+this.listClass).position().left;
};

App.Tabs.prototype.reAdjust = function(){
  if (($('.'+this.wrapperClass).outerWidth()) < this.widthOfList) {
    $('.'+this.scrollerRightClass).show();
  }
  else {
    $('.'+this.scrollerRightClass).hide();
  }
  
  if (this.leftPosition<0) {
    $('.'+this.scrollerLeftClass).show();
  }
  else {
    $('.'+this.listClass).animate({left:"-="+this.leftPosition+"px"},'slow');
  	$('.'+this.scrollerLeftClass).hide();
  }
}
App.Tabs.prototype.$init = function() {
    
    $("#tabs").empty();
    //$("#main_container").empty();
    this.reAdjust();

    var me = this;
    $(window).on('resize',function(e){  
        	me.reAdjust();
    });

$('.'+this.scrollerRightClass).click(function() {
  me.goTo(-150);
    
});

$('.'+this.scrollerLeftClass).click(function() {

  me.goTo(150);
});        

$("#"+this.html_id).sortable();

this.goToStart();
}

App.Tabs.prototype.goTo = function(offset) {
        var me=this;
       $("."+this.listClass).animate({left:(offset>=0?"+=":"-=")+Math.abs(offset)+"px"},"fast",function() {
           if (me.leftPosition<0)
               $('.'+me.scrollerLeftClass).show();
           else 
               $('.'+me.scrollerLeftClass).hide();
           
           
           if (me.widthOfHidden<0)
             $('.'+me.scrollerRightClass).show();
            else
              $('.'+me.scrollerRightClass).hide();
           
          
          if (me.widthOfHidden<0 && me.leftPosition<0)
          {
                $('.'+me.scrollerRightClass).show();
                $('.'+me.scrollerLeftClass).show();
          }
       });
} 

App.Tabs.prototype.goToEnd = function() {
   $('.'+this.scrollerLeftClass).fadeIn('slow');
   $('.'+this.scrollerRightClass).fadeOut('slow');
  
  //$('.'+this.listClass).animate({left:"+="+this.widthOfHidden+"px"},'slow',function(){
    this.goTo(this.widthOfHidden);
      
 
}
    
App.Tabs.prototype.goToStart = function() {
       $('.'+this.scrollerRightClass).fadeIn('slow');
        $('.'+this.scrollerLeftClass).fadeOut('slow');
  
  	this.goTo(-this.leftPosition);
    
}
    
    
    
    App.Tabs.prototype.getNewIdTab=function()
	{
		
		var cont_tab_return = "tab__"+App.Tabs.cont_tab;
		
		App.Tabs.cont_tab++;
		
		return (cont_tab_return);
	}

	
	
	App.Tabs.prototype.getTabByType=function(type_tab)
	{
	
		return buscar_elemento(	this.a_tabs
								,function(elem)
								{
									return elem.define.class_panel==type_tab.class_panel;
									
								}
							);
	}

	App.Tabs.prototype.close_tab=function(id_tab)
	{
// 		log4javascript.getRootLogger().info("DELETE tab:"+id_tab);
		
		
		
// 		log4javascript.getRootLogger().info(this.a_tabs[id_tab].tab_id+"=="+this.tab_active.getTabId());
		
		if(this.a_tabs[id_tab].tab_id==this.tab_active.getTabId())
		{
// 			log4javascript.getRootLogger().info("ACTIVO !!!!!! tab:"+id_tab);
			
			var a_tabs_keys=Object.keys(this.a_tabs);
			
			
			
			if(a_tabs_keys[a_tabs_keys.length-1]==id_tab)
			{
				/// Si es el �ltimo se activa el anterior
// 				log4javascript.getRootLogger().info("ULTIMO !!!!!! tab:"+id_tab);
				
				if(a_tabs_keys.length!=1) /// Si hay m�s de esta pesta�a
				{
					this.setActiveTabId(a_tabs_keys[a_tabs_keys.length-2]); /// activamso la anterior
				}
				
			}else
			{
				/// Si no lo es se activa el siguiente 
				
				var k_tab=buscar_elemento(a_tabs_keys, 
								function(elem)
								{
									return elem==id_tab;
								}
								
				)
				
				
// 				log4javascript.getRootLogger().info("NO ULTIMOP POS tab:"+k_tab+"====>"+a_tabs_keys[k_tab]);
				
				var next_id_tab=parseInt(k_tab)+1;
				
				var next_tab= a_tabs_keys[next_id_tab]
				
// 				log4javascript.getRootLogger().info("SIGUIENTE POS tab:"+next_id_tab+"====>"+next_tab);
				
				this.setActiveTabId(next_tab); /// activamos la siguiente
			}
		}
		
		this.a_tabs[id_tab].close();
		
		$("#"+id_tab).remove();
		
		delete this.a_tabs[id_tab];
                
                this.reAdjust();
                
               
		
	}
	
	
	App.Tabs.prototype.create_tab=function(type_tab,name)
	{

                if (!type_tab || type_tab.length==0) return;
		var me = this;
 		if(!type_tab.replicate && this.getTabByType(type_tab)!=false)
 		{
			/// Si no es replicable y ya esxiste uno de ese tipo se activa en vez de crear
// 			log4javascript.getRootLogger().info("NO REPLICABLE Y EXISTE => ACTIVAR: "+this.getTabByType(type_tab));
			
			this.setActiveTabId (this.getTabByType(type_tab));
			
		}else
		{
// 			log4javascript.getRootLogger().info("REPLICABLE O NO EXISTE => CREAR:");
			
			var id_tab=this.getNewIdTab();
			

			
			/// Creamos el panel dentro del array de 
                        Ext.ns("App.panels."+type_tab);
                        
                        console.log(type_tab.class_panel);
                        
			App.panels[type_tab].class_panel=this.a_tabs[id_tab]=new window[type_tab.class_panel](id_tab);
                        //this.tabs.push(this.a_tabs[id_tab]);
                        this.a_tabs[id_tab].$class = type_tab.class_panel;
                        this.a_tabs[id_tab].tabLabel = type_tab.text_default;
			

			this.setActive(this.a_tabs[id_tab]);
			
			
			if(type_tab.replicate)
			{
				var HTML_CODE_li_tab=HTML_CODE.li_tab_editable;
			}else
			{
				var HTML_CODE_li_tab=HTML_CODE.li_tab_no_editable;
			}
			
			$("#tabs").append(replaceAll(HTML_CODE_li_tab, 												
										{
											$ID_TAB$: id_tab
											,
	// 										$NAME_TAB$: type_tab.text_default+"("+id_tab+")"
											$NAME_TAB$: name || type_tab.text_default
											
											
										
										}
									)
							);
                        $('#go_'+id_tab).data(this.a_tabs[id_tab]);                                
			$('#go_'+id_tab).click(
							function(e)
							{
								e.preventDefault(); 
// 								log4javascript.getRootLogger().info("GO TO TAB "+id_tab);
								me.setActiveTabId(id_tab);
								
								
								
							}
							);
			

			
			var txt = $("#go_"+id_tab).text();

			var me=this;
                        
			$('#edit_'+id_tab).click(
							function(e)
							{
								e.preventDefault(); 

// 								$("#text_editing_"+id_tab).focus();
								
// 								log4javascript.getRootLogger().info("1 edit TAB "+id_tab);
								var txt = $("#go_"+id_tab).text();
								
// 								log4javascript.getRootLogger().info("2 edit TAB "+id_tab);	
								$('#go_'+id_tab).hide();
								
// 								log4javascript.getRootLogger().info("3 edit TAB "+id_tab);
								$("#text_editing_"+id_tab).show();
								
// 								log4javascript.getRootLogger().info("4 edit TAB "+id_tab);
// 								$("#text_editing_"+id_tab).focus();
								
// 								log4javascript.getRootLogger().info("5 edit TAB "+id_tab);
								$("#text_editing_"+id_tab).val(txt);
								
                                                                  me.a_tabs[id_tab].tabLabel = txt;  
							}
							);
			
                              var editHandler = function(e)
									{
                                                                            if (e.keyCode!==13) return true;
// 										
// 	// 									
											
											var txt = $("#text_editing_"+id_tab).val();

											$("#go_"+id_tab).text(txt);
											$("#go_"+id_tab).show();
	// 										$("#text_editing_"+id_tab).focusout();
											$("#text_editing_"+id_tab).hide();
										
									};
                                                        
				$('#text_editing_'+id_tab)
                                            .keydown(editHandler)
                                            .change(editHandler);
			
			
			
			$('#close_'+id_tab).click(
							function(e)
							{
								e.preventDefault(); 
// 								log4javascript.getRootLogger().info("GO TO TAB "+id_tab);
								me.close_tab(id_tab);
								
								
								
							}
		
                        
                        
                        );
                
                    }
                    
                    this.reAdjust();
                  return this.a_tabs[id_tab];  
               }
			
    App.Tabs.prototype.setActiveTabId=function (id_tab)
	{
		
// 		the_App.Tabs.id_tab_active=id_tab;
		
// 		for(var k in this.a_tabs[CONSTANT.panels.monitor.class_panel])						
// 		{
		

		for(var k in this.a_tabs)						
		{
			if(this.a_tabs[k].getTabId()==id_tab)
			{
				this.setActive(this.a_tabs[k]);
				return true;
			}
			
			
		}
					
			

								
		
	}
	
	App.Tabs.prototype.setActive=function (obj_tab)
	{
		this.tab_active=obj_tab;
		
		

		if(this.tab_active.define.class_panel==C.panels.panel_monitor.class_panel && this.loaded)
		{
			this.tab_active.update();
		}
		
		
		var one_active=false;
		
		for(var k in this.a_tabs)						
		{

			
			if(this.a_tabs[k].getTabId()!=this.tab_active.getTabId())
			{
				$("#"+this.a_tabs[k].getTabId()).removeClass( "active" );
				$("#"+this.a_tabs[k].getTabId()).addClass( "desactive" );
				
// 				log4javascript.getRootLogger().info("OCULTAR this.html_id:"+this.a_tabs[k].html_id);
				
// 				$("#"+this.a_tabs[k].html_id).hide();
				
				this.a_tabs[k].hide();
				
			}else
			{
				$("#"+this.a_tabs[k].getTabId()).removeClass( "desactive" );
				$("#"+this.a_tabs[k].getTabId()).addClass( "active" );
				


				this.a_tabs[k].show();
				
				if (typeof this.a_tabs[k].update == 'function') 
				{
					this.a_tabs[k].update();
				}
				
			}
		}
		
		
		
	}
	    