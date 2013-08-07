////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var canvas;
var context;

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function initCanvas(){
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	canvas.width = unitSize*10;
	canvas.height = unitSize*5;
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var frameCount = 0;
var packetInterval = 5;

var packets = [];
var addPackets = false;

function drawSeeding(){
	if(frameCount%packetInterval===0 && addPackets){

		var b = buckets[currentNavigation];

		var startX = b.titleBox.x-leftOffset;
		var startY = b.titleBox.y-canvasTopOffset;

		for(var c=0;c<b.contentBoxes.length;c++){

			var endX = b.contentBoxes[c].x-leftOffset;
			var endY = b.contentBoxes[c].y-canvasTopOffset;
			var p = new Packet(startX,startY,endX,endY);
			packets.push(p);

			if(b.contentBoxes[c].sinCount>-Math.PI*.25 && b.contentBoxes[c].sinCount<Math.PI*.25){

				for(var i=0;i<b.contentBoxes.length;i++){
					if(c!==i){
						var endX_inter = b.contentBoxes[i].x-leftOffset;
						var endY_inter = b.contentBoxes[i].y-canvasTopOffset;
						var p_inter = new Packet(endX,endY,endX_inter,endY_inter,c);
						packets.push(p_inter);
					}
				}
			}
		}
	}
	frameCount++;
	updateCurrentPackets();
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function updateCurrentPackets(){
	context.globalAlpha = 1;
	if(packets.length>0){
		context.clearRect(0,0,canvas.width,canvas.height);
		for(var i=0;i<packets.length;i++){
			packets[i].step();
			packets[i].paint();
			if(packets[i].arrived){
				packets.splice(i,1);
				i--;
			}
		}
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function findAngle(startX,startY,endX,endY){

	var finalAngle = 0;

	var xDiff = endX-startX;
	var yDiff = endY-startY;
	var totalDiff = Math.sqrt(Math.pow(xDiff,2)+Math.pow(yDiff,2));
	var rightSine = Math.sin(Math.PI*.5);

	var useDiff;
	var radOffset;

	if(xDiff>=0 && yDiff<=0){
		useDiff = Math.abs(xDiff);
		radOffset = 0;
	}
	else if(xDiff>=0 && yDiff>=0){
		useDiff = Math.abs(yDiff);
		radOffset = Math.PI*.5;
	}
	else if(xDiff<=0 && yDiff>=0){
		useDiff = Math.abs(xDiff);
		radOffset = Math.PI;
	}
	else if(xDiff<=0 && yDiff<=0){
		useDiff = Math.abs(yDiff);
		radOffset = Math.PI*1.5;
	}
	var numerator = rightSine*useDiff;
	finalAngle = Math.asin(numerator/totalDiff)+radOffset;

	if(!finalAngle) finalAngle=0;

	return finalAngle;
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function Packet(sx,sy,dx,dy,colorIndex){
	this.x = sx;
	this.y = sy;
	this.totalDiff = Math.sqrt(Math.pow(dx-sx,2)+Math.pow(dy-sy,2));
	this.rot = findAngle(sx,sy,dx,dy)+Math.PI;

	this.waves = Math.floor(Math.random()*7)+3;

	this.stepAmount = Math.floor(Math.random()*20)+60;
	this.currentStep = 0;

	this.waveHeight = this.totalDiff*(Math.pow(Math.random()*.3,2));

	this.arrived = false;
	this.size = Math.floor(Math.pow(Math.random()*2,2)+3);
	this.colorIndex = colorIndex;
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

Packet.prototype.step = function(){
	this.currentStep++;
	if(this.currentStep===this.stepAmount){
		this.arrived = true;
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var colors = ['red','green','yellow','purple','orange','blue','green','yellow','purple','orange','blue'];

Packet.prototype.paint = function(){
	var amount = (this.currentStep/this.stepAmount)*this.waves;
	var location = (Math.sin(((this.currentStep/this.stepAmount)*2-1)*Math.PI*.5)*.5+.5)*this.totalDiff;
	var offset = Math.sin(amount)*this.waveHeight;
	var thisFill = Math.sin((this.currentStep/this.stepAmount)*Math.PI)*.6;
	context.translate(this.x,this.y);
	context.rotate(this.rot);
	context.globalAlpha = thisFill;
	context.fillStyle = colors[this.colorIndex];
	context.beginPath();
	context.arc(offset,location,this.size,0,2*Math.PI,false);
	context.fill();
	context.rotate(-this.rot);
	context.translate(-this.x,-this.y);
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////