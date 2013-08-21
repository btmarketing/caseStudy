////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
function initCaseStudy(e){resized();makeCheckerBoard();splitImage(e);createBuckets();loadCoverPhotos(0)}function splitImage(e,t){var n=e.width/xDim,r=e.height/yDim;for(var i=0;i<checkers.length;i++){var s=i;t&&(s=checkers[i].index);var o=s%xDim,u=Math.floor(s/xDim),a=o*n,f=u*r;checkers[i].full&&checkers[i].context.drawImage(e,a,f,n,r,0,0,unitSize,unitSize)}}function loadCoverPhotos(e){var t=document.createElement("img");t.src="img/coverPhotos/"+e+".png";t.onload=function(){coverPhotos.push(t);var n=e+1;n<buckets.length?loadCoverPhotos(n):masterLoop()}}function createBuckets(){var e=document.getElementById("content").children;for(var t=0;t<e.length;t++)if(e[t].className==="bucket"){var n=!1;t===e.length-1&&(n=!0);var r=new Bucket(e[t],t,n);buckets.push(r)}}function prev(){var e=currentNavigation-1;e<0&&(e=buckets.length-1);changeNavigation(e)}function next(){var e=currentNavigation+1;e>=buckets.length&&(e=0);changeNavigation(e)}function masterLoop(){resizeTest();updateCheckers();updateBuckets();requestAnimFrame(masterLoop)}function changeNavigation(e){if(currentNavigation!==e){document.getElementById("checkerBoard").style.display="inline";currentCoords=(currentCoords+1)%coordinates.length;if(buckets[currentNavigation])buckets[currentNavigation].deselect();else{makeTargetCheckerLayout();shrinkCheckers()}currentNavigation=e;splitImage(coverPhotos[currentNavigation],!0);buckets[currentNavigation].select()}}function resizeTest(){var e=document.getElementById("main").offsetLeft,t=document.getElementById("main").offsetTop;(center.oldLeft!==e||center.oldTop!==t)&&resized()}function resized(){var e=20,t=document.getElementById("main").offsetLeft,n=document.getElementById("main").offsetTop,r=t+unitSize*xDim,i=n+unitSize*yDim;center={l:t+e,t:n+e,b:i-e,r:r-e,oldLeft:t,oldTop:n};updateAllCheckerPositions();buckets[currentNavigation]&&buckets[currentNavigation].updateContentBoxPositions()}var coverPhotos=[],buckets=[],currentNavigation=-1,currentCoords=0,gutter=2,unitSize=100,center;window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}();