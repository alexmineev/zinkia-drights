


// alert("HTML_CODE");
		


HTML_CODE=new Object();

HTML_CODE.Progres ='<div class="progress">';
HTML_CODE.Progres_bar='<div class="progress"><div class="progress-bar  progress-bar-info" role="progressbar" aria-valuenow="2" aria-valuemin="0" aria-valuemax="100" style="width:{WIDTH}%;">{PERCENT}%</div></div>';
HTML_CODE.Progres_bar_executed='<div class="progress"><div class="progress-bar  progress-bar-success" role="progressbar" aria-valuenow="2" aria-valuemin="0" aria-valuemax="100" style="width:{WIDTH}%;">{PERCENT}%</div></div>';
HTML_CODE.Progres_bar_danger='<div class="progress"><div class="progress-bar  progress-bar-danger" role="progressbar" aria-valuenow="2" aria-valuemin="0" aria-valuemax="100" style="width:{WIDTH}%;">{PERCENT}%</div></div>';
HTML_CODE.Progres_bar_warning='<div class="progress"><div class="progress-bar  progress-bar-warning" role="progressbar" aria-valuenow="2" aria-valuemin="0" aria-valuemax="100" style="width:{WIDTH}%;">{PERCENT}%</div></div>';

HTML_CODE.tr_pending="pending";
HTML_CODE.tr_disabled="disabled";
HTML_CODE.tr_finished="finished";
HTML_CODE.tr_paused="paused";
HTML_CODE.tr_error="with-error";
HTML_CODE.tr_progress="in-progress";
// HTML_CODE.checkbox="<input type='checkbox' />";

HTML_CODE.row_node ="<td><input type='checkbox' /></td>";
HTML_CODE.row_node+='<td>$VAR_OS$</td>';
HTML_CODE.row_node+='<td>$VAR_IP$</td>';
HTML_CODE.row_node+='<td>$VAR_NAME$</td>';
HTML_CODE.row_node+='<td>$VAR_STATUS$</td>';
HTML_CODE.row_node+='<td>$VAR_JOB_NAME$</td>';
HTML_CODE.row_node+='<td>$VAR_PROGRESS$</td>';
HTML_CODE.row_node+='<td>$VAR_TIME$</td>';
HTML_CODE.row_node+='<td>$VAR_NODE_POOLS$</td>';
HTML_CODE.row_node+='</tr>';


HTML_CODE.row_job ="<td><input type='checkbox' /></td>";
HTML_CODE.row_job+='<td>$VAR_ID$</td>';
HTML_CODE.row_job+='<td>$VAR_NAME_JOB$</td>';
HTML_CODE.row_job+='<td>$VAR_PLUGIN$</td>';
HTML_CODE.row_job+='<td>$VAR_PROGRESS$</td>';
HTML_CODE.row_job+='<td>$VAR_CONFIGURATION$</td>';
HTML_CODE.row_job+='<td>$VAR_STATUS$</td>';
HTML_CODE.row_job+='<td>$VAR_PRIORITY$</td>';
HTML_CODE.row_job+='<td>$VAR_ERRORS$</td>';
HTML_CODE.row_job+='<td>$VAR_WARNINGS$</td>';
HTML_CODE.row_job+='<td>$VAR_PRIMARY_POOLS$</td>';
HTML_CODE.row_job+='<td>$VAR_SECUNDARY_POOLS$</td>';
HTML_CODE.row_job+='<td>$VAR_PRIMARY_NODES$</td>';
HTML_CODE.row_job+='<td>$VAR_SECUNDARY_NODES$</td>';
HTML_CODE.row_job+='<td>$VAR_CHANGE_STATE$</td>';
HTML_CODE.row_job+='</tr>';


HTML_CODE.user_list=[];
HTML_CODE.user_list.row_user='<tr>';
HTML_CODE.user_list.row_user+='	<td>';
HTML_CODE.user_list.row_user+='		<input class="user_check" type="checkbox" id="user_checkbox_$user_id$"/>';
HTML_CODE.user_list.row_user+='</td>';
HTML_CODE.user_list.row_user+='	<td><a href="#" id="user_nick_$user_id$" id_user="$user_id$">$user_nick$</a></td>';
HTML_CODE.user_list.row_user+='	<td>$user_name$</td>';
HTML_CODE.user_list.row_user+='	<td>$user_subname$</td>';
HTML_CODE.user_list.row_user+='	<td>$user_mail$</td>';
HTML_CODE.user_list.row_user+='	<td>$user_role$</td>';
// HTML_CODE.user_lisdt.row_user+='	<td><input type="radio" $admin_checked$/></td>';
HTML_CODE.user_list.row_user+='	<td>$user_groups$</td>';
HTML_CODE.user_list.row_user+='</tr>';


HTML_CODE.user_data=[];
HTML_CODE.user_data.row_group='<tr>';
HTML_CODE.user_data.row_group+='	<td>';
HTML_CODE.user_data.row_group+='		<input type="checkbox" id="group_checkbox_$group_id$"/>';
HTML_CODE.user_data.row_group+='    </td>';
HTML_CODE.user_data.row_group+='	<td>$group_name$</td>';
HTML_CODE.user_data.row_group+='	<td>$group_num_users$</td>';
HTML_CODE.user_data.row_group+='</tr>';

HTML_CODE.user_data.row_group_other='<tr>';
HTML_CODE.user_data.row_group_other+='	<td>';
HTML_CODE.user_data.row_group_other+='		<input type="checkbox" id="group_checkbox_other_$group_id$"/>';
HTML_CODE.user_data.row_group_other+='  </td>';
HTML_CODE.user_data.row_group_other+='	<td>$group_name$</td>';
HTML_CODE.user_data.row_group_other+='	<td>$group_num_users$</td>';
HTML_CODE.user_data.row_group_other+='</tr>';



HTML_CODE.group_list=[];
HTML_CODE.group_list.row_group='<tr>';
HTML_CODE.group_list.row_group+='	<td>';
HTML_CODE.group_list.row_group+='		<input class="group_check" type="checkbox" id_group="$group_id$" id="group_checkbox_$group_id$"/>';
HTML_CODE.group_list.row_group+='</td>';
HTML_CODE.group_list.row_group+='	<td><a href="#" id="group_name$group_id$" id_group="$group_id$">$group_name$</a></td>';
HTML_CODE.group_list.row_group+='	<td>$number_users$</td>';
HTML_CODE.group_list.row_group+='	<td>$number_plugins$</td>';
HTML_CODE.group_list.row_group+='	<td>$number_pools$</td>';
HTML_CODE.group_list.row_group+='</tr>';






// HTML_CODE.li_tab='<li class="dropdown active" id="$ID_TAB$">';
// HTML_CODE.li_tab+='		<a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">';
// HTML_CODE.li_tab+='	$NAME_TAB$';
// HTML_CODE.li_tab+='			<span class="caret"></span>'
// HTML_CODE.li_tab+='		</a>';
// HTML_CODE.li_tab+='	<ul class="dropdown-menu">\n';
// HTML_CODE.li_tab+='		<li><a href="#" id="go_$ID_TAB$">Go to tab</a></li>\n';
// HTML_CODE.li_tab+='		<li class="divider"></li>\n';
// HTML_CODE.li_tab+='		<li><a href="#">Rename</a></li>\n';
// HTML_CODE.li_tab+='		<li><a href="#" id="close_$ID_TAB$">Close tab</a></li>\n';
// HTML_CODE.li_tab+='	</ul>\n';
// HTML_CODE.li_tab+='</li>';





HTML_CODE.li_tab_editable='<li class="dropdown active" id="$ID_TAB$">';
HTML_CODE.li_tab_editable+='		<a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">';
HTML_CODE.li_tab_editable+='		<input type="text" id="text_editing_$ID_TAB$" style=" display: none;"> '
HTML_CODE.li_tab_editable+='		<span id="go_$ID_TAB$">$NAME_TAB$</span> '
HTML_CODE.li_tab_editable+='			<span class="glyphicon glyphicon-pencil" STYLE="font-size: 10pt" id="edit_$ID_TAB$"></span>'
HTML_CODE.li_tab_editable+='			<span class="glyphicon glyphicon-remove" STYLE="font-size: 10pt" id="close_$ID_TAB$"></span>'
HTML_CODE.li_tab_editable+='		</a>';
HTML_CODE.li_tab_editable+='	</ul>\n';
HTML_CODE.li_tab_editable+='</li>';



HTML_CODE.li_tab_no_editable='<li class="dropdown active" id="$ID_TAB$">';
HTML_CODE.li_tab_no_editable+='		<a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">';
HTML_CODE.li_tab_no_editable+='		<input type="text" id="text_editing_$ID_TAB$" style=" display: none;"> '
HTML_CODE.li_tab_no_editable+='		<span id="go_$ID_TAB$">$NAME_TAB$</span> '
// HTML_CODE.li_tab_no_editable+='			<span class="glyphicon glyphicon-pencil" STYLE="font-size: 10pt" id="edit_$ID_TAB$"></span>'
HTML_CODE.li_tab_no_editable+='			<span class="glyphicon glyphicon-remove" STYLE="font-size: 10pt" id="close_$ID_TAB$"></span>'
HTML_CODE.li_tab_no_editable+='		</a>';
HTML_CODE.li_tab_no_editable+='	</ul>\n';
HTML_CODE.li_tab_no_editable+='</li>';


// HTML_CODE.li_tab+='			<span class="caret"></span>'

// HTML_CODE.li_tab+='			<span>'
// HTML_CODE.li_tab+='			'
// // HTML_CODE.li_tab+='			<a href="#" title="" id="user_details">'
// 
// HTML_CODE.li_tab+='			<span class="glyphicon glyphicon-pencil" STYLE="font-size: 10pt" id="edit_$ID_TAB$"></span>'
// // HTML_CODE.li_tab+='			'
// // HTML_CODE.li_tab+='			</a>'
// HTML_CODE.li_tab+='			<span class="glyphicon glyphicon-remove" STYLE="font-size: 10pt" id="close_$ID_TAB$"></span>'
// // HTML_CODE.li_tab+='			</span>'
// 
// HTML_CODE.li_tab+='		</a>';
// 
// HTML_CODE.li_tab+='	</ul>\n';
// HTML_CODE.li_tab+='</li>';


/// ESTETICAMENTE NO QUEDA COMO PESTA�A
// HTML_CODE.li_tab='<li class="dropdown active" id="$ID_TAB$">';
// HTML_CODE.li_tab+='		<div>';
// // HTML_CODE.li_tab+='		<a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">';
// HTML_CODE.li_tab+='			$NAME_TAB$';
// HTML_CODE.li_tab+='			<div style="float: right;" id="close_$ID_TAB$"> X</div>';
// HTML_CODE.li_tab+='			';
// // HTML_CODE.li_tab+='			<span class="caret"></span>'
// // HTML_CODE.li_tab+='		</a>';
// HTML_CODE.li_tab+='		</div>';
// HTML_CODE.li_tab+='</li>';
// 

/// HTML PANEL NEW JOB

HTML_CODE.new_job=new Object();

HTML_CODE.new_job.por_defecto= "<option disabled selected> -- select a configuration -- </option>";
HTML_CODE.new_job.por_defecto_plugin = "<option disabled selected> -- select a plugin -- </option>";


HTML_CODE.new_job.data_plugin= '<option $VAR_SELECTED$ ';
HTML_CODE.new_job.data_plugin+= 'value ="$VAR_VALUE$" >$VAR_TEXT$';
HTML_CODE.new_job.data_plugin+= '</option>';


HTML_CODE.new_job.plugin_list_job= '<option $VAR_SELECTED$ ';
HTML_CODE.new_job.plugin_list_job+=' style="background-image: url(data:image/png;base64,$VAR_ICON$)" ';
HTML_CODE.new_job.plugin_list_job+= 'value ="$VAR_VALUE$" >$VAR_TEXT$';
HTML_CODE.new_job.plugin_list_job+= '</option>';


HTML_CODE.new_job.parameters_text_box='<div class="form-group">';
HTML_CODE.new_job.parameters_text_box+='<label class="col-sm-2 control-label" for="jobAddOperation">';
HTML_CODE.new_job.parameters_text_box+='$VAR_LABEL$';		
HTML_CODE.new_job.parameters_text_box+='</label>';
HTML_CODE.new_job.parameters_text_box+='<div class="col-sm-4">';
HTML_CODE.new_job.parameters_text_box+='<input type="text" class="form-control" placeholder="" ';
HTML_CODE.new_job.parameters_text_box+=' value="$VAR_VALUE$"  ';
HTML_CODE.new_job.parameters_text_box+=' name="$VAR_NAME$" ';
HTML_CODE.new_job.parameters_text_box+=' id="$VAR_ID$" ';
HTML_CODE.new_job.parameters_text_box+=' />';
HTML_CODE.new_job.parameters_text_box+=' </div>';
HTML_CODE.new_job.parameters_text_box+=' </div>';






HTML_CODE.panels=[];


///HTML_CODE.panels.monitor

$.ajax({	url : C.panels.panel_monitor.url, async:true, success : function(result){	HTML_CODE.panels.panel_monitor=result;} });
$.ajax({	url : C.panels.new_job.url, async:true, success : function(result){	HTML_CODE.panels.new_job=result;} });
$.ajax({	url : C.panels.panel_user_list.url, async:true, success : function(result){	HTML_CODE.panels.panel_user_list=result;} });
$.ajax({	url : C.panels.button_open_new_tabs.url, async:true, success : function(result){	HTML_CODE.panels.button_open_new_tabs=result;} });
$.ajax({	url : C.panels.header.url, async:true, success : function(result){	HTML_CODE.panels.header=result;} });
$.ajax({	url : C.panels.panel_user_data.url, async:true, success : function(result){	HTML_CODE.panels.panel_user_data=result;} });


$.ajax({	url : C.panels.panel_group_list.url, async:true, success : function(result){	HTML_CODE.panels.panel_group_list=result;} });
$.ajax({	url : C.panels.panel_group_data.url, async:true, success : function(result){	HTML_CODE.panels.panel_group_data=result;} });

$.ajax({	url : C.panels.panel_history.url, async:true, success : function(result){	HTML_CODE.panels.panel_history=result;} });

$.ajax({	url : C.panels.panel_statistics.url, async:true, success : function(result){	HTML_CODE.panels.panel_statistics=result;} });


$.ajax({	url : C.panels.panel_node_list.url, async:true, success : function(result){	HTML_CODE.panels.panel_node_list=result;} });

$.ajax({	url : C.panels.panel_pool_list.url, async:true, success : function(result){	HTML_CODE.panels.panel_pool_list=result;} });

$.ajax({	url : C.panels.panel_preset_list.url, async:true, success : function(result){	HTML_CODE.panels.panel_preset_list=result;} });

$.ajax({	url : C.panels.panel_contrab_list.url, async:true, success : function(result){	HTML_CODE.panels.panel_contrab_list=result;} });

$.ajax({	url : C.panels.panel_plugin_list.url, async:true, success : function(result){	HTML_CODE.panels.panel_plugin_list=result;} });
$.ajax({	url : C.panels.panel_pool_details.url, async:true, success : function(result){	HTML_CODE.panels.panel_pool_details=result;} });


/// NO SE PORQUE NO FUINCIONA
// for(var k in C.panels)
// {
// 	log4javascript.getRootLogger().info("LEER::::::::::::"+k+"("+C.panels[k].url+")");
// 	
// 	if(C.panels[k].url!=null)
// 	{
// 		var k_tranfer=k;
// 		$.ajax(
// 			{	
// 				url : C.panels[k].url 
// 				,async:true
// 				,success : function(result)
// 										{
// 											HTML_CODE.panels[k_tranfer]=result;
// 											log4javascript.getRootLogger().info(".....LOADED:"+k_tranfer);
// 										} 
// 			
// 			}
// 			
// 		);
// 	}
// }


// log4javascript.getRootLogger().info(HTML_CODE.panels.button_open_new_tabs);
// 	
// $.get("assets/html/monitor.html", async:false, function(data) {	HTML_CODE.panels.monitor = data;  
// 	
// 	log4javascript.getRootLogger().info("=====>MONITOR (callback): \n"+HTML_CODE.panels.monitor);
// 	
// });
// 	
// log4javascript.getRootLogger().info("============================================================= 1");
// 
// // log4javascript.getRootLogger().info("=====>2 MONITOR: \n"+HTML_CODE.panels.monitor);
// 
// log4javascript.getRootLogger().info("============================================================= 2");
// 
// 
// $.ajax({
//     url : "assets/html/monitor.html",
//     async:false,            //this is the trick
//     success : function(result){
//                 HTML_CODE.panels.monitor=result;
//                } 
//     });;
// 	
// 	
// log4javascript.getRootLogger().info("============================================================= 3");