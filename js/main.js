////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function initCaseStudy(){
    resized();
    createBuckets();
    masterLoop();
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var buckets = [];

//loop through the content divs, creating a new Bucket object for each section

function createBuckets(){
    var domBuckets = document.getElementById('content').children;
    for(var i=0;i<domBuckets.length;i++){
        if(domBuckets[i].className==='bucket'){
            var isLast = false;
            if(i===domBuckets.length-1) isLast = true;
            var b = new Bucket(domBuckets[i],i,isLast);
            buckets.push(b);
        }
    }
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function masterLoop(){
    resizeTest();
    requestAnimFrame(masterLoop);
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var currentNavigation = -1;
var currentCoords = 0;

function changeNavigation(index){
    if(currentNavigation!==index){
        currentCoords = (currentCoords+1)%coordinates.length;

        if(buckets[currentNavigation]) buckets[currentNavigation].deselect();

        var prevIndex = currentNavigation;
        currentNavigation=index;

        buckets[currentNavigation].select(prevIndex);
    }
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function resizeTest(){
    var main = document.getElementById('main').getBoundingClientRect();
    if(center.oldLeft!==main.left || center.oldTop!==main.top){
        resized(main);
    }
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var gutter = 5; // the space between each box
var unitSize = 95; // the size each checker box
var center; // object holding main container div's screen coordinates

function resized(main){

    if(!main) main = document.getElementById('main').getBoundingClientRect();

    var padding = 20;

    center = {
        'l': main.left+padding,
        't': main.top+padding,
        'b': main.bottom-padding,
        'r': main.right-padding,
        'oldLeft': main.left,
        'oldTop': main.top
    };
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame||window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame||function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
