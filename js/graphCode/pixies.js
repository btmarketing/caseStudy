////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

var pixies_max = 12900;
var pixies_min = 1;
var pixies_w = unitSize*4-gutter*2;
var pixies_h = unitSize*2-gutter*2;

var pixiesSVG = d3.select('#pixiesGraph_div').append('svg')
	.attr('id','pixiesSVG')
	.attr('width',pixies_w)
	.attr('height',pixies_h)[0][0];

pixiesSVG.style.position = 'absolute';
pixiesSVG.style.left = '0px';
pixiesSVG.style.top = '0px';

var pixies_labelX = pixies_w*.7;
var pixies_labelY = pixies_h*.25;
var pixies_labelMaxWidth = 65;
var pixies_labelMinWidth = 30;
var pixies_labelHeight = 30;

var pixies_envelopeWidth = 159;
var pixies_envelopeHeight = 108;

d3.select(pixiesSVG)
	.append('image')
	.attr("xlink:href", "img/envelope.png")
	.attr('id','pixies_image')
	.attr('width',0)
	.attr('height',0)
	.attr('x',-pixies_envelopeWidth/2)
	.attr('y',pixies_h+pixies_envelopeHeight/2)
	.on('mouseover',pixies_mouseover)
	.on('mouseout',pixies_mouseout);

d3.select(pixiesSVG).append('rect')
	.attr('fill','#9184bd')
	.attr('stroke','white')
	.attr('id','pixies_rect')
	.attr('stroke-width',2)
	.attr('id','pixies_rect')
	.attr('opacity',0)
	.attr('x',function(){
		return pixies_labelX-pixies_labelMinWidth/2;
	})
	.attr('y',function(){
		return pixies_labelY-pixies_labelHeight/2;
	})
	.attr('width',pixies_labelMinWidth)
	.attr('height',pixies_labelHeight)
	.attr('rx',pixies_labelMinWidth*.5)
	.attr('ry',pixies_labelHeight)
	.on('mouseover',pixies_mouseover)
	.on('mouseout',pixies_mouseout);

d3.select(pixiesSVG)
	.append('text')
	.attr('fill','white')
	.attr('id','pixies_value')
	.attr('opacity',0)
	.attr('x',pixies_labelX)
	.attr('cursor','default')
	.attr('y',pixies_labelY+7)
	.attr('text-anchor','middle')
	.attr('font-size',20)
	.text(pixies_min)
	.on('mouseover',pixies_mouseover)
	.on('mouseout',pixies_mouseout);

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

function pixies_mouseover(){
	d3.select('#pixies_rect')
		.attr('opacity',1)
		.transition()
		.duration(500)
		.ease('cubic-out')
		.attr('width',pixies_labelMaxWidth)
		.attr('x',function(){
			return pixies_labelX-pixies_labelMaxWidth/2;
		});
	d3.select('#pixies_value')
		.attr('opacity',1)
		.transition()
		.duration(6000)
		.ease('cubic-out')
		.tween("text", function() {
	        var i = d3.interpolate(this.textContent,pixies_max);

	        return function(t) {
	            this.textContent = Math.round(i(t));
	        }
	    })
	    .each('end',function(){
	    	d3.select('#pixies_value')
				.transition()
				.duration(20000)
				.ease('linear')
				.tween("text", function() {
			        var i = d3.interpolate(this.textContent,pixies_max+50);

			        return function(t) {
			            this.textContent = Math.round(i(t));
			        }
			    })
	    });
}

function pixies_mouseout(){
	d3.select('#pixies_rect')
		.transition()
		.duration(300)
		.ease('cubic-in')
		.attr('width',pixies_labelMinWidth)
		.attr('x',function(){
			return pixies_labelX-pixies_labelMinWidth/2;
		});
	d3.select('#pixies_value')
		.transition()
		.duration(300)
		.tween("text", function() {
	        var i = d3.interpolate(this.textContent,pixies_min);

	        return function(t) {
	            this.textContent = Math.round(i(t));
	        }
	    });
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

function pixies_open(){
	d3.select('#pixies_image')
		.transition()
		.duration(500)
		.attr('width',pixies_envelopeWidth)
		.attr('height',pixies_envelopeHeight)
		.attr('x',pixies_w/2-pixies_envelopeWidth/2)
		.attr('y',pixies_h/2-pixies_envelopeHeight/2)
		.each('end',function(){

			d3.select('#pixies_rect')
				.transition()
				.duration(300)
				.attr('opacity',1);

			d3.select('#pixies_value')
				.transition()
				.duration(function(){
					console.log('yay');
					return 300;
				})
				.attr('opacity',1);
		})
}

function pixies_close(){
	d3.select('#pixies_rect').attr('opacity',0);
	d3.select('#pixies_value').attr('opacity',0);
	d3.select('#pixies_image')
		.attr('width',0)
		.attr('height',0)
		.attr('x',-pixies_envelopeWidth/2)
		.attr('y',pixies_h+pixies_envelopeHeight/2);
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

var pixiesDisplay = false;

setInterval(function(){
    if(document.getElementById('pixiesGraph_div').offsetWidth){
        if(!pixiesDisplay){
            pixiesDisplay=true;
            pixies_open();
        }
    }
    else if (pixiesDisplay){
        pixiesDisplay=false;
        pixies_close();
    }
},500);

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////