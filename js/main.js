////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function initCaseStudy(img){
    resized();
    makeCheckerBoard();
    splitImage(img);
    createBuckets();
    loadCoverPhotos(0);
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function splitImage(image){
    var xStep = image.width/xDim;
    var yStep = image.height/yDim;
    for(var i=0;i<checkers.length;i++){

        var xPos = i%xDim;
        var yPos = Math.floor(i/xDim);
        var tempX = xPos*xStep;
        var tempY = yPos*yStep;

        if(checkers[i].full){
            checkers[i].context.drawImage(image,tempX,tempY,xStep,yStep,0,0,unitSize,unitSize);
        }
    }
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var coverPhotos = [];

function loadCoverPhotos(i){
    var temp = document.createElement('img');
    temp.src = 'img/coverPhotos/'+i+'.png';
    temp.onload = function(){
        coverPhotos.push(temp);
        var newIndex = i+1;
        if(newIndex<buckets.length){
            loadCoverPhotos(newIndex);
        }
        else{
            masterLoop();
        }
    }
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
    updateCheckers();
    updateBuckets();
    requestAnimFrame(masterLoop);
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var currentNavigation = -1;
var currentCoords = 0;

function changeNavigation(index){
    if(currentNavigation!==index){

        updateAllCheckerPositions();

        document.getElementById('checkerBoard').style.display = 'inline';
        currentCoords = (currentCoords+1)%coordinates.length;

        if(buckets[currentNavigation]){
            buckets[currentNavigation].deselect();
        }
        else{
            makeTargetCheckerLayout();
            shrinkCheckers();
        }

        currentNavigation=index;

        splitImage(coverPhotos[currentNavigation]);

        buckets[currentNavigation].select();
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
var unitSize = 100; // the size each checker box
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
    updateAllCheckerPositions();
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
