////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
function Bucket(e,t){this.el=e;this.title=this.el.getElementsByClassName("title")[0].children[0].innerHTML;this.index=t;this.totalGrown=0;this.totalShrunk=0;this.makeNavLink();this.makeContentBoxes()}Bucket.prototype.makeContentBoxes=function(){this.contentBoxes=[];this.titleBox;var e=this.el.children;for(var t=0;t<e.length;t++){var n=new ContentBox(e[t]);n.type.name==="title"?this.titleBox=n:this.contentBoxes.push(n)}};Bucket.prototype.makeNavLink=function(){this.navLink=document.createElement("span");this.navLink.className="navLink";this.navLink.id="nav_"+this.index;this.navLink.innerHTML=this.title;var e=this.index;this.navLink.onclick=function(){changeNavigation(e)};this.navLink.ontouchstart=function(){changeNavigation(e)};document.getElementById("navigation").appendChild(this.navLink)};Bucket.prototype.updateTitleBox=function(){var e=this.titleBox.growing,t=this.titleBox.shrinking;if(e||t){this.titleBox.updateSize();if(e&&this.titleBox.growing)for(var n=0;n<this.contentBoxes.length;n++){this.contentBoxes[n].changePosition();this.contentBoxes[n].shrinking=!1;this.contentBoxes[n].growing=!0;addPackets=!0}else t!=this.titleBox.shrinking}};Bucket.prototype.updateContentBoxes=function(){for(var e=0;e<this.contentBoxes.length;e++){var t=this.contentBoxes[e].growing,n=this.contentBoxes[e].shrinking;if(t||n){this.contentBoxes[e].updateSize();if(t!=this.contentBoxes[e].growing){this.totalGrown++;if(this.totalGrown===this.contentBoxes.length){this.totalGrown=0;addPackets=!1}}else if(n!=this.contentBoxes[e].shrinking){this.totalShrunk++;if(this.totalShrunk===this.contentBoxes.length){this.totalShrunk=0;var r=buckets[currentNavigation];r.titleBox.changePosition();r.titleBox.shrinking=!1;r.titleBox.growing=!0}}}}};Bucket.prototype.select=function(e){this.navLink.className+=" navSelected";if(e){this.titleBox.changePosition();this.titleBox.shrinking=!1;this.titleBox.growing=!0}};Bucket.prototype.deselect=function(){this.navLink.className="navLink";this.titleBox.hideKids();this.titleBox.shrinking=!0;this.titleBox.growing=!1;for(var e=0;e<this.contentBoxes.length;e++){this.contentBoxes[e].hideKids();this.contentBoxes[e].shrinking=!0;this.contentBoxes[e].growing=!1}};