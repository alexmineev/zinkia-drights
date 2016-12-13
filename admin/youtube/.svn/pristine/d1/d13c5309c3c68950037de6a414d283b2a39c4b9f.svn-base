<?php
die();

/*DEBUG SCRIPT. DO NOT USE!*/
require_once 'DB.inc.php';
$db = getDB();
$fp=fopen("channels.csv","r");

$db->query("DELETE FROM channels");
while(!feof($fp)) {
    $channel = fgetcsv($fp);
   $db->query("INSERT INTO channels (id,title,cms_id) VALUES ('{$channel[2]}','{$channel[1]}','{$channel[3]}')");
    echo $channel[1]."\n";
}

fclose($fp);