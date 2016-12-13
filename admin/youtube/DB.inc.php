<?php
require_once 'Zend/Db.php';
require_once 'libs/config.inc.php';
/**
 * @internal Mysqlwrapper
 * @author amineev
 * 
 */
class MysqlWrapper {
    public function __construct($server,$user,$pass,$dbname,$port) {
       /* $this->conn = mysqli_connect($server,$user,$pass,$dbname,$port) 
                or die("MySQL Driver Error: ".  mysql_error());*/
       // $this->dbLog = fopen("db_log.log","w");
        //mysqli_select_db($this->conn,$dbname);
        
        
        $this->conn = Zend_Db::factory('Pdo_Mysql', array(
                 'host'     => $server,
                 'username' => $user,
                 'password' => $pass,
                 'dbname'   => $dbname
        ));

        
    }
     
     public function query($query) {
        // fputs($this->dbLog,$query.";\n");
         /*$result = mysqli_query($this->conn,$query);
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
         return $rows;*/
         
         $stmt = $this->conn->query($query);
         return $stmt->fetchAll();
         
     }
     public function escape_string($str) {
         //return mysqli_escape_string($this->conn, $str);
         return $str;
     }
     public function close() {
         //mysqli_close($this->conn);
      //   fclose($this->dbLog);
     }
     
}

function getDB() {
   
    
    return new MysqlWrapper(DB_HOST,DB_USER,DB_PASSWORD,DB_SCHEMA,3306);
    
    
    /*$db =  new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error*/
    
    //return $db;
  
}



