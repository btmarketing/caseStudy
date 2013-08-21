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

function splitImage(image,ordered){
    var xStep = image.width/xDim;
    var yStep = image.height/yDim;
    for(var i=0;i<checkers.length;i++){

        var tempIndex = i;
        if(ordered){
            tempIndex = checkers[i].index;
        }

        var xPos = tempIndex%xDim;
        var yPos = Math.floor(tempIndex/xDim);
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

        splitImage(coverPhotos[currentNavigation],true);

        buckets[currentNavigation].select();
    }
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function resizeTest(){
    var newLeft = document.getElementById('main').offsetLeft;
    var newTop = document.getElementById('main').offsetTop;
    if(center.oldLeft!==newLeft || center.oldTop!==newTop){
        resized();
    }
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var gutter = 2; // the space between each box
var unitSize = 100; // the size each checker box
var center; // object holding main container div's screen coordinates

function resized(){

    var padding = 20;

    var newLeft = document.getElementById('main').offsetLeft;
    var newTop = document.getElementById('main').offsetTop;
    var newRight = newLeft+(unitSize*xDim);
    var newBottom = newTop+(unitSize*yDim);

    center = {
        'l': newLeft+padding,
        't': newTop+padding,
        'b': newBottom-padding,
        'r': newRight-padding,
        'oldLeft': newLeft,
        'oldTop': newTop
    };
    updateAllCheckerPositions();
    if(buckets[currentNavigation]){
        buckets[currentNavigation].updateContentBoxPositions();
    }
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
