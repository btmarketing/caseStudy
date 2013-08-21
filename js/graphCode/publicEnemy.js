////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

var publicEnemy_dates = ['2013-06-01', '2013-06-02', '2013-06-03', '2013-06-04', '2013-06-05', '2013-06-06', '2013-06-07', '2013-06-08', '2013-06-09', '2013-06-10', '2013-06-11', '2013-06-12', '2013-06-13', '2013-06-14', '2013-06-15', '2013-06-16', '2013-06-17', '2013-06-18', '2013-06-19', '2013-06-20'];

var publicEnemy_data = {
	'Total':{
		'array':[2245.0,2622.0,3186.0,3034.0,2655.0,2229.0,2407.0,1707.0,2119.0,2476.0,2491.0,2403.0,2035.0,2040.0,1696.0,1705.0,2419.0,2091.0,3455.0,4103.0],
		'percentage':100,
		'sum':49118,
		'color':'rgb(30,16,74)'
	},
	'Twitter':{
		'array':[1393.0,1733.0,1165.0,1304.0,1110.0,1203.0,1039.0,1024.0,1204.0,903.0,1031.0,1212.0,986.0,1062.0,1010.0,888.0,1219.0,978.0,2328.0,2812.0],
		'percentage':52,
		'sum':25604,
		'color':'rgb(30,16,74)'
	},
	'News':{
		'array':[380.0,325.0,1201.0,981.0,840.0,381.0,727.0,226.0,343.0,803.0,563.0,395.0,377.0,376.0,193.0,349.0,509.0,452.0,414.0,537.0],
		'percentage':21,
		'sum':10372,
		'color':'rgb(30,16,74)'
	},
	'Blog':{
		'array':[310.0,353.0,575.0,528.0,464.0,434.0,389.0,309.0,408.0,555.0,660.0,550.0,438.0,386.0,334.0,307.0,470.0,455.0,513.0,515.0],
		'percentage':18,
		'sum':8953,
		'color':'rgb(30,16,74)'
	},
	'Forums':{
		'array':[162.0,211.0,245.0,221.0,241.0,211.0,252.0,148.0,164.0,215.0,237.0,246.0,234.0,216.0,159.0,161.0,221.0,206.0,200.0,239.0],
		'percentage':9,
		'sum':4189,
		'color':'rgb(30,16,74)'
	}
};

var publicEnemy_empty = [];
for(var q=0;q<publicEnemy_data.Total.array.length;q++){
	publicEnemy_empty[q] = 0;
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

var publicEnemy_w = unitSize*4-gutter*2;
var publicEnemy_h = unitSize*2-gutter*2;

var publicEnemy_ready = false;

var pe_viz = d3.select('#publicEnemy_graph_div')
	.append('svg')
		.attr('width',publicEnemy_w)
		.attr('height',publicEnemy_h)
		.attr('id','publiEnemy_svg');

var pe_svg = document.getElementById('publiEnemy_svg');
pe_svg.style.position = 'absolute';
pe_svg.style.top = '0px';
pe_svg.style.left = '0px';

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

var publicEnemy_divider = 22;

var pe_area = d3.svg.area()
	.x(function(d,i) { return (publicEnemy_w/(publicEnemy_data.Total.array.length-1))*i; })
	.y0(publicEnemy_h)
	.y1(function(d,i) { return publicEnemy_h-d/publicEnemy_divider; })
	.interpolate("basis");

var pe_line = d3.svg.area()
	.x(function(d,i) { return (publicEnemy_w/(publicEnemy_data.Total.array.length-1))*i; })
	.y(function(d,i) { return publicEnemy_h-d/publicEnemy_divider; })
	.interpolate("basis");

var publicEnemby_types = ['Total','Twitter','News','Blog','Forums'];
for(var i=0;i<publicEnemby_types.length;i++){
	pe_viz.append('g')
		.attr('id','publicEnemy_group_'+publicEnemby_types[i]);
}
pe_viz.append('g')
	.attr('id','publicEnemy_group_dynamic')
	.append('path')
		.attr('id','publicEnemy_path_dynamic');

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

makeChart(0);

function makeChart(index){
	var type = publicEnemby_types[index];
	var color = publicEnemy_data[type].color;
	var data = publicEnemy_data[type].array;

	pe_viz.select('#publicEnemy_group_'+type)
		.append('path')
			.attr('id','publicEnemy_path_'+type)
			.datum(publicEnemy_empty)
			.attr('d',pe_area)
			.attr('opacity',.1)
			.attr('fill',function(d,i){
				return publicEnemy_data[type].color;
			})
			.on('mouseover',function(d){
				if(publicEnemy_ready){
					pe_viz.select('#publicEnemy_line_'+type)
						.transition()
						.duration(100)
						.attr('opacity',.2);
					pe_viz.select('#publicEnemy_path_'+type)
						.transition()
						.duration(100)
						.attr('opacity',1);
					pe_viz.select('#publicEnemy_text_'+type)
						.transition()
						.duration(100)
						.attr('opacity',1);
				}
			})
			.on('mouseout',function(d){
				if(publicEnemy_ready){
					pe_viz.select('#publicEnemy_line_'+type)
						.transition()
						.duration(100)
						.attr('opacity',.1);
					pe_viz.select('#publicEnemy_path_'+type)
						.transition()
						.duration(100)
						.attr('opacity',.1);
					pe_viz.select('#publicEnemy_text_'+type)
						.transition()
						.duration(100)
						.attr('opacity',0);
				}
			});

	pe_viz.append('path')
		.attr('id','publicEnemy_line_'+type)
		.datum(publicEnemy_empty)
		.attr('d',pe_line)
		.attr('stroke-width',1)
		.attr('opacity',.1)
		.attr('stroke','white');

	pe_viz.selectAll('text')
		.data(publicEnemby_types)
		.enter()
			.append('text')
			.attr('id',function(d){
				return 'publicEnemy_text_'+d;
			})
			.attr('text-anchor','left')
			.attr('fill','white')
			.attr('opacity',0)
			.attr('font-size',20)
			.text(function(d){
				return d+' Conversations';
			})
			.attr('x',10)
			.attr('y',20);

	var newIndex = index+1;
	if(newIndex<publicEnemby_types.length){
		makeChart(newIndex);
	}
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

function publicEnemy_open(){
	for(var i=0;i<publicEnemby_types.length;i++){
		var type = publicEnemby_types[i];
		var data = publicEnemy_data[type].array;
		pe_viz.select('#publicEnemy_path_'+type)
			.datum(data)
			.transition()
			.duration(2000)
			.attr('d',pe_area)
			.each('end',function(){
				publicEnemy_ready = true;
			});
		pe_viz.select('#publicEnemy_line_'+type)
			.datum(data)
			.transition()
			.duration(2000)
			.attr('d',pe_line);
	}
}

function publicEnemy_close(){
	for(var i=0;i<publicEnemby_types.length;i++){
		var type = publicEnemby_types[i];
		pe_viz.select('#publicEnemy_path_'+type)
			.datum(publicEnemy_empty)
			.attr('d',pe_area);
		pe_viz.select('#publicEnemy_line_'+type)
			.datum(publicEnemy_empty)
			.attr('d',pe_line);
	}
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

var publicEnemy_Display = false;

setInterval(function(){
    if(document.getElementById('publicEnemy_graph_div').offsetWidth){
        if(!publicEnemy_Display){
            publicEnemy_Display=true;
            publicEnemy_open();
        }
    }
    else if (publicEnemy_Display){
        publicEnemy_Display=false;
        publicEnemy_close();
    }
},500);

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////