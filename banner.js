function Banner(option){
	var container = document.createDocumentFragment(),
		indicator = document.createElement("div"),
		element = document.querySelector(option.element),
		keywords = option.keywords,
		title = keywords.title,
		href = keywords.href,
		url = keywords.url,
		data = option.data,
		dataLen = data.length,
		theme = option.theme,
		controller = option.controller,
		indicatorTheme = option.indicator,
		duration = (option.duration || 2) * 1000,
		arrIndicator = [],
		arrImage = data.map(function(item, index){
			arrIndicator.push(createIndicator(index));
			return createImage(index, item);
		}),
		currentIndex = 0,
		previousIndex = getIndex(),
		nextIndex = getIndex(1),
		autoTimer;
	function createImage(index, option){
		var dom = document.createElement("a");
		dom.href = option[href];
		dom.title = option[title];
		dom.style.backgroundImage = "url(" + option[url] + ")";
		container.appendChild(dom);
		return dom;
	}
	function createIndicator(index){
		var dom = document.createElement("em");
		indicatorTheme >> 1 || (dom.innerText = index + 1);
		dom.onclick = function(){
			restart();
			setIndex(index);
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
		polyline.setAttribute("stroke", "rgba(255, 255, 255, .4)");
		polyline.setAttribute("stroke-width", 2);
		polyline.setAttribute("stroke-linecap", "round");
		polyline.setAttribute("points", type ? "1 1, 19 30, 1 59" : "19 1, 1 30, 19 59");
		svg.appendChild(polyline);
		svg.onmouseenter = function(){
			polyline.setAttribute("stroke", "white");
		};
		svg.onmouseleave = function(){
			polyline.setAttribute("stroke", "rgba(255, 255, 255, .4)");
		};
		svg.onclick = function(){
			restart();
			setIndex(getIndex(type));
		};
		container.appendChild(svg);
	}
	function getIndex(type){
		if(type){
			return currentIndex < dataLen - 1 ? currentIndex + 1 : 0;
		}
		return currentIndex > 0 ? currentIndex - 1 : dataLen - 1;
	}
	function setIndex(index){
		theme && (arrImage[previousIndex].classList.remove("previous"), arrImage[currentIndex].classList.add("previous"));
		arrImage[currentIndex].classList.remove("current");
		arrIndicator[currentIndex].classList.remove("current");
		previousIndex = currentIndex;
		currentIndex = index;
		nextIndex = getIndex(1);
		arrImage[currentIndex].classList.add("current");
		arrIndicator[currentIndex].classList.add("current");
	}
	function start(){
		autoTimer = setInterval(function(){
			setIndex(getIndex(1));
		}, duration);
	}
	function restart(){
		clearTimeout(autoTimer);
		start();
	}
	var init = function(){
		element.classList.add(["tab", "fade", "slide"][theme || 0]);
		indicator.className = "indicator";
		indicatorTheme && indicator.classList.add("theme" + indicatorTheme);
		controller && (createController("previous"), createController("next", 1));
		indicatorTheme && container.appendChild(indicator);
		element.appendChild(container);
		arrIndicator[0].classList.add("current");
		start();
	}();
}