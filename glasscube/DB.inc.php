<?php

class MysqlWrapper {
    public function __construct($server,$user,$pass,$dbname) {
        $this->conn = mysql_connect($server,$user,$pass) 
                or die("MySQL Driver Error: ".  mysql_error());
        mysql_select_db($dbname,$this->conn);
    }
    
     public function query($query) {
         
         $result = mysql_query($query,$this->conn);
         
         $rows = [];
         while ($row = mysql_fetch_array($result)) {
             $rows[] = $row;
         }
         
         return $rows;
     }
}
/*PHP ver. >=5.6*/
function getDB() {
    $host="192.168.1.80";
    $port=3306;
    $socket="";
    $user="UDigitalRYout";
    $password="DR160602znk";
    $dbname="DigitalRYout";
  
      /* Uncomment for PHP ver <=5.3 */
    //return new MysqlWrapper($host.":".$port,$user,$password,$dbname);
    
    
    $db =  new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error());
    
    return $db;
  
}



