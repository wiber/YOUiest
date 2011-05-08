require('apollo:debug').console();
loadjscssfile("http://dl.dropbox.com/u/1545014/curea/fatc.css", "css") 
require("apollo:jquery-binding").install();
//require('apollo:http').script("https://ajax.googleapis.com/ajax/libs/jquery/1.5.11/jquery.min.js");
//loadjscssfile("https://ajax.googleapis.com/ajax/libs/jquery/1.5.11/jquery.min.js", "js")
loadjscssfile("http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/smoothness/jquery-ui.css", "css")
loadjscssfile("https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/jquery-ui.min.js", "js")

//require('apollo:http').script("https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/jquery-ui.min.js");
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
 var curea = "nro9c1rNZWptL8xvUHlbw";
var curespin = "UHzpOFf7xx71TKwEyZEeQ";
var curetweet ="faqTC5lt072CjLMRAoYEtQ";
var youiestdev ="V2UNxW4TKTovoUPUpIY9hA";
var API_KEY = curea;
*/


var windowheight = screen.height;//(typeof window.innerHeight != 'undefined' ? window.innerHeight : document.body.offsetHeight);
var windowwidth=screen.width;//(typeof window.innerWidth != 'undefined' ? window.innerWidth : document.body.offsetWidth);
var tweetidstack= new Array;
var tweetpile= new Array;
var dragging=false;
var percentage=0;
var cyclespeed=5;
var firstrun=false;
var firstrunYou=false;
var windowheight = screen.height;//(typeof window.innerHeight != 'undefined' ? window.innerHeight : document.body.offsetHeight);
var windowwidth=screen.width;//(typeof window.innerWidth != 'undefined' ? window.innerWidth : document.body.offsetWidth);
var tweetidstack=[];
var tweetpile= [];
var dragging=false;
var percentage=0;

//can sjs code files be added the same way?
// can we add script as a head element, not a link?
function loadjscssfile(filename, filetype){
 if (filetype=="js"){ //if filename is a external JavaScript file
  var fileref=document.createElement('script')
  fileref.setAttribute("type","text/javascript")
  fileref.setAttribute("src", filename)
 }
 else if (filetype=="css"){ //if filename is an external CSS file
  var fileref=document.createElement("link")
  fileref.setAttribute("rel", "stylesheet")
  fileref.setAttribute("type", "text/css")
  fileref.setAttribute("href", filename)
 }
 if (typeof fileref!="undefined")
  document.getElementsByTagName("head")[0].appendChild(fileref)
}





//----------------------------------------------------------------------
  
// Initialization
  
// Load the @Anywhere API and init with your application id:
//require("apollo:twitter")

 
// We'll use jquery; load it from Google's CDN and install stratified
// bindings ($click, etc):
function paintpage(){
    $('body').append(' <div id="wrapper"></div>');
    $('#wrapper').html('<div class="tweet_box"></div>');
    $('.tweet_box').html('<div id="session_wrap"></div>');
    $('#session_wrap').html('<div id="session_buttons"></div>');
    $('#session_buttons').html('<div id="current_user"></div><div id="login"></div><div id="logout"></div>');
    //$('#session_buttons').append('<div id="login"></div>');
    //$('#session_buttons').append('<div id="logout"></div>');
    $('#session_wrap').append('<div id="title_bar"></div>');
    $('.tweet_box').append('<div id="info"></div>');
    $('#info').append('<textarea id="status" onkeyup="update_counter(this)"></textarea>');
    $('#info').append('<span id="latest"><strong>latest: </strong><span></span></span>');
    $('#info').append('<span id="tweeting_button_container"></span>');
    $('#info').append('<span id="tweeting_status"></span>');
    $('#info').append('<button id="tweeting_button">Tweet</button>');
    $('wrapper').append('<div id="timeline"></div>');
//window.session_wrap='<div id="session_buttons"><div id="current_user"></div></div>'
};


// read settings from id=youiest . what's the best way for the host to add these variables? window.var? unsuccefull
if ($('#youiest').attr('API_KEY')){var API_KEY=$('#youiest').attr('API_KEY')};
//if (window.SET_API_KEY){var API_KEY=window.SET_API_KEY};
if ($('#youiest').attr('twitter_user')){var twitter_user=$('#youiest').attr('twitter_user')};
//if (window.SET_twitter_user){var API_KEY=window.SET_twitter_user};
//if(!twitter_user){var twitter_user='wiber';};

// init the twitter object with key
var T = require("apollo:twitter").initAnywhere({id:API_KEY});

// get tweets from page hosts twitter account.
var you=require('apollo:twitter').get(twitter_user);
//window.API_KEY=API_KEY;

// makes twitter object global (not sjs scope) so it can be accessed by debugger console.
//window.T = T;


//attempt to make dialog draggable on mobile touch devices. unsolved.
//require('apollo:http').script("http://dl.dropbox.com/u/1545014/curea/jquery.touch.js");

// tools
var common = require("apollo:common");

//cache ... unsure
var tweeting_button = $("#tweeting_wrap");
// cache tweet input box .. performance
var status_el = $("#status");
// cache characters left.. perf
var counter = $("#tweeting_status");

//$.fx.speeds._default = 600; //jquery animation speed

// if we have tweets, open a dialog, with id of last tweet, focus tweet box to avoid input box stealing focus..
function poptweetnow(){
    
    if(tweetidstack && tweetidstack.length ){
    $('#'+tweetidstack.pop()).dialog("open").parent().css({position:"fixed"});
    $('#status').focus()
    }
}

//hide dialogs when scrolling
var didScroll = false;
$(window).scroll(function() {
    didScroll = true;
});

//build hosts first tweet
showYouTweet(you[0],false);
// display first tweet from host
poptweetnow();


// create elements on page, timing has importance
paintpage()

//----------------------------------------------------------------------
// main program loop
 
// Show the twitter connect button:
T("#login").connectButton();
// Run our application logic in an endless loop:

// open input box, slim , expand later
$('.tweet_box').dialog({ //executed at the right time..
        autoOpen:false,
        dialogClass:'wibe',
        //position:['center','bottom'],
        width:500,
})

$('.tweet_box').dialog('open').parent().css({position:"fixed"});;
$('.tweet_box').dialog('option', 'position', ['left','top']);
$('.tweet_box').dialog('option', 'height', 0);
//adding the login buttons and controls to inputbox
$('.tweet_box').dialog('option','title',$('#session_buttons').html());
$('.tweet_box').css('overflow','hidden');

//will not autoopen:false.. sticks for a second.
//$('.tweet_box').parent().hide()

//endless loop 
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
  // investigate / remove timeline elements and functionality..
  $("#timeline").empty();
 
  try {
    // Let's set the last tweet and the background based on the
    // user's prefs:
    // create profile object from current users twitter object, 
    var profile = T.call("users/show", {user_id: T.currentUser.id});
    // on input box, set name of logged in user
    $("#current_user").text(profile.screen_name);
    // users image on inputbox
    $("#current_user").prepend("<img src='"+profile.profile_image_url + "'/>");
    // adds users last tweet to tweet box, last tweet status
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
        // keep popping tweets, sits on a timer and calls poptweetnow
       poptweet(); 
    }
    and {
        // hide dialogs if scrolling has happened recently
        scrollfader();
    }

  }
  finally {
    // Clean up: removes buttons, user name etc?
    $("#current_user").empty();
    
    /*
    $("#timeline").empty();
    $("#welcome").show();
    $("body").css({background:""});
*/
  }
}
 
 
//----------------------------------------------------------------------
// Helper functions

//takes a tweet, sets it as latest tweet.
function setLatestTweet(tweet) {
  $("#latest")[tweet?"show":"hide"]();
  if (tweet)
    $("#latest span").text(tweet.text);
}
 
// 'characters left' counter
function update_counter() {
  counter.text(140 - status_el.val().length);
}
 
 // included mute without unfollow function
function ui_mute_loop() {
  if (!window["localStorage"]) return;
  
  var filterArray = [];
  // is tweet a global var? must be. no arg
  tweetFilter = function(tweet) {
    for (var i = filterArray.length; i >= 0; --i) {
      var keyword = filterArray[i];
      if (!keyword) continue;
      if (keyword.indexOf("@") == 0 && tweet.user.screen_name == keyword.substring(1)) return true;
      else if (tweet.text.indexOf(keyword) != -1) return true;
    }
 
    return false;
  };
  
  // adds link to input box title. investigate how to apply white text css, used to work.. why no longer?
  var button = $("<a href='#'>  Mute list // </a>").prependTo("#logout");
  // don't fully understand this.. ternary statements, $click.. localStorage api
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
// we want to add tweets to array _ tweetpile _ instead, then pop them later.
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
  // calls append or prepend function of dom elelment, if..? it it doesn't have append, do prepend. (ie if it has no len
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

//tweetpile.push($("#timeline"));
//$("#timeline").empty();
//log(tweetpile.pop);

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
        $(this).parent().css("opacity","1");
        hold(1.6*cyclespeed*1000); //stack them at the top instead of where new spawn
        if(!$(this).parent().hasClass('moved')){
        $(this).dialog('option', 'position', ['right','top']);
        $(this).parent().addClass('snapmoved');
 }
 
 
 //setInterval("$(this).dialog('option', 'position', ['right','center']);",1000);
 //setTimeout("if (!(this).parent().hasClass('moved')) {$(this).parent().dialog('option', 'position', ['right','top'])} ;",1500) 
 
 },
 focus: function(event, ui) { return false },
 dragStop:function(event, ui) { 
     dragging=false;
     $(this).parent().css("opacity","1");
         $("textarea").val('RT '+percentage.toString()[2]+'@'+$(this).find('.screenname').text()+' '+$(this).find('.content').text());
         $('#latest').append($(this).attr('id'));
         $('.tweet_box').dialog('open');
         $('.tweet_box').dialog("option", "height", 180);
         $('.tweet_box').dialog("option", "position", ['left','bottom']);
         //if (!$(this).parent().hasClass('moved')){$('#'+tweetidstack.pop()).dialog('open')};
         poptweetnow()
        
        var voteint=parseInt($(this).dialog( "option", "title" )[29]);
         if (!(voteint>1))   { 
            $(this).dialog('destroy');
            }
         else if (!(voteint<9))   { 
            //$(this).parent().find('.ui-dialog-titlebar').append($(this).attr("id")'#');
            //T.call("favorites/destroy/:id", [$(this).attr("id") ]);
            T.call("favorites/create/:id", [ $(this).attr("id") ]);
            $(this).parent().find('.ui-dialog-titlebar').append('Favorite Created');
             };
         $('#status').focus();
         
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
        if (!(firstrun)){
            poptweetnow();
            $('.tweet_box').dialog("option", "height", 220);
            $('.tweet_box').dialog("option", "position", ['left','bottom']);
            firstrun=true;
             $("textarea").val("checking out youiest.com. it's ... (blowing my mind)");
            }
        //$('#'+tweetidstack.pop()).dialog("open")
        //$( "#"+tweet.id ).parent().css("opacity","0");
}
 


function poptweet(){
while (true){
    hold(20);
if(tweetidstack && tweetidstack.length && !dragging && !($('.tweet_box').parent().hasClass('focus'))){
poptweetnow()
}
hold(20*cyclespeed*1000);
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
 
// Append/prepend a tweet to the timeline
function showYouTweet(tweet, append) {
    
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
    position: ['right','center'], 
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
        //$( "#"+tweet.id ).parent().css("opacity","1");
            hold(1.6*cyclespeed*1000); //stack them at the top instead of where new spawn
                if(!$(this).parent().hasClass('moved')){
                $(this).dialog('option', 'position', ['right','top']);
                $(this).parent().addClass('snapmoved');
                }
            },
    focus: function(event, ui) { 
            return false },
    dragStop:function(event, ui) { 
        dragging=false;
        $(this).parent().css("opacity",1);
        $("textarea").val('RT '+percentage.toString()[2]+'@'+$(this).find('.screenname').text()+' '+$(this).find('.content').text());
        $('.tweet_box').dialog('open');
        $('.tweet_box').dialog("option", "height", 180);
        $('.tweet_box').dialog("option", "position", ['left','bottom']);
        poptweetnow()
        var voteint=parseInt($(this).dialog( "option", "title" )[29]);
        if (!(voteint>1))   { 
            $(this).dialog('destroy');
            }
        else if (!(voteint<9))   { 
            //T.call("favorites/destroy/:id", [$(this).attr("id") ]);
            T.call("favorites/create/:id", [ $(this).attr("id") ]);
            $(this).parent().find('.ui-dialog-titlebar').append('Favorite Created');
            };
        $('#status').focus();
        hold(5*cyclespeed*1000);
        var voteint=parseInt($(this).dialog( "option", "title" )[29])
        if (!(voteint>=8))  { 
            $(this).dialog('option', 'position', ['left','center']);  }
            hold(15*cyclespeed*1000);
            var voteint=parseInt($(this).dialog( "option", "title" )[29])
        if (!(voteint>=6))  { 
            $(this).dialog('destroy');
            };
        }, 
    drag:function(event, ui) { 
        var scrolled = $(document).scrollTop()
        var window=.84*windowheight //$(window).height()
        var dragposition = ui.offset.top
        var percentage = 1000+Math.round(Math.max(Math.min(100*( ( (window-1.2*(dragposition-scrolled))/(window)    )),99),0),2)    ;      
        var bigdigit= "<span style='font-size:38px'>"+percentage.toString()[2]+"</span>" ;// explains the link between 0-9 vote and percentages/percentiles..
        $("#"+tweet.id ).dialog('option', 'title', bigdigit+""+percentage.toString()[3]+"%" );
        $(this).parent().css("opacity",Math.abs(1.4*(percentage-1000)/100-0.07)+.05);
        dragging=true;
            } 
        });
    if (!(firstrunYou)){
        poptweetnow();
        $('.tweet_box').dialog("option", "height", 220);
        $('.tweet_box').dialog("option", "position", ['left','bottom']);
        firstrunYOU=true;
         $("textarea").val("checking out youiest.com. it's ... (blowing my mind)");
        };
        //$('#'+tweetidstack.pop()).dialog("open")
}; 
 
