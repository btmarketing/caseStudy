////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function ContentBox(el){
	this.type = dimensions[el.className];

	this.x;
	this.y;

	this.width = this.type.width*unitSize;
	this.height = this.type.height*unitSize;

	this.moving = false;

	var shade = Math.floor(Math.random()*150);

	this.color = 'rgba('+shade+','+shade+','+shade+',0.5)';

	this.el = el;
	this.el.style.backgroundColor = this.color;
	this.el.className += ' contentBox';
	this.el.style.width = '0px';
	this.el.style.height = '0px';
	if(this.type.name==='title') this.el.style.lineHeight = this.width/2-gutter+'px';

	this.changePosition();
	//this.updateDOM();
	this.hide();
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

ContentBox.prototype.updateAnimation = function(){
	this.moving=false;
	this.updateDOM();
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

ContentBox.prototype.hide = function(){
	this.el.style.display = 'none';
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

ContentBox.prototype.show = function(){
	this.el.style.display = 'inline';
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
	this.el.style.left = this.x-this.width/2+gutter+'px';
	this.el.style.top = this.y-this.height/2+gutter+'px';
	this.el.style.width = this.width-gutter*2+'px';
	this.el.style.height = this.height-gutter*2+'px';
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var dimensions = {
	'title': {
		'name':'title',
		'width':2,
		'height':1
	},
	'big': {
		'name':'big',
		'width':4,
		'height':3
	},
	'rect_1': {
		'name':'rect_1',
		'width':4,
		'height':2
	},
	'rect_2': {
		'name':'rect_2',
		'width':4,
		'height':2
	},
	'unit_1': {
		'name':'unit_1',
		'width':1,
		'height':1
	},
	'unit_2': {
		'name':'unit_2',
		'width':1,
		'height':1
	},
	'double_1': {
		'name':'double_1',
		'width':2,
		'height':1
	},
	'double_2': {
		'name':'double_2',
		'width':2,
		'height':1
	},
	'long': {
		'name':'long',
		'width':3,
		'height':1
	}
};

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////