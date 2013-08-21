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
            berkeley_vis.selectAll('path')
                .transition()
                .duration(function(d,i){
                    return (100*i)+300;
                })
                .attr('d', function(d,i) { 
                    return berkeley_triangle(d,i,berkeley_smallScale);
                });
        }


        function endBerkeley(){
            berkeley_vis.selectAll('path')
                .attr('d', function(d,i) { 
                    return berkeley_triangle(d,i,0);
                });
        }

        ////////////////////////////////////////////////
        ////////////////////////////////////////////////
        ////////////////////////////////////////////////

        var berkeley_w = unitSize*4-gutter*2;
        var berkeley_h = unitSize*2-gutter*2;
        var berkeley_r = 80;

        var berkeley_vis = d3.select("#berkeleyGraph")
            .append("svg:svg")
            .attr('id','berkeleySVG')
            .attr("width", berkeley_w)
            .attr("height", berkeley_h);


        var berkSVG = document.getElementById('berkeleyGraph');
        berkSVG.style.position = 'absolute';
        berkSVG.style.left = '0px';
        berkSVG.style.top = '0px';

        var berkeley_data = [
            {"label":"6.6", "value":69612},
            {"label":"6.7", "value":143726},
            {"label":"6.8", "value":157271},
            {"label":"6.9", "value":149027},
            {"label":"6.10", "value":138174},
            {"label":"6.11", "value":135456},
            {"label":"6.12", "value":139275},
            {"label":"6.13", "value":138613},
            {"label":"6.14", "value":143478},
            {"label":"6.15", "value":151220},
            {"label":"6.16", "value":144100},
            {"label":"6.17", "value":137351},
            {"label":"6.18", "value":134479},
            {"label":"6.19", "value":85173},
        ];

        ////////////////////////////////////////////////
        ////////////////////////////////////////////////
        ////////////////////////////////////////////////

        var berkeley_max = 200000;
        var berkeley_min = 0;
        var berkeley_diff = berkeley_max-berkeley_min;
        var berkeley_smallScale = .5;

        var berkeley_dateHeight = 20;

        function berkeley_triangle(d,i,scale){
            var x = berkeley_xScale(i);
            var y = berkeley_h-berkeley_dateHeight;
            var w = (berkeley_w/berkeley_data.length)*1.5;
            var scaled = (d.value-berkeley_min)/berkeley_diff*1;
            var h = scaled*(berkeley_h-berkeley_dateHeight)*scale;
            var result = 'M ' + Math.floor(x-(w/2)) +' '+ y + ' l '+w+' 0 l '+-w/2+' '+-h+' z';
            return result;
        }

        function berkeley_xScale(index){
            return (((berkeley_w-40)/berkeley_data.length)*index)+((berkeley_w/berkeley_data.length)/4)+26;
        }

        ////////////////////////////////////////////////
        ////////////////////////////////////////////////
        ////////////////////////////////////////////////

        var berkeley_paths = berkeley_vis.selectAll("path")
            .data(berkeley_data)
            .enter()
                .append("path")
                    .attr('d', function(d,i) { 
                        return berkeley_triangle(d,i,0);
                    })
                    .attr('id',function(d,i){
                        return 'berkeley_path_'+i;
                    })
                    .attr("fill", 'rgb(115,99,170)')
                    .attr('opacity',.6)
                    .on('mouseover',function(d,i){
                        var data = d;
                        var place = i;
                        openBerkeleyBar(data,place);
                    })
                    .on('mouseout',function(d,i){
                        var place = i;
                        closeBerkeleyBar(place);
                    });

        berkeley_vis.selectAll('circle.berkeley_inner')
            .data(berkeley_data)
            .enter()
                .append('circle')
                .attr('class','berkeley_inner')
                .attr('id',function(d,i){
                    return'berkeley_inner_'+i;
                })
                .attr('fill','white')
                .attr('opacity',.2)
                .attr('cx', function(d,i){
                    return berkeley_xScale(i);
                })
                .attr('cy',function(d,i){
                    var scaled = (d.value-berkeley_min)/berkeley_diff*1;
                    return berkeley_h-berkeley_dateHeight-(scaled*(berkeley_h-berkeley_dateHeight))-3;
                })
                .attr('r',0);

        berkeley_vis.selectAll('circle.berkeley_outer')
            .data(berkeley_data)
            .enter()
                .append('circle')
                .attr('class','berkeley_outer')
                .attr('id',function(d,i){
                    return'berkeley_outer_'+i;
                })
                .attr('fill','white')
                .attr('opacity',.1)
                .attr('cx', function(d,i){
                    return berkeley_xScale(i);
                })
                .attr('cy',function(d,i){
                    var scaled = (d.value-berkeley_min)/berkeley_diff*1;
                    return berkeley_h-berkeley_dateHeight-(scaled*(berkeley_h-berkeley_dateHeight))-3;
                })
                .attr('r',0);

        berkeley_vis.selectAll('text.berkeley_value_graph')
            .data(berkeley_data)
            .enter()
            .append('text')
            .attr("text-anchor", "middle")
            .text(function(d,i){
                return Math.floor(d.value/1000)+'k';
            })
            .attr('x',function(d,i){
                return berkeley_xScale(i);
            })
            .attr('y',function(d,i){
                var scaled = (d.value-berkeley_min)/berkeley_diff*1;
                return berkeley_h-berkeley_dateHeight-(scaled*(berkeley_h-berkeley_dateHeight))+1;
            })
            .attr('fill','white')
            .attr('opacity',0)
            .attr('font-size','13px')
            .attr('class','berkeley_value_graph')
            .attr('id',function(d,i){
                return 'berkeley_value'+i
            })
            .attr('font-family','Helvetica');

        berkeley_vis.selectAll('text.berkeley_date')
            .data(berkeley_data)
            .enter()
                .append('text')
                .attr('class','berkeley_date')
                .attr('id',function(d,i){
                    return 'berkeley_date_'+i;
                })
                .attr('fill','rgb(140,120,220)')
                .attr('font-size',10)
                .attr('text-anchor','middle')
                .attr('x',function(d,i){
                    return berkeley_xScale(i);
                })
                .attr('y',function(){
                    return berkeley_h-(berkeley_dateHeight/2);
                })
                .text(function(d){
                    return d.label;
                });

        ////////////////////////////////////////////////
        ////////////////////////////////////////////////
        ////////////////////////////////////////////////

        function openBerkeleyBar(data,place){
            d3.select('#berkeley_path_'+place)
                .transition()
                .ease('bounce')
                .duration(100)
                .attr('opacity',1)
                .attr('d', function(d,i) { 
                    return berkeley_triangle(d,place,1);
                });

            d3.select('#berkeley_inner_'+place)
                .transition()
                .duration(200)
                .attr('r',18);
            d3.select('#berkeley_outer_'+place)
                .transition()
                .duration(300)
                .attr('r',25);
            d3.select('#berkeley_value'+place)
                .transition()
                .duration(500)
                .attr('opacity',1);
            d3.select('#berkeley_date_'+place)
                .transition()
                .duration(200)
                .attr('fill','white');
        }

        function closeBerkeleyBar(place){
            d3.select('#berkeley_path_'+place)
                .transition()
                .duration(1000)
                .ease('bounce')
                .attr('opacity',.6)
                .attr('d', function(d,i) { 
                    return berkeley_triangle(d,place,berkeley_smallScale);
                });
            d3.select('#berkeley_value'+place)
                .transition()
                .duration(100)
                .attr('opacity',0);
            d3.select('#berkeley_inner_'+place)
                .transition()
                .duration(200)
                .attr('r',0);
            d3.select('#berkeley_outer_'+place)
                .transition()
                .duration(100)
                .attr('r',0);
            d3.select('#berkeley_date_'+place)
                .transition()
                .duration(200)
                .attr('fill','rgb(140,120,220)');
        }

        ////////////////////////////////////////////////
        ////////////////////////////////////////////////
        ////////////////////////////////////////////////