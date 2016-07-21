/**
 * Proyecto: Zinkia Croupier
 * Autor: 
 * Descripcion: Objeto para la gestion de usuarios de Croupier.
 * 
 * @class User
 * @namespace App.Croupier    
 * @description Objeto para la gestion de usuarios de Croupier.
 * 
 * TODO: Migrar a App.API
 */

Ext.namespace("App.Croupier");


App.Croupier.User = Ext.extend(App.Croupier.General, {
   
  login: function() {
    console.info("Trying to login with name: "+$("#user").val());  
    
    croupier.login($("#user").val(),md5($('#password').val()),App.config.clientId,this.onLogin,this);
    
  },

  checkLogin: function(data) {
   
  },

  logout: function() {
     croupier.logout();
     
     
     if (Array.isArray(App.tabs.a_tabs))
                    App.tabs.a_tabs.forEach(function(tab) {tab.close();});
                
     $( "#signin_form" ).fadeIn();
     
     location.reload(); //TODO: Temporalmente recargamos pagina.
     
  },
  
  constructor: function() {
        var me =this;
        
        
        this.addEvents('loginsuccess','loginerror');
        
   	$('#signin_form').submit(function(e) 
	{
			///detiene la acci�n por defecto de este evento (en este caso enviar el formulario)
			e.preventDefault(); 
			e.stopImmediatePropagation();
                        
			if(typeof LOGANDOSE=="undefined" || LOGANDOSE==false)
			{
				LOGANDOSE=true;

				/// Ocultamos la alerta
				$('#info').hide();

				/// Sacamos la pass
		// 		$('#password').val( md5($('#password').val()));
				var pass= md5($('#password').val());
				var user= $('#user').val();
				
				me.login(user,pass);
			}
	});

 
  },
  onLogin: function(response) {
      console.info("login done");
      if (response.status==croupier.ResponseStatus.SUCCESS)
	{
		
// 		log4javascript.getRootLogger().info("admin.onLogin: OK!");
                Ext.apply(this,response.value);
			
		$('#info').html('Login Success. Redirecting...')
						.removeClass('alert-danger alert-success')
						.addClass('alert-success')
						.fadeIn('slow');
	// 			
			

			
                
		
		LOGANDOSE=false;
                App.user.fireEvent("loginsuccess");

	}
	else
	{
 		App.user.fireEvent("loginerror",response);
                console.warn("Login error: "+JSON.stringify(response));
	}
  }
  

});

