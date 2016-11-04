<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require_once 'DB.inc.php';

$db = getDB();
echo "Videos DB will be erased! Proceed Y/N? ";
$r=fgetc(STDIN);

if ($r != "Y") exit();


$rs = $db->prepare("TRUNCATE videos_tmp;");
$rs->execute();
$rs = $db->prepare("TRUNCATE videos;");
$rs->execute();

echo "BD Erased.\n";