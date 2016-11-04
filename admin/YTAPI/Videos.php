<?php

/**
 * Description of Videos
 *
 * @author alexey.mineev
 */
class Videos {
    private $videos = array();
    private $year = null;
    private $trimester = null;
    
    protected $_query = "";
    protected $_groupBy = "id";
    
    public function __construct(mysqli $db) {
        $this->db = $db;
    }
    
    public function setVideosQuery($year,$trimester) {
       $this->_query = "SELECT id,title,channel,SUM(views) as views,SUM(earnings) as earnings FROM videos WHERE year = $year AND trimester = $trimester";
    }
    
    public function load($mode) {
        
       $res = $this->db->query($this->_query);
        
       foreach ($res as $video) {
           $this->videos[] = $video;
       }  
       
      return count($res)>0;
    }
    
    
    
}
