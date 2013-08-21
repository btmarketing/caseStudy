////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var bonesDisplay = false;

setInterval(function(){
    if(document.getElementById('bonesGraph').offsetWidth){
        if(!bonesDisplay){
            bonesDisplay=true;
            startBones();
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
        .attr("d", bones_arcStart);

d3.select('#bonesSVG').selectAll('text.bones_label')
    .data(bones_data)
    .enter(0)
        .append('svg:text')
        .attr('class','bones_label')
        .attr('fill','white')
        .attr('opacity',1)
        .attr("text-anchor", "end")
        .attr('font-size','13px')
        .attr('font-family','Helvetica')
        .attr('y',function(d){
            if(d.value===36){
                return 15;
            }
            else{
                return 40;
            }
        })
        .attr('x',function(){
            return bones_w-30;
        })
        .text(function(d, i) {return bones_data[i].label; });

d3.select('#bonesSVG').selectAll('rect.bones_rectLabel')
    .data(bones_data)
    .enter()
        .append('rect')
        .attr('class','bones_rectLabel')
        .attr('fill',function(d){
            return d.color;
        })
        .attr('x',function(){
            return bones_w-30+7;
        })
        .attr('y',function(d){
            if(d.value===36){
                return 15-14;
            }
            else{
                return 40-14;
            }
        })
        .attr('width',20)
        .attr('height',20)

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
                return bones_h*.2;
            }
            else{
                return bones_h*.8;
            }
        })
        .attr('cx',50);

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
                return bones_h*.2;
            }
            else{
                return bones_h*.8;
            }
        })
        .attr('cx',50);

d3.select('#bonesSVG').selectAll('text.bones_percentage')
    .data(bones_data)
    .enter()
        .append('text')
        .attr('class','bones_percentage')
        .attr('fill','white')
        .attr('text-anchor','middle')
        .attr('font-size',13)
        .attr('opacity',0)
        .attr('x',50)
        .attr('y',function(d){
            if(d.label==='BitTorrent'){
                return bones_h*.2+5;
            }
            else{
                return bones_h*.8+5;
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
        .attr('x1',70)
        .attr('x2',function(d){
            if(d.label==='BitTorrent'){
                return bones_w/3;
            }
            else{
                return bones_w*.5;
            }
        })
        .attr('y1',function(d){
            if(d.label==='BitTorrent'){
                return bones_h*.2;
            }
            else{
                return bones_h*.8;
            }
        })
        .attr('y2',function(d){
            if(d.label==='BitTorrent'){
                return bones_h*.2;
            }
            else{
                return bones_h*.8;
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
                return bones_w/3;
            }
            else{
                return bones_w*.5;
            }
        })
        .attr('x2',function(d){
            if(d.label==='BitTorrent'){
                return bones_w*.4;
            }
            else{
                return bones_w*.6;
            }
        })
        .attr('y1',function(d){
            if(d.label==='BitTorrent'){
                return bones_h*.2;
            }
            else{
                return bones_h*.8;
            }
        })
        .attr('y2',function(d){
            if(d.label==='BitTorrent'){
                return bones_h*.4;
            }
            else{
                return bones_h*.6;
            }
        });

d3.select('#bonesSVG').append('rect')
    .attr('id','bones_overlay')
    .attr('opacity',0)
    .attr('x',0)
    .attr('y',0)
    .attr('width',bones_w)
    .attr('height',bones_h)
    .on('mouseover',bones_mouseover)
    .on('mouseout',bones_mouseout)

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

function bones_mouseover(){
    bones_mouseOn = true;
    bones_cancelAllTransitions('path');
    bones_vis.selectAll('g.bt').select("path")
        .transition()
        .duration(300)
        .attr("d", bones_arcBig);
    bones_vis.selectAll('g.other').select("path")
        .transition()
        .duration(300)
        .attr("d", bones_arcSmall);

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
                    .attr('x2',70)
                    .transition()
                    .duration(200)
                    .ease('linear')
                    .attr('x2',function(d){
                        if(d.label==='BitTorrent'){
                            return bones_w/3;
                        }
                        else{
                            return bones_w*.5;
                        }
                    })
                    .each('end',function(){
                        if(bones_mouseOn){
                            d3.selectAll('.bones_lineTwo')
                                .attr('opacity',.7)
                                .attr('x2',function(d){
                                    if(d.label==='BitTorrent'){
                                        return bones_w/3;
                                    }
                                    else{
                                        return bones_w*.5;
                                    }
                                })
                                .attr('y2',function(d){
                                    if(d.label==='BitTorrent'){
                                        return bones_h*.2;
                                    }
                                    else{
                                        return bones_h*.8;
                                    }
                                })
                                .transition()
                                .duration(200)
                                .ease('linear')
                                .attr('x2',function(d){
                                    if(d.label==='BitTorrent'){
                                        return bones_w*.4;
                                    }
                                    else{
                                        return bones_w*.6;
                                    }
                                })
                                .attr('y2',function(d){
                                    if(d.label==='BitTorrent'){
                                        return bones_h*.4;
                                    }
                                    else{
                                        return bones_h*.6;
                                    }
                                });
                        }
                    });
            }
        });
}

function bones_mouseout(){
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
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////