<?php
class Google { 

    const COOKIEFILE = '../.ht_cookiejar';
    
    public function __construct($ch = false) {
        if (!$ch)
            $this->ch = curl_init();
        else 
            $this->ch = $ch;
    }

    protected function doConfig() {

        curl_setopt($this->ch, CURLOPT_CONNECTTIMEOUT, 30);
        curl_setopt($this->ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 6.0; Windows 5.1)");
        curl_setopt($this->ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($this->ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($this->ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($this->ch, CURLOPT_COOKIEJAR, self::COOKIEFILE);
        curl_setopt($this->ch, CURLOPT_COOKIEFILE, self::COOKIEFILE);
        curl_setopt($this->ch, CURLOPT_HEADER, 0);  
        curl_setopt($this->ch, CURLOPT_RETURNTRANSFER,1);
        curl_setopt($this->ch, CURLOPT_CONNECTTIMEOUT, 120);
        curl_setopt($this->ch, CURLOPT_TIMEOUT, 120);

    }

    public function login($username,$password) {
    
           
        $this->doConfig();
        //echo "[INFO] Logging into Google Account\n";
        curl_setopt($this->ch, CURLOPT_URL, 'https://accounts.google.com/ServiceLogin?hl=en&');
        $data = curl_exec($this->ch);
        
        $formFields = $this->getFormFields($data);

        $formFields['Email']  = $username;
        $formFields['Passwd'] = $password;
        unset($formFields['PersistentCookie']);

        $post_string = '';
        foreach($formFields as $key => $value) {
            $post_string .= $key . '=' . urlencode($value) . '&';
        }

        $post_string = substr($post_string, 0, -1);

        curl_setopt($this->ch, CURLOPT_URL, 'https://accounts.google.com/ServiceLoginAuth');
        curl_setopt($this->ch, CURLOPT_POST, 1);
        curl_setopt($this->ch, CURLOPT_POSTFIELDS, $post_string);

        $result = curl_exec($this->ch);

        return $result;
        //echo "[INFO] Login OK.\n";
    }

    protected function getFormFields($data)
    {
        if (preg_match('/(<form.*?id=.?gaia_loginform.*?<\/form>)/is', $data, $matches)) {
            $inputs = $this->getInputs($matches[1]);

            return $inputs;
        } else {
            throw new Exception('Error: Login form not found.');
        }
    }

    protected function getInputs($form)
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

    public function __destruct() {
        curl_close($this->ch);
    }
}