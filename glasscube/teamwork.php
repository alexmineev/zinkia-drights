    ¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨<?php 


/* 
 * POST /index.cfm HTTP/1.1
Host: zinkia.teamwork.com
Connection: keep-alive
Content-Length: 253
Pragma: no-cache
Cache-Control: no-cache
Origin: https://zinkia.teamwork.com
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36
Content-type: application/x-www-form-urlencoded; charset=UTF-8
Accept: text/javascript, text/html, application/xml, text/xml, 
X-Prototype-Version: 1.7
X-Requested-With: XMLHttpRequest
Referer: https://zinkia.teamwork.com/projects/249087/tasks
Accept-Encoding: gzip, deflate, br
Accept-Language: es-ES,es;q=0.8
Cookie: km_ai=mV90ZwMhsPcOJBwFX16yOMnwmZc%3D; km_lv=1463469535; km_uq=; CFID=26796375; CFTOKEN=47b951de5f5f109f-02F109CD-B4BF-B2ED-E984B4B1787691B5; ABTasty=ABTastyUTMB%3A1%5E%7C%5ELiwioTracking%3A16051709185325953%5E%7C%5EsegmentationTracking%3A16051709185325953%5E%7C%5ELiwioUTMA%3A0.2.1463469533492.1463469533492.1464940687868.2; _ga=GA1.2.1358850035.1463469534; _drip_client_9378226=vid%253D89c8d590fe2d013318cc0e9dd67883c3%2526pageViews%253D3%2526sessionPageCount%253D2%2526lastVisitedAt%253D1464940719342%2526weeklySessionCount%253D1%2526lastSessionAt%253D1464940688271; JSESSIONID=38304b86ee4c06a81b935b6c211a333cc3b3; PROJLB=s8; tw-auth=CZa4R7QBeoFvVWCiZ1ebjMqjzcdxf-219611; USERLOGIN=alexey%2Emineev%40zinkia%2Ecom; REVEL_FLASH=; REVEL_SESSION=81092d0c0ee75882bc4a09f75c7a222f2e1bf181-%00_ID%3A0b5545513601774d91844606784cfbe7c0de52d45c73be5ebb63a56c6fee1237%00%00_TS%3A1468588997%00


 /* 
  *  AddTaskList
  * 
    action:addTaskList
    use_template:false
    callback:
    templateId:
    skipAutoClosingList:true
    projectId:249087
    taskListName:list1
    taskListDescription:
    privacyHasChanged:0
    grantAccessTo:
    milestoneId:0
    taskListTemplateId:-1
    taskListDefaultTaskId:0
    newTaskDefaults:
 * 
 */


/*
 * AddComment
 * 
mode:new
projectId:249087
objectId:6545335
objectType:task
contentType:HTML
userReceiveNotifyWarnings:0
insertId:
insertPosition:
isInline:true
uniqueId:1465998228835
dest:bottom
commentBody:dfdfd
notifyUserIdList:219611
grantAccessTo:
updateFiles:1
mfpHolderId:commentFPWHolder1465998228835
 * 
 *  */







include_once 'Zend/Http/Client.php';


/**
 * Teamwork tasks & comments importer
 *
 * @author alexey.mineev
 */
class TeamWork {
    const BASE_URL = "https://zinkia.teamwork.com/";
    const POST_SCRIPT = "index.cfm";
    
    public function __construct($user,$password,$projectId) {
         $this->user = $user;
         $this->password = $password;
         $this->projectId = $projectId;
         
         $this->client = new Zend_Http_Client(self::BASE_URL,array(
            "maxredirects" => 100000000,
            "timeout" => 1000000,
         ));
         
         $this->client->setCookieJar(true);
         
    }
    
    public function login() {
        $this->client->resetParameters();
        
        $this->client->setUri(self::BASE_URL.self::POST_SCRIPT);
        $this->client->setParameterPost("action","login");
        $this->client->setParameterPost("userLogin",$this->user);
        $this->client->setParameterPost("password",$this->password);
        
        $resp = $this->client->request(Zend_Http_Client::POST);
        
        return strpos($resp->getBody(),"/dashboard");   
        
        
        
        
    }
    /*
    action:addTaskList
    use_template:false
    callback:
    templateId:
    skipAutoClosingList:true
    projectId:249087
    taskListName:list1
    taskListDescription:
    privacyHasChanged:0
    grantAccessTo:
    milestoneId:0
    taskListTemplateId:-1
    taskListDefaultTaskId:0
    newTaskDefaults:*/
    
    public function addTaskList($listName,$projectId) {
        $this->client->resetParameters();
        $this->client->setUri(self::BASE_URL.self::POST_SCRIPT);
        
        $this->client->setParameterPost("action","addTaskList");
        $this->client->setParameterPost("use_template","false");
        $this->client->setParameterPost("callback","");
        $this->client->setParameterPost("templateId","");
        $this->client->setParameterPost("skipAutoClosingList","true");
        $this->client->setParameterPost("projectId",$this->projectId);
        $this->client->setParameterPost("taskListName",$listName);
        $this->client->setParameterPost("taskListDescription","Importado desde GlassCube");
        $this->client->setParameterPost("privacyHasChanged","0");
        $this->client->setParameterPost("grantAccessTo","");
        $this->client->setParameterPost("milestoneId","0");
        $this->client->setParameterPost("taskListTemplateId","-1");
        $this->client->setParameterPost("taskListDefaultTaskId","0");
        $this->client->setParameterPost("newTaskDefaults","");
        
        $resp = $this->client->request(Zend_Http_Client::POST);
        
        $obj= json_decode($resp->getBody());
        
        return $obj->taskListId;
        
    }
    /*
mode:new
projectId:258623
objectId:6765913
objectType:task
contentType:HTML
userReceiveNotifyWarnings:0
insertId:
insertPosition:
isInline:true
uniqueId:1466411752481
dest:bottom
commentBody:test comment<br><br>
notifyUserIdList:228238
grantAccessTo:
updateFiles:1
mfpHolderId:commentFPWHolder1466411752481
     * 
     *      */
    
    
    public function addComment($taskId, $projectId, $comment) 
    {            
        $this->client->resetParameters();
        $this->client->setUri(self::BASE_URL);
        
        $this->client->setParameterGet("action","invoke.comments.ajaxAddOrEditComment()$sq WSW");
        $this->client->setParameterPost("mode","new");
        $this->client->setParameterPost("projectId",$projectId);
        $this->client->setParameterPost("objectType","task");
        $this->client->setParameterPost("objectId",$taskId);
        $this->client->setParameterPost("contentType","HTML");
        $this->client->setParameterPost("userReceiveNotifyWarnings","0");
        $this->client->setParameterPost("insertId","");
        $this->client->setParameterPost("insertPosition","");
        $this->client->setParameterPost("isInline","true");
        $this->client->setParameterPost("uniqueId",  microtime());
        $this->client->setParameterPost("dest","bottom");
        $this->client->setParameterPost("commentBody","Author: <u>".$comment['author']."</u>\n\n<br />"."Date: <i>".$comment['date']."</i><br/>\n\n".$comment['message']);
       // $this->client->setParameterPost("notifyUserIdList","228238");
        $this->client->setParameterPost("grantAccessTo","");
        $this->client->setParameterPost("updateFiles","1");
        $this->client->setParameterPost("mfpHolderId","commentFPWHolder".microtime());
        
        $res = $this->client->request(Zend_Http_Client::POST);
        
        echo ">>>> Comment posted.\n"; 
        
        
        
    }
    
/*
 * AddTask
 *  
 * 
taskGrantAccessTo:-1
action:addTask
taskListId:826941
tagsJSON:[{"id":null,"color":"#2f8de4","name":"glass"}]
uniqueId:0
redirectAfterEdit:NO
taskId:0
pushDependencies:
pushSubTasks:
notifyUsersViaEmail:no
createMultipleTasks:false
taskName:TaskName
taskAssignedToUserId:0
taskStartDate:10/06/2015
taskDueDate:
taskDescription:Autor: test user

Descripcion..
updateFiles:1
mfpHolderId:taskFPWHolder0
taskPriority:
taskProgress:0
taskEstimateHours:0
taskEstimateMins:0
taskCommentFollowersList:
taskChangeFollowersList:
taskRepeatsFreq:norepeat
monthlyRepeatType:monthDay
taskRepeatEnd:noEndDate
 * 
 * 
*/
    public function addTask($taskListId,$projectId,$name,$startDate,$description,$author,$group)
    {
         
         $description = utf8_encode("Taskgroup: $group\n\nAuthor: ".$author."\n\n".$description);
        
         $this->client->resetParameters();
         $this->client->setUri(self::BASE_URL.self::POST_SCRIPT);
         
         $this->client->setParameterPost("taskGrantAccessTo","-1");
         $this->client->setParameterPost("action","addTask");
         $this->client->setParameterPost("taskListId",$taskListId);
         $this->client->setParameterPost("tagsJSON",'[{"id":null,"color":"#2f8de4","name":"GlassCubes"}]');
         $this->client->setParameterPost("uniqueId","0");
         $this->client->setParameterPost("redirectAfterEdit","NO");
         $this->client->setParameterPost("taskId","0");
         $this->client->setParameterPost("pushDependencies","");
         $this->client->setParameterPost("pushSubTasks","");
         $this->client->setParameterPost("notifyUsersViaEmail","no");
         $this->client->setParameterPost("taskName",$name);
         $this->client->setParameterPost("taskAssignedToUserId","0");
         $this->client->setParameterPost("taskStartDate",$startDate);
         $this->client->setParameterPost("taskDueDate","");
         $this->client->setParameterPost("taskDescription",  strip_tags($description));
         $this->client->setParameterPost("updateFiles","1");
         $this->client->setParameterPost("mfpHolderId","taskFPWHolder0");
         $this->client->setParameterPost("taskPriority","");
         $this->client->setParameterPost("taskProgress","0");
         $this->client->setParameterPost("taskEstimateHours","0");
         $this->client->setParameterPost("taskEstimateMins","0");
         $this->client->setParameterPost("taskCommentFollowersList","");
         $this->client->setParameterPost("taskChangeFollowersList","");
         $this->client->setParameterPost("taskRepeatsFreq","norepeat");
         $this->client->setParameterPost("monthlyRepeatType","monthDay");
         $this->client->setParameterPost("taskRepeatEnd","noEndDate");
         
         $resp = $this->client->request(Zend_Http_Client::POST);
         
         if ($resp)
         {
             $obj=json_decode($resp->getBody());
             
             return $obj->taskId;
         }  else {
             echo ">>>>>>>>!!!!!!!!!!! Error exporting to TeamWork.";
         }
         
    }
    
    
}

$host="192.168.1.80";
$port=3306;
$socket="";
$user="UDigitalRYout";
$password="DR160602znk";
$dbname="DigitalRYout";

$opts = getopt("p:w:t:");
//var_dump($opts);
$projectId =  isset($opts['p']) ?  $opts['p'] : "259211";
$workspace = isset($opts['w']) ?  $opts['w'] : "SEND";


echo "********* TeamWork tasks & comments importer v.1.Alpha *********\n";
echo "----------------------------------------------------------------\n\n";


$tw = new TeamWork("eneko.elbira@gmail.com","glasscubes",$projectId);
echo ">>>> Trying to login...\n";

if ($tw->login()) {
    echo ">>>> Login successful.\n";
} else
    die(">>>> !!!!! Login Failed !!!!\n");

echo ">>>> Establishing connection to MySQL server...\n";
    
$con = new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('>>>> !!! Could not connect to the Zinkia DigitalRights I+D DB server!\n |-> ' . mysqli_connect_error());

echo ">>>> Done.\n";


echo  ">>>>> Importing workspace ".$workspace."\n";
/*echo  ">>>>> Fetching task groups from the DB. \n";

$sql= "SELECT * FROM tasks WHERE workspace = '$workspace' ORDER BY task_group";


$ds= $con->query($sql);
echo $ds->num_rows;

$groups = array();

foreach ($ds as $row) {
    
   $groups[$row['task_group']][] = $row; 
    
}


echo ">>>> sorting tasks & groups.....\n "; */

$sql= "SELECT * FROM tasks WHERE workspace = '$workspace'";

$ds= $con->query($sql);
echo "Got ".$ds->num_rows." tasks to import...";


    
    
    //$groupId=$tw->addTaskList($group,$projectId); 
   //$groupId = $tw->addTaskList("Import_GlassCubes",$projectId);     

    

   foreach ($ds as $task)  {
       
     $groupId = $opts['t'];
     $taskId = $tw->addTask($groupId,$projectId,$task['title'],$task['created'],$task['description'],$task['author'],$task['task_group']);
     echo $taskId." | ".$task['title']." imported\n";  
     
     
     $comments = $con->query("SELECT * FROM comments WHERE task_id = '{$task['id']}'");
     if ($comments->num_rows>0) {
        echo ">>>>>> Posting comments (".$comments->num_rows.")\n";
        
        foreach ($comments as $comment)
            $tw->addComment($taskId,$projectId,$comment);
     } else {
         echo ">>>> No comments for this task.\n";
     }
     
    
}

echo ">>>>>> TeamWork import finished. <<<<<<\n"; 


$con->close();
