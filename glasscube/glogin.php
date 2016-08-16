<?php
require_once('Zend/Http/Client.php');


/**
 * Clase para acceder a los informes de YouTube MCN.
 *
 * @author alexey.mineev
 */
class YTReports {
    
    const AUTH_URI = "https://accounts.google.com/ServiceLoginAuth";
    const FORM_URI = "https://accounts.google.com/ServiceLogin?hl=en&service=cds&continue=https://www.youtube.com/dashboard&followup=https://www.youtube.com/dashboard";
    
    public function __construct($email,$password) {
        $this->email = $email;
        $this->password = $password;
        
        
        $this->client = new Zend_Http_Client(self::FORM_URI,array(
            "maxredirects" => 1000000,
            "timeout" => 100000,
            "useragent" => "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)"
        ));
        $this->client->setCookieJar(true);
        
    }
    private function getForm() {
         $this->client->setUri(self::FORM_URI);
         return $this->client->request(Zend_Http_Client::GET)->getBody();
    }
    public function signIn() {
        $this->client->resetParameters();
        
        
        $formParams = $this->getFormFields($this->getForm());
        $formParams['Email'] = $this->email;
        $formParams['Passwd'] = $this->password;
        
        $formParams['PersistentCookie'] = "no";
        foreach ($formParams as $paramName => $paramValue)
        {
            echo $paramName.": ".$paramValue."\n<br />";
            $this->client->setParameterPost($paramName,$paramValue);
        }
        
        //$this->client->setHeaders("User-Agent","Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)");
       /* $this->client->setParameterPost("Page","RememberedSignIn");
        $this->client->setParameterPost("gxf","AFoagUVD8u_yzrpXmUpyRYP1uvbxKIu8Ig:".  microtime());
        $this->client->setParameterPost("continue","https://www.youtube.com/signin?app=desktop&next=%2Fdashboard%3Fo%3D3sk-VT2PP3aGHHSPGjBd9A&action_handle_signin=true&feature=redirect_login&hl=en");
        $this->client->setParameterPost("service","youtube");
        $this->client->setParameterPost("sacu","1");
        $this->client->setParameterPost("acui","1");
        $this->client->setParameterPost("ignoreShadow","0");
        $this->client->setParameterPost("bgresponse","js_disabled");
        $this->client->setParameterPost("pstMsg","1");
        $this->client->setParameterPost("dnConn","");
        $this->client->setParameterPost("checkConnection","youtube:113:1");
        $this->client->setParameterPost("checkedDomains","youtube");
        $this->client->setParameterPost("Email",$this->email);
        $this->client->setParameterPost("Passwd",$this->password);*/
       // $this->client->setParameterPost("PersistentCookie","yes");
        
       $this->client->setUri(self::AUTH_URI);
       return $this->client->request(Zend_Http_Client::POST)->getBody();
        
        
    }
    
    private function getFormFields($data)
    {
        if (preg_match('/(<form.*?id=.?gaia_loginform.*?<\/form>)/is', $data, $matches)) {
        $inputs = $this->getInputs($matches[1]);

        return $inputs;
        } else {
            die('didnt find login form');
        }
    }

private function getInputs($form)
{
    $inputs = array();

    $elements = preg_match_all('/(<input[^>]+>)/is', $form, $matches);

    if ($elements > 0) {
        for($i = 0; $i < $elements; $i++) {
            $el = preg_replace('/\s{2,}/', ' ', $matches[1][$i]);

            if (preg_match('/name=(?:["\'])?([^"\'\s]*)/i', $el, $name)) {
                $name  = $name[1];
                $value = '';

                if (preg_match('/value=(?:["\'])?([^"\'\s]*)/i', $el, $value)) {
                    $value = $value[1];
                }

                $inputs[$name] = $value;
            }
        }
    }

    return $inputs;
}
    
}



$ytr = new YTReports("alexey.mineev@zinkia.com","am071215");
//var_dump($ytr->signIn());


$ytr->client->setUri("https://www.youtube.com/dashboard");
 var_dump($ytr->client->request()->getBody());