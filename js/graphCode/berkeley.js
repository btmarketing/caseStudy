////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var berkeleyDisplay = false;

setInterval(function(){
    if(document.getElementById('berkeleyGraph').offsetWidth){
        if(!berkeleyDisplay){
            berkeleyDisplay=true;
            startBerkeley();
        }
    }
    else if (berkeleyDisplay){
        berkeleyDisplay=false;
        endBerkeley();
    }
},500);

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function startBerkeley(){
    berkeley_vis.selectAll('rect')
        .transition()
        .duration(function(d,i){
            return (100*i)+300;
        })
        .attr('height',function(d){
            var scaled = (d.value-berkeley_min)/berkeley_diff*1;
            return scaled*berkeley_h;
        })
        .attr('y',function(d,i){
            var scaled = (d.value-berkeley_min)/berkeley_diff*1;
            return berkeley_h-(scaled*berkeley_h);
        });
}


function endBerkeley(){
    berkeley_vis.selectAll('rect')
        .attr('height',0)
        .attr('y',function(d,i){
            return berkeley_h;
        });
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var berkeley_w = unitSize*4-gutter*2-40;
var berkeley_h = unitSize*2-gutter*2-40;
var berkeley_r = 80;

var berkeley_vis = d3.select("#berkeleyGraph")
    .append("svg:svg")
    .attr('id','berkeleySVG')
    .attr("width", berkeley_w)
    .attr("height", berkeley_h);


var berkSVG = document.getElementById('berkeleyGraph');
berkSVG.style.position = 'absolute';
berkSVG.style.left = '20px';
berkSVG.style.top = '20px';

var berkeley_data = [
    {"label":"June 6", "value":69612},
    {"label":"June 7", "value":143726},
    {"label":"June 8", "value":157271},
    {"label":"June 9", "value":149027},
    {"label":"June 10", "value":138174},
    {"label":"June 11", "value":135456},
    {"label":"June 12", "value":139275},
    {"label":"June 13", "value":138613},
    {"label":"June 14", "value":143478},
    {"label":"June 15", "value":151220},
    {"label":"June 16", "value":144100},
    {"label":"June 17", "value":137351},
    {"label":"June 18", "value":134479},
    {"label":"June 19", "value":85173},
];

var berkeley_max = 200000;
var berkeley_min = 0;
var berkeley_diff = berkeley_max-berkeley_min;

var berkeley_rects = berkeley_vis.selectAll("rect")
    .data(berkeley_data)
    .enter()
        .append("rect")
            .attr('id',function(d,i){
                return 'berkeley_rect_'+i;
            })
            .attr('width',function(){
                return (berkeley_w/berkeley_data.length)/2;
            })
            .attr('height',0)
            .attr('x',function(d,i){
                return ((berkeley_w/berkeley_data.length)*i)+((berkeley_w/berkeley_data.length)/4);
            })
            .attr('y',berkeley_h)
            .attr("fill", 'rgb(165,149,220)')
            .on('mouseover',function(d,i){
                var data = d;
                var place = i;
                openBerkeleyBar(data,place);
            })
            .on('mouseout',function(d,i){
                var place = i;
                closeBerkeleyBar(place);
            });

berkeley_vis.selectAll('.berkeley_date_label')
    .data(berkeley_data)
    .enter()
    .append('text')
    .attr("text-anchor", "left")
    .text(function(d,i){
        //return Math.floor(d.value/1000)+'';
        return d.label;
    })
    .attr('transform',function(d,i){
        var tempX = ((berkeley_w/berkeley_data.length)*i)+((berkeley_w/berkeley_data.length)/2);
        var tempY = berkeley_h-10;
        return 'translate('+tempX+','+tempY+') rotate(-90)'
    })
    .attr('x',-5)
    .attr('y',4)
    .attr('fill','rgb(135,119,190)')
    .attr('opacity',0)
    .attr('font-size','14px')
    .attr('class','berkeley_date_label')
    .attr('id',function(d,i){
        return 'berkeley_date'+i;
    })
    .attr('font-family','Helvetica')
    .on('mouseover',function(d,i){
        var data = d;
        var place = i;
        openBerkeleyBar(data,place);
    })
    .on('mouseout',function(d,i){
        var place = i;
        closeBerkeleyBar(place);
    });

berkeley_vis.selectAll('.berkeley_value_graph')
    .data(berkeley_data)
    .enter()
    .append('text')
    .attr("text-anchor", "middle")
    .text(function(d,i){
        return Math.floor(d.value/1000)+'k';
    })
    .attr('x',function(d,i){
        return ((berkeley_w/berkeley_data.length)*i)+((berkeley_w/berkeley_data.length)/4)+5;
    })
    .attr('y',function(d,i){
        var scaled = (d.value-berkeley_min)/berkeley_diff*1;
        return berkeley_h-(scaled*berkeley_h)-3;
    })
    .attr('fill','rgb(165,149,220)')
    .attr('opacity',0)
    .attr('font-size','14px')
    .attr('class','berkeley_value_graph')
    .attr('id',function(d,i){
        return 'berkeley_value'+i
    })
    .attr('font-family','Helvetica');

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function openBerkeleyBar(data,place){
    d3.select('#berkeley_rect_'+place)
         .attr('height',function(d){
            var scaled = (d.value-berkeley_min)/berkeley_diff*1;
            return scaled*berkeley_h;
        })
        .attr('y',function(d,i){
            var scaled = (d.value-berkeley_min)/berkeley_diff*1;
            return berkeley_h-(scaled*berkeley_h);
        })
        .transition()
        .ease('bounce')
        .duration(100)
        .attr('fill','rgb(200,184,255)')
        .attr('width',function(){
            return (berkeley_w/berkeley_data.length)*1.1;
        })
        .attr('x',function(d,i){
            return ((berkeley_w/berkeley_data.length)*place)-((berkeley_w/berkeley_data.length)*.066);
        });
    d3.select('#berkeley_date'+place)
        .transition()
        .duration(100)
        .attr('opacity',1);

    d3.select('#berkeley_value'+place)
        .transition()
        .duration(100)
        .attr('opacity',1);
}

function closeBerkeleyBar(place){
    d3.select('#berkeley_rect_'+place)
        .transition()
        .duration(1000)
        .ease('bounce')
        .attr('fill','rgb(165,149,220)')
        .attr('width',function(){
            return (berkeley_w/berkeley_data.length)/2;
        })
        .attr('x',function(d,i){
            return ((berkeley_w/berkeley_data.length)*place)+((berkeley_w/berkeley_data.length)/4);
        });
    d3.select('#berkeley_date'+place)
        .transition()
        .duration(100)
        .attr('opacity',0);
    d3.select('#berkeley_value'+place)
        .transition()
        .duration(100)
        .attr('opacity',0);
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////