<?php
require_once 'Zend/Http/Client.php';
require_once 'Zend/Dom/Query.php';
set_time_limit(0);
/**
 * @class GlassCube
 * 
 */
class GlassCube {
    const BASE_URL = "https://salitamontiel.glasscubes.com";
    const LOGIN_URI = "/wicket/bookmarkable/hub.app.wicket.login.UserLoginPage";
    const REPORT_POST_DATA = "%3Asubmit=x&who=u-3&whichWorkspace=0&whichWorkspace=1&whichWorkspace=2&whichWorkspace=3&whichWorkspace=4&whichWorkspace=5&whichWorkspace=6&whichWorkspace=7&whichWorkspace=8&whichWorkspace=9&whichWorkspace=10&state=0";
    const  LAST_PAGE = 78;
    
    public function __construct($id,$email,$password) {
        $this->client = new Zend_Http_Client(self::BASE_URL,array(
            "maxredirects" => 100000000,
            "timeout" => 1000000,
        ));
        
        $this->client->setCookieJar(true);
        $this->id =$id; 
        
        
        $this->email = $email;
        $this->password = $password;
        
    }
    /**
     * 
     * @param type $id
     * @return type
     */
    public function getReportsLink($id) {
        $this->client->resetParameters();
        $this->client->setUri(self::BASE_URL."/cube/tasksv2/{$id}");
        $html =  $this->client->request(Zend_Http_Client::GET)->getBody();
        
        $query = new Zend_Dom_Query(Zend_Dom_Query::DOC_HTML,"utf8"); 
        $query->setDocumentHtml($html);
        $result=$query->query("div.otherreports a");
        return $result->current()->getAttribute("href");
        
    }
    
    public function doLogin() {
        //$this->client->
        echo ">>>> Trying to login with user: ".$this->email."\n";
        $this->client->resetParameters();
        $this->client->setUri(self::BASE_URL.self::LOGIN_URI);
        
        $this->client->setParameterGet("-1.IFormSubmitListener-signInForm","");
        $this->client->setParameterPost("id1_hf_0","");
        $this->client->setParameterPost("forgotForm:email",$this->email);
        $this->client->setParameterPost("password",$this->password);
        
        $ret =  $this->client->request(Zend_Http_Client::POST);
        if (!strpos($ret->getBody(),"Tablero"))
            die("!!!!!! ERROR: Login failed. \n");
        else
            echo ">>>> Login done with user ".$this->email."\n";
        
        return $ret->getBody();
    }
    
    public function getSectionList() {
         $html= $this->doLogin();
         $query = new Zend_Dom_Query(Zend_Dom_Query::DOC_HTML,"utf8"); 
         $query->setDocumentHtml($html);
        
         $links = $query->query("a.projectLink");
         
         $first = $links->current();
         
         
         //echo $name;
         $name = $first->childNodes->item(3)->textContent;
         $id = explode("/",$first->getAttribute("href"))[3];
         
         
         $sections[] = array(
             "id" => $id,
             "name" => $name
         );
         
         echo ">>>>> Found project ".$name." | ID: ".$id."\n";
         while ($el = $links->next())
         {
            $el = $links->current();
            $name = $el->childNodes->item(3)->textContent;
            $id = explode("/",$el->getAttribute("href"))[2];
            $sections[] = array(
                 "id" => $id,
                 "name" => $name
             );
             
         }
         
         echo ">>>>> Done. Section list fetched. Found ".count($sections)."\n";
        return $sections;
    }
    
    public function navigate($uri) {
        $this->client->resetParameters();
        
        //die(self::BASE_URL.$uri);
        $this->client->setUri(self::BASE_URL.$uri);
        
        $resp=  $this->client->request(Zend_Http_Client::GET)->getBody();
        //$resp = $this->client->request(Zend_Http_Client::GET)->getBody();
        return $resp;
        
    }
            
    public function getPages($html) {
        $query = new Zend_Dom_Query(Zend_Dom_Query::DOC_HTML,"utf8"); 
        $query->setDocumentHtml($html);
        
        $res = $query->query(".goto a"); 
        
        $pages = array();
        $el = $res->current();
        $pages[] = "/wicket/".$el->getAttribute("href");
        while ($el= $res->next())
        {
            $pages[] = "/wicket/".$el->getAttribute("href");
        }
        
        return $pages;
    }
    public function fetchComments($taskUri,$name="(next page)") {
        echo ">>>>> Fetching comments from task: $name, uri: $taskUri\n";
        $html = $this->navigate("/".str_replace("../","",$taskUri));
        
        
        $query = new Zend_Dom_Query(Zend_Dom_Query::DOC_HTML,"utf8"); 
        $query->setDocumentHtml($html);
        
     
        
           
          if ($query->query(".loadMoreLink")->current()!=null) {
              preg_match("/\\?(.*).IBehaviorListener.0-taskDetailPanel-commentListPanel-latestBottomImp-loadMoreContainer-loadMoreTopLink/i",$html,$matches);
              
              if (strpos($taskUri,"?")) {
                  $taskUri=explode("?",$taskUri)[0];
              }
              return $this->fetchComments($taskUri.$matches[0]);    
              
          }   
        
          $res = $query->query(".commentContainer .usrcont .usrcmt .innercmt"); 
          $comments = array();
          foreach ($res as $div) {
              //$items = $div->childNodes;
              
              $q = new Zend_Dom_Query(Zend_Dom_Query::DOC_HTML,"utf8"); 
              $q->setDocumentHtml($res->getDocument()->saveHTML($div));
              $author = $q->query("a[href='#'] .author")->current()->textContent;
              $date = $q->query(".when span")->current()->textContent;
              
              $msgQ = $q->query(".usrinfo");
              
              $message = strip_tags($msgQ->getDocument()->saveHTML($msgQ->current()));
              
              $comments[] = array(
                 "author" =>$author,
                  "date" => $date,
                  "msg" => $message
              );
              
          }
          echo ">>>>>> ".count($comments)." comments parsed.\n";
          return $comments;
    }
    
    public function processPage($page,$text = false) {
        
        
        $html= $text? $page:$this->navigate($page);
        
        
        
        try {
        
        $query = new Zend_Dom_Query(Zend_Dom_Query::DOC_HTML,"utf8"); 
        $query->setDocumentHtml($html);
          
        
          $this->nextPage =$query->query("a.next")->current()!=null ? "/wicket/". $query->query("a.next")->current()->getAttribute("href"):null; 
          $res = $query->query("#task-report-table td.titleTreport div a"); 
              
           $tasks = array();
           foreach ($res as $el) {
                //if (strlen($el->textContent)!=0)
                    $tasks[] = array("id" => $el->getAttribute("href"),"name" => $el->textContent);
           
           }
           //var_dump($tasks);
           return $tasks;
        } catch (Exception $e) {
            return array();
        } 
        
    }
    
    public function getCsvLink($html) {
         $query = new Zend_Dom_Query(Zend_Dom_Query::DOC_HTML,"utf8"); 
         $query->setDocumentHtml($html);
        
         return $query->query("#reporttop a")->current()->getAttribute("href");
         
         
        
    }
    
    public function genReport() {
        $this->client->resetParameters();
        /*$this->client->setParameterPost(":submit","x");
        $this->client->setParameterPost("who","u-3");
        $this->client->setParameterPost("whichWorkspace","0");
        $this->client->setParameterPost("whichWorkspace","1");
        $this->client->setParameterPost("whichWorkspace[]","2");
        $this->client->setParameterPost("whichWorkspace[]","3");
        $this->client->setParameterPost("whichWorkspace[]","4");
        $this->client->setParameterPost("whichWorkspace[]","5");
        $this->client->setParameterPost("state","0");*/
        
        //$this->client->setRawData("%3Asubmit=x&who=u-3&whichWorkspace=0&whichWorkspace=1&whichWorkspace=2&whichWorkspace=3&whichWorkspace=4&whichWorkspace=5&state=0","application/x-www-form-urlencoded");
        $this->client->setRawData(self::REPORT_POST_DATA);
        
        $this->client->setUri(self::BASE_URL.$this->formUri);
        
        
        $firstPage = $this->client->request(Zend_Http_Client::POST)->getBody();
        
        $this->csvLink = $this->getCsvLink($firstPage);
        
        
        
        $tasks = $this->processPage($firstPage,true);
        
        $pages = $this->getPages($firstPage);
        
      
        
             
        
        
        //var_dump($this->pages);1
        $this->fpage = $tasks;
        
        
       /* foreach ($pages as $page) {
            
            $tasks= array_merge($tasks,$this->processPage($page));
        }
        
        var_dump($tasks);*/
        
    }
    
    public function getReportForm($rUri) {
        $html = $this->navigate($rUri);
        
        $query = new Zend_Dom_Query(Zend_Dom_Query::DOC_HTML,"utf8"); 
        $query->setDocumentHtml($html);
        
        $q = $query->query("form");
        $q->next();
        $res =$q ->next();
        
        $this->formUri = "/wicket/". 
                    $res->getAttribute("action");
    }
    
}


const USER = "";
const PASSWORD = "";

echo "******* GlassCube Tasks Exporter v0.alpha ********\n\n";
echo "****> Connecting & login into ".GlassCube::BASE_URL."\n";

function tasksList($section) {
    echo ">>>> Fetching task list for section id: ".$section;    
    $gc = new GlassCube($section,USER,PASSWORD);
    $gc->doLogin();
    

    $reportsUri= "/cube/tasksv2/".$gc->getReportsLink($gc->id);
    echo ">>>> Preparing report... \n";
    $gc->getReportForm($reportsUri);
    $gc->genReport();
    
    echo ">>>>> Downloading CSV report. \n";
    echo $gc->csvLink;
    $csvData = $gc->navigate("/".$gc->csvLink);    
     
    
    $lines = explode("\n",$csvData);
    
    $headers = explode(",",$lines[0]);
    
    $headers = array_map(function($el) {
        return trim(strtolower($el));
        
    }, $headers);
    
    for ($i=1;$i<count($lines)-1;$i++)
    {
        
        $tasks[] = array_combine($headers, explode(",",$lines[$i])); 
    }
    
    echo ">>>> ".count($tasks)." processed from CSV.\n";
    echo ">>>> Fetching page list... \n";
    
    $data = array();
    for ($i=1;$i<GlassCube::LAST_PAGE;$i++) {
        echo ">>>> Exporting page {$gc->nextPage}\n";
        /*$gcn = new GlassCube($section,USER,PASSWORD);
        $gcn->doLogin();
        $reportsUri= "/cube/tasksv2/".$gcn->getReportsLink($gcn->id);
        $gcn->getReportForm($reportsUri);
        $gcn->genReport();*/
        
        $html = $gc->navigate($gc->nextPage);    
        $ntasks =$gc->processPage($html,true);
        $data = array_merge($data,$ntasks);

        echo ">>>> Done. ".count($ntasks)." tasks parsed\n";
     }
        
    $data = array_merge($gc->fpage , $data);
     
    echo ">>>>> Report parsed. ".count($data)." tasks fetched\n";
    
    
    for ($i=0;$i<count($tasks);$i++)
    {
        
       $tasks[$i]['id'] = $data[$i]['id'];
       //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
    }
        
    return $tasks;
    
    

}

echo ">>>> Reading section list...";
 
$gc= new GlassCube(null, USER, PASSWORD);


   $tasks = tasksList("35835"); 
   
   $gc->doLogin();
   
   
   for ($j=0;$j<count($tasks);$j++) {
      try { 
        $tasks[$j]['comments'] = $gc->fetchComments($tasks[$j]['id'],$tasks[$j]['title']);
      } catch (Exception $e) {
          echo "!!!!!! Network error: ".$e->getMessage()."\n";
          echo ">>>> retrying...";
          
          $j--;
      }  
   }
    



//$gc->fetchComments("../cube/tasksv2/35835/224155");


file_put_contents("tasks.json", json_encode($tasks));
echo "*************tasks.json created **************";
 
 
 
