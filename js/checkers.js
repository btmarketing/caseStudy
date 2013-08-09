////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function Checker(startIndex,isFull){
	this.full = isFull;
	this.index = startIndex;
	this.corners;
	this.el;
	this.targetIndex = this.index;
	this.prevExchange = undefined;
	if(this.full) {
		this.el = document.createElement('div');
		this.el.style.position = 'absolute';
		this.el.style.backgroundColor = 'rgb(150,150,150)';
		document.getElementById('checkerBoard').appendChild(this.el);
	}

	this.updateCorners();
}

Checker.prototype.updateCorners = function(){
	var xPos = this.index%xDim;
	var yPos = Math.floor(this.index/xDim);
	this.corners = {
		'l':(xPos*unitSize)+gutter+center.l,
		'r':((xPos*unitSize)+unitSize)-gutter+center.l,
		't':(yPos*unitSize)+gutter+center.t,
		'b':((yPos*unitSize)+unitSize)-gutter+center.t,
	};
	if(this.el) this.updateDOM();
}

Checker.prototype.updateDOM = function(){
	this.el.style.width = Math.round(this.corners.r-this.corners.l)+'px';
	this.el.style.height = Math.round(this.corners.b-this.corners.t)+'px';
	this.el.style.left = Math.round(this.corners.l)+'px';
	this.el.style.top = Math.round(this.corners.t)+'px';
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function updateCheckerPositions(){
	for(var i=0;i<checkers.length;i++){
		checkers[i].updateCorners();
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function moveCheckers(){
	var count = 0;
	var offset = Math.floor(Math.random()*checkers.length);
	for(var q=0;q<checkers.length;q++){
		var i = (q+offset)%checkers.length;
		if(!checkers[i].full && checkers[i].index!==checkers[i].targetIndex){
			count++;
			slideThisChecker(i);
		}
	}
	updateCheckerPositions();
	if(count===0 && buckets[currentNavigation] && clicked){
		clicked=false;
		buckets[currentNavigation].show();
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function slideThisChecker(i){
	var xDist = (checkers[i].targetIndex%xDim)-(checkers[i].index%xDim);
	var yDist = Math.floor(checkers[i].targetIndex/xDim)-Math.floor(checkers[i].index/xDim);

	if(xDist || yDist){

		var step = yDist/Math.abs(yDist);
		var newIndex = checkers[i].index+(step*xDim);

		if(Math.abs(xDist)>Math.abs(yDist)){
			var step = xDist/Math.abs(xDist);
			var newIndex = checkers[i].index+step;
		}

		for(var n=0;n<checkers.length;n++){
			if(checkers[n].index===newIndex){
				checkers[n].index = checkers[i].index;
				checkers[i].index = newIndex;
				if(!checkers[n].full){
					slideThisChecker(i);
				}
				break;
			}
		}
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var xDim = 10;
var yDim = 5;
var checkers = [];

function makeCheckerBoard(){

	//	document.getElementById('checkerBoard').style.display = 'none';

	//count how many full checkers we need
	var totalCheckers = 0;
	for(var n in dimensions){
		var w = dimensions[n].width;
		var h = dimensions[n].height;
		for(var x=0;x<w;x++){
			for(var y=0;y<h;y++){
				totalCheckers++;
			}
		}
	}

	//array for randomly pulling start indexes for each checker
	var availableIndexes = [];
	for(var i=0;i<xDim*yDim;i++){
		availableIndexes[i] = i;
	}

	//for each slot, make a checker
	for(var i=0;i<xDim*yDim;i++){

		//with a random starting point
		var rIndex = Math.floor(Math.random()*availableIndexes.length);
		var thisIndex = availableIndexes[rIndex];
		availableIndexes.splice(rIndex,1);

		//if we've already made all our full checkers, make empty ones
		var isFull = true;
		if(i>=totalCheckers) isFull = false;

		checkers[i] = new Checker(thisIndex,isFull);
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function assignEmptyCheckers(){

	//object to save the empty spaces we've already assigned
	var emptySpaceArray = {};

	for(var i=0;i<checkers.length;i++){
		if(!checkers[i].full){
			var winner = undefined;
			var checkerX = checkers[i].index%xDim;
			var checkerY = Math.floor(checkers[i].index/xDim);
			var closestDist = 999999;
			for(var n=0;n<targetLayout.length;n++){
				if(targetLayout[n]==='empty'){
					var tempX = n%xDim;
					var tempY = Math.floor(n/xDim);
					var tempDist = Math.abs(tempX-checkerX)+Math.abs(tempY-checkerY);
					if(tempDist<closestDist && !emptySpaceArray[n]){
						closestDist = tempDist;
						winner = n;
					}
				}
			}
			if(winner){
				checkers[i].targetIndex = winner;
				emptySpaceArray[winner] = true;
			}
			else{
				console.log('we fucked up on finding a space for checker '+i);
			}
		}
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var targetLayout;

function makeTargetCheckerLayout(){

	clearTargetLayout();

	var coords = coordinates[currentCoords];
	for(var b in coords){

		var w = dimensions[b].width;
		var h = dimensions[b].height;
		var l = coords[b].l;
		var t = coords[b].t;

		for(var x=l;x<l+w;x++){

			var growLeft = true;
			var growRight = true;

			if(x===l) growLeft = undefined;
			if(x===(l+w)-1) growRight = undefined;
			if(w===1) growRight = undefined;

			for(var y=t;y<t+h;y++){

				var growTop = true;
				var growBottom = true;

				if(y===t) growTop = undefined;
				if(y===(t+h)-1) growBottom = undefined;
				if(h===1) growBottom = undefined;

				var index = x+(y*xDim);

				targetLayout[index] = {
					'index':index,
					'l':growLeft,
					'r':growRight,	
					't':growTop,
					'b':growBottom
				};
			}
		}
	}
	assignEmptyCheckers();
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function clearTargetLayout(){
	targetLayout = [];
	for(var i=0;i<xDim*yDim;i++){
		targetLayout[i] = 'empty';
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////