////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

var ferriss_w = unitSize*4-gutter*2;
var ferriss_h = unitSize*2-gutter*2-40;

d3.select('#ferrissWrap').append('svg')
	.attr('id','ferrissSVG')
	.attr('width',ferriss_w)	
	.attr('height',ferriss_h);

var ferrissSVG = document.getElementById('ferrissSVG');
ferrissSVG.style.position = 'absolute';
ferrissSVG.style.left = '0px';
ferrissSVG.style.top = '20px';

var ferriss_imageWidth = 390;
var ferriss_imageHeight = 982;

var stopPoints = [-0.015,-.31,-.58,-.82];

d3.select(ferrissSVG)
	.append('image')
	.attr("xlink:href", "img/ferriss.png")
	.attr('id','ferriss_image')
	.attr('width',ferriss_imageWidth)
	.attr('height',ferriss_imageHeight)
	.attr('x',0)
	.attr('y',function(){
		return stopPoints[0]*ferriss_imageHeight;
	})
	.attr('opacity',1)
	.on('mouseover',ferriss_mouseover)
	.on('mouseout',ferriss_mouseout);

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

function ferriss_mouseover(){
	ferriss_cancelAllTransitions();
	d3.select('#ferriss_image')
		.attr('opacity',1)
		.attr('y',function(){
			return stopPoints[0]*ferriss_imageHeight;
		})
		.transition()
		.duration(1000)
		.attr('y',function(){
			return stopPoints[1]*ferriss_imageHeight;
		})
		.each('end',function(){
			d3.select('#ferriss_image')
				.transition()
				.duration(1000)
				.delay(500)
				.attr('y',function(){
					return stopPoints[2]*ferriss_imageHeight;
				})
				.each('end',function(){
					d3.select('#ferriss_image')
						.transition()
						.duration(1000)
						.delay(500)
						.attr('y',function(){
							return stopPoints[3]*ferriss_imageHeight;
						})
						.each('end',function(){
							d3.select('#ferriss_image')
								.transition()
								.duration(500)
								.delay(500)
								.attr('opacity',0)
								.each('end',function(){
									d3.select('#ferriss_image')
										.attr('y',function(){
											return stopPoints[0]*ferriss_imageHeight;
										})
										.transition()
										.duration(500)
										.attr('opacity',1)
										.each('end',ferriss_mouseover);
								})
						});
				});
		});
}

function ferriss_mouseout(){
	ferriss_cancelAllTransitions();
	d3.select('#ferriss_image')
		.transition()
		.duration(500)
		.attr('opacity',0)
		.each('end',function(){
			d3.select('#ferriss_image')
				.attr('y',function(){
					return stopPoints[0]*ferriss_imageHeight;
				})
				.transition()
				.duration(500)
				.attr('opacity',1);
		})
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

function ferriss_cancelAllTransitions(){
	d3.select('#ferriss_image').each(function() {
		var lock = this.__transition__;
		if (lock) lock.active = 0;
	});
}

function ferriss_open(){
}

function ferriss_close(){
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

var ferrissDisplay = false;

setInterval(function(){
    if(document.getElementById('ferrissWrap').offsetWidth){
        if(!ferrissDisplay){
            ferrissDisplay=true;
            ferriss_open();
        }
    }
    else if (ferrissDisplay){
        ferrissDisplay=false;
        ferriss_close();
    }
},500);

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////