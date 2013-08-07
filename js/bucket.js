////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function Bucket(bucket,_index){
	this.el = bucket;
	//find the title div
	this.title = this.el.getElementsByClassName('title')[0].children[0].innerHTML;
	this.index = _index;

	this.totalGrown = 0;
	this.totalShrunk = 0;

	//make the navigation link for the top
	this.makeNavLink();

	//make content boxes for each div
	this.makeContentBoxes();
}

////////////////////////////////////////////////
////////////////////////////////////////////////
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
////////////////////////////////////////////////
////////////////////////////////////////////////

Bucket.prototype.makeNavLink = function(){

	this.navLink = document.createElement('span');
	this.navLink.className = 'navLink';
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

	document.getElementById('navigation').appendChild(this.navLink);
}
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

Bucket.prototype.updateTitleBox = function(){
	var prevGrowing = this.titleBox.growing;
	var prevShrinking = this.titleBox.shrinking;

	if(prevGrowing || prevShrinking){

		this.titleBox.updateSize();

		if(prevGrowing && this.titleBox.growing){
			//trigger something for when the title full size ??
			for(var i=0;i<this.contentBoxes.length;i++){
				this.contentBoxes[i].changePosition();
				this.contentBoxes[i].shrinking=false;
				this.contentBoxes[i].growing=true;
				addPackets = true;
			}
		}
		else if(prevShrinking!=this.titleBox.shrinking){
			//trigger something for when the title is shrunk ??
		}
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

Bucket.prototype.updateContentBoxes = function(){

	for(var i=0;i<this.contentBoxes.length;i++){

		var prevGrowing = this.contentBoxes[i].growing;
		var prevShrinking = this.contentBoxes[i].shrinking;

		if(prevGrowing || prevShrinking){

			this.contentBoxes[i].updateSize();

			if(prevGrowing!=this.contentBoxes[i].growing){
				this.totalGrown++;
				if(this.totalGrown===this.contentBoxes.length){
					this.totalGrown = 0;
					//trigger something for when they're all full size ??
					addPackets = false;
				}
			}
			else if(prevShrinking!=this.contentBoxes[i].shrinking){
				this.totalShrunk++;
				if(this.totalShrunk===this.contentBoxes.length){
					this.totalShrunk = 0;
					//trigger something for when they're all shrunk ??
					var b = buckets[currentNavigation];
					b.titleBox.changePosition();
					b.titleBox.shrinking=false;
					b.titleBox.growing=true;
				}
			}
		}
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

Bucket.prototype.select = function(isFirstSelected){

	this.navLink.className += ' navSelected';

	if(isFirstSelected){
		this.titleBox.changePosition();
		this.titleBox.shrinking=false;
		this.titleBox.growing=true;
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

Bucket.prototype.deselect = function(){

	this.navLink.className = 'navLink';

	this.titleBox.hideKids();
	this.titleBox.shrinking=true;
	this.titleBox.growing=false;

	for(var i=0;i<this.contentBoxes.length;i++){
		this.contentBoxes[i].hideKids();
		this.contentBoxes[i].shrinking=true;
		this.contentBoxes[i].growing=false;
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////