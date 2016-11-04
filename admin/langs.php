<?php
/**
 * ISO Langs codes lists REST API controllerç
 * 
 * @uses Zend_Json_Encoder UTF8-safe encoder.
 * @author Alexey Mineev <alexey.mineev@zinkia.com>
 * 
 */

require_once 'DB.inc.php';
//require_once 'Zend/Json.php';


header("Content-type: application/json");

$res = new stdClass();
$res->success = false;


if ($_SERVER['REQUEST_METHOD'] == "GET")
{
   $db = getDB();
   $langs= $db->query("SELECT * FROM iso_lang");
   $rLangs = array();
   foreach ($langs as $lang)
    $rLangs[]  = array(
        "code" => $lang['code'],
        "name" => utf8_encode($lang['name'])
    );
   
   $res->success = true;
   $res->data = $rLangs;
    
}

echo json_encode($res);//Zend_Json::encode($res,Zend_Json::TYPE_ARRAY);