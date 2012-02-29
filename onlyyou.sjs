/*
run the app by adding
<script src='http://dl.dropbox.com/u/1545014/curea/youiest.js'/></script>
to any page. This file is hosted on drop box and simply points to the other parts of the app hosted on github etc.
*/
var debugging=true;
if (debugging){ var c=require('apollo:debug').console(); require('wibes')};
require("apollo:jquery-binding").install();
loadjscssfile("http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/smoothness/jquery-ui.css", "css");
//https://github.com/furf/jquery-ui-touch-punch/blob/master/jquery.ui.touch-punch.min.js
require('apollo:http').script("https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/jquery-ui.min.js");
if(navigator.userAgent.match(/iPad/i) !== null || navigator.userAgent.match(/android/i) !== null ){require('github:furf/jquery-ui-touch-punch/master/jquery.ui.touch-punch.min.js')};
// trouble on android, run touch library on ipad only for now. ipad\|android
//require('github:furf/jquery-ui-touch-punch/master/jquery.ui.touch-punch.min.js')
loadjscssfile("http://dl.dropbox.com/u/1545014/curea/fatc.css", "css") ;
var common = require("apollo:common");

if ($('#youiest').attr('twitter_user')){var twitter_user=$('#youiest').attr('twitter_user')}
else{var twitter_user='wiber'};
var you = require('apollo:twitter').get(twitter_user);
var lastID=you[you.length-1].id;
log('lastID'+lastID);
var cyclespeed=10;
var voter=333;
var howmany =3;
var votehash = new Array();
var wibes = new Array;
var connections= new Array;
var youtrix = new Array;
function popsimple(tweetstack){
    if (!tweetstack.length || howmany==0){ 
        log('no length');
        $('.tweet_wrapper').dialog('destroy');
        alert('Thanks! Log in for more.');
        //showTweet(tweetstack.shift(),false);
        //tweetstack = replenish();
        //require('apollo:twitter').get(twitter_user);
        return tweetstack;
        }
    else {
        showTweet(tweetstack.shift(),false);
        howmany-= 1;
        log("tweetstack.length"+tweetstack.length+"howmany"+howmany)
        return tweetstack;
    }   
    ;
};

function start(){
    log(you);
    popsimple(you);
};




var winW = 630, winH = 460;
if (document.body && document.body.offsetWidth) {
 winW = document.body.offsetWidth;
 winH = document.body.offsetHeight;
}
if (document.compatMode=='CSS1Compat' &&
    document.documentElement &&
    document.documentElement.offsetWidth ) {
 winW = document.documentElement.offsetWidth;
 winH = document.documentElement.offsetHeight;
}
if (window.innerWidth && window.innerHeight) {
 winW = window.innerWidth;
 winH = window.innerHeight;
} 
if(navigator.userAgent.match(/iPad/i) !== null){winH=640}
    
 
function loadjscssfile(filename, filetype){
 if (filetype=="js"){ //if filename is a external JavaScript file
  var fileref=document.createElement('script');
  fileref.setAttribute("type","text/javascript");
  fileref.setAttribute("src", filename);
 }
 else if (filetype=="css"){ //if filename is an external CSS file
  var fileref=document.createElement("link");
  fileref.setAttribute("rel", "stylesheet");
  fileref.setAttribute("type", "text/css");
  fileref.setAttribute("href", filename);
 }
 if (typeof fileref!="undefined")
  document.getElementsByTagName("head")[0].appendChild(fileref);
}

function log(tobelogged){
    if (debugging){
        c.log(tobelogged);
    };
};

function showTweet(tweet, append) {
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
  $("body")[append ? "append" : "prepend"](common.supplant("\
</div>
<div class='timeline_item user_{screenname}'>
<div  class='tweet_wrapper' tweetid='{tweetid}' id='{tweetid}'>
<span class='tweet_thumb'>
<img src='{image}' width='48' height='48' style='float: left;'/>
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
wibes[tweet.id]=tweet;
log(wibes);
$( "#"+tweet.id ).dialog({ 
    title:tweet.user.screen_name+" - "+date_string +'   [   DRAG ME!   ]',
    position: ['right','middle'], 
    autoOpen:true,
    dialogClass: 'wibe',
    width:500,
 dragStart:function(event, ui) { 
        dragging=true;
        $('.tweet_box').dialog('close');
        $(this).parent().removeClass('snapmoved');
        },
 
  open: function(event, ui) { 
        $(this).parent().css("opacity","1");
        hold(1.6*cyclespeed*1000); //stack them at the top instead of where new spawn
        if(!$(this).parent().hasClass('moved')){
        $(this).dialog('option', 'position', ['right','top']);
        $(this).parent().addClass('snapmoved');
 }
 },
 dragStop:function(event, ui) { 
    var dragging=false;
    $(this).parent().css("opacity","1");
    var voteint=parseInt($(this).dialog( "option", "title" )[29]);
    var thisID=$(this).attr('tweetid');
    tweet.connectionsIN=new Array;
    //if(!votehash[thisID]){log('not in hash, creating')}
    //if(!wibes[thisID].connectionsIN[voter]){log('not in wibes')};
    //votehash[thisID]=voteint
    //tweet.vote=[voter,voteint]; //we want  hash
    
    tweet.connectionsIN[voter]=[voteint];
    wibes[thisID]=tweet
    //wibes[thisID,tweet]=voteint
    // post wibes to server as they happen, if server responds with low load condition, else wait till done and do all at once, with twitter user object as well
    log(wibes); log(wibes.length);
    //log(wibes[thisID].connectionsIN[voter]);
    connections[voter+'.'+thisID]=voteint; //works!
    log (connections); log('<<connections')
    /*
    var dual = new Array; dual=[voter,thisID];
    var matrix = new Array;
    matrix[dual]=voteint;
    log (matrix); log(matrix[voter,thisID]);   */
    youtrix[parseFloat(voter+'.'+thisID)]=voteint;
    log(youtrix);
    log(youtrix.sort());
    //log(parseFloat(voter+'.'+thisID)-10); //works..
//    log(votehash);
    //for (key in youtrix){log(key.split('.'))} log('split keys <<');
    if (!(voteint>1))   { 
        $(this).dialog('destroy');
        }
    if(!$(this).parent().hasClass('moved')){
        $(this).parent().addClass('moved');
        you=popsimple(you)
        };
         }, 
    drag:function(event, ui) { 
        var scrolled = $(document).scrollTop()
        var window=winH//.84*winH//$(window).height()
        var dragposition = ui.offset.top
        percentage = 1000+Math.round(Math.max(Math.min(100*( ( (window-1.2*(dragposition-scrolled))/(window)    )),99),0),2)    ;      
        var bigdigit= "<span style='font-size:32px'>"+percentage.toString()[2]+"</span>" ;// explains the link between 0-9 vote and percentages/percentiles..
        $("#"+tweet.id ).dialog('option', 'title', bigdigit+""+percentage.toString()[3]+"%" );
        $(this).parent().css("opacity",Math.abs(1.4*(percentage-1000)/100-0.07)+.05);
        dragging=true;
            }, 
    close:function(event,ui){
        $('.moved').dialog('destroy');
    }
        });
        $( "#"+tweet.id ).css({position:"fixed"});
return true;
}


start();