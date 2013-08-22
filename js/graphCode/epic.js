////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

var epic_data = [
	{
		'country':'USA',
		'percentage':9,
		'x':.22,
		'y':.43
	},
	{
		'country':'Russia',
		'percentage':15,
		'x':.75,
		'y':.3
	},
	{
		'country':'Argentina',
		'percentage':6,
		'x':.3,
		'y':.85
	},
	{
		'country':'Spain',
		'percentage':4,
		'x':.46,
		'y':.4
	},
	{
		'country':'India',
		'percentage':3,
		'x':.66,
		'y':.5
	},
	{
		'country':'Italy',
		'percentage':3,
		'x':.5,
		'y':.4
	},
	{
		'country':'Ukraine',
		'percentage':2,
		'x':.55,
		'y':.40
	},
	{
		'country':'Canada',
		'percentage':2,
		'x':.22,
		'y':.26
	},
	{
		'country':'Turkey',
		'percentage':2,
		'x':.55,
		'y':.46
	}
];

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

document.getElementById('epicMap').style.width = unitSize*4-gutter*2-40+'px';
document.getElementById('epicMap').style.height = unitSize*2-gutter*2-40+'px';
document.getElementById('epicMap').style.position = 'absolute';
document.getElementById('epicMap').style.left = '20px';
document.getElementById('epicMap').style.top = '20px';

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var epicDisplay = true;

setInterval(function(){
    if(document.getElementById('epicGraph').offsetWidth){
        if(!epicDisplay){
            epicDisplay=true;
            startEpic();
        }
    }
    else if (epicDisplay){
        epicDisplay=false;
        endEpic();
    }
},500);

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

function startEpic(){
	var epic_fadeIn_time = 4000
    epic_vis.selectAll('circle.innerCircle')
		.transition()
		.duration(epic_fadeIn_time)
	    .attr('r',function(d){
			return epicInnerSmall(d.percentage);
		});

	for(var i=0;i<epic_data.length;i++){
		var startX = epic_data[i].x*epic_w;
		var startY = epic_data[i].y*epic_h;
		var totalPackets = (epic_data[i].percentage*2)+5;
		for(var n=0;n<totalPackets;n++){
			var rIndex = (i+(Math.floor(Math.random()*(epic_data.length-1))))%epic_data.length;
			var endX = epic_data[rIndex].x*epic_w;
			var endY = epic_data[rIndex].y*epic_h;
			var halfX = ((endX-startX)/2)+startX;
			var halfY = ((endY-startY)/2)+startY;
			var delayTime = ((epic_fadeIn_time/2)/totalPackets)*Math.floor(Math.random()*totalPackets);
			epic_vis.append('circle')
				.attr('class','epic_packet')
				.attr('fill','white')
				.attr('cx',endX)
				.attr('cy',endY)
				.attr('opacity',.5)
				.attr('r',0)
				.transition()
				.ease('cubic-in')
				.delay(delayTime)
				.duration(epic_fadeIn_time/4)
				.attr('cx',halfX)
				.attr('cy',halfY)
				.attr('r',2)
				.attr('opacity',1)
				.transition()
				.ease('cubic-out')
				.duration(epic_fadeIn_time/4)
				.attr('cx',startX)
				.attr('cy',startY)
				.attr('opacity',.5)
				.attr('r',0)
				.each('end',function(){
					this.remove();
				});
		}
	}
}


function endEpic(){
	for(var i=0;i<epic_data.length;i++){
		epic_vis.select('#epic_innerCircle_'+i)
			.attr('r',0);
	}
}

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

var epic_w = unitSize*4-gutter*2;
var epic_h = unitSize*2-gutter*2;
var epic_r = 80;

var epic_vis = d3.select("#epicMeal_div")
  .append("svg:svg")
  .attr('id','epicGraph')
  .attr("width", epic_w)
  .attr("height", epic_h);

var epicSVG = document.getElementById('epicGraph');
epicSVG.style.position = 'absolute';
epicSVG.style.left = '0px';
epicSVG.style.top = '0px';

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

epic_vis.selectAll('circle.outerCircle')
	.data(epic_data)
	.enter()
		.append('circle')
		.attr('class','outerCircle')
		.attr('id',function(d,i){
			return 'epic_outerCircle_'+i;
		})
		.attr('cx',function(d){
			return d.x*epic_w;
		})
		.attr('cy',function(d){
			return d.y*epic_h;
		})
		.attr('fill','white')
		.attr('opacity',.3)
		.attr('r',0)
		.on('mouseover',function(d,i){
			openEpicCircle(d,i);
		})
		.on('mouseout',function(d,i){
			closeEpicCircle(d,i);
		});

epic_vis.selectAll('circle.innerCircle')
	.data(epic_data)
	.enter()
		.append('circle')
		.attr('class','innerCircle')
		.attr('id',function(d,i){
			return 'epic_innerCircle_'+i;
		})
		.attr('cx',function(d){
			return d.x*epic_w;
		})
		.attr('cy',function(d){
			return d.y*epic_h;
		})
		.attr('opacity',.6)
		.attr('fill','white')
		.attr('r',0)
		.on('mouseover',function(d,i){
			openEpicCircle(d,i);
		})
		.on('mouseout',function(d,i){
			closeEpicCircle(d,i);
		});

epic_vis.selectAll('text.epic_text')
	.data(epic_data)
	.enter()
		.append('text')
		.attr('class','epic_text')
		.attr('cursor','default')
		.attr('id',function(d,i){
			return 'epic_text_'+i;
		})
		.attr('opacity',0)
		.attr('fill','#594c81')
		.attr('font-size',function(d){
			return Math.floor(epicInnerBig(d.percentage)*.7)+6+'px';
		})
		.attr("text-anchor", "middle")
		.text(function(d){
			return d.percentage+'%';
		})
		.attr('x',function(d){
			return d.x*epic_w;
		})
		.attr('y',function(d){
			var offset = epicInnerBig(d.percentage)*.3;
			return d.y*epic_h+offset+1;
		})
		.on('mouseover',function(d,i){
			openEpicCircle(d,i);
		})
		.on('mouseout',function(d,i){
			closeEpicCircle(d,i);
		});

epic_vis.append('text')
	.attr('id','countryDisplay')
	.attr('opacity',0)
	.attr('font-size','13px')
	.attr("text-anchor", "left")
	.attr('fill','white')
	.attr('x',20)
	.attr('y',function(){
		return epic_h-20+'px';
	});

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

function openEpicCircle(data,index){
	d3.select('#epic_innerCircle_'+index)
		.transition()
		.duration(200)
		.attr('r',function(d){
			return epicInnerBig(d.percentage);
		});

	d3.select('#epic_outerCircle_'+index)
		.transition()
		.duration(300)
		.attr('r',function(d){
			return epicOuterBig(d.percentage);
		});

	d3.select('#epic_text_'+index)
		.transition()
		.duration(500)
		.attr('opacity',1);

	d3.select('#countryDisplay')
		.text(data.country)
		.transition()
		.duration(200)
		.attr('opacity',.7);
}

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

function closeEpicCircle(data,index){
	d3.select('#epic_innerCircle_'+index)
		.transition()
		.duration(600)
		.attr('r',function(d,i){
			return epicInnerSmall(d.percentage);
		});

	d3.select('#epic_outerCircle_'+index)
		.transition()
		.duration(1000)
		.attr('r',0);

	d3.select('#epic_text_'+index)
		.transition()
		.duration(200)
		.attr('opacity',0);

	d3.select('#countryDisplay')
		.transition()
		.duration(200)
		.attr('opacity',0);
}

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

function epicInnerSmall(value){
	return value*.6+5;
}

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

function epicInnerBig(value){
	return (value+10)*1.1;
}

function epicOuterBig(value){
	return (value+10)*1.6;
}

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

endEpic();

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////