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

	this.stepCount = 0;
	this.stepAmount = 2.5;

	this.seemStep = 1;

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

	if(this.full) {
		var that = this;
		this.el = document.createElement('div');
		this.el.style.position = 'absolute';
		this.el.style.backgroundColor = 'rgb(150,150,150)';
		this.el.onmousedown = function(e){
			endRandomSorting();
			var tempX = e.x;
			var tempY = e.y;
			if(!tempX){
				tempX = e.clientX;
				tempY = e.clientY;
			}
			that.initMouseDrag(tempX,tempY);
		};
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

	var tempAmount = this.stepAmount;
	if(!buckets[currentNavigation]) tempAmount = Math.round(tempAmount*2.5);

	var divider = tempAmount-this.stepCount;

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
	if(this.stepCount>=tempAmount){
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
		if(instr.l) this.adder.l-=this.seemStep;
		if(instr.r) this.adder.r+=this.seemStep;
		if(instr.t) this.adder.t-=this.seemStep;
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
		if(instr.l) this.adder.l+=this.seemStep;
		if(instr.r) this.adder.r-=this.seemStep;
		if(instr.t) this.adder.t+=this.seemStep;
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
	if(Math.abs(xShift)>unitSize*.5 && Math.abs(xShift)<unitSize){
		if(xShift<0 && this.index%xDim!==0 && this.neighborSpace.l){
			//shift if left
			newIndex = this.index-1;
		}
		else if(xShift>0 && this.index%xDim<xDim-1 && this.neighborSpace.r){
			//shift it right
			newIndex = this.index+1;
		}
	}
	else if(Math.abs(yShift)>unitSize*.5 && Math.abs(xShift)<unitSize){
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

var shrinking = false;

function shrinkCheckers(){
	shrinking = true;
	var test = false;

	for(var i=0;i<checkers.length;i++){
		if(!checkers[i].shrunk){
			checkers[i].shrink();
			test = true;
		}
	}

	if(!test){
		shrinking = false;
		makeTargetCheckerLayout();
		selectCurrentChecker();
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
		buckets[currentNavigation].show();
		document.getElementById('checkerBoard').style.display = 'none';
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
		}
		else{
			triggerRandomSorting();
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
		currentNavigation = -1;
	}
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

	if(!buckets[currentNavigation] && !checkers[currentEmptyChecker] && !checkers[movingChecker] && !clicked){
		triggerRandomSorting();
	}

	if(checkers[movingChecker]){
		checkers[movingChecker].slideCorners();
	}
	else if(checkers[currentEmptyChecker]){
		checkers[currentEmptyChecker].slideThisChecker();
	}
	else if(shrinking){
		shrinkCheckers();
	}
	else if(growing){
		growCheckers();
	}
}


////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var xDim = 10;
var yDim = 5;
var checkers = [];

function makeCheckerBoard(){

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
			}
		}
	};
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