<?php

header("Content-type: text/json");

$res = new stdClass();
if (count($_FILES)>0 && isset($_FILES['csv'])) {
    $fp=fopen($_FILES['csv']['tmp_name'],"r");
    
    $videos= array();
    while (!feof($fp)) {
        $cell = fgetcsv($fp);
        
        if ($cell[0] =="Video ID") {
            $header =$cell;
            
            while (!feof($fp) && $cell[0]!=null) {
                
                $cell = fgetcsv($fp);
               
                $videos[] = $cell;
                
                
            }
          
         break;   
        }
        //}
    }
    
    $results = array();
    if (count($videos)>0) {
       
        foreach ($videos as $video) {
            if ($video[0] == null) continue;
            
            $result= new stdClass();
            $result-> id = $video[0];
            $result -> title = $video[3];
            $result -> channel = $video[7];
            $result -> views = $video[17];
            $result -> earnings = $video[31];
            
            $results[] = $result;
        }
        
        $res->videos = $results;
    
    } else {
       
        $res->error = "Incorrect Report CSV file";
    } 
    
} else {
         
       $res->error = "Incorrect Report CSV file";
    
    
}

echo json_encode($res);