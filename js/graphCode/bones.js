////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var bonesDisplay = false;

setInterval(function(){
    if(document.getElementById('bonesGraph').offsetWidth){
        if(!bonesDisplay){
            bonesDisplay=true;
            setTimeout(startBones,500);
        }
    }
    else if (bonesDisplay){
        bonesDisplay=false;
        endBones();
    }
},500);

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function startBones(){
    bones_vis.selectAll('path')
        .transition()
        .duration(1000)
        .attr('d',bones_arc);
}

function endBones(){
    bones_vis.selectAll('path')
        .attr("d", bones_arcStart);

    bones_vis.selectAll('text')
        .attr('opacity',0);
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var bones_w = unitSize*4-gutter*2-40;
var bones_h = unitSize*2-gutter*2-40;
var bones_r = 65;
var color = d3.scale.category20c();

var vas = d3.select("#bonesGraph")
    .append("svg:svg")
    .attr('id','bonesSVG');

var bonesSVG = document.getElementById('bonesGraph');
bonesSVG.style.position = 'absolute';
bonesSVG.style.left = '20px';
bonesSVG.style.top = '20px';

var bones_data = [
    {
        "label":"Other",
        "value":64,
        'color':'rgb(125,109,180)'
    }, 
    {
        "label":"BitTorrent",
        "value":36,
        'color':'rgb(145,129,200)'
    }
];
    
var bones_vis = d3.select("#bonesSVG")
    .data([bones_data])                  
        .attr("width", bones_w)          
        .attr("height", bones_h)
    .append("g")       
        .attr("transform", "translate(" + bones_w/2 + "," + bones_h/2 + ")");

var bones_arc = d3.svg.arc()
    .outerRadius(bones_r);

var bones_arcBig = d3.svg.arc()
    .outerRadius(bones_r + 5);

var bones_arcSmall = d3.svg.arc()
    .outerRadius(bones_r - 2);

var bones_arcStart = d3.svg.arc()
    .outerRadius(bones_r - bones_r);

var bones_pie = d3.layout.pie()
    .value(function(d){
        return d.value;
    });

var bones_bt_line = [
    [50,bones_h*.2],
    [bones_w*.25,bones_h*.2],
    [bones_w*.4,bones_h*.4]
];

var bones_other_line = [
    [bones_w-50,bones_h*.2],
    [bones_w*.8,bones_h*.2],
    [bones_w*.55,bones_h*.6]
];

var bones_arcs = bones_vis.selectAll("g.slice")
    .data(bones_pie)
    .enter()
        .append("svg:g")
            .attr("class", function(d){
                if(d.value<50){
                    return 'slice bt';
                }
                else{
                    return 'slice other';
                }
            });

bones_arcs.append("svg:path")
        .attr("fill", function(d){
            return d.data.color;
        })
        .attr("d", bones_arc)
        .on('mouseover',function(d){
            d3.select(this)
                .transition()
                .duration(200)
                .attr('d',bones_arcBig);
            d3.select('#bones_text_'+d.data.label)
                .transition()
                .duration(300)
                .attr('opacity',1);
        })
        .on('mouseout',function(d){
            d3.select(this)
                .transition()
                .duration(200)
                .attr('d',bones_arc);
            d3.select('#bones_text_'+d.data.label)
                .transition()
                .duration(300)
                .attr('opacity',0);
        });

d3.select('#bonesSVG').selectAll('text.bones_label')
    .data(bones_data)
    .enter(0)
        .append('svg:text')
        .attr('class','bones_label')
        .attr('id',function(d){
            return 'bones_text_'+d.label;
        })
        .attr('fill','white')
        .attr('opacity',0)
        .attr("text-anchor",function(d){
            if(d.label==='BitTorrent'){
                return 'start';
            }
            else{
                return 'end';
            }
        })
        .attr('font-size','13px')
        .attr('y',function(){
            return bones_h-1;
        })
        .attr('x',function(d){
            if(d.label==='BitTorrent'){
                return 0;
            }
            else{
                return bones_w;
            }
        })
        .text(function(d, i) {return bones_data[i].label; });

d3.select('#bonesSVG').selectAll('circle.bones_circleOuter')
    .data(bones_data)
    .enter()
        .append('circle')
        .attr('class','bones_circleOuter')
        .attr('fill','white')
        .attr('opacity',.1)
        .attr('r',0)
        .attr('cy',function(d){
            if(d.label==='BitTorrent'){
                return bones_bt_line[0][1];
            }
            else{
                return bones_other_line[0][1];
            }
        })
        .attr('cx',function(d){
            if(d.label==='BitTorrent'){
                return bones_bt_line[0][0]-20;
            }
            else{
                return bones_other_line[0][0]+20;
            }
        });

d3.select('#bonesSVG').selectAll('circle.bones_circleInner')
    .data(bones_data)
    .enter()
        .append('circle')
        .attr('class','bones_circleInner')
        .attr('fill','white')
        .attr('opacity',.1)
        .attr('r',0)
        .attr('cy',function(d){
            if(d.label==='BitTorrent'){
                return bones_bt_line[0][1];
            }
            else{
                return bones_other_line[0][1];
            }
        })
        .attr('cx',function(d){
            if(d.label==='BitTorrent'){
                return bones_bt_line[0][0]-20;
            }
            else{
                return bones_other_line[0][0]+20;
            }
        });

d3.select('#bonesSVG').selectAll('text.bones_percentage')
    .data(bones_data)
    .enter()
        .append('text')
        .attr('class','bones_percentage')
        .attr('fill','white')
        .attr('text-anchor','middle')
        .attr('font-size',13)
        .attr('opacity',0)
        .attr('x',function(d){
            if(d.label==='BitTorrent'){
                return bones_bt_line[0][0]-20;
            }
            else{
                return bones_other_line[0][0]+20;
            }
        })
        .attr('y',function(d){
            if(d.label==='BitTorrent'){
                return bones_bt_line[0][1]+4;
            }
            else{
                return bones_other_line[0][1]+4;
            }
        })
        .text(function(d){
            return d.value+'%';
        });

d3.select('#bonesSVG').selectAll('line.bones_lineOne')
    .data(bones_data)
    .enter()
        .append('line')
        .attr('class','bones_lineOne')
        .attr('stroke','white')
        .attr('opacity',0)
        .attr('stroke-width',2)
        .attr('x1',function(d){
            if(d.label==='BitTorrent'){
                return bones_bt_line[0][0];
            }
            else{
                return bones_other_line[0][0];
            }
        })
        .attr('x2',function(d){
            if(d.label==='BitTorrent'){
                return bones_bt_line[0][0];
            }
            else{
                return bones_other_line[0][0];
            }
        })
        .attr('y1',function(d){
            if(d.label==='BitTorrent'){
                return bones_bt_line[0][1];
            }
            else{
                return bones_other_line[0][1];
            }
        })
        .attr('y2',function(d){
            if(d.label==='BitTorrent'){
                return bones_bt_line[0][1];
            }
            else{
                return bones_other_line[0][1];
            }
        });

d3.select('#bonesSVG').selectAll('line.bones_lineTwo')
    .data(bones_data)
    .enter()
        .append('line')
        .attr('class','bones_lineTwo')
        .attr('stroke','white')
        .attr('opacity',0)
        .attr('stroke-width',2)
        .attr('x1',function(d){
            if(d.label==='BitTorrent'){
                return bones_bt_line[1][0];
            }
            else{
                return bones_other_line[1][0];
            }
        })
        .attr('x2',function(d){
            if(d.label==='BitTorrent'){
                return bones_bt_line[2][0];
            }
            else{
                return bones_other_line[2][0];
            }
        })
        .attr('y1',function(d){
            if(d.label==='BitTorrent'){
                return bones_bt_line[1][1];
            }
            else{
                return bones_other_line[1][1];
            }
        })
        .attr('y2',function(d){
            if(d.label==='BitTorrent'){
                return bones_bt_line[2][1];
            }
            else{
                return bones_other_line[2][1];
            }
        });

d3.select('#bonesSVG').selectAll('circle.bones_lineCircle')
    .data(bones_data)
    .enter()
        .append('circle')
        .attr('class','bones_lineCircle')
        .attr('fill','white')
        .attr('cx',function(d){
            if(d.label==='BitTorrent'){
                return bones_bt_line[2][0];
            }
            else{
                return bones_other_line[2][0];
            }
        })
        .attr('cy',function(d){
            if(d.label==='BitTorrent'){
                return bones_bt_line[2][1];
            }
            else{
                return bones_other_line[2][1];
            }
        })
        .attr('r',0);

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function bones_cancelAllTransitions(type){
    bones_vis.selectAll(type)
        .each(function() {
            var lock = this.__transition__;
            if (lock) lock.active = 0;
        });
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var bones_mouseOn = false;

function startBones(){
    bones_mouseOn = true;

    bones_cancelAllTransitions('circle');
    bones_cancelAllTransitions('line');
    d3.selectAll('.bones_circleOuter')
        .transition()
        .duration(200)
        .attr('r',30);
    d3.selectAll('.bones_circleInner')
        .transition()
        .duration(300)
        .attr('r',20)
        .each('end',function(){
            if(bones_mouseOn){
                d3.select('#bonesSVG').selectAll('text.bones_percentage')
                    .transition()
                    .duration(200)
                    .attr('opacity',1);

                d3.selectAll('.bones_lineOne')
                    .attr('opacity',.7)
                    .attr('x2',function(d){
                        if(d.label==='BitTorrent'){
                            return bones_bt_line[0][0];
                        }
                        else{
                            return bones_other_line[0][0];
                        }
                    })
                    .attr('y2',function(d){
                        if(d.label==='BitTorrent'){
                            return bones_bt_line[0][1];
                        }
                        else{
                            return bones_other_line[0][1];
                        }
                    })
                    .transition()
                    .duration(200)
                    .ease('linear')
                    .attr('x2',function(d){
                        if(d.label==='BitTorrent'){
                            return bones_bt_line[1][0];
                        }
                        else{
                            return bones_other_line[1][0];
                        }
                    })
                    .each('end',function(){
                        if(bones_mouseOn){
                            d3.selectAll('.bones_lineTwo')
                                .attr('opacity',.7)
                                .attr('x2',function(d){
                                    if(d.label==='BitTorrent'){
                                        return bones_bt_line[1][0];
                                    }
                                    else{
                                        return bones_other_line[1][0];
                                    }
                                })
                                .attr('y2',function(d){
                                    if(d.label==='BitTorrent'){
                                        return bones_bt_line[1][1];
                                    }
                                    else{
                                        return bones_other_line[1][1];
                                    }
                                })
                                .transition()
                                .duration(200)
                                .ease('linear')
                                .attr('x2',function(d){
                                    if(d.label==='BitTorrent'){
                                        return bones_bt_line[2][0];
                                    }
                                    else{
                                        return bones_other_line[2][0];
                                    }
                                })
                                .attr('y2',function(d){
                                    if(d.label==='BitTorrent'){
                                        return bones_bt_line[2][1];
                                    }
                                    else{
                                        return bones_other_line[2][1];
                                    }
                                })
                                .each('end',function(){
                                    if(bones_mouseOn){
                                        d3.selectAll('.bones_lineCircle')
                                            .transition()
                                            .duration(100)
                                            .attr('r',2);
                                    }
                                });
                        }
                    });
            }
        });
}

function endBones(){
    bones_mouseOn = false;
    bones_cancelAllTransitions('path');
    bones_vis.selectAll('g.bt').select("path")
        .transition()
        .duration(200)
        .attr("d", bones_arc);
    bones_vis.selectAll('g.other').select("path")
        .transition()
        .duration(200)
        .attr("d", bones_arc);

    bones_cancelAllTransitions('circle');
    d3.selectAll('.bones_circleInner')
        .transition()
        .duration(100)
        .attr('r',0);
    d3.selectAll('.bones_circleOuter')
        .transition()
        .duration(200)
        .attr('r',0);

    bones_cancelAllTransitions('line');
    d3.selectAll('.bones_lineOne')
        .attr('opacity',0);
    d3.selectAll('.bones_lineTwo')
        .attr('opacity',0);

    bones_cancelAllTransitions('text');
    d3.select('#bonesSVG').selectAll('text.bones_percentage')
        .transition()
        .duration(100)
        .attr('opacity',0);
    d3.selectAll('.bones_lineCircle')
        .attr('r',0);
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////