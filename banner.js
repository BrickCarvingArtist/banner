//轮播图组件
function Banner(option){ //option 组件配置
	var container = document.createDocumentFragment(), //创建轮播图容器元素
		indicator = document.createElement("div"), //创建指针容器元素
		element = document.querySelector(option.element), //获取轮播图插入位置元素
		keywords = option.keywords, //设置所有字段名称
		title = keywords.title, //设置title字段名称 (用做图片提示标题)
		href = keywords.href, //设置href字段名称 (用做图片链接)
		url = keywords.url, //设置url字段名称 (用做图片背景图片地址)
		data = option.data, //设置数据
		dataLen = data.length, //设置数据个数
		theme = option.theme, //设置轮播主题
		controller = option.controller, //设置轮播前后翻页控制
		indicatorTheme = option.indicator, //设置指针主题
		duration = (option.duration || 2) * 1000, //设置秒数间隔
		arrIndicator = [], //创建下标元素集合
		arrImage = data.map(function(item, index){ //创建图片元素集合
			arrIndicator.push(createIndicator(index)); //创建单个下标元素并新增至下标元素集合中
			return createImage(item); //创建单个图片元素并新增至下表元素集合中
		}),
		currentIndex = 0, //设置轮播图当前下标
		previousIndex = getIndex(), //设置轮播图前一个下标
		nextIndex = getIndex(1), //设置轮播图下一个下标
		autoTimer; //设置定时器
	element.classList.add(["tab", "fade", "slide"][theme || 0]); //设置轮播图插入位置元素主题类名
	controller && (createController("previous"), createController("next", 1)); //创建翻页控制
	indicatorTheme && (indicator.className = "indicator", indicator.classList.add("theme" + indicatorTheme), container.appendChild(indicator)); //设置指针容器类名, 主题类名, 新增至轮播图容器中
	element.appendChild(container); //新增轮播图容器至轮播图插入位置元素中
	arrIndicator[0].classList.add("current"); //为第一个指针添加当前被选中类名
	start(); //执行启动轮播
	//创建单个图片元素方法
	function createImage(option){ //option 配置
		var dom = document.createElement("a"); //创建单个图片元素
		dom.href = option[href]; //设置链接地址
		dom.title = option[title]; //设置提示标题
		dom.style.backgroundImage = "url(" + option[url] + ")"; //设置背景图片
		container.appendChild(dom); //新增至轮播图容器元素中
		return dom; //返回单个图片元素
	}
	//创建单个指针元素方法
	function createIndicator(index){ //index 指针下标
		var dom = document.createElement("em"); //创建单个指针元素
		indicatorTheme >> 1 || (dom.innerText = index + 1); //根据主题设置指针数字
		dom.onclick = function(){
			restart(); //重新轮播
			setIndex(index); //设置轮播当前下标为指针下标
		};
		indicator.appendChild(dom); //新增至指针容器中
		return dom; //返回单个指针元素
	}
	//创建翻页控制方法
	function createController(className, type){ //className 翻页元素类名, type (false:前翻页, true:后翻页)
		var xmlns = "http://www.w3.org/2000/svg", //xml命名空间
			svg = document.createElementNS(xmlns, "svg"), //创建xml格式矢量图元素
			polyline = document.createElementNS(xmlns, "polyline"); //创建xml格式折线元素
		svg.setAttribute("class", className); //设置翻页元素类名
		svg.setAttribute("xmlns", xmlns); //设置xml命名空间
		polyline.setAttribute("fill", "none"); //设置折线填充
		polyline.setAttribute("stroke", "rgba(255, 255, 255, .4)"); //设置描边颜色
		polyline.setAttribute("stroke-width", 2); //设置描边宽度
		polyline.setAttribute("stroke-linecap", "round"); //设置描边线头
		polyline.setAttribute("points", type ? "1 1, 19 30, 1 59" : "19 1, 1 30, 19 59"); //设置折线顶点
		svg.appendChild(polyline); //新增折线至矢量图元素中
		svg.onmouseenter = function(){ //矢量图鼠标移入事件
			polyline.setAttribute("stroke", "white"); //设置描边颜色
		};
		svg.onmouseleave = function(){ //矢量图鼠标移出事件
			polyline.setAttribute("stroke", "rgba(255, 255, 255, .4)"); //设置描边颜色
		};
		svg.onclick = function(){ //矢量图鼠标点击事件
			restart(); //重启轮播
			setIndex(getIndex(type)); //设置轮播当前下标为翻页后下标
		};
		container.appendChild(svg); //新增至轮播容器中
	}
	//获取下标方法
	function getIndex(type){ //type (false:前一个下标, true:后一个下标)
		if(type){ //判断下标类型
			return currentIndex < dataLen - 1 ? currentIndex + 1 : 0; //返回后一个下标
		}
		return currentIndex > 0 ? currentIndex - 1 : dataLen - 1; //返回前一个下标
	}
	//设置轮播当前下标方法
	function setIndex(index){ //index 根据指针下标设置为当前下标
		theme && (arrImage[previousIndex].classList.remove("previous"), arrImage[currentIndex].classList.add("previous")); //为轮播图原前一个下标对应图片移除前一个被选中类名, 为轮播图原当前下标对应图片添加前一个被选中类名
		arrImage[currentIndex].classList.remove("current"); //为轮播图原当前下标对应图片移除当前被选中类名
		arrIndicator[currentIndex].classList.remove("current"); //为轮播图原当前下标对应指针移除当前被选中类名
		previousIndex = currentIndex; //设置轮播图前一个下标为原当前下标
		currentIndex = index; //根据指针下标设置为当前下标
		nextIndex = getIndex(1); //设置轮播图下一个下标为新当前下标的下一个下标
		arrImage[currentIndex].classList.add("current"); //为轮播图当前下标对应图片添加当前被选中类名
		arrIndicator[currentIndex].classList.add("current"); //为轮播图当前下标对应指针添加当前被选中类名
	}
	//启动轮播方法
	function start(){
		autoTimer = setInterval(function(){ //设置定时器
			setIndex(getIndex(1)); //设置下标为下一个下标
		}, duration); //设置秒数间隔
	}
	//重新轮播方法
	function restart(){
		clearTimeout(autoTimer); //清除计时器
		start(); //执行轮播
	}
}