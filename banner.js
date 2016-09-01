function Banner(option){
	var container = document.createDocumentFragment(),
		indicator = document.createElement("div"),
		element = option.element,
		data = option.data,
		dataLen = data.length,
		arrIndicator = [],
		arrImage = data.map(function(item, index){
			arrIndicator.push(createIndicator(index));
			return createImage(index, item);
		}),
		currentIndex = 0,
		previousIndex = getIndex(),
		nextIndex = getIndex(1),
		autoTimer;
	indicator.className = "indicator";
	function createImage(index, option){
		var dom = document.createElement("a");
		dom.href = option.anchorHref;
		dom.title = option.name;
		dom.style.backgroundImage = "url(" + option.imageUrl + ")";
		container.appendChild(dom);
		return dom;
	}
	function createIndicator(index){
		var dom = document.createElement("em");
		dom.innerText = index + 1;
		dom.onclick = function(){
			clearTimeout(autoTimer);
			autoTimer = auto();
			setIndex(currentIndex, index);
		};
		indicator.appendChild(dom);
		return dom;
	}
	function createController(className, type){
		var xmlns = "http://www.w3.org/2000/svg",
			svg = document.createElementNS(xmlns, "svg"),
			polyline = document.createElementNS(xmlns, "polyline");
		svg.setAttribute("class", className);
		svg.setAttribute("xmlns", xmlns);
		polyline.setAttribute("fill", "none");
		polyline.setAttribute("stroke", "rgb(204, 204, 204)");
		polyline.setAttribute("stroke-width", 2);
		polyline.setAttribute("stroke-linecap", "round");
		polyline.setAttribute("points", type ? "1 1, 19 30, 1 59" : "19 1, 1 30, 19 59");
		svg.appendChild(polyline);
		svg.onmouseenter = function(){
			polyline.setAttribute("stroke", "rgb(0, 128, 255)");
		};
		svg.onmouseleave = function(){
			polyline.setAttribute("stroke", "rgb(204, 204, 204)");
		};
		svg.onclick = function(){
			clearTimeout(autoTimer);
			autoTimer = auto();
			setIndex(currentIndex, getIndex(type));
		};
		container.appendChild(svg);
	}
	function getIndex(type){
		if(type){
			return currentIndex < dataLen - 1 ? currentIndex + 1 : 0;
		}
		return currentIndex > 0 ? currentIndex - 1 : dataLen - 1;
	}
	function setIndex(prev, curr){
		previousIndex = prev;
		currentIndex = curr;
		nextIndex = getIndex(1);
		arrImage[previousIndex].classList.remove("current");
		arrImage[currentIndex].classList.add("current");
		arrIndicator[previousIndex].classList.remove("current");
		arrIndicator[currentIndex].classList.add("current");
	}
	function auto(){
		return setInterval(function(){
			setIndex(currentIndex, getIndex(1));
		}, 2000);
	}
	var init = function(){
		arrImage[0].classList.add("current");
		arrIndicator[0].classList.add("current");
		createController("previous");
		createController("next", 1);
		container.appendChild(indicator);
		document.querySelector(element).appendChild(container);
		autoTimer = auto();
	}();
}