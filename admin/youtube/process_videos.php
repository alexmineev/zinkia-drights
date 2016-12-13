<?php

require_once 'DB.inc.php';

echo "[INFO] Calculating videos views & earnings.\n";

$con= getDB();
$con->query("INSERT INTO videos SELECT id,title,channel,SUM(views) as views,SUM(earnings) as earnings,year,trimester,thumbnail,serie,cms_id,channel_id FROM videos_tmp GROUP BY id");
//$con->close();
echo "[INFO] Downloading thumbnail images and inserting them into DB.\n";
$videosIds = $con->query("SELECT id FROM videos");
foreach ($videosIds as $vidId) {
    $id = $vidId['id'];
    
    $thumbBase64=@base64_encode(@file_get_contents("https://i3.ytimg.com/vi/$id/default.jpg"));    
    if (strlen($thumbBase64)==0) $thumbBase64 = base64_encode(file_get_contents("default.jpg"));
    
    $con->query("UPDATE videos SET thumbnail='$thumbBase64' WHERE id = '$id'");
}
echo "[INFO] Done. ".(is_array($videosIds)?count($videosIds):$videosIds->num_rows)." videos processed and inserted into DB.\n";
echo "[INFO] Cleaning up temp data...\n";

$con->query("DELETE FROM videos_tmp");
$con->close();
echo "[INFO] Done.\n\n";