<?php

require_once 'Zend/Dom/Query.php';
set_time_limit(0);

header("Content-type: text/javascript");
header("Connection: keep-alive");

if (!is_numeric($_GET['year']) || !is_numeric($_GET['trimester']) || !isset($_GET['type'])) {
    $err = new stdClass();
    $err->success= false;
    $err->error="Bad parameters";
    die(json_encode($err));
}
    

$USERNAME = 'zinkiadev@zinkia.com';//"alexey.mineev@zinkia.com";//;
$PASSWORD = 'znk121314';

$COOKIEFILE = '.ht_cookiejar';
$CONTENT_OWNER = "3sk-VT2PP3aGHHSPGjBd9A";//"-3HHK8UB89SXTeTPkdEsZQ";//"0YSVm7yx3KFfY2JfQ2_1CA";
$SERIES_FILE_LINK = 'https://docs.google.com/spreadsheets/export?id=1SIs4_9M0Ghn63tZEILoquree5RJHdURCC88e1XQf8WM&exportFormat=csv';


$ch = curl_init();
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



$data = curl_exec($ch);
echo "App.mainBox.progress(33);\n";
echo "App.mainBox.setMsg(\"Fetching reports...\");";

$formFields = getFormFields($data);

$formFields['Email']  = $USERNAME;
$formFields['Passwd'] = $PASSWORD;
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

/*if (strpos($result, '<title>Redirecting') === false) {
    /*die("Login failed");
    var_dump($result);
} else {*/

    curl_setopt($ch, CURLOPT_URL, 'https://www.youtube.com/dashboard?o='.$CONTENT_OWNER);
    curl_setopt($ch, CURLOPT_POST, 0);
    curl_setopt($ch, CURLOPT_POSTFIELDS, null);
    curl_exec($ch);

    curl_setopt($ch, CURLOPT_URL, 'https://www.youtube.com/download_reports?action_ads_partner_revenue=1');
    curl_setopt($ch, CURLOPT_POST, 0);
    curl_setopt($ch, CURLOPT_POSTFIELDS, null);
   // curl_setopt($ch,CURLOPT_HTTPGET, "action_ads_partner_revenue", "1")

  $result = curl_exec($ch);

echo "App.mainBox.progress(100); App.mainBox.done();\n";    
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

$query = new Zend_Dom_Query(Zend_Dom_Query::DOC_HTML,"utf8"); 
$query->setDocumentHtml($result);

$result=$query->query("#download-reports-tbody-0-monthly a");

/* filtering reports */

$files = array();
foreach ($result as $link) {
    $link =  $link->getAttribute("href");
    
    list($null,$null,$null,$null,$date,$file) = explode("/",$link);
    $linkYear = substr($date,0,4); $linkMonth = substr($date,4,2);
    
    if (strpos($link,$_GET['type'])!==false && isInTrimester($linkYear,$linkMonth,$_GET['year'],$_GET['trimester'])) {
        $files[] = $link;
        
        
        
    }
    
}

if (count($files) == 0)  {
    echo "\nwindow.__abort = true;\nApp.errorMsg('YT Zinkia MCN','No se han encontrado informes para trimestre elegido.');\n";
    die();
}


/* Downloading zipped reports */

foreach ($files as $file) {
    
    curl_setopt($ch, CURLOPT_URL,$file);
    $zipName = uniqid("zipreport_");
    file_put_contents("tmp/".$zipName,curl_exec($ch));
   
    $zf = new ZipArchive();
    $zf->open("tmp/".$zipName);
    $zf->extractTo("./tmp");
    $zf->close();
    
    
    
    $fName = toCSVFileName($file);
    $csvData = file_get_contents("tmp/".$fName);
    
    $csv[]=$csvData;
    
    unlink("tmp/".$fName);
    unlink("tmp/".$zipName);
    
}
curl_setopt($ch, CURLOPT_URL,$SERIES_FILE_LINK);
$series = explode("\r\n",curl_exec($ch));
//var_dump($series);
$csv = implode("\n",$csv);
$rows = explode("\n",$csv);

$host="192.168.1.80";
$port=3306;
$socket="";
$user="UDigitalRYout";
$password="DR160602znk";
$dbname="DigitalRYout";

$con = new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error());

$con->query("DELETE FROM videos WHERE year='{$_GET['year']}' AND trimester= '{$_GET['trimester']}'");
foreach ($rows as $row) {
    
    $cells = explode(",",$row);
    
    if (count($cells)<2 || $cells[0] == "Video ID") continue;
    
    $video = array(
        "id" => $cells[0],
        "title" => utf8_decode($cells[3]),
        "channel" => utf8_decode($cells[7]),
        "views" => $cells[17],
        "earnings" => $cells[31]
    );
    
    
    $thumbBase64=@base64_encode(@file_get_contents("https://i3.ytimg.com/vi/{$cells[0]}/default.jpg"));
    
    if (strlen($thumbBase64)==0) $thumbBase64 = base64_encode(file_get_contents("default.jpg"));
    
    
    $serie = $video['channel'];
    foreach ($series as $s) {
          if(strstr($cells[3],$s)) {
              $serie = utf8_decode($s);
              break;
          }
          /*if (strpos(utf8_encode($video['title']),$s)!==-1) {
              $serie = $s;
              //echo $serie."\n";
              break;
          }*/
          
    }

    $con->query("INSERT INTO videos (id,title,serie,channel,views,earnings,year,trimester,thumbnail) VALUES ('{$video['id']}','{$video['title']}','{$serie}','{$video['channel']}','{$video['views']}','{$video['earnings']}','{$_GET['year']}','{$_GET['trimester']}','{$thumbBase64}')");
    
    $videos[] =$video;
}


$con->close();



//echo json_encode(array("progress" => 100,"done"=>true));