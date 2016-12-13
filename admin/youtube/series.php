<?php
/**
 *  Series API Data module
 * 
 *  @uses Google
 *  @author alexey.mineev <alexey.mineev@zinkia.com>
 */

require_once 'DB.inc.php';
require_once 'libs/Google.php';

include_once 'libs/config.inc.php';

$db = getDB();

$ch = curl_init(); //getting cURL handler

$g= new Google($ch);

$g->login(GOOGLE_USER,GOOGLE_PASSWORD);

curl_setopt($ch, CURLOPT_URL,SERIES_FILE_LINK);
$series = explode("\r\n",curl_exec($ch));

$res = $db->query("SELECT name FROM series");

$seriesDB = array();
foreach ($res as $serie)
    $seriesDB[] = $serie['name'];

$series = array_merge($seriesDB,$series);

$ret = new stdClass();
$ret->success = true;
$ret->data = $series;

header ("Content-type: application/json");
echo json_encode($ret);