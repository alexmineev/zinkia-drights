<?php
require_once 'DB.inc.php';

$db = getDB();
if (!isset($_GET['cms_id'])) {
    $res = $db->query("SELECT * FROM cms");
    $ret = array();
    foreach ($res as $cms) {
        $ret[] = array(
                "id" => $cms['id'],
                "name" => $cms['name'],
                "description" => $cms['description'],
                "icon" => $cms['icon'] 
        );
    } 
} else {
    $cms_id = $db->escape_string($_GET['cms_id']);
  
    $res = $db->query("SELECT * FROM channels WHERE cms_id = '$cms_id'");
   
    $ret = array();
    foreach ($res as $ch) {
        $ret[] = array(
                "id" => $ch['id'],
                "title" => $ch['title'],
                "name" => $ch['title'],
                "cms_id" => $ch['cms_id']
        );
    } 
   
}
$result = new stdClass();
$result->success = true;
$result->data = $ret;

header("Content-type: application/json");

echo json_encode($result);