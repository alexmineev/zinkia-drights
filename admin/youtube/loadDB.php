<?php 
/**
 * REST API de videos. 
 * 
 * @uses Zend_Json_Encoder UTF8-safe JSON Encoder
 * @author Alexey Mineev <alexey.mineev@zinkia.com>
 */
set_time_limit(0);
require_once('Zend/Json/Encoder.php');
require_once 'DB.inc.php';

if (!isset($_GET['channels'])) $_GET['channels'] = null; //FIXME: corregir
if (!isset($_GET['langs'])) $_GET['langs'] = null;

function loadVideos($year,$trimester,$cms) {
$con = getDB();
 
 $year = $con->escape_string($year);
 $trimester = $con->escape_string($trimester);
 $cms = $con->escape_string($cms);
 
 $serie = $con->escape_string($_GET['serie']);
 $title = $con->escape_string($_GET['title']);
 
 $filter = "";
 if (strlen($_GET['serie'])>0)
 {
     $filter = "AND serie LIKE '%$serie%' "; 
 }
 
 if (strlen($_GET['title'])>0)
 {
     $filter .= "AND title LIKE '%$title%' "; 
 }
 
 if (isset ($_GET['season']) && $_GET['season']>0) {
     $filter .= " AND season= ".$con->escape_string($_GET['season']);
 }
 if (isset ($_GET['episode']) && $_GET['episode']>0) {
    $filter .= " AND episode= ".$con->escape_string($_GET['episode']); 
 }
 
 if ($_GET['langs'] != null)
 {
     $langs = 
     implode(",",array_map(function($el) {
         return "'$el'";
     },json_decode($_GET['langs'])));
     
     $filter .= " AND lang_id IN ($langs)";
 }
 if (is_null($_GET['channels']) || !isset($_GET['channels'])) {
     if ($trimester!=0)
    $videos = $con->query("SELECT id,title,channel,serie,views,earnings,season,episode,lang_id FROM videos WHERE year = $year AND trimester = $trimester AND cms_id = '$cms' $filter"); 
        else
    $videos = $con->query("SELECT id,title,channel,serie,lang_id,sum(views) as views,sum(earnings) as earnings,season,episode FROM videos WHERE year = $year AND cms_id = '$cms' $filter group by id");
        
 } else {
     
    $chList = array();
    $channels = json_decode($_GET['channels']);
    foreach ($channels as $chId)
        $chList[] = "'$chId'";
    
    $chList = implode(",",$chList);
    if ($trimester!=0)
    $videos = $con->query("SELECT id,title,channel,serie,views,earnings,season,episode,lang_id FROM videos WHERE year = $year AND trimester = $trimester AND cms_id = '$cms' AND channel_id IN ($chList) $filter");  
    else 
    $videos = $con->query("SELECT id,title,channel,serie,sum(views) as views,sum(earnings) as earnings,season,episode,lang_id FROM videos WHERE year = $year AND cms_id = '$cms' AND channel_id IN ($chList) $filter group by id");      
 } 
 $results = array();
 foreach ($videos as $video) {
     
     $res = new stdClass();
     $res -> id = $video['id'];
     $res -> title = $video['title'];
     $res -> serie = $video['serie'];
     $res -> channel = $video['channel'];
     $res -> views = $video['views']; 
     $res -> earnings = $video['earnings']; 
     $res -> episode = $video['episode']; 
     $res -> season  = $video['season']; 
     $res -> lang_id  = $video['lang_id']; 
          
    $results[] = $res;  
 }
 
 return $results;
}                                                                                                                                                                                                                                                               

$res = new stdClass();
$res -> videos  = loadVideos($_GET['year'],$_GET['trimester'],$_GET['cms']);

echo @Zend_Json_Encoder::encode($res);