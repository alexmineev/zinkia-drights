
(function() {
    
    
    function _load() {
        console.log("jQUERY LOADED");
        
    } 
    
    
    
    
    var s = document.createElement("script");
    s.setAttribute("src","https://ajax.googleapis.com/ajax/libs/jquery/2.2.3/jquery.min.js");
    s.setAttribute("type","text/javascript");
    s.onload = _load;
    document.getElementsByTagName("HEAD")[0].appendChild(s);

})();
