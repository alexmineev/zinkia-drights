<?php
require_once 'Google/autoload.php';
require_once 'Zend/Json/Encoder.php';

//const TEMPLATE_FILE_ID = "1MZrMZKu1bpIE6BkOD_RrSYEupWfV0bhbSCbWovLRMNs";
/*const TEMPLATE_FILE_ID = "157PyxLX9dX56XyqeXxC6wKw3eJVUosq6otgyOXp7e4c";//"1DPCjirw-uCBKf9YNESblA9FHOdKhiCNTqSO7Qo4g8pM";//"10nVc3FRNyJCLYkPN537AMnoIhJeA8PKmk-HWscZza2Q";

function getPreAuthService(){ //setup credentials
$driveService =//buildServiceDrive('alexey.mineev@zinkia.com',"yt-administrator@appspot.gserviceaccount.com","https://www.googleapis.com/auth/drive.file",".ht_key");
        buildServiceDrive('alexey.mineev@zinkia.com',"zinkia-mcn@yt-administrator.iam.gserviceaccount.com","https://www.googleapis.com/auth/drive.file",".ht_key.p12");
    return $driveService;
}
//building service
function buildServiceDrive($userEmail,$service_id,$scope,$service_filename) {
    $key = file_get_contents($service_filename);
    $auth = new Google_Auth_AssertionCredentials(
        $service_id,
        array($scope),
        $key);
    $auth->sub = $userEmail;
    $client = new Google_Client();
    $client->setAssertionCredentials($auth);
    return new Google_Service_Drive($client);
}
*/
function getDB() {
    $host="192.168.1.80";
    $port=3306;
    $socket="";
    $user="UDigitalRYout";
    $password="DR160602znk";
    $dbname="DigitalRYout";

    $db =  new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error());
    
    return $db;
    
} 
/*function setFilePermissions($driveService,$fileId,$email,$domain) {
 
    $driveService->getClient()->setUseBatch(true);
 try {
     $batch = $driveService->createBatch();

     $userPermission = new Google_Service_Drive_Permission(array(
         'type' => 'user',
         'role' => 'writer',
         'emailAddress' => $email
     ));
    $request = $driveService->permissions->create(
        $fileId, $userPermission, array('fields' => 'id'));
    $batch->add($request, 'user');
    $domainPermission = new Google_Service_Drive_Permission(array(
        'type' => 'domain',
        'role' => 'writer',
        'domain' => $domain
    ));
    $request = $driveService->permissions->create(
        $fileId, $domainPermission, array('fields' => 'id'));
    $batch->add($request, 'domain');
    $results = $batch->execute();

  
 } finally {
        $driveService->getClient()->setUseBatch(false);
        return $results;
 }
    
}
*/
if (!isset($_POST['year']) || !isset($_POST['trimester']) ) die(json_encode(array("error" => "Bad parameters")));

header("Content-type: text/plain"); 

$db = getDB();
/*$driveService = getPreAuthService();

//echo createFile($driveService,"REPORTS_TEMPLATE",""); die();

$dateId  = $db->escape_string($_POST['year']."_".$_POST['trimester']);

$res = $db->query("SELECT drive_id FROM drive_reports WHERE year_trimester = '$dateId'");

    if ($res->num_rows == 0) { 
        $fileId = createFile($driveService,"YT_ZINKIA_MCN_".$_POST['year']."_TRIMESTER_".$_POST['trimester'],genCSVFile($db,$_POST['year'],$_POST['trimester']));
        $db->query("INSERT INTO drive_reports (year_trimester,drive_id) VALUES ('$dateId','$fileId') ");
        
    
    } else {
        
       foreach($res as $d)
       {
           $fileId = $d['drive_id'];
       }
       //echo "update: ".$fileId; 
       $fileId = updateFile($driveService,$fileId,genCSVFile($db,$_POST['year'],$_POST['trimester']));
        
    }
  */


//echo json_encode(array("id" => $fileId)); /*** RESULT OUTPUT TO FRONTEND ***/

$resp=genCSVFile($db,$_POST['year'],$_POST['trimester']); 
echo Zend_Json_Encoder::encode($resp);die();



/*function createFile($driveService,$fileName,$content) {

    $fileMetadata = new Google_Service_Drive_DriveFile(array(
        'name' => $fileName,
        'mimeType' => 'application/vnd.google-apps.spreadsheet',
        
     ));
    
    setFilePermissions($driveService,TEMPLATE_FILE_ID,$_POST['email'],"zinkia.com");
    
    $fileId = copyFile($driveService,TEMPLATE_FILE_ID,$fileName);
 
     setFilePermissions($driveService,$fileId,$_POST['email'],"zinkia.com");
     
    if (isset($fileId)) {
        
      //  $fileId=updateFile($driveService,$fileId,$content,$fileName);
        
        
        return $fileId;
    } else {
      die(json_encode(array("error" => "File creation failed")));  
      return null;
    }

}
function updateFile($service, $fileId, $content,$fileName=false) {
        try {
            if ($fileName)
            $newFile = new Google_Service_Drive_DriveFile(array(
                            'name' => $fileName,
                            'mimeType' => 'application/vnd.google-apps.spreadsheet',
               
            ));
           else 
               
               $newFile = new Google_Service_Drive_DriveFile(array(
               
                            'mimeType' => 'application/vnd.google-apps.spreadsheet',
               
            ));
            //$file = $service->files->get($fileId);
            $service->files->update($fileId, $newFile, array(
               // 'fileId' => $fileId,
                'data' => $content,
                'mimeType' => 'text/csv',
                'uploadType' => 'multipart',
  
            ));
        } catch (Exception $e) {
            print "An error occurred: " . $e->getMessage();
            die();
        }
        return $fileId;
}

*/

function genCSVFile($db,$year,$trimester) {
    $res = $db->query("SELECT id,title,channel,SUM(views) as views, SUM(earnings) as earnings,thumbnail FROM videos WHERE year = '$year' AND trimester = '$trimester' AND channel <> '' GROUP BY id ORDER BY channel");
    $channelTotals = $db->query("SELECT channel,SUM(views) as views,SUM(earnings) as earnings FROM videos WHERE year = '$year' AND trimester = '$trimester'  AND channel <> '' GROUP BY channel");
    $totals = $db->query("SELECT SUM(views) as views, SUM(earnings) as earnings FROM videos WHERE year = '$year' AND trimester = '$trimester'  AND channel <> '' ");
    
    $videos = array();
    foreach ($res as $video) {
        $videos[$video['channel']]['videos'][] = 
                    array (
                        "id" => $video['id'],
                        "thumbnail" =>$video['thumbnail'],
                        "title" => $video['title'],
                        "channel" => $video['channel'],
                        "views" => $video['views'],
                        "earnings" => $video['earnings']
                   ); 
        $rawVideos[] = 
            array(
                
                        "id" => $video['id'],
                        "title" => utf8_encode($video['title']),
                        "channel" => utf8_encode($video['channel']),
                        "views" => $video['views'],
                        "earnings" => $video['earnings']
                
            );
        
    }
    
    foreach($channelTotals as $channel) {
        //if (!strlen($channel['channel'])==0)
        $channels[$channel['channel']] = 
                            array(
                                "views" => $channel['views'],
                                "earnings" => $channel['earnings']
                            );
        $channelsRaw[] = array(
            "channel" =>  utf8_encode($channel['channel']),
            "views" =>  $channel['views']
        );
        
    }
    
    foreach ($totals as $total) {
        $summary = array("views" => $total['views'],"earnings" => $total['earnings']);
    }
    
    
    
    $csvLines = array();
    foreach ($videos as $channel => $data)
    {
        $csvLines[] = ["Thumbnail","Canal","Titulo","Views","Earnings"];
            foreach ($data['videos'] as $video) {
                $line = array();
                $line[] = $video['thumbnail'];
                $line[] = utf8_encode($video['channel']);
                $line[] = utf8_encode($video['title']);
                $line[] = $video['views'];
                $line[] = round($video['earnings'],2).' USD';
                
                $csvLines[] = $line;
            }
          $csvLines[]=["","","","",""];
          $csvLines[]=["","","TOTAL POR CANAL",$channels[$channel]['views'],round($channels[$channel]['earnings'],2)." USD"];  
          

        
    }
    
    $csvLines[] =["","","",""];
    $csvLines[] =["","","TOTAL POR TRIMESTRE",$summary['views'],round($summary['earnings'],2)." USD"];
    
    $rawData = new stdClass();
    $rawData->videos = $rawVideos;
    $rawData->channels = $channelsRaw;
    $rawData->totals = $summary;
    
    $csvLines[] = ["",base64_encode(@Zend_Json_Encoder::encode($rawData))];
    return $csvLines;
    
}

/**
 * Copy an existing file.
 *
 * @param Google_Service_Drive $service Drive API service instance.
 * @param String $originFileId ID of the origin file to copy.
 * @param String $copyTitle Title of the copy.
 * @return DriveFile The copied file. NULL is returned if an API error occurred.
 */
/*
function copyFile($service, $originFileId, $copyTitle) {
  $copiedFile = new Google_Service_Drive_DriveFile(array(
            'name' => $copyTitle,
            'mimeType' => 'application/vnd.google-apps.spreadsheet'
      
          ));
  //$copiedFile->setName($copyTitle);
  

  try {
    $newFile= $service->files->copy($originFileId, $copiedFile);
  } catch (Exception $e) {
 
    print "An error occurred: " . $e->getMessage();
  }
    
    
  //return NULL;
}

*/