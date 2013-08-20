////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

var kaskade_w = unitSize*4-gutter*2;
var kaskade_h = unitSize*2-gutter*2;

var kaskade_vis = d3.select('#kaskadeGraph_div')
	.append('svg')
	.attr('width',kaskade_w)
	.attr('height',kaskade_h)
	.attr('id','kaskade_svg');

var kaskadeSVG = document.getElementById('kaskade_svg');
kaskadeSVG.style.position = 'absolute';
kaskadeSVG.style.left = '0px';
kaskadeSVG.style.top = '0px';

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

var kaskade_data = [
	{
		'value':3500000,
		'label':'BitTorrent',
		'percentage':0.81,
		'color':'#9184bd'
	},
	{
		'value':680000,
		'label':'YouTube',
		'percentage':0.19,
		'color':'#594c81'
	}
];

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

kaskade_vis.selectAll('rect.kaskade_rect')
	.data(kaskade_data)
	.enter()
		.append('rect')
		.attr('class','kaskade_rect')
		.attr('id',function(d,i){
			return 'kaskade_rect_'+i;
		})
		.attr('y',function(d,i){
			return (kaskade_h-(kaskade_h*d.percentage))*i;
		})
		.attr('x',0)
		.attr('width',kaskade_w)
		.attr('height',function(d){
			return kaskade_h*d.percentage+2;
		})
		.attr('fill',function(d){
			return d.color;
		})
		.attr('opacity',0);

kaskade_vis.selectAll('text.kaskade_text')
	.data(kaskade_data)
	.enter()
		.append('text')
		.attr('class','kaskade_text')
		.attr('id',function(d,i){
			return 'kaskade_text_'+i;
		})
		.attr('fill','white')
		.attr('text-anchor','middle')
		.attr('x',function(d,i){
			var scale = 1;
			if(i===0) scale=-1;
			return kaskade_w/2+(kaskade_w*scale);
		})
		.attr('y',function(d,i){
			return (kaskade_h-(kaskade_h*d.percentage))*i+(kaskade_h*d.percentage)*.5+6;
		})
		.text(function(d){
			if(d.label==='BitTorrent'){
				return d.value/1000000+' million views on BitTorrent';
			}
			else{
				return d.value/1000+'k on '+d.label;
			}
		})
		.attr('font-size',20);

kaskade_vis.selectAll('rect.kaskade_fadeInX')
	.data([0,1])
	.enter()
		.append('rect')
		.attr('class','kaskade_fadeInX')
		.attr('fill','black')
		.attr('height',kaskade_h)
		.attr('width',function(){
			return kaskade_w/2;
		})
		.attr('y',0)
		.attr('x',function(d){
			if(d===0){
				return -1;
			}
			else{
				return kaskade_w/2+1;
			}
		});

kaskade_vis.selectAll('rect.kaskade_fadeInY')
	.data([0,1])
	.enter()
		.append('rect')
		.attr('class','kaskade_fadeInY')
		.attr('fill','black')
		.attr('height',kaskade_h/2)
		.attr('width',kaskade_w)
		.attr('x',0)
		.attr('y',function(d){
			if(d===0){
				return -1;
			}
			else{
				return kaskade_h/2+1;
			}
		});

kaskade_vis.append('rect')
	.attr('class','kaskade_overlay')
	.attr('opacity',0)
	.attr('x',0)
	.attr('y',0)
	.attr('width',kaskade_w)
	.attr('height',kaskade_h)
	.on('mouseover',kaskade_mouseover)
	.on('mouseout',kaskade_mouseout);

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

function kaskade_cancelAllTransitions(){
	kaskade_vis.selectAll('rect.kaskade_rect')
		.each(function() {
			var lock = this.__transition__;
			if (lock) lock.active = 0;
		});
	kaskade_vis.selectAll('text')
		.each(function() {
			var lock = this.__transition__;
			if (lock) lock.active = 0;
		});
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

var kaskade_position = 0;

function kaskade_mouseover(){
	kaskade_cancelAllTransitions();
	kaskade_vis.select('rect.kaskade_overlay')
		.transition()
		.duration(200)
		.attr('opacity',0)
		.each('end',kaskade_revealData);
}

function kaskade_mouseout(){
	kaskade_cancelAllTransitions();
	kaskade_hideData();
	kaskade_vis.select('rect.kaskade_overlay')
		.transition()
		.duration(200)
		.attr('opacity',.3);
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

function kaskade_powerOn(){
	kaskade_vis.select('rect.kaskade_overlay')
		.attr('opacity',0);

	kaskade_vis.selectAll('rect.kaskade_fadeInX')
		.transition()
		.delay(1000)
		.duration(500)
		.ease('cubic-out')
		.attr('x',function(d){
			if(d===0){
				return -kaskade_w/2;
			}
			else{
				return kaskade_w;
			}
		})
		.each('end',function(){
			kaskade_vis.selectAll('rect.kaskade_fadeInY')
				.transition()
				.duration(300)
				.ease('cubic-out')
				.attr('y',function(d){
					if(d===0){
						return -kaskade_h/2;
					}
					else{
						return kaskade_h;
					}
				})
				.each('end',function(){
					kaskade_vis.select('rect.kaskade_overlay')
						.transition()
						.duration(400)
						.attr('opacity',.3);
				});
		});
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

function kaskade_powerOff(){
	kaskade_vis.selectAll('rect.kaskade_fadeInX')
		.attr('x',function(d){
			if(d===0){
				return -1;
			}
			else{
				return kaskade_w/2+1;
			}
		});
	kaskade_vis.selectAll('rect.kaskade_fadeInY')
		.attr('y',function(d){
			if(d===0){
				return -1;
			}
			else{
				return kaskade_h/2+1;
			}
		});
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

function kaskade_revealData(){
	kaskade_vis.selectAll('rect.kaskade_rect')
		.transition()
		.duration(100)
		.attr('opacity',.7)
		.each('end',function(){
			kaskade_vis.selectAll('text.kaskade_text')
				.transition()
				.duration(200)
				.attr('x',function(){
					return kaskade_w/2;
				});
		});
}

function kaskade_hideData(){
	kaskade_vis.selectAll('text.kaskade_text')
		.attr('x',function(d,i){
			var scale = 1;
			if(i===0) scale=-1;
			return kaskade_w/2+(kaskade_w*scale);
		});

	kaskade_vis.selectAll('rect.kaskade_rect')
		.transition()
		.duration(500)
		.attr('opacity',0);
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

var kaskadeDisplay = false;

setInterval(function(){
    if(document.getElementById('kaskadeGraph_div').offsetWidth){
        if(!kaskadeDisplay){
            kaskadeDisplay=true;
            kaskade_powerOn();
        }
    }
    else if (kaskadeDisplay){
        kaskadeDisplay=false;
        kaskade_powerOff();
    }
},500);

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////