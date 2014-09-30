(function(){
	function addEvent (ele,event,fn) {
			if(ele.addEventListener){
				ele.addEventListener(event,fn,false);
			}else if (ele.attachEvent) {
				ele.attachEvent('on'+event,fn);
			}else{
				ele["on"+event]=fn;
			}
		}

	if (Mtime.browser.ie && Mtime.browser.ie < 9) {
		var oCanvas=document.getElementById("canvas");
		var oImgHack=document.getElementById("imgHack");
		oCanvas.style.display="none";
		oImgHack.style.display="block";
		addEvent(oImgHack,"click",function(){
			oImgHack.style.display="none";
		});
	}else{
		var canvas=document.getElementById('canvas');
		var img=new Image();
		img.src="images/gua.png";

		addEvent(img,"load", function() {
			var w=img.width;
			var h=img.height;
			canvas.width = w;
			canvas.height = h;
		    
			var ctx=canvas.getContext("2d");
			ctx.drawImage(img,0,0);
			ctx.globalCompositeOperation="destination-out";

			addEvent(canvas,"mousedown",mouseDown);
			addEvent(canvas,"mouseup",mouseUp);
			addEvent(canvas,"touchstart",mouseDown);
			addEvent(canvas,"touchend",mouseUp);

			function mouseDown(e){
				var ev=e||window.event;
				mouseMove(ev);
				canvas.onmousemove=mouseMove;
				canvas.addEventListener('touchmove', mouseMove);
			}

			function mouseMove(e){
				var ev=e||window.event;
				ev.preventDefault();
				if (ev.changedTouches){
				    // 取得涉及当前事件中众多手指中的最后一个。
				    ev = ev.changedTouches[ev.changedTouches.length - 1];
				}
				if (ev.pageX || ev.pageY) {
					var x=ev.pageX-canvas.offsetLeft,
						y=ev.pageY-canvas.offsetTop;
				} else{
					var x = (ev.clientX + document.body.scrollLeft || ev.pageX) - canvas.offsetLeft || 0,
					    y = (ev.clientY + document.body.scrollTop || ev.pageY) - canvas.offsetTop || 0;	
				};
				ctx.beginPath();
				ctx.arc(x,y,20,0,Math.PI*2);
				ctx.fill();
			}		

			function mouseUp(e){
				var ev=e||window.event;
				// addEvent(canvas,"mousemove",null);
				canvas.onmousemove=null;
				canvas.ontouchmove=null;
				checkClear();
			}

			function checkClear(){
				var data=ctx.getImageData(0,0,w,h).data;
				for (var i = 0,j=0,l=data.length; i < l; i+=4) {
					if(data[i]&&data[i+1]&&data[i+2]&&data[i+3]){
						j++;
					}
				};
				if (j<w*h*0.6) {
					ctx.clearRect(0,0,w,h);
				};
			}
		});
	};
})();
	