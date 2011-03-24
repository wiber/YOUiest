
/*
 
 
This is more of a scaffold than a proper twitter client.
It lacks any sophistication and basically just allows you to sign-in
and tweet, it shows and auto-updates your timeline, and it loads older
tweets when you scroll down the page.
It's easy to extend, so go on and hack it :-)
Oh, and IT RUNS COMPLETELY CLIENT-SIDE. There is no server code involved.
It talks to twitter directly. You don't even need a proper domain to
run it from; you can serve it from 'localhost'. E.g. if you have a Mac,
you can serve it via Personal Web Sharing - see
http://www.macinstruct.com/node/112 .
* HOW TO GET A TWITTER APPLICATION ID:
Log into twitter and go to http://dev.twitter.com/apps/ .
Register a new application, setting the 'Callback URL' to the site where
your app will live (this can be 'http://localhost'!).
Set the 'Default Access type' to 'Read & Write'.
Then change the application id below to the @Anywhere API key of your app.
* ABOUT STRATIFIED JAVASCRIPT / ONI APOLLO:
Oni Apollo, the library that we use here, allows you to make calls to
the Twitter API directly from the client in a NON-CALLBACK style.
See http://onilabs.com/api#twitter.
It allows you to call any function in the standard RESTful Twitter API
(see http://dev.twitter.com/doc) in this way:
var result = T.call("statuses/home_timeline", params);
StratifiedJS is the extended JS used by Oni Apollo to make the
non-callback style possible (and more!). See http://stratifiedjs.org/sjsdocs.
 
*/
var curea = "nro9c1rNZWptL8xvUHlbw";
var curespin = "UHzpOFf7xx71TKwEyZEeQ";
var curetweet ="faqTC5lt072CjLMRAoYEtQ";
var youiestdev ="V2UNxW4TKTovoUPUpIY9hA";
var API_KEY = curea;

var windowheight = screen.height;//(typeof window.innerHeight != 'undefined' ? window.innerHeight : document.body.offsetHeight);
var windowwidth=screen.width;//(typeof window.innerWidth != 'undefined' ? window.innerWidth : document.body.offsetWidth);
var tweetidstack= new Array;
var tweetpile= new Array;
var dragging=false;
var percentage=0;
var cyclespeed=5;
firstrun=false;

/*
$(document).ready(function() {
  $('.wibe').dialog({dialogClass: "flora"});
  $('.flora.ui-dialog').css({position:"fixed"});
  $(".ui-resizable").stop(function() {
    $(".flora.ui-dialog").css({position:"fixed"});
  });
)};
*/

var cssId = 'myCss';  // load jqueryui css from google.
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/themes/smoothness/jquery-ui.css';
    link.media = 'all';
    head.appendChild(link);
}

var cssId = 'myCss';  // load jqueryui css from google.
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'http://dl.dropbox.com/u/1545014/curea/fatc.css';
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








//----------------------------------------------------------------------
  
// Initialization
//<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/start/jquery-ui.css" type="text/css" rel="Stylesheet" /> 
  
// Load the @Anywhere API and init with your application id:
//require("apollo:twitter")

 
// We'll use jquery; load it from Google's CDN and install stratified
// bindings ($click, etc):
require("apollo:jquery-binding").install();
//alert($('body').attr('API_KEY'));
if(!twitter_user){var twitter_user='wiber';};

if ($('body').attr('API_KEY')){var API_KEY=$('body').attr('API_KEY')};
if ($('body').attr('twitter_user')){var twitter_user=$('body').attr('twitter_user')};

var T = require("apollo:twitter").initAnywhere({id:API_KEY});
require('apollo:http').script("https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js"); 
//require('apollo:http').script("http://dl.dropbox.com/u/1545014/curea/jquery.touch.js");


var common = require("apollo:common");
var tweeting_button = $("#tweeting_button");
var status_el = $("#status");
var counter = $("#tweeting_status");
$.fx.speeds._default = 600; //jquery animation speed




//hide dialogs when scrolling
var didScroll = false;
$(window).scroll(function() {
    didScroll = true;
});

//to be used to avoid opening a dialog tweet if textfieldstatus box has focus


$(document).ready(function() {    

    $('.tweet_box')
            .focus(function() {                
                $(this).parent().addClass("focus");
                hold(4*cyclespeed*1000);
                $(this).parent().removeClass("focus");
            });
    $('.tweet_box').blur(
            function(){
                $('tweet_box').parent().removeClass('focus');
                alert('tweet_box')
                });
    
});





//----------------------------------------------------------------------
// main program loop
 
// Show the twitter connect button:
T("#login").connectButton();
// Run our application logic in an endless loop:


$('.tweet_box').dialog({ //executed at the right time..
        autoOpen:false,
        dialogClass:'wibe',
        //position:['center','bottom'],
        width:500,
})
//will not autoopen:false.. sticks for a second.
//$('.tweet_box').parent().hide()
$('.tweet_box').dialog('open').parent().css({position:"fixed"});;
$('.tweet_box').dialog('option', 'position', ['left','top']);
$('.tweet_box').dialog('option', 'height', 85);
$('.tweet_box').dialog('option','title','Tweets are things');
$('.tweet_box').css('overflow','hidden');

 
while (true) {
  try {
    main();
  }
  catch(e) {
    alert("Error:"+e);
  }
}
 
//----------------------------------------------------------------------
// main application logic:



 
function main() {
  // First wait until we're connected:
  if (!T.isConnected())
    T.waitforEvent("authComplete");
  $("#login").hide();
  $("#welcome").hide();
  $("#timeline").empty();
  /*
  $('.tweet_box').dialog('open');
         $('.tweet_box').dialog("option", "height", 220);
         $('.tweet_box').dialog("option", "position", ['left','bottom']);
         */
  try {
    // Let's set the last tweet and the background based on the
    // user's prefs:
    var profile = T.call("users/show", {user_id: T.currentUser.id});
    $("#current_user").text(profile.screen_name);
    $("#current_user").prepend("<img src='"+profile.profile_image_url + "'/>");
    setLatestTweet(profile.status);
/*
//we want to run this as an external script, hands off original page
    $("body").css({
      background: common.supplant("#{color} url({image}) {repeat}", {
        color: profile.profile_background_color,
        image: profile.profile_background_image_url,
        repeat: profile.profile_background_tile ? "repeat" : "no-repeat"
      })
    });
*/
  
    // Now we'll do several things in parallel, by combining them with
    // the stratified construct waitfor/and:
    waitfor {
      waitfor_signout();
      // Now exit main(). The other clauses in the waitfor/and will
      // automatically be aborted cleanly (i.e. eventlisteners will be
      // removed, etc).
      return;
    }
    and {
      // Endlessly handle tweets by the user:
      tweet_loop();
    }
    and {
      // Endlessly update the timeline:
      update_timeline_loop();
    }
    and {
      // Endlessly load older tweets when the user scrolls down:
      show_more_loop();
    }
    and {
      ui_mute_loop();
    }
    and {
       poptweet();
    }
    and {scrollfader();}

  }
  finally {
    // Clean up:
    $("#current_user").empty();/*
    $("#timeline").empty();
    $("#welcome").show();
    $("body").css({background:""});
*/
  }
}
 
 
//----------------------------------------------------------------------
// Helper functions
 
function setLatestTweet(tweet) {
  $("#latest")[tweet?"show":"hide"]();
  if (tweet)
    $("#latest span").text(tweet.text);
}
 
// 'characters left' counter
function update_counter() {
  counter.text(140 - status_el.val().length);
}
 
function ui_mute_loop() {
  if (!window["localStorage"]) return;
  
  var filterArray = [];
  tweetFilter = function(tweet) {
    for (var i = filterArray.length; i >= 0; --i) {
      var keyword = filterArray[i];
      if (!keyword) continue;
      if (keyword.indexOf("@") == 0 && tweet.user.screen_name == keyword.substring(1)) return true;
      else if (tweet.text.indexOf(keyword) != -1) return true;
    }
 
    return false;
  };
  
  var button = $("<a href='#'>Mute list</a>").prependTo("#session_buttons");
  try {
    while(true) {
      filterArray = localStorage.mute ? localStorage.mute.split(" ") : [];
      button.$click();
      var rv = prompt("Enter a space-separated list of #keywords or @users you want to mute.", localStorage.mute);
      if (rv != null) {
        localStorage.mute = rv;
        $(window).trigger("settingschanged");
      }
    }
  } finally {
    button.remove();
  }
}
 
// Append/prepend a tweet to the timeline
function showTweet(tweet, append) {
  if (window["tweetFilter"] && tweetFilter(tweet)) return;
 
  var date = new Date(tweet.created_at.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/,
                                               "$1 $2 $4 $3 UTC"));
  var elapsed = Math.round(((new Date()).getTime() - date.getTime()) / 60000);
  if (elapsed < 60) {
    var date_string = elapsed + " minutes";
  }
  else if (elapsed < 60*24) {
    var date_string = Math.round(elapsed / 60) + " hours";
  }
  else {
    var date_string = date.getDate() + "/" + date.getMonth();
  }
 
  if (tweet.entities && tweet.entities.urls) {
    for (var i = tweet.entities.urls.length - 1, entity; entity = tweet.entities.urls[i]; --i) {
      tweet.text = common.supplant("{a}<a target='_blank' href='{b}'>{b}</a>{c}", {
        a: tweet.text.substring(0, entity.indices[0]),
        b: entity.url,
        c: tweet.text.substring(entity.indices[1])
      });
    }
  }
  // Construct the html for the tweet. Note how we can use
  // multiline strings in StratifiedJS. We also use the
  // 'supplant' function from the 'common' module for getting
  // values into our string:
  $("#timeline")[append ? "append" : "prepend"](common.supplant("\
</div>
<div class='timeline_item user_{screenname}'>
<div  class='tweet_wrapper' tweetid='{tweetid}'>
<span class='tweet_thumb'>
<img src='{image}' width='48' height='48'/>
</span>
<span class='tweet_body'>
<span class='screenname'>{screenname}</span>
<span class='content'>{text}</span>
<span class='meta'>{meta}</span>
</span>
</div>
</div>
 
", {
      tweetid: tweet.id,
      text: tweet.text,
      image: tweet.user.profile_image_url,
      screenname: tweet.user.screen_name,
      meta: date_string
    })
    
    
);
tweetidstack.push(tweet.id); 
tweetpile.push((common.supplant("\
<div id='{tweetid}' class='timeline_item user_{screenname}'>
<div class='tweet_wrapper' tweetid='{tweetid}'>
<span class='tweet_thumb'>
<img src='{image}' width='48' height='48'/>
</span>
<span class='tweet_body'>
<span class='screenname'>{screenname}</span>
<span class='content'>{text}</span>
</span>
</div>
", {
      tweetid: tweet.id,
      text: tweet.text,
      image: tweet.user.profile_image_url,
      screenname: tweet.user.screen_name,
      meta: date_string
    })
    
));

$("body")[append ? "append" : "prepend"](tweetpile.pop()); 

 
$( "#"+tweet.id ).dialog({ 
    title:tweet.user.screen_name+" - "+date_string +'   [   DRAG ME!   ]',
    position: ['right','bottom'], 
    autoOpen:false,
    dialogClass: 'wibe',
    width:500,
 dragStart:function(event, ui) { 
        dragging=true;
        $('.tweet_box').dialog('close');
        $(this).parent().addClass('moved');
        $(this).parent().removeClass('snapmoved');
        },
 
  open: function(event, ui) { 
 hold(1.6*cyclespeed*1000); //stack them at the top instead of where new spawn
 if(!$(this).parent().hasClass('moved')){
 $(this).dialog('option', 'position', ['right','top']);
 $(this).parent().addClass('snapmoved');
 }
 
 
 //setInterval("$(this).dialog('option', 'position', ['right','center']);",1000);
 //setTimeout("if (!(this).parent().hasClass('moved')) {$(this).parent().dialog('option', 'position', ['right','top'])} ;",1500) 
 
 },
 dragStop:function(event, ui) { 
     dragging=false;
     $(this).parent().css("opacity",1);
         $("textarea").val('RT '+percentage.toString()[2]+'@'+$(this).find('.screenname').text()+' '+$(this).find('.content').text());
         
         $('.tweet_box').dialog('open');
         $('.tweet_box').dialog("option", "height", 220);
         $('.tweet_box').dialog("option", "position", ['left','bottom']);
         //if (!$(this).parent().hasClass('moved')){$('#'+tweetidstack.pop()).dialog('open')};
         poptweetnow()
         var voteint=parseInt($(this).dialog( "option", "title" )[29])
         if (!(voteint>=2))   { $(this).dialog('destroy');};
         if (!(voteint<=9))   { 
             favorite(status|$(this).parent().attr("tweetid"));
             };
         $('#status').focus()
         
         hold(5*cyclespeed*1000);
         var voteint=parseInt($(this).dialog( "option", "title" )[29])
         if (!(voteint>=8))  { $(this).dialog('option', 'position', ['left','center']);  }
        hold(15*cyclespeed*1000);
        var voteint=parseInt($(this).dialog( "option", "title" )[29])
        if (!(voteint>=6))  { $(this).dialog('destroy');};
         }, 
    drag:function(event, ui) { 
        var scrolled = $(document).scrollTop()
        var window=.84*windowheight //$(window).height()
        var dragposition = ui.offset.top
        percentage = 1000+Math.round(Math.max(Math.min(100*( ( (window-1.2*(dragposition-scrolled))/(window)    )),99),0),2)    ;      
        var bigdigit= "<span style='font-size:38px'>"+percentage.toString()[2]+"</span>" ;// explains the link between 0-9 vote and percentages/percentiles..
        $("#"+tweet.id ).dialog('option', 'title', bigdigit+""+percentage.toString()[3]+"%" );
        $(this).parent().css("opacity",Math.abs(1.4*(percentage-1000)/100-0.07)+.05);
        dragging=true;
            }, 
        });
        if (!(firstrun)){poptweetnow();firstrun=true;}
        //$('#'+tweetidstack.pop()).dialog("open")
}
 
function poptweetnow(){
    $('#'+tweetidstack.pop()).dialog("open").parent().css({position:"fixed"});
}

function poptweet(){
while (true){
    hold(2000);
if(tweetidstack && tweetidstack.length && !dragging && !($('.tweet_box').parent().hasClass('focus'))){
poptweetnow()
$('#status').focus()
}
hold(cyclespeed*1000);
}} 

function scrollfader(){
    while(true){
        hold(10); //avoid polling too frequently
        if ( didScroll ) {
            $(".wibe").fadeOut('fast');
            didScroll=false;
            hold(3500); 
            var snapper = setTimeout("poptweetnow()",500);
            }
        if(!didScroll){
            $(".wibe").fadeIn('slow')
        //$('#'+tweetidstack.pop()).dialog("open");
        //$('.tweet_box').dialog("option", "position",['right','bottom']);
        
        };
        }
}
// Helper to fetch new tweets:
function fetch_tweets(params) {
  try {
    return T.call("statuses/home_timeline", params);
  }
  catch(e) {
    // Are we still connected? If not, quit the app:
    if (!T.isConnected())
      throw "Disconnected";
    // else try again in 10s:
    // XXX should really have a back-off algo here
    // XXX should examine exception object.
    hold(10*1000);
    return fetch_tweets(params);
  }
}
 
// Function that periodically fetches new tweets from twitter and
// displays them:
function update_timeline_loop() {
  // Run an endless loop:

  while (true) {
    // Fetch tweets from twitter:
    var timeline = fetch_tweets({
      include_entities: true,
      count: 100,
      since_id: $(".tweet_wrapper:first").attr("tweetid")
    });
 
    if (timeline && timeline.length) {
      // Prepend tweets to timeline:
      for (var i = timeline.length-1, tweet; tweet = timeline[i]; --i)
        showTweet(tweet, false);
        //poptweet();
        
    }
 
    waitfor {
      // Twitter is rate-limited to ~150calls/h. Wait for 60 seconds
      // until we fetch more tweets.
      hold(60*1000);
    }
    or {
      $(window).waitFor("settingschanged");
      $("#timeline").empty();
    }
  }
}


 
// Helper that waits until the user scrolls to the bottom of the page:
function waitforScrollToBottom() {
  do {
    $(window).$scroll();
  }
  while ($(document).height()- $(window).height() - $(document).scrollTop() > 300)
}
// Runs a loop that waits for the user to scroll to the bottom, and
// then loads more tweets:
function show_more_loop() {
  while (true) {
    waitforScrollToBottom();
 
    var timeline = null;
    waitfor {
      // show a cancel button:
      $("#timeline").append("\
<div class='timeline_item loading_more'>
Loading more tweets... click here to cancel
</div>");
      // wait for it to be clicked; if that happens before the request
      // completes, the request will be cancelled, by virtue of the
      // waitfor/or.
      $(".timeline_item:last").$click();
    }
    or {
      timeline = fetch_tweets({
        count: 100,
        max_id: $(".tweet_wrapper:last").attr("tweetid")-1
      });
      if (!timeline.length) return; // we've loaded all tweets there are
    }
    finally {
      // remove the cancel button:
      $(".timeline_item:last").remove();
    }
    
    if (timeline && timeline.length) {
      // Append tweets to timeline:
      for (var i = 0, tweet; tweet = timeline[i]; ++i)
        showTweet(tweet, true); 
    }
  }
}
 
// Runs an endless loop that checks for the 'tweet' button to be
// clicked and sends out a tweet if it is:
function tweet_loop() {
  try {
    $(".tweet_box").show();
    while (true) {
      tweeting_button.$click();
      tweeting_button.attr("disabled", "disabled");
      $("#tweeting_status").text("Tweeting...");
      try {
        var tweet = T.call("statuses/update", {status: status_el.val() });
        status_el.val("");
        showTweet(tweet);
        setLatestTweet(tweet);
      }
      catch (e) {
        alert("Error posting: " + e.response.error);
      }
      update_counter();
      tweeting_button.removeAttr("disabled");
    }
  }
  finally {
    $(".tweet_box").hide();
  }
}
 
// shows a signout button and blocks until it is clicked
function waitfor_signout() {
  try {
    // Show a signout button and wait for it to be clicked:
    var signout = $("<a href='#'>Sign out of twitter</a>").appendTo("#logout");
    var e = signout.$click();
    e.returnValue = false;
    e.preventDefault();
  
    // Ok, signout button was clicked; sign out, hide button & clear timeline:
    twttr.anywhere.signOut();
  }
  finally {
    signout.remove();
    $("#login").show();
  }
}
 
 
