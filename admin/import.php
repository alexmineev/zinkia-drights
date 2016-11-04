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


for($i=0;$i<count($tasks);$i++)
{
    
    
    $task = $tasks[$i];
   
    $id = explode("/",$task->id)[4];
    
    $crby = "created by";
    $wspace ="workspace name";
    $group = "task group";
    
    $task->title = utf8_decode($con->escape_string($task->title));
    $task->$group = utf8_decode($con->escape_string($task->$group));
    $task->description = utf8_decode($con->escape_string($task->description));
    $task->$wspace = utf8_decode($con->escape_string($task->$wspace));
    $task->$crby =  utf8_decode($con->escape_string($task->$crby));
    $task->assigned = utf8_decode($con->escape_string($task->assigned));
    
    
    
    $res=$con->query("INSERT INTO tasks (id,created,author,title,workspace,assigned,label,task_group,description) VALUES ('$id','{$task->created}','{$task->$crby}','{$task->title}','{$task->$wspace}','{$task->assigned}','{$task->label}','{$task->$group}','{$task->description}')");
   
    if (!$res) {
        echo("INSERT INTO tasks (id,created,author,title,workspace,assigned,label,task_group,description) VALUES ('$id','{$task->created}','{$task->$crby}','{$task->title}','{$task->$wspace}','{$task->assigned}','{$task->label}','{$task->$group}','{$task->description}')");
        die($con->error);  
    }
    $comments = $task->comments;
    foreach ($comments as $j=>$comment) {
        $comment->author = utf8_decode(utf8_decode(utf8_decode($con->escape_string($comment->author))));
        $comment->date = utf8_decode(utf8_decode(utf8_decode($con->escape_string($comment->date))));
        $comment->msg = utf8_decode(utf8_decode($con->escape_string($comment->msg)));
        $commentId = $id."_".$j;
        $res=$con->query("INSERT INTO comments (id,task_id,author,date,message) VALUES ('$commentId','$id','{$comment->author}','{$comment->date}','{$comment->msg}')");
        
        if (!$res) {
           $sql= "INSERT INTO comments (id,task_id,author,date,message) VALUES ('$commentId','$id','{$comment->author}','{$comment->date}','{$comment->msg}')";
           echo $sql."\n\n";
           $err = $con->error;
           
           echo($err);
           die();
           
        }
    }
    
    
}

$con->commit();
$con->close();

