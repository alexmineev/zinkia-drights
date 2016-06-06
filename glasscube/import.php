<?php
$host="192.168.1.80";
$port=3306;
$socket="";
$user="UDigitalRYout";
$password="DR160602znk";
$dbname="DigitalRYout";

$tasks = json_decode(file_get_contents("tasks.json"));


$con = new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error());

$con->begin_transaction();


var_dump($tasks[0]);
for($i=0;$i<count($tasks);$i++)
{
    $task = $tasks[$i];
    $id = md5($task->id);
    $res=$con->query("INSERT INTO tasks (id,created,author,workspace,assigned,label,duedate,title,description) VALUES ('$id','{$task->created}','{$task["created by"]}','{$task->title}','{$task->description}')");
    
}



$con->commit();
$con->close();

