<?php


/**
 * @internal Mysqlwrapper
 * @author amineev
 * 
 */
class MysqlWrapper {
    public function __construct($server,$user,$pass,$dbname,$port) {
        $this->conn = mysqli_connect($server,$user,$pass,$dbname,$port) 
                or die("MySQL Driver Error: ".  mysql_error());
       // $this->dbLog = fopen("db_log.log","w");
        //mysqli_select_db($this->conn,$dbname);
    }
     
     public function query($query) {
        // fputs($this->dbLog,$query.";\n");
         $result = mysqli_query($this->conn,$query);
         $rows = [];
        // echo $query;
         //var_dump($result);die();
         if (!is_object($result)) return;
         //return $result;
         
         while ($row = mysqli_fetch_array($result)) {
             //var_dump($row); die();
             $rows[] = $row;
         }
         //var_dump($rows); die();
         mysqli_free_result($result);
         return $rows;
         
     }
     public function escape_string($str) {
         return mysqli_escape_string($this->conn, $str);
     }
     public function close() {
         mysqli_close($this->conn);
      //   fclose($this->dbLog);
     }
     
}
/*PHP ver. >=5.6*/
function getDB() {
    $host="192.168.1.80";
    $port="3306";
    $socket="";
    $user="UDigitalRYout";
    $password="DR160602znk";
    $dbname="DigitalRYout";
  
      /* Uncomment for PHP ver <=5.3 */
    return new MysqlWrapper($host,$user,$password,$dbname,$port);
    
    
    /*$db =  new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error*/
    
    //return $db;
  
}



