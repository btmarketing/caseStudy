////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

//GLOBAL VARIABLES

var theWidth;
var theHeight;
var center;

var unitSize = 95;

var currentCoords = 0;

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
    for(var i=0;i<buckets.length;i++){
        buckets[i].updateTitleBox();
        buckets[i].updateContentBoxes();
    }
    //drawSeeding();
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

function resized(main){

    if(!main) main = document.getElementById('main').getBoundingClientRect();

    theWidth = window.innerWidth;
    theHeight = window.innerHeight;

    var padding = 20;

    center = {
        'x': main.left+unitSize*3+padding,
        'y': main.top+unitSize*2+padding,
        'left': main.left+padding,
        'top': main.top+padding,
        'oldLeft': main.left,
        'oldTop': main.top
    };

    canvas.style.left = center.left+'px';
    canvas.style.top = center.top+'px';
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
