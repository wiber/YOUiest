/*
var curea = "nro9c1rNZWptL8xvUHlbw";
var curespin = "UHzpOFf7xx71TKwEyZEeQ";
var curetweet ="faqTC5lt072CjLMRAoYEtQ";
var API_KEY = curea;
twitter_user='wiber';
*/
/*
if (
    !$(head).attr('twitter_user'){return
    }
else{
    API_KEY=$(head).attr('twitter_user')
    }
*/
var windowheight = screen.height;//(typeof window.innerHeight != 'undefined' ? window.innerHeight : document.body.offsetHeight);
var windowwidth=screen.width;//(typeof window.innerWidth != 'undefined' ? window.innerWidth : document.body.offsetWidth);
var tweetidstack=[];
var tweetpile= [];
var dragging=false;
var percentage=0;

/*
var headID = document.getElementsByTagName("head")[0];         
var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.src = 'http://code.onilabs.com/0.9.2/oni-apollo.js';
headID.appendChild(newScript);
*/

//<script type="text/sjs">require('http://dropbox.com/XXX/fatc.sjs')</script>

var cssIdjq = 'myCss';  // load jqueryui css from google.
if (!document.getElementById(cssIdjq))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssIdjq;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/themes/smoothness/jquery-ui.css';
    link.media = 'all';
    head.appendChild(link);
}

var cssId = 'fatc';  // load fatc css from dropbox..?.
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'fatc.css';
    link.media = 'all';
    head.appendChild(link);
}

function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}





