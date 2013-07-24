////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function ContentBox(el){
	this.type = dimensions[el.className];

	this.x;
	this.y;

	this.width = this.type.width*unitSize;
	this.height = this.type.height*unitSize;

	this.sinCount = -Math.PI*.5;
	this.sinStepUp = Math.random()*0.04+0.03;
	this.sinStepDown = 0.2;

	if(this.type.name==='title') this.sinStepUp = 0.2;

	this.growing = false;
	this.shrinking = false;

	var shade = Math.floor(Math.random()*150);

	this.color = 'rgba('+shade+','+shade+','+shade+',0.5)';

	this.el = el;
	this.el.style.backgroundColor = this.color;
	this.el.className += ' contentBox';
	this.el.style.width = '0px';
	this.el.style.height = '0px';
	if(this.type.name==='title') this.el.style.lineHeight = this.width/2-gutter+'px';

	this.changePosition();
	this.updateDOM();
	this.hideKids();
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

ContentBox.prototype.updateSize = function(){

	//if it's growing, increase the size until full size
	//then turn growing off
	if(this.growing){
		this.sinCount+=this.sinStepUp;
		if(this.sinCount>=Math.PI*.5){
			this.sinCount = Math.PI*.5;
			this.growing = false;
			this.showKids();
		}
		this.updateDOM();
	}

	//if shrinking, decrease the size until nothing
	else if(this.shrinking){
		this.sinCount-=this.sinStepDown;
		if(this.sinCount<=-Math.PI*.5){
			this.sinCount = -Math.PI*.5;
			this.shrinking = false;
		}
		this.updateDOM();
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

ContentBox.prototype.hideKids = function(){
	var kids = this.el.children;
	for(var i=0;i<kids.length;i++){
		kids[i].style.display = 'none';
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

ContentBox.prototype.showKids = function(){
	var kids = this.el.children;
	for(var i=0;i<kids.length;i++){
		kids[i].style.display = 'inline';
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

ContentBox.prototype.changePosition = function(pos){
	var unitOffsetX = coordinates[currentCoords][this.type.name].x;
	var unitOffsetY = coordinates[currentCoords][this.type.name].y;

	this.x = (unitOffsetX*unitSize)+center.x;
	this.y = (unitOffsetY*unitSize)+center.y;
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var gutter = 5; // the space between each box

ContentBox.prototype.updateDOM = function(){
	var tempSize = Math.sin(this.sinCount)*.5+.5;
	var tempWidth = Math.floor(this.width*tempSize);
	var tempHeight = Math.floor(this.height*tempSize);

	this.el.style.left = this.x-tempWidth/2+gutter+'px';
	this.el.style.top = this.y-tempHeight/2+gutter+'px';
	this.el.style.width = tempWidth-gutter*2+'px';
	this.el.style.height = tempHeight-gutter*2+'px';

	if(tempSize>0){
		this.el.style.display = 'inline';
	}
	else{
		this.el.style.display = 'none';
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var dimensions = {
	'tall': {
		'name':'tall',
		'width':2,
		'height':4
	},
	'fat': {
		'name':'fat',
		'width':4,
		'height':2
	},
	'square_1': {
		'name':'square_1',
		'width':2,
		'height':2
	},
	'square_2': {
		'name':'square_2',
		'width':2,
		'height':2
	},
	'title': {
		'name':'title',
		'width':2,
		'height':1
	}
};

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////