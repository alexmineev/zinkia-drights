<?php
set_include_path( get_include_path() . PATH_SEPARATOR . 'Google' );
require_once 'Google/autoload.php';
require_once 'Google/Client.php';
require_once 'Google/Service/Drive.php';
try{

    //Get service document
    $service = get_service_document();
    $data = $service->files->get("0B5jx-lvOXGOnS1Y2aGtqa1pFX1k");
    $url=$data->downloadUrl;
    $data=downloadFile($service,$url);
    print_r($data);
}
catch(Exception $e){
    print_r($e->getMessage());
}

//Alternate method using download URL
function downloadFile($service, $downloadUrl)
{
    if ($downloadUrl) {
        $request = new Google_Http_Request($downloadUrl, 'GET', null, null);
        $httpRequest = $service->getClient()->getAuth()->authenticatedRequest($request);
        if ($httpRequest->getResponseHttpCode() == 200) {
            return $httpRequest->getResponseBody();
        } else {
            echo "errr";
            return null;
        }
    } else {
        echo "empty";
        return null;
    }
}
//function to get service
function get_service_document(){
$driveService =buildServiceDrive('alexey.mineev@zinkia.com',"yt-administrator@appspot.gserviceaccount.com","email","KEY.p12");
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