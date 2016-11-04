<?php
include_once 'Zend/Json/Encoder.php';

$host="192.168.1.80";
$port=3306;
$socket="";
$user="UDigitalRYout";
$password="DR160602znk";
$dbname="DigitalRYout";


$con = new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error());


$res = $con->query("SELECT tasks.*,COUNT(comments.id) as comments FROM tasks"
        . " LEFT JOIN comments ON comments.task_id = tasks.id GROUP BY tasks.id ");

$o = array();
foreach ($res as $row)
{
    foreach ($row as $k=>$v) {
        $prow[$k] = utf8_encode($v);
    }
  
    $tasks[] =$prow; 
 
}
header("Content-type: application/json");





 echo @Zend_Json_Encoder::encode($tasks);

//var_dump($tasks);

//echo "[".implode(",",$o)."]";



