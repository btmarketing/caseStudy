////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

//each moving unit is an instance of Checker

//even empty spaces are a Checker, except they just don't have any DOM elements inside them
//the empty checkers are technically the ones that move
//empty checkers look for where they need to go for the new layout, and try to get there as fast as they can

function Checker(startIndex,isFull){
	this.full = isFull;
	this.index = startIndex;
	this.corners;
	this.el;
	this.canvas; // where we draw the portion of the cover photo
	this.context;
	this.targetIndex = this.index;
	this.prevExchange = undefined;

	this.stepCount = 0;
	this.stepAmount = 2.5; // how fast does it shift to a new spot? (higher number = slower speed)

	this.seemStep = gutter/2; // how fast does it open/close the seems on fade? (higher number = slower speed)

	this.shrunk = true;
	this.grown = false;

	this.mouse = {
		'x':undefined,
		'y':undefined
	};

	this.adder = {
		'l':0,
		'r':0,
		't':0,
		'b':0,
		'total':0
	};

	this.touched = false;

	this.neighborSpace;

	if(this.full) {  // only checkers that aren't empty get all this fun stuff...
		var that = this;
		this.el = document.createElement('div');
		this.el.style.overflow = 'hidden';
		this.el.style.position = 'absolute';
		this.el.style.cursor = 'move';
		this.el.style.backgroundColor = 'rgb(150,150,150)';
		//this.el.style.overflow = 'auto';
		this.el.onmousedown = function(e){
			if(that.shrunk && !that.grown && !buckets[currentNavigation]){
				that.el.style.opacity = .75;
				//endRandomSorting();
				var tempX = e.x;
				var tempY = e.y;
				if(!tempX){
					tempX = e.clientX;
					tempY = e.clientY;
				}
				that.initMouseDrag(tempX,tempY);
			}
		};

		this.canvas = document.createElement('canvas');
        this.canvas.width = unitSize;
        this.canvas.height = unitSize;
        this.canvas.style.width = unitSize+'px';
        this.canvas.style.height = unitSize+'px';
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = -gutter+'px';
        this.canvas.style.top = -gutter+'px';
        this.context = this.canvas.getContext('2d');

        this.el.appendChild(this.canvas);

		document.getElementById('checkerBoard').appendChild(this.el);
	}

	this.updateCorners();

	this.prevCorners;
}

Checker.prototype.initMouseDrag = function(x,y){
	this.touched = true;
	this.mouse.x = x-this.corners.l;
	this.mouse.y = y-this.corners.t;
	//see if there's an empty space next to it
	this.findNeighboringSpaces();
}

Checker.prototype.slideCorners = function(){

	var divider = this.stepAmount-this.stepCount;

	var targetX = this.index%xDim;
	var targetY = Math.floor(this.index/xDim);
	var targetCorners = {
		'l':(targetX*unitSize)+gutter+center.l,
		'r':((targetX*unitSize)+unitSize)-gutter+center.l,
		't':(targetY*unitSize)+gutter+center.t,
		'b':((targetY*unitSize)+unitSize)-gutter+center.t,
	};
	this.corners.l += (targetCorners.l-this.corners.l)/divider;
	this.corners.r += (targetCorners.r-this.corners.r)/divider;
	this.corners.t += (targetCorners.t-this.corners.t)/divider;
	this.corners.b += (targetCorners.b-this.corners.b)/divider;
	
	this.updateDOM();

	this.prevCorners = this.corners;
	this.stepCount++;
	if(this.stepCount>=this.stepAmount){
		this.stepCount=0;
		this.updateCorners();
		selectCurrentChecker();
	}
}

Checker.prototype.updateCorners = function(dontUpdateDom){
	var xPos = this.index%xDim;
	var yPos = Math.floor(this.index/xDim);
	this.corners = {
		'l':(xPos*unitSize)+gutter+center.l+this.adder.l,
		'r':((xPos*unitSize)+unitSize)-gutter+center.l+this.adder.r,
		't':(yPos*unitSize)+gutter+center.t+this.adder.t,
		'b':((yPos*unitSize)+unitSize)-gutter+center.t+this.adder.b,
	};
	if(this.el && this.prevCorners!==this.corners && !dontUpdateDom){
		this.updateDOM();
	}
	this.prevCorners = this.corners;
}

Checker.prototype.updateDOM = function(){
	var thisLeft = this.corners.l;
	var thisTop = this.corners.t;
	var thisWidth = this.corners.r-thisLeft;
	var thisHeight = this.corners.b-thisTop;

	if(thisWidth!==this.el.offsetWidth){
		this.el.style.width = Math.round(thisWidth)+'px';
	}
	if(thisHeight!==this.el.offsetHeight){
		this.el.style.height = Math.round(thisHeight)+'px';
	}
	if(thisLeft!==this.el.offsetLeft){
		this.el.style.left = Math.round(thisLeft)+'px';
	}
	if(thisTop!==this.el.offsetTop){
		this.el.style.top = Math.round(thisTop)+'px';
	}
}

Checker.prototype.slideThisChecker = function(){
	var xDist = (this.targetIndex%xDim)-(this.index%xDim);
	var yDist = Math.floor(this.targetIndex/xDim)-Math.floor(this.index/xDim);

	if(xDist || yDist){

		var step = yDist/Math.abs(yDist);
		var newIndex = this.index+(step*xDim);

		if(Math.abs(xDist)>Math.abs(yDist)){
			var step = xDist/Math.abs(xDist);
			var newIndex = this.index+step;
		}

		for(var n=0;n<checkers.length;n++){
			if(checkers[n].index===newIndex){
				checkers[n].index = this.index;
				this.index = newIndex;
				if(!checkers[n].full){
					this.slideThisChecker();
				}
				else{
					movingChecker = n;
				}
				break;
			}
		}
	}
	else{
		selectCurrentChecker();
	}
}

Checker.prototype.grow = function(){
	this.grown = false;
	this.shrunk = false;
	var instr = targetLayout[this.index];
	if(instr!=='empty'){
		if(instr.l){
			this.adder.l-=this.seemStep;
			this.canvas.style.left = Math.round(gutter+this.adder.l)*-1+'px';
		}
		if(instr.r) this.adder.r+=this.seemStep;
		if(instr.t){
			this.adder.t-=this.seemStep;
			this.canvas.style.top = Math.round(gutter+this.adder.t)*-1+'px';
		}
		if(instr.b) this.adder.b+=this.seemStep;
	}
	this.adder.total+=this.seemStep;
	if(this.adder.total>=gutter){
		this.adder.total=gutter;
		if(instr.l) this.adder.l=-gutter;
		if(instr.r) this.adder.r=gutter;
		if(instr.t) this.adder.t=-gutter;
		if(instr.b) this.adder.b=gutter;
		this.grown = true;
	}
	this.updateCorners();
}

Checker.prototype.shrink = function(){
	this.shrunk = false;
	this.grown = false;
	var instr = targetLayout[this.index];
	if(instr!=='empty'){
		if(instr.l){
			this.adder.l+=this.seemStep;
			this.canvas.style.left = Math.round(gutter+this.adder.l)*-1+'px';
		}
		if(instr.r) this.adder.r-=this.seemStep;
		if(instr.t){
			this.adder.t+=this.seemStep;
			this.canvas.style.top = Math.round(gutter+this.adder.t)*-1+'px';
		}
		if(instr.b) this.adder.b-=this.seemStep;
	}
	this.adder.total-=this.seemStep;
	if(this.adder.total<=0){
		this.adder.total = 0;
		this.adder.r = 0;
		this.adder.l = 0;
		this.adder.t = 0;
		this.adder.b = 0;
		this.shrunk = true;
	}
	this.updateCorners();
}

Checker.prototype.findNeighboringSpaces = function(){
	this.neighborSpace = {
		'l':false,
		'r':false,
		't':false,
		'b':false
	};
	for(var i=0;i<checkers.length;i++){
		if(!checkers[i].full){
			if(checkers[i].index===this.index-1 && checkers[i].index%xDim!==-1){
				this.neighborSpace.l = true;
			}
			else if(checkers[i].index===this.index+1 && checkers[i].index%xDim!==xDim){
				this.neighborSpace.r = true;
			}
			else if(checkers[i].index===this.index-xDim && Math.floor(checkers[i].index/xDim)!==-1){
				this.neighborSpace.t = true;
			}
			else if(checkers[i].index===this.index+xDim && Math.floor(checkers[i].index/xDim)!==yDim){
				this.neighborSpace.b = true;
			}
		}
	}
}

Checker.prototype.mouseSlide = function(xShift,yShift,realX,realY){
	var wentHorizontal = false;
	if(Math.abs(xShift)>Math.abs(yShift)){
		var yPos = Math.floor(this.index/xDim);
		var idealYPos = (yPos*unitSize)+gutter+center.t+this.adder.t;
		if(this.corners.t===idealYPos){
			if(xShift<0 && this.neighborSpace.l){
				//shift to left by xShift amount
				this.corners.l+=xShift;
				this.corners.r+=xShift;
				if(this.corners.l<center.l+gutter){
					this.corners.l = center.l+gutter;
					this.corners.r = (unitSize-(gutter*2))+this.corners.l;
				}
				wentHorizontal = true;
				this.updateDOM();
			}
			else if(xShift>0 && this.neighborSpace.r){
				//shift to right by xShift amount
				this.corners.l+=xShift;
				this.corners.r+=xShift;
				if(this.corners.r>((xDim*unitSize)+center.l)-gutter){
					this.corners.r = ((xDim*unitSize)+center.l)-gutter;
					this.corners.l = this.corners.r-(unitSize-(gutter*2));
				}
				wentHorizontal = true;
				this.updateDOM();
			}
		}
	}
	if(!wentHorizontal && Math.abs(yShift)>0){
		var xPos = this.index%xDim;;
		var idealXPos = (xPos*unitSize)+gutter+center.l+this.adder.l;
		if(this.corners.l===idealXPos){
			if(yShift<0 && this.neighborSpace.t){
				//shift up by xShift amount
				this.corners.t+=yShift;
				this.corners.b+=yShift;
				if(this.corners.t<center.t+gutter){
					this.corners.t = center.t+gutter;
					this.corners.b = this.corners.t+(unitSize-(gutter*2));
				}
				this.updateDOM();
			}
			else if(yShift>0 && this.neighborSpace.b){
				//shift to down by xShift amount
				this.corners.t+=yShift;
				this.corners.b+=yShift;
				if(this.corners.b>((yDim*unitSize)+center.t)-gutter){
					this.corners.b = ((yDim*unitSize)+center.t)-gutter;
					this.corners.t = this.corners.b-(unitSize-(gutter*2));
				}
				this.updateDOM();
			}
		}
	}
	var newIndex = undefined;
	if(Math.abs(xShift)>unitSize*.5){
		if(xShift<0 && this.index%xDim!==0 && this.neighborSpace.l){
			//shift if left
			newIndex = this.index-1;
		}
		else if(xShift>0 && this.index%xDim<xDim-1 && this.neighborSpace.r){
			//shift it right
			newIndex = this.index+1;
		}
	}
	else if(Math.abs(yShift)>unitSize*.5){
		if(yShift<0 && Math.floor(this.index/xDim)!==0 && this.neighborSpace.t){
			//shift if up
			newIndex = this.index-xDim;
		}
		else if(yShift>0 && Math.floor(this.index/xDim)<=yDim-1 && this.neighborSpace.b){
			//shift it down
			newIndex = this.index+xDim;
		}
	}
	if(newIndex!==undefined){
		for(var i=0;i<checkers.length;i++){
			if(checkers[i].index===newIndex){
				checkers[i].index = this.index;
				checkers[i].updateCorners();
				this.index = newIndex;
				this.initMouseDrag(realX,realY);
			}
		}
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var shrinking_checkers = false;

function shrinkCheckers(clicked){
	shrinking_checkers = true;
	var test = false;

	for(var i=0;i<checkers.length;i++){
		if(!checkers[i].shrunk){
			checkers[i].shrink();
			test = true;
		}
	}

	if(!test){
		shrinking_checkers = false;
		makeTargetCheckerLayout();
		if(!clicked) selectCurrentChecker();
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var growing = false;

function growCheckers(){
	growing = true;
	var test = false;

	for(var i=0;i<checkers.length;i++){
		if(!checkers[i].grown){
			checkers[i].grow();
			test = true;
		}
	}

	if(!test){
		growing = false;
		currentEmptyChecker = -1;
		movingChecker = -1;
		// buckets[currentNavigation].fading=true;
		// buckets[currentNavigation].show();
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function selectCurrentChecker(){
	movingChecker = -1;
	var offset = Math.floor(Math.random()*checkers.length);
	var test = false;
	for(var q=0;q<checkers.length;q++){
		var i = (q+offset)%checkers.length;
		if(!checkers[i].full && checkers[i].targetIndex!==checkers[i].index){
			currentEmptyChecker = i;
			test = true;
			break;
		}
	}
	if(!test){
		if(buckets[currentNavigation]){
			//we're done
			growCheckers();
			buckets[currentNavigation].fading=true;
			buckets[currentNavigation].show();
		}
		else{
			//changeNavigation(0,true);
		}
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function updateAllCheckerPositions(){
	for(var i=0;i<checkers.length;i++){
		checkers[i].updateCorners();
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var clicked = false;

function endRandomSorting(){
	currentEmptyChecker = -1;
	if(buckets[currentNavigation]){
		buckets[currentNavigation].deselect();
	}
	currentNavigation = -1;
	movingChecker = -1;
	clicked = true;
	updateAllCheckerPositions();
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function triggerRandomSorting(){
	currentCoords = (currentCoords+1)%coordinates.length;
	makeTargetCheckerLayout();
	selectCurrentChecker();
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var currentEmptyChecker = -1;
var movingChecker = -1;

function updateCheckers(){

	if(checkers[movingChecker]){
		checkers[movingChecker].slideCorners();
	}
	else if(checkers[currentEmptyChecker]){
		checkers[currentEmptyChecker].slideThisChecker();
	}
	else if(shrinking_checkers){
		shrinkCheckers();
	}
	else if(growing){
		growCheckers();
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var checkerGrayscale = 1;
var puzzleSolved = false;

function updateCheckerGrayscale(goDown){
	if(goDown){
		checkerGrayscale-=.1;
	}
	if(checkerGrayscale>=0){
		var tempAmount = Math.floor(checkerGrayscale*100)+'%';
		var board = document.getElementById('checkerBoard');
		if(board.style['-webkit-filter']!==undefined){
			board.style['-webkit-filter'] = 'grayscale('+tempAmount+')';
		}
		else if(board.style['-moz-filter']!==undefined){
			board.style['-moz-filter'] = 'grayscale('+tempAmount+')';
		}
		else if(board.style['-o-filter']!==undefined){
			board.style['-o-filter'] = 'grayscale('+tempAmount+')';
		}
		else if(board.style['filter']!==undefined){
			board.style['filter'] = 'grayscale('+checkerGrayscale+')';
		}
	}
	else if(goDown){
		changeNavigation(0,true);
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var checkers = [];  // very important array, holds every checker, including empty ones


//this are predefined layouts for the cover screen
//pseudo-random layouts, to make it easy to solve the puzzle
//they are lookup array, telling the checkers where to start out
var scrambleIndexes = [
	[40,21,42,3,23,45,6,7,47,9,10,1,12,13,14,15,46,17,18,19,20,11,22,33,24,25,16,27,28,39,30,31,32,43,34,35,36,37,38,49,0,41,2,4,44,5,26,8,48,29],
	[11,1,2,3,42,45,6,7,8,9,10,21,12,13,14,15,47,17,18,19,20,31,22,23,24,25,16,27,28,29,30,41,32,33,34,35,36,37,48,49,40,0,4,43,44,5,46,26,38,39],
	[0,11,12,3,41,5,49,7,8,9,10,1,2,13,14,15,16,17,18,19,20,21,22,23,24,25,26,37,28,29,30,31,32,33,34,35,46,47,38,39,40,4,42,44,43,45,36,27,48,6]
];

function makeCheckerBoard(){

	updateCheckerGrayscale(false);

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

	//pick which scrambleArray we want to use today...
	var rIndex = Math.floor(Math.random()*scrambleIndexes.length);
	//for each slot, make a checker
	var checkerCount = 0;
	var chckerOffset = 5;
	for(var i=0;i<xDim*yDim;i++){

		var thisChecker = (i+chckerOffset)%(xDim*yDim);

		//with a random starting point
		var thisIndex = scrambleIndexes[rIndex][thisChecker]; // tell it to go to a specific spot on the screen

		//if we've already made all our full checkers, make empty ones
		var isFull = true;
		if(checkerCount>=totalCheckers) isFull = false;

		checkers[thisChecker] = new Checker(thisIndex,isFull);
		checkerCount++;
	}

	//we use document.body for out mouse movements, so that if the user pulls their mouse off the
	//checker board, they're still able to manipulate the checker
	document.body.onmousemove = function(e){
		for(var i=0;i<checkers.length;i++){
			if(checkers[i].touched){
				checkers[i].updateCorners(true);
				var realX = e.x;
				var realY = e.y;
				if(!realX){
					realX = e.clientX;
					realY = e.clientY;
				}
				var xDiff = realX-(checkers[i].corners.l+checkers[i].mouse.x);
				var yDiff = realY-(checkers[i].corners.t+checkers[i].mouse.y);
				checkers[i].mouseSlide(xDiff,yDiff,realX,realY);
				break;
			}
		}
	};
	document.body.onmouseup = function(e){
		for(var i=0;i<checkers.length;i++){
			if(checkers[i].touched){
				checkers[i].touched = false;
				checkers[i].mouse = {
					'x':undefined,
					'y':undefined
				};
				checkers[i].updateCorners();
				checkers[i].el.style.opacity = 1;
			}
		}
		setTimeout(checkCheckerPositions,200);;
	};
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////


//did we win????
function checkCheckerPositions(){
	//this array hold the checker indexes that have part of the BitTorrent type on it
	//as far as we're concerned, these are the only checkers that need to be in the right spot
	//relative to each other, that is...
	var logoCheckers = [10,11,12,13,14,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39];
	var count = 0;
	var offset = undefined;
	for(var i=0;i<logoCheckers.length;i++){
		if(offset===undefined){
			offset = checkers[logoCheckers[i]].index-logoCheckers[i];
		}
		if(checkers[logoCheckers[i]].index!==logoCheckers[i]+offset){
			count++;
		}
	}
	//only trigger a win if a bucket hasn't been selected yet
	if(count===0 && checkers[logoCheckers[0]].index%xDim<3 && !buckets[currentNavigation]){
		puzzleSolved=true; // yay, we won!
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
			if(winner!==undefined){
				checkers[i].targetIndex = winner;
				emptySpaceArray[winner] = true;
			}
			else{
				console.log('we messed up on finding a space for checker '+i);
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