
var wibing={};
wibing.from=[];
wibing.to=[];
wibing.root='404'

wibing.newcon=function(origin,target,weight){
    wibes.from[origin].push([target,weight]);
    wibes.to[target].push([origin,weight]);
    return wibing;
};
wibing.sortTwo=(function(index){return function(a, b){ return (a[index] === b[index] ? 0 : (a[index] < b[index] ? -1 : 1)); }; })(2);
wibing.sortfrom=function(){
    initLength=wibing.from.length
    var answer=new Array;
    while(answer.length < initLength){
    };
};