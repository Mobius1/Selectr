/*!
 * Selectr 2.1.0
 * http://mobius.ovh/docs/selectr
 *
 * Released under the MIT license
 */
(function (root, factory) {
	var plugin = "Selectr";

	if (typeof define === "function" && define.amd) {
		define([], factory(plugin));
	} else if (typeof exports === "object") {
		module.exports = factory(plugin);
	} else {
		root[plugin] = factory(plugin);
	}
}(this, function (plugin) {
	"use strict";

	var util = {
		extend: function(src, props) {
			props = props || {};
			var p;
			for (p in src) {
				if (!props.hasOwnProperty(p)) {
					props[p] = src[p];
				}
			}
			return props;
		},
		each: function(a, b, c) {
			if ("[object Object]" === Object.prototype.toString.call(a)) {
				for (var d in a) {
					if ( Object.prototype.hasOwnProperty.call(a, d) ) {
						b.call(c, d, a[d], a);
					}
				}
			} else {
				for (var e = 0, f = a.length; e < f; e++) {
					b.call(c, e, a[e], a);
				}
			}
		},
		createElement: function(a, b) {
			var c = document,
				d = c.createElement(a);
			if (b && "object" == typeof b) {
				var e;
				for (e in b)
					if ("html" === e) d.innerHTML = b[e];
					else if ("text" === e) {
					var f = c.createTextNode(b[e]);
					d.appendChild(f);
				} else d.setAttribute(e, b[e]);
			}
			return d;
		},
		hasClass: function(a, b) {
			return a.classList ? a.classList.contains(b) : !!a.className && !!a.className.match(new RegExp("(\\s|^)" + b + "(\\s|$)"));
		},
		addClass: function(a, b) {
			if (!util.hasClass(a, b)) {
				if (a.classList) { a.classList.add(b); } else { a.className = a.className.trim() + " " + b; } }
		},
		removeClass: function(a, b) {
			if (util.hasClass(a, b)) { if (a.classList) { a.classList.remove(b); } else { a.className = a.className.replace(new RegExp("(^|\\s)" + b.split(" ").join("|") + "(\\s|$)", "gi"), " "); }}
		},
		closest: function(el, fn) {
			return el && el !== document.body && ( fn(el) ? el : util.closest(el.parentNode, fn) );
		},
		on: function(e, type, callback, capture) {
			e.addEventListener(type, callback, capture || false);
		},
		off: function(e, type, callback) {
			e.removeEventListener(type, callback);
		},
		isObject: function(a) {
			return "[object Object]" === Object.prototype.toString.call(a);
		},
		isArray: function(a) {
			return "[object Array]" === Object.prototype.toString.call(a);
		},
		isInt: function(val) {
			return !isNaN(val) && (function(x) {
				return (x || 0) === x;
			})(parseFloat(val));
		},
		debounce: function(a, b, c) {
			var d;
			return function() {
				var e = this,
					f = arguments,
					g = function() {
						d = null;
						if (!c) a.apply(e, f);
					},
					h = c && !d;
				clearTimeout(d); d = setTimeout(g, b);
				if (h){ a.apply(e, f); }
			};
		},
		getBoundingRect: function(el) {
			var win = window;
			var doc = document;
			var body = doc.body;
			var rect = el.getBoundingClientRect();
			var offsetX = win.pageXOffset !== undefined ? win.pageXOffset : (doc.documentElement || body.parentNode || body).scrollLeft;
			var offsetY = win.pageYOffset !== undefined ? win.pageYOffset : (doc.documentElement || body.parentNode || body).scrollTop;

			return {
				bottom: rect.bottom + offsetY,
				height: rect.height,
				left  : rect.left + offsetX,
				right : rect.right + offsetX,
				top   : rect.top + offsetY,
				width : rect.width
			};
		},
		preventDefault: function(e) {
			e = e || window.event;
			if (e.preventDefault) {
				return e.preventDefault();
			}
		},
		includes: function(a,b) {
			return a.indexOf(b) > -1;
		}
	};

	var setSelected = function() {
		var o = this.settings;
		var opts = this.el.options;

		if ( o.selectedValue ) {
			var val = o.selectedValue.toString();
			util.each(opts, function(i, opt) {
				if ( util.includes(val, opt.value) )  {
					opt.defaultSelected = true;
				}
			});
		}

		if ( !opts[0].defaultSelected && opts[0].selected ) {
			this.el.selectedIndex = -1;
		}
	};

	var setWidth = function() {
		var w = this.settings.width;

		if (w) {
			if (util.isInt(w)) {
				w += "px";
			} else {
				if (w === "auto") {
					w = "100%";
				} else if (util.includes(this.settings.width, "%")) {
					w = this.settings.width;
				}
			}

			this.width = w;
		}
	};

	var build = function() {
		var _ = this;
		var o = _.settings;
		util.addClass(_.el, "hidden-input");

		// Check for data
		if ( o.data ) {
			_.pageIndex = 1;
			var data = o.pagination ? o.data.slice(0, o.pagination) : o.data;
			var firstSelected = false;

			util.each(data, function(idx, itm) {
				var selected = itm.hasOwnProperty('selected') && itm.selected === true;
				var option = new Option(itm.text, itm.value, selected, selected);

				if ( itm.disabled ) {
					option.disabled = true;
				}

				if ( idx === 0 && selected ) {
					firstSelected = true;
				}

				_.el.add(option);
			});

			if ( !firstSelected ) {
				this.el.selectedIndex = -1;
			}

			if ( o.pagination ) {
				this.pages = o.data.map( function(v, i) {
					return i % o.pagination === 0 ? o.data.slice(i, i+o.pagination) : null;
				}).filter(function(pages){ return pages; });
			}
		}

		setSelected.call(_);

		_.customOption = o.hasOwnProperty("renderOption") && typeof o.renderOption === "function";
		_.customSelected = o.hasOwnProperty("renderSelection") && typeof o.renderSelection === "function";

		_.container = util.createElement("div", {
			class: "selectr-container"
		});

		// Custom className
		if (o.customClass) {
			util.addClass(_.container, o.customClass);
		}

		setWidth.call(_);

		this.container.style.width = this.width;

		_.selected = util.createElement("div", {
			class: "selectr-selected"
		});

		_.label = util.createElement(_.el.multiple ? "ul" : "span", {
			class: "selectr-label"
		});

		var optsContainer = util.createElement("div", {
			class: "selectr-options-container"
		});

		_.optsOptions = util.createElement("ul", {
			class: "selectr-options"
		});

		_.notice = util.createElement("div", {
			class: "selectr-notice"
		});

		if (_.el.multiple) {
			util.addClass(_.label, "selectr-tags");
			util.addClass(_.container, "multiple");

			// Collection of tags
			this.tags = [];

			// Collection of selected values
			this.selectedValues = [];

			// Collection of selected indexes
			this.selectedIndexes = [];
		}


		_.selected.appendChild(_.label);

		if ( o.clearable ) {
			_.selectClear = util.createElement("button", {
				class: "selectr-clear",
				type: "button"
			});

			_.selected.appendChild(_.selectClear);
		}

		if ( o.taggable ) {
			var li = util.createElement('li', { class: 'input-tag' });
			_.input = util.createElement("input", {
				class: "selectr-tag-input",
				placeholder: 'Enter a tag...'
			});

			li.appendChild(_.input);
			_.label.appendChild( li);
			util.addClass(_.container, "taggable");

			this.tagSeperators = [","];
			if ( _.settings.tagSeperators ) {
				this.tagSeperators = this.tagSeperators.concat(_.settings.tagSeperators);
			}
		}

		if (o.searchable) {
			_.input = util.createElement("input", {
				class: "selectr-input"
			});
			_.inputClear = util.createElement("button", {
				class: "selectr-clear",
				type: "button"
			});
			_.inputContainer = util.createElement("div", {
				class: "selectr-input-container"
			});

			_.inputContainer.appendChild(_.input);
			_.inputContainer.appendChild(_.inputClear);
			optsContainer.appendChild(_.inputContainer);
		}

		// Check for optgroups
		if (_.hasOptGroups) {
			var x = 0;
			util.addClass(_.optsOptions, "optgroups");
		}

		var i = 0;
		util.each(_.el.children, function(idx, opt) {
			if (opt.nodeName === "OPTGROUP") {
				var group = util.createElement("ul", {
					class: "selectr-optgroup"
				});
				group.appendChild(util.createElement("li", {
					class: "selectr-optgroup--label",
					text: opt.label
				}));
				_.optsOptions.appendChild(group);

				if (opt.children) {
					util.each(opt.children, function(i, option) {
						if ( o.pagination && o.data && x >= o.pagination ) return;
						buildOption.call(_, x, option, group);
						x++;
					});
				}
			} else {
				if ( o.pagination && o.data && i >= o.pagination ) return;
				buildOption.call(_, i, opt);
				i++;
			}
		});

		util.addClass(_.list[_.activeIdx], "active");

		optsContainer.appendChild(_.notice);
		optsContainer.appendChild(_.optsOptions);

		_.container.appendChild(_.selected);
		_.container.appendChild(optsContainer);

		// Set the placeholder
		var placeholder = o.placeholder || _.el.getAttribute("placeholder") || "Choose...";
		_.placeEl = util.createElement("div", {
			class: "selectr-placeholder",
			html: placeholder
		});
		_.selected.appendChild(_.placeEl);

		_.el.parentNode.insertBefore(_.container, _.el);
		_.container.appendChild(_.el);

		addListeners.call(this);
	};

	var buildOption = function(i, option, group) {
		if (option.nodeName !== "OPTION" || !option.value) return;

		var content = this.customOption ? this.settings.renderOption(option) : option.textContent.trim();
		var opt = util.createElement("li", {
			class: "selectr-option",
			html: content
		});

		// Store the index for later
		opt.idx = i;

		this.items.push(opt);

		if (option.defaultSelected) {
			change.call(this, i, true);
		}

		if (option.disabled) {
			opt.disabled = true;
			util.addClass(opt, "disabled");
		}

		if (group) {
			group.appendChild(opt);
		} else {
			this.optsOptions.appendChild(opt);
		}

		if (!option.disabled) {
			this.list.push(opt);
		}
	};

	var addListeners = function() {
		var _ = this;

		this.events = {};

		this.events.keyup = keyup.bind(_);
		this.events.navigate = navigate.bind(_);
		this.events.dismiss = dismiss.bind(_);

		_.requiresPagination = _.settings.data && _.settings.data.length > _.settings.pagination;

		// Global listener
		util.on(_.container, "click", function(e) {
			e = e || window.event;

			var target = e.target;

			var isSelected = util.closest(target, function(el) {
				return (el && el == _.selected);
			});

			if ( target === _.input ) {
				return;
			}


			// Clear
			if ( _.settings.clearable && target === _.selectClear ) {
				_.clear();
				return;
			}

			// Remove tag button
			if (util.hasClass(target, "selectr-tag-remove")) {
				deselect.call(_, target.parentNode.idx);
			}

			// Click on placeholder or selected text
			if (target === _.label || target === _.placeEl) {
				target = _.placeEl.parentNode;
			}

			// Open / close dropdown
			if (isSelected || target === _.selected) {
				_.toggle();
			}

			// Select option
			if (util.hasClass(target, "selectr-option")) {
				var index = _.items.indexOf(target);
				change.call(_, index);
			}


			util.preventDefault(e);
		});

		// Prevent text selection
		util.on(_.optsOptions, "mousedown", function(e) { util.preventDefault(e); });

		if (_.settings.searchable) {
			util.on(_.inputClear, "click", function(e) {
				clearSearch.call(_);
			});
		}

		util.on(document, "click", this.events.dismiss);
		util.on(document, "keydown", this.events.navigate);
		util.on(document, "keyup", this.events.keyup);

		_.update = util.debounce(function() {
			if (_.opened) {
				_.close();
			}
			if ( this.width ) {
				this.container.style.width = this.width;
			}
		}, 50);

		util.on(window, "resize", _.update);
		util.on(window, "scroll", _.update);

		if (_.requiresPagination) {
			_.paginateItems = util.debounce(function() {
				paginate.call(_);
			}, 50);

			util.on(_.optsOptions, "scroll", _.paginateItems);
		}
	};

	var change = function(index, init) {
		var _ = this;
		var opt = _.items[index];
		var option = _.el.options[index];

		if (option.disabled) {
			return;
		}

		if (init) {
			select.call(_, index);
			return;
		}

		if (util.hasClass(opt, "selected")) {
			deselect.call(_, index);
		} else {
			select.call(_, index);
		}

		if (_.opened && !_.el.multiple) {
			_.close();
		}
	};

	var select = function(index) {
		var option = this.el.options[index];

		if ( this.el.multiple ) {
			if (util.includes(this.selectedIndexes, index) ) {
				return false;
			}

			var max = this.settings.maxSelections;
			if ( max && this.tags.length == max ) {
				this.setMessage("A maximum of " + max + " items can be selected.", true);
				return false;
			}

			this.selectedValues.push(option.value);
			this.selectedIndexes.push(index);

			addTag.call(this, index);
		} else {
			this.label.innerHTML = this.customSelected ? this.settings.renderSelection(option) : option.textContent;

			this.selectedValue = option.value;
			this.selectedIndex = index;

			util.each(this.el.options, function(i, option) {
				var opt = this.items[i];

				if ( i !== index ) {
					if ( opt ) {
						util.removeClass(opt, "selected");
					}
					option.defaultSelected = false;
				}
			}, this);
		}

		util.addClass(this.items[index], "selected");
		util.addClass(this.container, "has-selected");

		option.defaultSelected = true;

		this.emit("selectr.select", option);
		this.emit("selectr.change", option);
	};

	var deselect = function(index) {
		var option = this.el.options[index];

		util.removeClass(this.items[index], "selected");

		if ( this.el.multiple ) {
			var selIndex = this.selectedIndexes.indexOf(index);
			this.selectedIndexes.splice(selIndex, 1);

			var valIndex = this.selectedValues.indexOf(option.value);
			this.selectedValues.splice(valIndex, 1);

			removeTag.call(this, index);

			if ( !this.tags.length ) {
				util.removeClass(this.container, "has-selected");
			}
		} else {
			this.label.innerHTML = "";
			this.selectedValue = null;

			this.el.selectedIndex = -1;

			util.removeClass(this.container, "has-selected");
		}

		option.defaultSelected = false;

		this.emit("selectr.deselect", option);
		this.emit("selectr.change", option);
	};

	var addTag = function(index) {
		var _ = this;

		var docFrag = document.createDocumentFragment();
		var option = _.el.options[index];
		var content = _.customSelected ? _.settings.renderSelection(option) : option.textContent;

		var tag = util.createElement("li", {
			class: "selectr-tag",
			html: content
		});
		var btn = util.createElement("button", {
			class: "selectr-tag-remove",
			type: "button"
		});

		tag.appendChild(btn);

		// Set property to check against later
		tag.idx = index;
		tag.tag = option.value;

		_.tags.push(tag);

		if ( _.settings.sortSelected ) {

			var tags = _.tags.slice();

			tags.sort(function(a, b) {
				var x = [], y = [], ac, bc;
				if ( _.settings.sortSelected === true ) {
					ac = a.tag;
					bc = b.tag;
				} else if ( _.settings.sortSelected === 'text' ) {
					ac = a.textContent;
					bc = b.textContent;
				}

				// Deal with values that contain numbers
				ac.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { x.push([$1 || Infinity, $2 || ""]); });
				bc.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { y.push([$1 || Infinity, $2 || ""]); });

				while(x.length && y.length) {
					var ax = x.shift();
					var by = y.shift();
					var nn = (ax[0] - by[0]) || ax[1].localeCompare(by[1]);
					if(nn) return nn;
				}

				return x.length - y.length;
			});

			util.each(tags, function(i,tg) {
				docFrag.appendChild(tg);
			});

			_.label.innerHTML = "";

		} else {
			docFrag.appendChild(tag);
		}

		if ( _.settings.taggable ) {
			_.label.insertBefore(docFrag, _.input.parentNode);
		} else {
			_.label.appendChild(docFrag);
		}
	};

	var removeTag = function(index) {
		var tag = false;


		util.each(this.tags, function(i, t) {
			if (t.idx === index) {
				tag = t;
			}
		});

		if (tag) {
			this.label.removeChild(tag);

			var tagIdx = this.tags.indexOf(tag);
			this.tags.splice(tagIdx, 1);
		}
	};

	var clearSearch = function() {
		var _  = this;

		if ( _.settings.searchable || _.settings.taggable ) {
			_.input.value = null;
			_.searching = false;
			if ( _.settings.searchable ) {
				util.removeClass(_.inputContainer, "active");
			}

			if ( util.hasClass(_.container, "notice") ) {
				util.removeClass(_.container, "notice");
				util.addClass(_.container, "open");
				_.input.focus();
			}

			util.each(_.list, function(i, el) {
				util.removeClass(el, "match");
				util.removeClass(el, "excluded");

				if ( !_.customOption ) {
					el.innerHTML = el.textContent;
				}
			});
		}
	};

	var keyup = function(e) {
		var _ = this;
		if ( e.target == _.input ) {
			_.input = e.target;
			_.search(_.input.value, true);
		}
		if (_.navigating && e.keyCode != 13) {
			_.navigating = false;
		}

		if ( _.input.value.length ) {
			var value = _.input.value.trim();

			if ( e.which === 13 || util.includes(_.tagSeperators, e.key) ) {

				util.each(_.tagSeperators, function(i,k) {
					value = value.replace(k, '');
				});

				var option = _.addOption({
					value: value,
					text: value,
					selected: true
				});

				if ( !option ) {
					_.input.value = '';
					_.setMessage('That tag is already in use.');
				} else {
					_.close();
					clearSearch.call(_);
				}
			}

		}
	};

	var navigate = function(e) {
		e = e || window.event;

		var _ = this,
			key = e.which,
			keys = [13, 38, 40];

		// Filter out the keys we don"t want
		if (!_.opened || !util.includes(keys, key)) return;

		util.preventDefault(e);

		var list = this.searching ? this.searchItems : this.list,
			dir;

		if ( !list.length ) return;

		switch (key) {
			case 13:
				if ( _.settings.taggable && _.input === document.activeElement ) {
					return;
				}
				var opt = _.optsOptions.querySelector(".active");
				var index = _.items.indexOf(opt);

				return void change.call(_, index);
			case 38:
				dir = 1;
				if ( _.activeIdx > 0 ) { _.activeIdx--; }
				break;
			case 40:
				dir = -1;
				if ( _.activeIdx < list.length - 1 ) { _.activeIdx++; }
		}

		this.navigating = true;

		var nextElem = list[_.activeIdx];
		var nextRect = util.getBoundingRect(nextElem);
		var optsTop = _.optsOptions.scrollTop;
		var offset = _.optsRect.top;
		var currentOffset, nextOffset;

		if (dir > 1) {
			var nextTop = nextRect.top;
			currentOffset = offset;
			nextOffset = optsTop + (nextTop - currentOffset);

			if (_.activeIdx === 0) {
				_.optsOptions.scrollTop = 0;
			} else if (nextTop - currentOffset < 0) {
				_.optsOptions.scrollTop = nextOffset;
			}
		} else {
			var nextBottom = nextRect.top + nextRect.height;
			currentOffset = offset + _.optsRect.height;
			nextOffset = optsTop + nextBottom - currentOffset;

			if (_.activeIdx === 0) {
				_.optsOptions.scrollTop = 0;
			} else if (nextBottom > currentOffset) {
				_.optsOptions.scrollTop = nextOffset;
			}

			if ( _.requiresPagination ) {
				paginate.call(_);
			}
		}

		util.removeClass(_.optsOptions.querySelector(".active"), "active");
		util.addClass(list[_.activeIdx], "active");
	};

	var paginate = function() {
		var _ = this;
		var opts = _.optsOptions;
		var scrollTop = opts.scrollTop;
		var scrollHeight = opts.scrollHeight;
		var offsetHeight = opts.offsetHeight;
		var atBottom = scrollTop >= (scrollHeight - offsetHeight);

		if ( atBottom && _.pageIndex < _.pages.length ) {
			var selectFrag = document.createDocumentFragment();
			var optsFrag = document.createDocumentFragment();

			util.each(_.pages[_.pageIndex], function(i, item) {
				var option = util.createElement("option", { value: item.value, text: item.text });
				selectFrag.appendChild(option);
				buildOption.call(_, i, option, optsFrag);
			});

			_.el.appendChild(selectFrag);
			opts.appendChild(optsFrag);

			_.pageIndex++;

			_.emit("selectr.paginate", {
				items: _.items.length,
				total: _.settings.data.length,
				page: _.pageIndex,
				pages: _.pages.length
			});
		}
	};

	var dismiss = function(e) {
		var target = e.target;
		if (!this.container.contains(target) && (this.opened || this.container.classList.contains("notice"))) {
			this.close();
		}
	};

	var match = function(query, opt, text) {
		var result = new RegExp(query, "i").exec(text);
		if ( result ) {
			return opt.textContent.replace(result[0], "<span>"+result[0]+"</span>");
		}
		return false;
	};

	/* EMITTER */
	var Emitter = function() {};
	Emitter.prototype = {
		on: function(event, fct){
			this._events = this._events || {};
			this._events[event] = this._events[event]	|| [];
			this._events[event].push(fct);
		},
		off: function(event, fct){
			this._events = this._events || {};
			if( event in this._events === false  )	return;
			this._events[event].splice(this._events[event].indexOf(fct), 1);
		},
		emit: function(event /* , args... */){
			this._events = this._events || {};
			if( event in this._events === false  )	return;
			for(var i = 0; i < this._events[event].length; i++){
				this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
			}
		}
	};

	Emitter.mixin = function(obj) {
		var props	= ['on', 'off', 'emit'];
		for(var i = 0; i < props.length; i ++){
			if( typeof obj === 'function' ){
				obj.prototype[props[i]]	= Emitter.prototype[props[i]];
			}else{
				obj[props[i]] = Emitter.prototype[props[i]];
			}
		}
		return obj;
	};

	var defaults = {
		width: "auto",
		searchable: true,
		clearable: false,
		sortSelected: false
	};

	/**
	 * Selectr
	 * @param {mixed} el      The element (HTMLSelectElement or CSS3 selector string)
	 * @param {obj} options User defined options
	 */
	function Selectr(el, options) {

		// Checks
		if (el === null) {
			throw new Error("Selectr requires an element to work.");
		}

		this.el = el;

		if (typeof this.el === "string") {
			this.el = document.querySelector(el);
		}

		if ( this.el === null ) {
			throw new Error("The element you passed to Selectr can not be found.");
		}

		if (this.el.nodeName.toLowerCase() !== "select") {
			throw new Error("The element you passed to Selectr is not a HTMLSelectElement.");
		}

		if (!this.el.options.length && !options.data && !options.taggable) {
			throw new Error("You don't have any options in your select!");
		}

		this.originalType = this.el.type;

		this.render(options);
	}

	/**
	 * Render the instance
	 */
	Selectr.prototype.render = function(options) {

		if ( this.rendered ) return;

		this.settings = util.extend(defaults, options);

		if (this.settings.multiple || this.settings.taggable) {
			this.el.multiple = true;
		}

		if ( this.settings.taggable ) {
			this.settings.searchable = false;
		}

		// Check for optgroupd
		this.hasOptGroups = false;
		if (this.el.getElementsByTagName("optgroup").length) {
			this.hasOptGroups = true;
		}

		// Contains all the options in the dropdown
		this.items = [];

		// List of valid items, i.e. not disabled and non-empty values
		this.list = [];

		this.activeIdx = 0;
		this.navigating = false;
		this.elRect = this.el.getBoundingClientRect();

		Emitter.mixin(this);

		build.call(this);

		this.update();

		this.rendered = true;

		var _ = this;
		setTimeout(function() {
			_.emit("selectr.init");
		}, 20);
	};

	/**
	 * Destroy the instance
	 */
	Selectr.prototype.destroy = function() {

		if ( !this.rendered ) return;

		this.emit("selectr.destroy");

		// Remove custom options set with the data option
		if ( this.settings.data ) {
			while(this.el.hasChildNodes()) {
				this.el.removeChild(this.el.lastChild);
			}
		}

		// Revert to select-single if programtically set to multiple
		if ( this.originalType === 'select-one' ) {
			this.el.multiple = false;
		}

		// Remove the className from select element
		util.removeClass(this.el, 'hidden-input');

		// Remove event listeners attached to doc and win
		util.off(document, "click", this.events.dismiss);
		util.off(document, "keydown", this.events.navigate);
		util.off(document, "keyup", this.events.keyup);
		util.off(window, "resize", this.update);
		util.off(window, "scroll", this.update);

		// Replace the container with the original select element
		this.container.parentNode.replaceChild(this.el, this.container);

		this.rendered = false;
	};

	/**
	 * Programmatically set selected values
	 * @param {mixed} value A string or an array of strings
	 */
	Selectr.prototype.setValue = function(value) {
		var _ = this,
			isArray = util.isArray(value);

		if (!isArray) {
			value = value.toString().trim();
		}

		// Can"t pass array to select-one
		if ( !_.el.multiple && isArray ) {
			return;
		}

		util.each(this.el.options, function(i, opt) {
			if (isArray && util.includes(value.toString(), opt.value) || opt.value === value) {
				change.call(_, i);
			}
		});
	};

	/**
	 * Set the selected value(s)
	 * @param  {bool} toObject Return only the raw values or an object
	 * @param  {bool} toJson   Return the object as a JSON string
	 * @return {mixed}         Array or String
	 */
	Selectr.prototype.getValue = function(toObject, toJson) {
		var _ = this, value;

		if ( _.el.multiple ) {
			if ( toObject) {
				if ( _.selectedIndexes.length ) {
					value = {};
					value.values = [];
					util.each(_.selectedIndexes, function(i,index) {
						var option = _.el.options[index];
						value.values[i] = {
							value: option.value,
							text: option.textContent
						};
					});
				}
			} else {
				value = _.selectedValues.slice();
			}
		} else {
			if ( toObject) {
				var option = _.el.options[_.selectedIndex];
				value = {
					value: option.value,
					text: option.textContent
				};
			} else {
				value = _.selectedValue;
			}
		}

		if ( toObject && toJson) {
			value = JSON.stringify(value);
		}

		return value;
	};

	Selectr.prototype.addOption = function(data) {
		var _ = this;
		if ( data && util.isObject(data) && data.value ) {

			// Don't add if already there
			var options = _.settings.data ? _.settings.data : _.el.options;

			var dupe = false;

			util.each(options, function(i,option) {
				if ( option.value.toLowerCase() === data.value.toLowerCase() ) {
					dupe = true;
				}
			});

			if ( dupe ) {
				if ( !_.settings.taggable ) {
					throw new Error('That value is already in use.');
				}
				return false;
			}

			var option = util.createElement('option', data);

			if ( _.settings.data ) {
				_.settings.data.push({
					value: data.value,
					text: data.text
				});
			}

			if ( data.selected ) {
				option.defaultSelected = true;
			}

			option.innerHTML = _.customOption ? _.settings.renderOption(option) : option.textContent;

			if ( !_.settings.pagination ) {
				_.el.add(option);
				buildOption.call(_, _.el.options.length - 1, option);
			}

			return option;
		}

		return false;
	};

	/**
	 * Perform a search
	 * @param  {string} query The query string
	 */
	Selectr.prototype.search = function(query, open) {

		query = query.trim();

		var _ = this;

		if (_.navigating) return;

		if (!util.hasClass(_.container, "notice")) {
			if ( _.settings.searchable ) {
				if (query.length > 0) {
					util.addClass(_.inputContainer, "active");
				} else {
					util.removeClass(_.inputContainer, "active");
				}
			}
		}
		_.searching = true;
		_.searchItems = [];
		_.searchQuery = query;

		util.each(_.items, function(i, opt) {
			var text = opt.textContent.trim();
			var includes = util.includes(text.toLowerCase(), query.toLowerCase());
			if ( opt.disabled || !includes ) {
				util.addClass(opt, "excluded");
				util.removeClass(opt, "match");
			} else {

				_.searchItems.push(opt);

				if ( open ) {
					if ( !_.customOption ) {
						opt.innerHTML = match(query, opt, text);
					}

					util.addClass(opt, "match");
					util.removeClass(opt, "excluded");
				}
			}
		});

		if ( open ) {
			if (!_.searchItems.length && !_.settings.taggable) {
				_.setMessage("No results.");
				_.input.focus();
			} else {
				_.open();
			}
		} else {
			if ( _.searchItems.length ) {
				var arr = {};
				arr.values = [];
				util.each(_.searchItems, function(i, item) {
					var option = _.el.options[item.idx];
					arr.values[i] = {
						value: option.value,
						text: option.textContent
					};
				});

				return arr;
			}
		}

		_.emit("selectr.search", query, _.searchItems);
	};

	/**
	 * Toggle the dropdown
	 */
	Selectr.prototype.toggle = function() {
		if (!this.disabled) {
			var open = util.hasClass(this.container, "open");
			if (open) {
				this.close();
			} else {
				this.open();
			}
		}
	};

	/**
	 * Open the dropdown
	 */
	Selectr.prototype.open = function() {
		var _ = this;

		util.addClass(_.container, "open");

		_.optsRect = util.getBoundingRect(_.optsOptions);

		var wh = window.innerHeight;
		var scrollHeight = _.optsOptions.scrollHeight;
		var doInvert = _.elRect.top + _.elRect.height + _.optsRect.height > wh;

		if ( scrollHeight <= _.optsRect.height ) {
			if ( _.requiresPagination ) {
				paginate.call(_);
			}
		}

		if (doInvert) {
			util.addClass(_.container, "inverted");
			this.isInverted = true;
		} else {
			util.removeClass(_.container, "inverted");
			this.isInverted = false;
		}

		util.removeClass(_.container, "notice");

		if (_.settings.searchable && !_.settings.taggable) {
			setTimeout(function() {
				_.input.focus();
			}, 10);
		}

		_.optsRect = util.getBoundingRect(_.optsOptions);

		if ( !this.opened ) {
			_.emit("selectr.open");
		}

		_.opened = true;
	};

	/**
	 * Close the dropdown
	 */
	Selectr.prototype.close = function() {
		var notice = util.hasClass(this.container, "notice");

		if (this.settings.searchable && !notice) {
			this.input.blur();
			this.searching = false;
		}

		if (notice) {
			util.removeClass(this.container, "notice");
			this.notice.textContent = "";
		}

		util.removeClass(this.container, "open");

		clearSearch.call(this);

		if ( this.opened ) {
			this.emit("selectr.close");
		}

		this.opened = false;
	};

	/**
	 * Reset to initial state
	 */
	Selectr.prototype.reset = function(init) {
		this.clear();

		setSelected.call(this);

		util.each(this.el.options, function(i,opt) {
			if ( opt.defaultSelected ) {
				change.call(this, i);
			}
		}, this);

		this.emit("selectr.reset");
	};

	/**
	 * Clear all selections
	 */
	Selectr.prototype.clear = function(init) {
		if ( this.el.multiple ) {
			// Copy the array for reference otherwise it'll chuck an error
			var indexes = this.selectedIndexes.slice();
			util.each(indexes, function(i, index) {
				deselect.call(this, index);
			}, this);
		} else {
			deselect.call(this, this.selectedIndex);
		}

		this.emit("selectr.clear");
	};

	Selectr.prototype.serialise = function(toJson) {
		var data = [];
		util.each(this.el.options, function(i, option) {
			var obj = {
				value: option.value,
				text: option.textContent
			};

			if ( option.defaultSelected ) {
				obj.selected = true;
			}
			if ( option.disabled ) {
				obj.disabled = true;
			}
			data[i] = obj;
		});

		return toJson ? JSON.stringify(data) : data;
	};

	/* Friends from across the pond */
	Selectr.prototype.serialize = function(toJson) {
		return this.serialise(toJson);
	};

	/**
	 * Display a message
	 * @param  {string} message The message
	 */
	Selectr.prototype.setMessage = function(message, close) {
		if ( close ) {
			this.close();
		}
		util.addClass(this.container, "notice");
		this.notice.textContent = message;
	};

	return Selectr;
}));
