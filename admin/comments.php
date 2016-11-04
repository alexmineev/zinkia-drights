<?php
include_once 'Zend/Json/Encoder.php';

$host="192.168.1.80";
$port=3306;
$socket="";
$user="UDigitalRYout";
$password="DR160602znk";
$dbname="DigitalRYout";

if (!isset($_GET['taskid'])) 
    die(json_encode(array("status" => "error","error" => "Bad parameter")));

$con = new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error());

$sql = "SELECT * FROM comments WHERE task_id = '".$con->escape_string($_GET['taskid'])."'";

$res = $con->query($sql);

foreach ($res as $row)
{
    foreach ($row as $k=>$v) {
        $prow[$k] = utf8_encode($v);
    }
  
    $comments[] =$prow; 
}
header("Content-type: application/json");

echo @Zend_Json_Encoder::encode($comments);
