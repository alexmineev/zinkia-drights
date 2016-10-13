<?php

set_time_limit(0);

require_once 'Zend/Json/Encoder.php';



require_once 'DB.inc.php';

if (!isset($_REQUEST['year']) || !isset($_REQUEST['trimester']) || !isset($_REQUEST['cms'])) die(json_encode(array("error" => "Bad parameters")));

header("Content-type: text/plain"); 

$db = getDB();



if (!isset($_REQUEST['channels'])) $_REQUEST['channels'] = null;


$resp=genCSVFile($db,$_REQUEST['year'],$_REQUEST['trimester'],$_REQUEST['cms'],is_array($_REQUEST['channels'])?$_REQUEST['channels']:null); 
$json= Zend_Json_Encoder::encode($resp);
echo $json;


function genCSVFile($db,$year,$trimester,$cms,$channels) {
    
    $serie = $db->escape_string($_REQUEST['serie']);
 $title =$db->escape_string($_REQUEST['title']);
 
 $filter="";
 if (strlen($_REQUEST['serie'])>0)
 {
     $filter = "AND serie LIKE '%$serie%' "; 
 }
 
 if (strlen($_REQUEST['title'])>0)
 {
     $filter .= "AND title LIKE '%$title%' "; 
 }
    
    if (is_null($channels)) {
       if ($trimester!=0) 
        $filterSQL =  "year = '$year' AND trimester = '$trimester' AND cms_id= '$cms' AND channel <> '' $filter";
       else 
            $filterSQL =  "year = '$year' AND cms_id= '$cms' AND channel <> '' $filter";
    } else {
         $chList = array();
         
         foreach ($channels as $chId)
             $chList[] = "'$chId'";
    
            $chList = implode(",",$chList); 
        if ($trimester!=0)    
        $filterSQL =  "year = '$year' AND trimester = '$trimester' AND cms_id= '$cms' AND channel <> '' AND channel_id IN ($chList) $filter";
        else
        $filterSQL =  "year = '$year' AND cms_id= '$cms' AND channel <> '' AND channel_id IN ($chList) $filter";    
    }
  
    if ($trimester!=0)
      $res = $db->query("SELECT id,title,channel,serie, views, earnings,thumbnail FROM videos WHERE $filterSQL GROUP BY id ORDER BY channel,serie");
    else 
      $res = $db->query("SELECT id,title,channel,serie, sum(views) as views, sum(earnings) as earnings,thumbnail FROM videos WHERE $filterSQL GROUP BY id ORDER BY channel,serie");
    
    $channelTotals = $db->query("SELECT channel,SUM(views) as views,SUM(earnings) as earnings FROM videos WHERE $filterSQL GROUP BY channel");
    $seriesTotals = $db->query(
 "SELECT 
    channel,
    serie,
    SUM(views) AS views,
    SUM(earnings) AS earnings
FROM
    DigitalRYout.videos
WHERE 
    $filterSQL 
GROUP BY serie
HAVING LENGTH(channel) > 0
ORDER BY channel"
            );
          
    
    $totals = $db->query("SELECT SUM(views) as views, SUM(earnings) as earnings FROM videos WHERE $filterSQL");
    
    $videos = array();
    foreach ($res as $video) {
        $videos[$video['channel']]['videos'][] = 
                    array (
                        "id" => $video['id'],
                        "thumbnail" =>$video['thumbnail'],
                        "title" => $video['title'],
                        "channel" => $video['channel'],
                        "serie" => $video['serie'],
                        "views" => $video['views'],
                        "earnings" => $video['earnings']
                   ); 
        $rawVideos[] = 
            array(
                
                        "id" => $video['id'],
                        "title" => $video['title'],
                        "channel" => $video['channel'],
                        "serie" => $video['serie'],
                        "views" => $video['views'],
                        "earnings" => $video['earnings']
            );
        
        
        
    }
    
    foreach($channelTotals as $channel) {
        //if (!strlen($channel['channel'])==0)
        $channels[$channel['channel']] = 
                            array(
                                "views" => $channel['views'],
                                "earnings" => $channel['earnings'],
                            );
        $channelsRaw[] = array(
            "channel" =>  $channel['channel'],
            "views" =>  $channel['views']
        );
        
    }
    
    foreach ($totals as $total) {
        $summary = array("views" => $total['views'],"earnings" => $total['earnings']);
    }
    
    
    
    $csvLines = array();
    foreach ($videos as $channel => $data)
    {
        $csvLines[] = array("Thumbnail","Canal","Serie","Titulo","Reproduciones","Ganancias");
            foreach ($data['videos'] as $video) {
                $line = array();
                $line[] = $video['thumbnail'];
                $line[] = $video['channel'];
                $line[] = $video['serie'];
                $line[] = $video['title'];
                $line[] = $video['views'];
                $line[] = round($video['earnings'],2).' USD';
                
                $csvLines[] = $line;
            }
          $csvLines[]=array("","","","","");
          $csvLines[]=array("","","","TOTAL POR CANAL",$channels[$channel]['views'],round($channels[$channel]['earnings'],2)." USD");  
        
    }
    
    
    $csvLines[] =array("","","","","","");
    if ($trimester!=0)
    $csvLines[] =array("","","","TOTAL POR TRIMESTRE",$summary['views'],round($summary['earnings'],2)." USD");
    else 
    $csvLines[] =array("","","","TOTAL POR AÑO",$summary['views'],round($summary['earnings'],2)." USD");    
    
    foreach ($seriesTotals as $serie) {
        $rawSeries[] = array(
            "channel" => $serie['channel'],
            "serie" => $serie['serie'],
            "views" =>  $serie['views']
         );
    }
    
    $rawData = new stdClass();
    $rawData->videos = $rawVideos;
    $rawData->series = $rawSeries;
    $rawData->channels = $channelsRaw;
    $rawData->totals = $summary;
    
    $csvLines[] = array("",base64_encode(@Zend_Json_Encoder::encode($rawData)));
    return $csvLines;
    
}

