<?php

require_once 'DB.inc.php';
require_once 'Zend/Dom/Query.php';

set_time_limit(0);

header("Content-type: text/javascript");
header("Connection: keep-alive");


/* * * * * * *
 * getopt inputs
 *  
 * * * * * * */

setlocale(LC_ALL, "es_ES.UTF-8");

$inputs = getopt("y:t:c:");
//var_dump($inputs);
//var_dump($inputs);
if (count($inputs)==0)
{
    echo "Usage: php reports.php -y year -t trimester -c CMS_ID\n";
    echo "       php reports.php -c CMS_ID\n";
    exit();
} else if (count($inputs)==1) {
  $inputs["y"] = date("Y");
  switch (date("m")) {
      case "01":
      case "02":
      case "03":
        $inputs['t'] = 1;  
          
      break;
  
      case "04":
      case "05":
      case "06":
        $inputs['t'] = 2;  
          
      break;
  
      case "07":
      case "08":
      case "09":
          $inputs['t'] = 3;
          
      break;
  
      case "10":
      case "11":
      case "12":
          $inputs['t'] = 4;
          
      break;
  }
}

if (!isset($inputs["y"]) || !isset($inputs["t"]) || !isset($inputs["c"]))
{
    die("[ERROR]: Bad parameters. See usage.");
}

$year = $inputs["y"];
$trimester = $inputs["t"];
$cms = $inputs["c"];

echo "[INFO] Launching importer for year: $year; trimester: $trimester; CMS_ID: $cms\n\n";

if (!is_numeric($year) || !is_numeric($trimester) || !isset($cms)) {
    /*$err = new stdClass();
    $err->success= false;
    $err->error="Bad parameters";*/
    die("Error: Bad parameters");
}


$type = $year < 2016 ? "rawdata":"videoclaim";
$oldformat = $year<2016;

$USERNAME = 'alexey.mineev@zinkia.com'; 
$PASSWORD = 'am071215';


$CONTENT_OWNER = $cms;//"-3HHK8UB89SXTeTPkdEsZQ";//"3sk-VT2PP3aGHHSPGjBd9A";//"-3HHK8UB89SXTeTPkdEsZQ";//"0YSVm7yx3KFfY2JfQ2_1CA";
$SERIES_FILE_LINK = 'https://docs.google.com/spreadsheets/export?id=1SIs4_9M0Ghn63tZEILoquree5RJHdURCC88e1XQf8WM&exportFormat=csv';

$ch = curl_init();

function GoogleLogin($ch,$username,$password) {
    
$COOKIEFILE = '.ht_cookiejar';

curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 6.0; Windows 5.1)");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($ch, CURLOPT_COOKIEJAR, $COOKIEFILE);
curl_setopt($ch, CURLOPT_COOKIEFILE, $COOKIEFILE);
curl_setopt($ch, CURLOPT_HEADER, 0);  
curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 120);
curl_setopt($ch, CURLOPT_TIMEOUT, 120);

curl_setopt($ch, CURLOPT_URL, 'https://accounts.google.com/ServiceLogin?hl=en&');

echo "[INFO] Logging into Google Account\n";

$data = curl_exec($ch);
/*echo "App.mainBox.progress(33);\n";
echo "App.mainBox.setMsg(\"Fetching reports...\");";*/

$formFields = getFormFields($data);

$formFields['Email']  = $username;
$formFields['Passwd'] = $password;
unset($formFields['PersistentCookie']);

$post_string = '';
foreach($formFields as $key => $value) {
    $post_string .= $key . '=' . urlencode($value) . '&';
}

$post_string = substr($post_string, 0, -1);

curl_setopt($ch, CURLOPT_URL, 'https://accounts.google.com/ServiceLoginAuth');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_string);

$result = curl_exec($ch);
echo "[INFO] Login OK.\n";
}
    

GoogleLogin($ch,$USERNAME,$PASSWORD);


    curl_setopt($ch, CURLOPT_URL, 'https://www.youtube.com/download_reports?action_ads_partner_revenue=1&o='.$CONTENT_OWNER);
    curl_setopt($ch, CURLOPT_POST, 0);
    curl_setopt($ch, CURLOPT_POSTFIELDS, null);
   // curl_setopt($ch,CURLOPT_HTTPGET, "action_ads_partner_revenue", "1")

  $result = curl_exec($ch);

//echo "App.mainBox.progress(100); App.mainBox.done();\n";    
//}

function getFormFields($data)
{
    if (preg_match('/(<form.*?id=.?gaia_loginform.*?<\/form>)/is', $data, $matches)) {
        $inputs = getInputs($matches[1]);

        return $inputs;
    } else {
        die('Error: Login form not found.');
    }
}

function getInputs($form)
{
    $inputs = array();

    $elements = preg_match_all('/(<input[^>]+>)/is', $form, $matches);

    if ($elements > 0) {
        for($i = 0; $i < $elements; $i++) {
            $el = preg_replace('/\s{2,}/', ' ', $matches[1][$i]);

            if (preg_match('/name=(?:["\'])?([^"\'\s]*)/i', $el, $name)) {
                $name  = $name[1];
                $value = '';

                if (preg_match('/value=(?:["\'])?([^"\'\s]*)/i', $el, $value)) {
                    $value = $value[1];
                }

                $inputs[$name] = $value;
            }
        }
    }

    return $inputs;
}

function isInTrimester($linkYear,$linkMonth,$year,$trimester) {
    
    return $linkYear == $year && 
                                (
                                 $trimester == 1 && ($linkMonth == "01" || $linkMonth == "02" || $linkMonth == "03") ||
                                 $trimester == 2 && ($linkMonth == "04" || $linkMonth == "05" || $linkMonth == "06") ||
                                 $trimester == 3 && ($linkMonth == "07" || $linkMonth == "08" || $linkMonth == "09") ||
                                 $trimester == 4 && ($linkMonth == "10" || $linkMonth == "11" || $linkMonth == "12")
                                );
    
}


function toCSVFileName($link) {
    list($null,$null,$null,$null,$date,$file) = explode("/",$link);
    
    return substr($file,0,strpos($file,".zip"));
}


/* fetching report links */
function getFilesList($result,$type,$year,$trimester) {
    

$query = new Zend_Dom_Query(Zend_Dom_Query::DOC_HTML,"utf8"); 
$query->setDocumentHtml($result);

$result=$query->query("#download-reports-tbody-0-monthly a");

/* filtering reports */

$files = array();
foreach ($result as $link) {
    $link =  $link->getAttribute("href");
    
    list($null,$null,$null,$null,$date,$file) = explode("/",$link);
    $linkYear = substr($date,0,4); $linkMonth = substr($date,4,2);
    
    if (strpos($link,$type)!==false && isInTrimester($linkYear,$linkMonth,$year,$trimester)) {
        $files[] = $link;
        
    }
    
}
return $files;
}
//var_dump($files);

$files = getFilesList($result,$type,$year,$trimester);
if (count($files) == 0)  {
    //echo "\nwindow.__abort = true;\nApp.errorMsg('YT Zinkia MCN','No se han encontrado informes para trimestre elegido.');\n";
    echo "[INFO] No reports found for given time period.\n";
    exit(0);
} else {
    echo "[INFO] Found  ".count($files). " report files.\n";
}

echo "[INFO] Downloading and processing reports... \n";

/* Downloading zipped reports */


$con = getDB();
$channels= $con->query("SELECT * FROM channels WHERE cms_id = '$CONTENT_OWNER'");

if ($oldformat) {
   $videosData= $con->query("SELECT DISTINCT id,title,channel,channel_id,asset_id,episode,season FROM videos WHERE cms_id = '$CONTENT_OWNER'");
   
   foreach ($videosData as $item) {
       $vData[$item['id']] =     array(
           "title" => $item['title'],
           "channel" => $item['channel'],
           "channel_id" => $item['channel_id'],
           "asset_id" => $item['asset_id'],
           "episode" => $item['episode'],
           "season" => $item['season']
       );
   }
}

foreach ($channels as $channel) {
    $chIds[] = $channel['id'];
}
$con->query("DELETE FROM videos WHERE year='{$year}' AND trimester= '{$trimester}' AND cms_id = '$CONTENT_OWNER'");
$con->query("DELETE FROM videos_tmp WHERE year='{$year}' AND trimester= '{$trimester}' AND cms_id = '$CONTENT_OWNER'");
curl_setopt($ch, CURLOPT_URL,$SERIES_FILE_LINK);
$series = explode("\r\n",curl_exec($ch));
$videos=0;
$seriesAssets = $con->query("SELECT * FROM series");
$numFiles = count($files);

for ($c=0;$c<count($files);$c++) {
    
    //curl_setopt($ch, CURLOPT_URL,$file);
        GoogleLogin($ch,$USERNAME,$PASSWORD);
        curl_setopt($ch, CURLOPT_URL, 'https://www.youtube.com/download_reports?action_ads_partner_revenue=1&o='.$CONTENT_OWNER);
        curl_setopt($ch, CURLOPT_POST, 0);
        curl_setopt($ch, CURLOPT_POSTFIELDS, null);
   // curl_setopt($ch,CURLOPT_HTTPGET, "action_ads_partner_revenue", "1")

    $result = curl_exec($ch);
    $uFiles=getFilesList($result,$type,$year,$trimester);
    $file = $uFiles[$c];
    
    $zipName = uniqid("zipreport_");
    file_put_contents("tmp/".$zipName,  file_get_contents($file));
   //die();
    $zf = new ZipArchive();
    $zf->open("tmp/".$zipName);
    $zf->extractTo("./tmp");
    $zf->close();
    
    
    
    $fName = toCSVFileName($file);
    
    echo "[INFO]: Processing file $fName\n";
    
    $fp= fopen("tmp/".$fName,"r");
    $i=0;
    while (!feof($fp)) {
    
    if (!is_resource($fp)) {
        echo "[ERROR] stream failed on entry: $i file $fName\n";
        break;
    }
    
    $cells = fgetcsv($fp);
    
    //$cells = explode(",",$row);
    
       
    if (count($cells)<2 || $cells[0] == "Video ID") continue;
   //echo $cells[8]."_".$cells[7]."\n";
    if (!$oldformat) {  //  2016 y dispues...
     if (!in_array($cells[8],$chIds)) continue;
    
    $video = array(
        "id" => $cells[0],
        "title" => $cells[3],
        "channel" => $cells[7],
        "views" => $cells[17],
        "earnings" => $cells[31]
    );
    $channel_id= $cells[8];
    $asset_id = $cells[16];
            
    $season = "0";
    $episode = "0";
    
    } else { // antes de 2016
        
       if (!isset($vData[$cells[0]])) continue;
        
       $title = $vData[$cells[0]]['title']; 
       $channel = $vData[$cells[0]]['channel'];
       $channel_id = $vData[$cells[0]]['channel_id'];
       $asset_id = $vData[$cells[0]]['asset_id'];
       $season = $vData[$cells[0]]['season'];
       $episode = $vData[$cells[0]]['episode'];
       //echo $channel."\n";
      if (!in_array($channel_id,$chIds)) continue;
      
      $video = array(
        "id" => $cells[0],
        "title" => $title,
        "channel" => $channel,
        "views" => $cells[6],
        "earnings" => $cells[14]
      ); 
        
    }
    
    
    /* *
     *  serie detection algorithytm begin 
     */  
     
    $serie = $video['channel']; //defaults to channel name
    
    //Trying to detect season and episode by common name patterns...
    if (preg_match("#S([0-9]+)E([0-9]+)#i",$video['title'],$regs)>0) //Detects SxxEyy pattern
    {
        list($exp,$season,$episode) = $regs;
        $season = (int) $season;
        $episode = (int) $episode;
    }      
     
    if (preg_match("#\s([1-9])x([0-9]+)\s#i",$video['title'],$regs)>0) //Detects NxMM pattern
    {
        list($exp,$season,$episode) = $regs;
        $season = (int) $season;
        $episode = (int) $episode;
         
    }
            
    //Detection by Asset Custom_ID
    //TODO: Optimise to manual matching in array..
     //Matching asset CUSTOM_ID
     foreach ($seriesAssets as $asset)
    {
        if (substr($asset_id, 0,strlen($asset['id']))!=$asset['id']) continue;
        
        $season = $asset['season'];
        $serie = $asset['name'];
        if ($season>0 && !is_int($episode) && strlen($asset['pattern'])>0)  { //detecting episode by a pattern
                if (preg_match($asset['pattern'],$asset_id,$regs)==1) {
                //var_dump($regs);die();
                $episode  = (int) $episode;    
              }
              else $episode = null;
        }
    }    
    if ($serie == $video['channel']) {   //no match, try matching serie by keyword list
    foreach ($series as $s) { //searching the match in a predefined series list
          if(strstr($cells[3],$s)) {
              $serie = $s;
              break;
          }
     }
   } 
    /* * 
     * end
     * */ 
    $con->query("INSERT INTO videos_tmp (id,title,serie,channel,views,earnings,year,trimester,cms_id,channel_id,season,episode,asset_id) VALUES ('{$video['id']}','{$video['title']}','{$serie}','{$video['channel']}','{$video['views']}','{$video['earnings']}','{$year}','{$trimester}','$CONTENT_OWNER','$channel_id','$season','$episode','$asset_id')");
    
    //$videos[] =$video;
    $videos++;
    $i++;
}
    fclose($fp); 
    unlink("tmp/".$fName);
    unlink("tmp/".$zipName);
    
}


echo "[INFO] Done. ".$videos." videos data entries processed.\n";
echo "[INFO] Calculating videos views & earnings.\n";

$con->query("INSERT INTO videos SELECT id,title,channel,SUM(views) as views,SUM(earnings) as earnings,year,trimester,thumbnail,serie,cms_id,channel_id,season,episode,asset_id FROM videos_tmp WHERE year = $year AND trimester = $trimester AND cms_id='$CONTENT_OWNER' group by id");
//$con->close();
echo "[INFO] Downloading thumbnail images and inserting them into DB.\n";
$videosIds = $con->query("SELECT id FROM videos WHERE year = '$year' AND trimester = '$trimester' AND cms_id='$CONTENT_OWNER'");
foreach ($videosIds as $vidId) {
    $id = $vidId['id'];
    
    $thumbBase64=@base64_encode(@file_get_contents("https://i3.ytimg.com/vi/$id/default.jpg"));    
    if (strlen($thumbBase64)==0) $thumbBase64 = base64_encode(file_get_contents("default.jpg"));
    
    $con->query("UPDATE videos SET thumbnail='$thumbBase64' WHERE id = '$id'");
}
echo "[INFO] Done. ".(is_array($videosIds)?count($videosIds):$videosIds->num_rows)." videos processed and inserted into DB.\n";
echo "[INFO] Cleaning up temp data...\n";

$con->query("DELETE FROM videos_tmp WHERE year='{$year}' AND trimester= '{$trimester}' AND cms_id = '$CONTENT_OWNER'");
$con->close();
echo "[INFO] Done.\n\n";
//var_dump($chIds);

//echo json_encode(array("progress" => 100,"done"=>true));