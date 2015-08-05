var Banner = window.Banner || (function(setting){
	"use strict";
	/*版权信息*/
	Banner.INFO = {
		AUTHOR : "BrickCarvingArtist/GitHub",
		BEGINTIME : "2015/06/01",
		LATESTRELEASE : "2015/08/03",
		LICENSE : "LGPL",
		NAME : "Banner",
		VERSION : "1.0"
	};
	if(setting.info){
		console.warn(Banner.INFO);
	}
	/*Ajax类*/
	function Ajax(obj){
		this.receiveObj = obj;
		this._init();
	}
	Ajax.prototype = {
		constructor : Ajax,
		_init : function(){
			this.xhr = new window.XMLHttpRequest() || window.ActiveXObject();
			this._open();
			this._addEvent();
		},
		_open : function(){
			this.xhr.open(this.receiveObj.type || "get", this.receiveObj.url, this.receiveObj.async || true);
		},
		_addEvent : function(){
			var _this = this;
			this.xhr.onreadystatechange = function(){
				if(this.readyState === 4){
					if(this.status === 200){
						if(_this.receiveObj.success(_this.receiveObj.dataType || _this.receiveObj.dataType === "json" ? eval("(" + this.responseText + ")") : this.responseText)){}
					}else{
						if(_this.receiveObj.failure(this.responseText)){}
					}
				}
			};
			this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			this.xhr.send(this.receiveObj.data || null);
		}
	};
	/*单张图片*/
	function AImage(userObj, index, setting){
		this.userObj = userObj;
		this.index = index;
		this.setting = setting;
		this._init();
	}
	AImage.prototype = {
		constructor : AImage,
		_init : function(){
			this.dom = document.createElement("a");
			this.dom.className = "normal";
			this._setHref();
			this._setBg();
		},
		_setHref : function(){
			if(this.setting.anchorHref){
				this.dom.setAttribute("href", this.setting.anchorHref);
				this.dom.setAttribute("target", "_blank");
			}
		},
		_setBg : function(){
			this.dom.style.backgroundImage = "url(" + this.setting.imageSrc + ")";
		},
		fadeIn : function(){
			this.dom.className = "current";
			var _this = this,
				opacity = 0,
				t = setInterval(function(){
					if(opacity < 1){
						opacity = parseFloat((opacity + 0.1).toFixed(1));
						_this.dom.style.opacity = opacity;
						_this.dom.style.filter = "alpha(opacity=" + opacity * 100 + ")";
					}else{
						clearInterval(t);
					}
				}, 50);
		},
		fadeOut : function(){
			this.dom.className = "normal";
			var _this = this,
				opacity = 1,
				t = setInterval(function(){
					if(opacity > 0){
						opacity = parseFloat((opacity - 0.1).toFixed(1));
						_this.dom.style.opacity = opacity;
						_this.dom.style.filter = "alpha(opacity=" + opacity * 100 + ")";
					}else{
						clearInterval(t);
					}
				}, 50);
		}
	};
	/*按钮*/
	function Button(userObj, index){
		this.userObj = userObj;
		this.index = index;
		this._init();
		this._addEvent();
	}
	Button.prototype = {
		constructor : Button,
		_init : function(){
			this.dom = document.createElement("em");
			this.dom.className = "normal";
		},
		_addEvent : function(){
			var _this = this;
			this.dom.onclick = function(){
				_this.userObj.setCurrentIndex(_this.index);
				_this.userObj.oButton[_this.userObj.prevIndex].closeLight();
				_this.highLight();
				_this.userObj.userObj.oImage[_this.userObj.prevIndex].fadeOut();
				_this.userObj.userObj.oImage[_this.index].fadeIn();
			};
		},
		highLight : function(){
			this.dom.className = "current";
		},
		closeLight : function(){
			this.dom.className = "normal";
		}
	};
	/*指示条*/
	function Indicator(userObj, display){
		this.userObj = userObj;
		this.className = "indicator" + (display ? " display" : " none");
		this.currentIndex = 0;
		this.prevIndex = 0;
		this._init();
	}
	Indicator.prototype = {
		constructor : Indicator,
		_init : function(){
			this.dom = document.createElement("div");
			this.dom.className = this.className;
			this._buildAll();
		},
		_buildAll : function(){
			this.oButton = new Array(this.userObj.imageSum);
			for(var i = 0; i < this.userObj.imageSum; i++){
				this.oButton[i] = new Button(this, i);
				this.dom.appendChild(this.oButton[i].dom);
			}
		},
		setCurrentIndex : function(index){
			var prevIndex = this.currentIndex;
			this.prevIndex = prevIndex;
			this.currentIndex = index;
		},
		getCurrentIndex : function(){
			return this.currentIndex;
		},
		getPrevIndex : function(){
			return this.prevIndex;
		}
	};
	/*Banner*/
	function Banner(obj){
		var _this = this;
		this.receiveObj = obj;
		this._getImage(function(){
			_this.imageSum = _this.receiveObj.image.length;
			_this._init();
			_this._autoFade();
		});
	}
	Banner.prototype = {
		constructor : Banner,
		_init : function(){
			this._buildAll();
		},
		_getImage : function(callback){
			var _this = this;
			new Ajax({
				type : "get",
				url : this.receiveObj.image,
				dataType : "json",
				success : function(data){
					_this.receiveObj.image = data.data;
					callback();
				}
			});
		},
		_buildAll : function(){
			this.dom = document.createElement("div");
			this.dom.className = "bannerFade";
			this._buildImage();
			this._buildIndictor();
			document.getElementById(this.receiveObj.position).appendChild(this.dom);
			this.indicator.oButton[0].dom.click();
		},
		_buildImage : function(){
			this.oImage = new Array(this.imageSum);
			for(var i = 0; i < this.imageSum; i++){
				this.oImage[i]= new AImage(this, i, this.receiveObj.image[i]);
				this.dom.appendChild(this.oImage[i].dom);
			}
		},
		_buildIndictor : function(){
			this.indicator = new Indicator(this, this.receiveObj.indicator);
			this.dom.appendChild(this.indicator.dom);
		},
		_autoFade : function(){
			var _this = this,
				t = setInterval(function(){
					_this.indicator.oButton[_this.indicator.getCurrentIndex() > _this.imageSum - 2 ? 0 : _this.indicator.getCurrentIndex() + 1].dom.click();
				}, 4000);
		}
	}
	return Banner;
})({
	info : true
});