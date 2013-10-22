////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var caseStudy_loadingPercentage = 0;

function initCaseStudy(img){

    document.getElementById('loadingPercentage').innerHTML = caseStudy_loadingPercentage+'%';
    resized();
    makeCheckerBoard(); // inside checkers.js, creates the checker board and units
    splitImage(img); // takes the current cover photo, and splits it up between all the checkers
    createBuckets(); // funs through the DOM, creating buckets for each case study

    loadCoverPhotos(0);
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

//each checker has a small Canvas element in it, that we draw a portion of the photo onto

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
            //if it's not an empty checker, draw onto it's canvas
            checkers[i].context.drawImage(image,tempX,tempY,xStep,yStep,0,0,unitSize,unitSize);
        }
    }
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var coverPhotos = [];

function loadCoverPhotos(i){

    caseStudy_loadingPercentage+=Math.floor(100/buckets.length);
    document.getElementById('loadingPercentage').innerHTML = caseStudy_loadingPercentage+'%';

    var temp = document.createElement('img');
    temp.src = 'img/coverPhotos/'+i+'.png';
    temp.onload = function(){
        coverPhotos.push(temp);
        var newIndex = i+1;
        if(newIndex<buckets.length){
            loadCoverPhotos(newIndex);
        }
        else{
            fadeLoadingScreen(); // when photoes are done loading, start fading the load animation
        }
    }
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function fadeLoadingScreen(){
    document.getElementById('loadSquare_wrap').className+='fadeOut'; // class that applies a transition on opacity
    setTimeout(function(){
        document.getElementById('whiteScreen').parentNode.removeChild(document.getElementById('whiteScreen'));
        document.getElementById('wrapper').className+='fadeIn'; // class that applies a transition on opacity
        masterLoop();  // start the case study frame loop
    },500);
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var buckets = [];  //very important array, holds all the case studies and their contents

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

function prev(){
    var newIndex = currentNavigation-1;
    if(newIndex<0) newIndex = buckets.length-1;
    changeNavigation(newIndex);
}

function next(){
    var newIndex = currentNavigation+1;
    if(newIndex>=buckets.length) newIndex = 0;
    changeNavigation(newIndex);
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function masterLoop(){
    resizeTest();
    if(checkerGrayscale>0 && puzzleSolved) updateCheckerGrayscale(true);
    updateCheckers();
    updateBuckets();
    requestAnimFrame(masterLoop);
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var currentNavigation = -1;
var currentCoords = 0;

function changeNavigation(index,dontSplitImage){ //fired when we select a new case study to look at
    if(currentNavigation!==index){

        if(currentNavigation===-1){
            puzzleSolved=true;
            checkerGrayscale=0;
            updateCheckerGrayscale(false);
        }

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

        if(!dontSplitImage) splitImage(coverPhotos[currentNavigation],true);

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

//very important variables...

var gutter = 2; // the space between each box
var unitSize = 100; // the size of each checker box --- (unitSize-(gutter*2))=unit's dimensions
var center; // object holding main container div's screen coordinates
//everything is relative to center.l and center.t

var xDim = 10; // how many units across?
var yDim = 5; // how many units down?

function resized(){

    var padding = 20;

    var newLeft = document.getElementById('main').offsetLeft;
    var newTop = document.getElementById('main').offsetTop;
    var newRight = newLeft+(unitSize*xDim);
    var newBottom = newTop+(unitSize*yDim);

    console.log(newTop);

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
