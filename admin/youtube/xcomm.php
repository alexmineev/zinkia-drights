<?php
require_once 'Zend/Db.php';


$db = Zend_Db::factory('Pdo_Mysql', array(
    'host'     => 'ddigital.zinkia.mad',
    'username' => 'UDigitalRYout',
    'password' => 'DR160602znk',
    'dbname'   => 'DigitalRYout'
));



//echo Zend_Db::class;