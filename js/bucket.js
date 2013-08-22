////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function Bucket(bucket,_index,isLast){
	this.el = bucket;
	//find the title div
	var tempDiv = this.el.getElementsByClassName('title')[0].children[0];
	this.title = tempDiv.innerHTML;
	this.index = _index;

	this.totalGrown = 0;
	this.totalShrunk = 0;

	this.fading = false;
	this.fadeStep = 1/10;
	this.fadeDirection = 1;
	this.opacity = 0;

	this.isLast = isLast;

	//make the navigation link for the top
	this.makeNavLink();

	//make content boxes for each div
	this.makeContentBoxes();
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

Bucket.prototype.fadeContents = function(){
	this.opacity+=this.fadeStep*this.fadeDirection;
	if(this.opacity>1){
		this.opacity = 1;
		this.fading = false;
		document.getElementById('checkerBoard').style.display = 'none';
	}
	else if(this.opacity<0){
		this.opacity = 0;
		this.fading = false;
		this.hide();
		shrinkCheckers();
	}

	var opacityAmount = Math.pow(this.opacity,.8);

	this.titleBox.el.style.opacity = opacityAmount;
	for(var i=0;i<this.contentBoxes.length;i++){
		this.contentBoxes[i].el.style.opacity = opacityAmount;
	}
}

////////////////////////////////////////////////

Bucket.prototype.makeContentBoxes = function(){
	this.contentBoxes = [];
	this.titleBox;

	var tempChildren = this.el.children;
	for(var i=0;i<tempChildren.length;i++){
		var box = new ContentBox(tempChildren[i]);
		if(box.type.name==='title'){
			this.titleBox = box;
		}
		else{
			this.contentBoxes.push(box);
		}
	}
}

////////////////////////////////////////////////

Bucket.prototype.makeNavLink = function(){

	var li = document.createElement('li');
	this.navLink = document.createElement('span');
	if(this.isLast) li.className = 'last';
	this.navLink.id = 'nav_'+this.index;
	this.navLink.innerHTML = this.title;

	var i = this.index;
	this.navLink.onclick = function(){
		changeNavigation(i); //function inside index.html
	}
	//for touchscreens...
	this.navLink.ontouchstart = function(){
		changeNavigation(i); //function inside index.html
	}

	li.appendChild(this.navLink);

	document.getElementById('navigation').appendChild(li);
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

Bucket.prototype.select = function(){

	//this.opacity = 0;

	this.navLink.className = 'navActive';
	this.fadeDirection = 1;

	this.titleBox.changePosition();

	for(var i=0;i<this.contentBoxes.length;i++){
		this.contentBoxes[i].changePosition();
	}
}

////////////////////////////////////////////////

Bucket.prototype.show = function(){

	this.titleBox.show();

	for(var i=0;i<this.contentBoxes.length;i++){
		this.contentBoxes[i].show();
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

Bucket.prototype.deselect = function(){
	this.navLink.className = '';
	this.fadeDirection = -1;
	if(this.opacity>0){
		this.fading = true;
	}
	else{
		shrinkCheckers(true);
	}
}

////////////////////////////////////////////////

Bucket.prototype.hide = function(){

	this.titleBox.hide();

	for(var i=0;i<this.contentBoxes.length;i++){
		this.contentBoxes[i].hide();
	}
}

////////////////////////////////////////////////

Bucket.prototype.updateContentBoxPositions = function(){

	this.titleBox.changePosition();
	this.titleBox.updateDOM();

	for(var i=0;i<this.contentBoxes.length;i++){
		this.contentBoxes[i].changePosition();
		this.contentBoxes[i].updateDOM();
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function updateBuckets(){
	for(var i=0;i<buckets.length;i++){
		if(buckets[i].fading){
			buckets[i].fadeContents();
		}
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////