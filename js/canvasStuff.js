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
	canvas.width = theWidth;
	canvas.height = theHeight;
	//drawGridLines();
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

		var startX = b.titleBox.x;
		var startY = b.titleBox.y;

		for(var c=0;c<b.contentBoxes.length;c++){

			var endX = b.contentBoxes[c].x;
			var endY = b.contentBoxes[c].y;
			var p = new Packet(startX,startY,endX,endY);
			packets.push(p);

			if(b.contentBoxes[c].sinCount>-Math.PI*.25){

				for(var i=0;i<b.contentBoxes.length;i++){
					if(c!==i){
						var endX_inter = b.contentBoxes[i].x;
						var endY_inter = b.contentBoxes[i].y;
						var p_inter = new Packet(endX,endY,endX_inter,endY_inter);
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

var clearIt = false;

function updateCurrentPackets(){
	if(packets.length>0){
		clearIt=true;
		context.fillStyle = 'rgba(255,255,255,1)';
		context.fillRect(0,0,canvas.width,canvas.height);
		for(var i=0;i<packets.length;i++){
			packets[i].step();
			packets[i].paint();
			if(packets[i].arrived){
				packets.splice(i,1);
				i--;
			}
		}
	}
	else if(clearIt){
		clearIt = false;
		context.fillStyle = 'rgba(255,255,255,1)';
		context.fillRect(0,0,canvas.width,canvas.height);
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function Packet(sx,sy,dx,dy){
	this.stepAmount = Math.floor(Math.random()*20)+30;
	this.currentStep = 0;
	this.x = sx;
	this.y = sy;
	this.size = Math.floor(Math.pow(Math.random()*2,2)+1);
	this.targetX = dx;
	this.targetY = dy;
	this.xStep = (dx-sx)/this.stepAmount;
	this.yStep = (dy-sy)/this.stepAmount;
	this.arrived = false;
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

Packet.prototype.step = function(){
	this.x+=this.xStep;
	this.y+=this.yStep;
	this.currentStep++;
	if(this.currentStep===this.stepAmount){
		this.arrived = true;
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

Packet.prototype.paint = function(){
	context.fillStyle = 'rgba(100,100,200,.7)';
	context.beginPath();
	context.arc(this.x,this.y,this.size,0,2*Math.PI,false);
	context.fill();
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function drawGridLines(){
	context.clearRect(0,0,canvas.width,canvas.height);
	for(var x=center.x;x<theWidth;x+=unitSize){
		context.beginPath();
		context.moveTo(x,0);
		context.lineTo(x,theHeight);
		context.stroke();
	}
	for(x=center.x-unitSize;x>0;x-=unitSize){
		context.beginPath();
		context.moveTo(x,0);
		context.lineTo(x,theHeight);
		context.stroke();
	}
	for(var y=center.y;y<theHeight;y+=unitSize){
		context.beginPath();
		context.moveTo(0,y);
		context.lineTo(theWidth,y);
		context.stroke();
	}
	for(var y=center.y-unitSize;y>0;y-=unitSize){
		context.beginPath();
		context.moveTo(0,y);
		context.lineTo(theWidth,y);
		context.stroke();
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////