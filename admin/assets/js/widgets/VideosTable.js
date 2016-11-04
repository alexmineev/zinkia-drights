Ext.ns("App.Widget");

App.Widget.VideosTable = Ext.extend(App.Widget.Table,{
    constructor: function(config) {
        var me = this;
        config = App.Widget.Table.makeSelectable(config);
        Ext.applyIf(config,{
                    rowModel: App.Model.Video,
                    dom: "lftipr",
                    actions: [
                         {
                           label: "Ver todo el año",
                           hint: "Carga y processa datos de año elegido apartir de informes de YT CMS.",
                           iconClass: "ico-trimester-all",
                           noRowsAllowed: true,
                           multi:true,
                           scope:this,
                           validator: function() {
                              
                               if ($("#cmsList_select").val()!=null)
                                return true;
                               else {
                                   App.errorMsg("Zinkia Reports","Elige CMS con la cual quere trabajar");
                                   return false;
                               } 
                           },
                           handler: function() {
                               this.loadTrimester(0);
                           }
                        },
                        {
                           label: "Procesar primer trimestre",
                           hint: "Carga y processa datos de primer trimeste de este año apartir de informes de YT CMS.",
                           iconClass: "ico-trimester ico-trimester-first",
                           noRowsAllowed: true,
                           multi:true,
                           scope:this,
                           validator: function() {
                               if ($("#cmsList_select").val()!=null)
                                return true;
                               else {
                                   App.errorMsg("Zinkia Reports","Elige CMS con la cual quere trabajar");
                                   return false;
                               } 
                           },
                           handler: function() {
                               this.loadTrimester(1);
                           }
                        },
                        {
                           label: "Procesar segundo trimestre",
                           hint: "Carga y processa datos de segundo trimeste de este año apartir de informes de YT CMS.",
                           iconClass: "ico-trimester ico-trimester-second",
                           noRowsAllowed: true,
                           multi:true,
                           scope:this,
                           validator: function() {
                              
                               if ($("#cmsList_select").val()!=null)
                                return true;
                               else {
                                   App.errorMsg("Zinkia Reports","Elige CMS con la cual quere trabajar");
                                   return false;
                               } 
                           },
                           handler: function() {
                               this.loadTrimester(2);
                           }
                        },{
                           label: "Procesar tercer trimestre",
                           hint: "Carga y processa datos de tercer trimeste de este año apartir de informes de YT CMS.",
                           iconClass: "ico-trimester ico-trimester-third",
                           noRowsAllowed: true,
                           multi:true,
                           scope:this,
                           validator: function() {
                              
                               if ($("#cmsList_select").val()!=null)
                                return true;
                               else {
                                   App.errorMsg("Zinkia Reports","Elige CMS con la cual quere trabajar");
                                   return false;
                               } 
                           },
                           handler: function() {
                               this.loadTrimester(3);
                           }
                        },
                        {
                           label: "Procesar cuarto trimestre",
                           hint: "Carga y processa datos del cuarto trimeste de este año apartir de informes de YT CMS.",
                           iconClass: "ico-trimester ico-trimester-forth",
                           noRowsAllowed: true,
                           multi:true,
                           scope:this,
                           validator: function() {
                              
                               if ($("#cmsList_select").val()!=null)
                                return true;
                               else {
                                   App.errorMsg("Zinkia Reports","Elige CMS con la cual quere trabajar");
                                   return false;
                               } 
                           },
                           handler: function() {
                               this.loadTrimester(4);
                           }
                        },
                       
                        {
                            label: "Generar informe con grafico en formato Google Spreadsheet y cargar lo a repositorio en Google Drive",
                            hint: "Tranfiere los datos en formato Google Sheets dentro de repositorio de Google Drive.",
                            iconClass: "ico-drive",
                            noRowsAllowed :true,
                            scope:this,
                            validator: function(rows) {
                                return me.rows.length>0;
                            },
                            handler: function() {
                               
                               
                              /* var csvLines = this.rows.map(function(video) {
                                   var videos = [];
                                   
                                   videos.push('"'+video['title']+'"');
                                   videos.push('"'+video['channel']+'"');
                                   videos.push('"'+video['views']+'"');
                                   videos.push('"'+parseFloat(video['earnings']).toPrecision(2)+" USD"+'"');
                                   
                                   return videos.join(",");
                               });
                               
                               csvLines.unshift('"Título","Canal","Views","Earnings"');*/
                               var me =this;
                               App.mainBox = App.progressMsg("Youtube CMS Reports","Uploading data to Google Drive...");
                               
                               var title = $("#titleFilter").val();
                               var serie = $("#serieFilter").val();
                               var season = $("#seasonFilter").val();
                               var episode = $("#episodeFilter").val();
                               var langs = $("#langList_select").val();
                                
                               $.post(App.config.API.csvToDrive,{season:season,episode:episode,langs:langs,serie:serie,title:title,year:this.year,cms:this.cms,trimester:this.trimester,email:App.user.getEmail(),channels:$("#channelList_select").val()},function(resp) {
                                 
                                  
                                  App.mainBox.progress(100);
                                  App.mainBox.done();
                                  
             
                                  
                                  //App.mainBox.done();
                                 /* $.getScript("https://script.google.com/a/macros/zinkia.com/s/AKfycbzBjH6z9D_sSYVbuQ0omFO497oMupXJkoN2M8f_aunX1-zmj3_j/exec?filename="+req.filename+"&data="+escape(JSON.stringify(req.data)),function(resp) {
                                     App.mainBox.progress(100);
                                     App.mainBox.done();
                                     
                                     //window.open("https://docs.google.com/a/zinkia.com/spreadsheets/d/"+resp.id+"/edit?usp=sharing");
                                  });*/
                                  
                                  window.addEventListener("message",function(e) {
                                      
                                      App.mainBox.done();
                                      if (e.data.indexOf("{") == -1 && e.data.indexOf("$") == -1)
                                      {
                                          window.xdrive.close();
                                          window.open(e.data);
                                      }
                                        
                                  });
                                  
                                  
                                  App.mainBox =App.driveMsg("YouTube CMS Reports", "Generando informe como hoja de calculo en Google Drive (puede tardar unos minutos)"); 
                                  var xcomm = window.open("about:blank","xcomm","width=400,height=200,location=no,menubar=no,locationbar=no");
                                 // xcomm.document.write("Comunicando con Google...");
                                  window.xdrive=xcomm;
                                  xcomm.document.title="Comunicando con Google Drive...";
                                  
                                   var frm=$("<form>")
                                            .attr("action","https://script.google.com/a/macros/zinkia.com/s/AKfycbzBjH6z9D_sSYVbuQ0omFO497oMupXJkoN2M8f_aunX1-zmj3_j/exec")
                                            .attr("method","POST")
                                            .attr("target","xcomm");
                                            
                                    var cmsName = $("option[value='"+me.cms+"']").text();       
                                   $("<input>")
                                          .attr("type","hidden")
                                          .attr("name","filename")
                                          .attr("value",me.trimester>0 ? "ZINKIA_YT_REPORT_"+me.year+"_TRIMESTER_"+me.trimester+"_CMS_"+cmsName.replace(" ","_"):"ZINKIA_YT_REPORT_"+me.year+"_CMS_"+cmsName.replace(" ","_"))
                                          .appendTo(frm);
                                  
                                   $("<input>")
                                          .attr("type","hidden")
                                          .attr("name","cms")
                                          .attr("value",me.cms)
                                          .appendTo(frm);
                                  
                                   $("<input>")
                                          .attr("type","hidden")
                                          .attr("name","incImages")
                                          .attr("value",$("#incImages").prop("checked")?"1":"0")
                                          .appendTo(frm);
                                  
                                  $("<input>")
                                          .attr("type","hidden")
                                          .attr("name","data")
                                          .attr("value",resp)
                                          .appendTo(frm);
                                                         
                                   frm.submit();       
                                  
                                  
                               });
                               
                            }
                        }
                    ]
                    
                });
        
        
       App.Widget.VideosTable.superclass.constructor.call(this,config); 
       
      // App.mainBox=App.progressMsg("Zinkia MCN","Inicializando Google Drive API");
       
       /*gapi.client.load("drive","v3",function() {
           console.info("[VideoTable]: Drive API Loaded");
           App.mainBox.progress(30);
           gapi.client.drive.files.get({fileId: "1SIs4_9M0Ghn63tZEILoquree5RJHdURCC88e1XQf8WM",mimeType:"text/csv"})
                   .execute(function(seriesFile) {
                        App.mainBox.progress(50);
                        //alert(seriesFile.downloadUrl);
                        console.debug(seriesFile);
                   });
           
           
           
       });
       */
       
       this.load([]);
    },
    
    loadTrimester: function(trimester) {
                               var me = this;
                               
                               var year=$("#videosYear").val(); //new Date().getFullYear();
                               var cms = $("#cmsList_select").val();
                               var channels = $("#channelList_select").val();
                              
                               var title = $("#titleFilter").val();
                               var serie = $("#serieFilter").val();
                               var season = $("#seasonFilter").val();
                               var episode = $("#episodeFilter").val();
                               var langs = $("#langList_select").val();
                               //App.mainBox = App.progressMsg("YouTube Zinkia MCN","Conectando YouTube Zinkia MCN Dashboard y descargando informes. (Puede tardar un rato)");
                               
                              // $.getScript(App.config.API.fetchReports+"?year="+year+"&trimester="+trimester+"&cms="+cms+"&type=videoclaim",function(resp) {
                                    
                                 // if (window.__abort) {window.__abort = false; return;}
                                  
                                  App.mainBox = App.progressMsg("Zinkia Reports","Calculando visitas y ganancias del año y trimestre elegido. Puede tardar varios minutos.");
                                  
                                   var chList = Array.isArray(channels) ? "&channels="+JSON.stringify(channels) : ""; 
                                   var langList = Array.isArray(langs) ? "&langs="+JSON.stringify(langs) : "";
                                   
                                    $.getJSON(App.config.API.loadReports+"?year="+year+"&trimester="+trimester+"&type=videoclaim&cms="+cms+"&serie="+serie+"&title="+title+"&season="+season+"&episode="+episode+chList+langList,function(resp) {
                                        App.mainBox.progress(50);
                                       var videos = resp.videos.map(function(video) {
                                           return new App.Model.Video(video);
                                       });
                                       
                                       
                                       
                                       me.panel.videos = videos;
                                       
                                       me.on("loaded",function() {
                                          App.mainBox.progress(100);
                                          App.mainBox.done();

                                          switch (trimester) {
                                              case 1:
                                                  $(".ico-trimester-first").parent("a").css("background-color","grey");
                                                  $(".ico-trimester-second").parent("a").css("background-color","white");
                                                  $(".ico-trimester-third").parent("a").css("background-color","white");
                                                  $(".ico-trimester-forth").parent("a").css("background-color","white");
                                              break;
                                              case 2:
                                                  $(".ico-trimester-second").parent("a").css("background-color","grey");
                                                  $(".ico-trimester-first").parent("a").css("background-color","white");
                                                  $(".ico-trimester-third").parent("a").css("background-color","white");
                                                  $(".ico-trimester-forth").parent("a").css("background-color","white");
                                              break;
                                              case 3:
                                                  $(".ico-trimester-third").parent("a").css("background-color","grey");
                                                  $(".ico-trimester-second").parent("a").css("background-color","white");
                                                  $(".ico-trimester-first").parent("a").css("background-color","white");
                                                  $(".ico-trimester-forth").parent("a").css("background-color","white");
                                              break;
                                              case 4:
                                                  $(".ico-trimester-forth").parent("a").css("background-color","grey");
                                                  $(".ico-trimester-second").parent("a").css("background-color","white");
                                                  $(".ico-trimester-third").parent("a").css("background-color","white");
                                                  $(".ico-trimester-first").parent("a").css("background-color","white");
                                              break;
                                          }
                                          
                                       },me);
                                       
                                       me.load(videos);
                                       me.year = year;
                                       me.trimester = trimester;
                                       me.cms = cms;
                                       
                                       document.title = "YT_ZINKIA_CMS_"+year+"_TRIMESTER_"+trimester;
                                    });
                        
                                          
                                
                               //});
                               //$("#uploader").modal().show();
                           }
});

