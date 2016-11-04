<?php
/*session_start();

require_once 'youtube/Google/autoload.php';

//var_dump($_SESSION['access_token']);

if (isset($_SESSION['access_token']) && $_SESSION['access_token']) {
    $client = new Google_Client();
    $client->setAccessToken($_SESSION['access_token']);
    $drive_service = new Google_Service_Drive($client);
    $files_list = $drive_service->files->listFiles(array())->getFiles();
    
    //var_dump($files_list);
    foreach ($files_list as $file)
    {   
       $f=new stdClass();
       $f->id= $file['id'];
       $f->name= $file['name'];
       $f->url = $drive_service->files->get($file['id'])->downloadUrl;
       
       $files[] = $f; 
    }
    echo json_encode($files);
     
    
    
  //echo "App.onSigned(".json_encode($plus).");";
} else if (isset($_GET['token'])) {
    $_SESSION['access_token'] = $_GET['token'];
   //  echo "window.loginWnd = window.open('/oauth2callback.php','login','menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=600,height=800');";
}



*/

//phpinfo();