<?php 


require_once('Zend/Json/Encoder.php');

function loadVideos($year,$trimester) {
    
 $host="192.168.1.80";
$port=3306;
$socket="";
$user="UDigitalRYout";
$password="DR160602znk";
$dbname="DigitalRYout";   
    
 $con = new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error());
 
 $year = $con->escape_string($year);
 $trimester = $con->escape_string($trimester);
 $videos = $con->query("SELECT id,title,channel,SUM(views) as views,SUM(earnings) as earnings FROM videos WHERE year = $year AND trimester = $trimester GROUP BY id"); 
    
 $results = array();
 foreach ($videos as $video) {
     
     $res = new stdClass();
     $res -> id = $video['id'];
     $res -> title = utf8_encode($video['title']);
     $res -> channel = utf8_encode($video['channel']);
     $res -> views = $video['views']; 
     $res -> earnings =$video['earnings']; 
     
    $results[] = $res;  
 }
 
 return $results;
}

$res = new stdClass();
$res -> videos  = loadVideos($_GET['year'],$_GET['trimester']);

echo @Zend_Json_Encoder::encode($res);
