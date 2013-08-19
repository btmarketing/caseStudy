////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function ContentBox(el){
	this.type = dimensions[el.className];

	this.l;
	this.t;

	this.width = this.type.width*unitSize;
	this.height = this.type.height*unitSize;

	var shade = 200;
	this.color = 'rgb('+shade+','+shade+','+shade+')';

	this.el = el;
	this.el.className += ' contentBox';
	this.el.style.backgroundColor = this.color;

	this.hide();
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
	this.updateDOM();
	this.el.style.display = 'inline';
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

ContentBox.prototype.changePosition = function(){
	var unitOffsetX = coordinates[currentCoords][this.type.name].l;
	var unitOffsetY = coordinates[currentCoords][this.type.name].t;

	this.l = (unitOffsetX*unitSize)+center.l;
	this.t = (unitOffsetY*unitSize)+center.t;
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

ContentBox.prototype.updateDOM = function(){
	this.el.style.left = this.l+gutter+'px';
	this.el.style.top = this.t+gutter+'px';
	this.el.style.width = this.width-gutter*2+'px';
	this.el.style.height = this.height-gutter*2+'px';
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////