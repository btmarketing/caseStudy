
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

var bones_w = 100*4-10;
var bones_h = 100*2-10;
var bones_r = 80;
var color = d3.scale.category20c();

var vas = d3.select("#bonesGraph")
    .append("svg:svg")
    .attr('id','bonesSVG');

var bones_data = [{"label":"Other", "value":64}, 
            {"label":"BitTorrent", "value":36}];
    
var bones_vis = d3.select("svg")
    .data([bones_data])                  
        .attr("width", bones_w)          
        .attr("height", bones_h)
    .append("svg:g")       
        .attr("transform", "translate(" + bones_w/2 + "," + bones_h/2 + ")")

var bones_arc = d3.svg.arc()
    .outerRadius(bones_r);

var bones_arcBig = d3.svg.arc()
    .outerRadius(bones_r + 10);

var bones_arcSmall = d3.svg.arc()
    .outerRadius(bones_r - 20);

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
            })
            .on('mouseover',function(){
                bones_vis.selectAll('g.bt').select("path")
                    .transition()
                    .duration(300)
                    .attr("d", bones_arcBig);
                bones_vis.selectAll('g.other').select("path")
                    .transition()
                    .duration(300)
                    .attr("d", bones_arcSmall);
                bones_vis.selectAll('text')
                    .transition()
                    .duration(400)
                    .attr('opacity',1);
            })
            .on('mouseout',function(){
                bones_vis.selectAll('g.bt').select("path")
                    .transition()
                    .duration(200)
                    .attr("d", bones_arc);
                bones_vis.selectAll('g.other').select("path")
                    .transition()
                    .duration(200)
                    .attr("d", bones_arc);
                bones_vis.selectAll('text')
                    .transition()
                    .duration(200)
                    .attr('opacity',0);
            });

bones_arcs.append("svg:path")
        .attr("fill", function(d, i) { return color(i+2); } )
        .attr("d", bones_arcStart);

bones_arcs.append("svg:text")
    .attr("transform", function(d) {
        d.innerRadius = 0;
        d.outerRadius = bones_r;
        return "translate(" + bones_arc.centroid(d) + ")";
    })
    .attr('fill','white')
    .attr('opacity',0)
    .attr("text-anchor", "middle")
    .attr('fontSize','12px')
    .attr('font-family','Helvetica')
    .text(function(d, i) {return bones_data[i].label; });

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
