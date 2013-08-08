////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function Bucket(bucket,_index,isLast){
	this.el = bucket;
	//find the title div
	this.title = this.el.getElementsByClassName('title')[0].children[0].innerHTML;
	this.index = _index;

	this.totalGrown = 0;
	this.totalShrunk = 0;

	this.isLast = isLast;

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

Bucket.prototype.select = function(oldBucketIndex){

	this.navLink.className = 'navActive';

	this.titleBox.changePosition();
	this.titleBox.show();

	for(var i=0;i<this.contentBoxes.length;i++){
		this.contentBoxes[i].changePosition();
		this.contentBoxes[i].show();
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

Bucket.prototype.deselect = function(){

	this.navLink.className = '';

	this.titleBox.hide();

	for(var i=0;i<this.contentBoxes.length;i++){
		this.contentBoxes[i].hide();
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////