/*!
 * Selectr 2.0.2
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
			var p;
			for (p in props)
				if (props.hasOwnProperty(p)) src[p] = props[p];
			return src;
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
		append: function(p, e) {
			return p && e && p.appendChild(e);
		},
		listen: function(e, type, callback, capture) {
			e.addEventListener(type, callback, capture || false);
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
		var m = this.multiple;

		util.each(this.el.options, function(i, opt) {
			if ((m && o.selectedValue && util.includes(o.selectedValue, opt.value)) || (!m && o.selectedValue && opt.value == o.selectedValue)) {
				// Setting the selected property does not change defaultSelected to true
				// which we"ll need to check for later
				opt.defaultSelected = true;
			}
		});
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

			util.each(data, function(idx, itm) {
				_.el.add(new Option(itm.text, itm.value, itm.selected || false, itm.selected || false));
			});

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

		setWidth.call(_);

		this.container.style.width = this.width;

		_.selected = util.createElement("div", {
			class: "selectr-selected"
		});

		_.label = util.createElement(_.multiple ? "ul" : "span", {
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

		if (_.multiple) {
			util.addClass(_.label, "selectr-tags");
			util.addClass(_.container, "multiple");

			// Collection of tags
			this.tags = [];

			// Collection of selected values
			this.selectedValues = [];

			// Collection of selected indexes
			this.selectedIndexes = [];
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
				util.append(group, util.createElement("li", {
					class: "selectr-optgroup--label",
					text: opt.label
				}));
				util.append(_.optsOptions, group);

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

		_.selected.appendChild(_.label);

		if ( o.clearable ) {
			_.selectClear = util.createElement("button", {
				class: "selectr-clear",
				type: "button"
			});

			util.append(_.selected, _.selectClear);
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

			util.append(_.inputContainer, _.input);
			util.append(_.inputContainer, _.inputClear);
			util.append(optsContainer, _.inputContainer);
		}

		util.append(optsContainer, _.notice);
		util.append(optsContainer, _.optsOptions);

		util.append(_.container, _.selected);
		util.append(_.container, optsContainer);

		// Set the placeholder
		var placeholder = o.placeholder || _.el.getAttribute("placeholder") || "Choose...";
		_.placeEl = util.createElement("div", {
			class: "selectr-placeholder",
			html: placeholder
		});
		util.append(_.selected, _.placeEl);

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
			selectOption.call(this, i, true);
		}

		if (option.disabled) {
			util.addClass(opt, "disabled");
		}

		if (group) {
			util.append(group, opt);
		} else {
			util.append(this.optsOptions, opt);
		}

		if (!option.disabled) {
			this.list.push(opt);
		}
	};

	var addListeners = function() {
		var _ = this;

		_.requiresPagination = _.settings.data && _.settings.data.length > _.settings.pagination;

		_.handleDismiss = dismiss.bind(_);

		// Global listener
		util.listen(_.container, "click", function(e) {
			e = e || window.event;

			var target = e.target;

			var isSelected = util.closest(target, function(el) {
				return (el && el == _.selected);
			});


			// Clear
			if ( _.settings.clearable && target === _.selectClear ) {
				_.clear();
				return;
			}

			// Remove tag button
			if (util.hasClass(target, "selectr-tag-remove")) {
				removeTag.call(_, target.parentNode.tag);
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
				selectOption.call(_, index);
			}


			util.preventDefault(e);
		});

		// Prevent text selection
		util.listen(_.selected, "mousedown", function(e) { util.preventDefault(e); });
		util.listen(_.optsOptions, "mousedown", function(e) { util.preventDefault(e); });

		if (_.settings.searchable) {
			util.listen(_.inputClear, "click", function(e) {
				clearSearch.call(_);
			});
		}

		util.listen(document, "click", _.handleDismiss);
		util.listen(document, "keydown", navigate.bind(_));
		util.listen(document, "keyup", function(e) {
			if ( _.settings.searchable && e.target == _.input ) {
				_.search(_.input.value, true);
			}
			if (_.navigating && e.keyCode != 13) {
				_.navigating = false;
			}
		});

		_.update = util.debounce(function() {
			if (_.opened) {
				_.close();
			}
			if ( this.width ) {
				this.container.style.width = this.width;
			}
		}, 50);

		util.listen(window, "resize", _.update);
		util.listen(window, "scroll", _.update);

		if (_.requiresPagination) {
			_.paginateItems = util.debounce(function() {
				paginate.call(_);
			}, 50);

			util.listen(_.optsOptions, "scroll", _.paginateItems);
		}
	};

	var selectOption = function(index, init) {
		var _ = this;
		var opt = _.items[index];
		var option = _.el.options[index];

		if (option.disabled) {
			return;
		}

		if (init) {
			if (_.multiple) {
				addTag.call(_, index);
			} else {
				util.addClass(_.items[index], "selected");
				util.addClass(_.container, "has-selected");
				_.label.innerHTML = _.customSelected ? _.settings.renderSelection(option) : option.textContent;
				_.selectedValue = option.value;
				_.selectedIndex = index;
			}
			return;
		}

		if (_.multiple) {
			if (!util.hasClass(opt, "selected")) {
				addTag.call(_, index);
			} else {
				removeTag.call(_, option.value);
			}
		} else {
			if (util.hasClass(opt, "selected")) {
				option.defaultSelected = false;
				util.removeClass(_.items[index], "selected");
				util.removeClass(_.container, "has-selected");
				_.label.innerHTML = "";
				_.selectedValue = null;

				_.emit("selectr.deselect", option);
			} else {
				option.defaultSelected = true;
				util.addClass(_.items[index], "selected");
				util.addClass(_.container, "has-selected");
				_.label.innerHTML = _.customSelected ? _.settings.renderSelection(option) : option.textContent;
				_.selectedValue = option.value;
				_.selectedIndex = index;

				_.emit("selectr.select", option);
			}

			util.each(_.items, function(i, o) {
				if (i != index) {
					util.removeClass(o, "selected");
					_.el.options[i].defaultSelected = false;
				}
			});
		}

		if (_.opened && !_.multiple) {
			_.close();
		}
	};

	var addTag = function(index) {
		var _ = this;

		if (util.includes(_.selectedIndexes, index) ) {
			return;
		}

		if ( _.multiple ) {
			var max = _.settings.maxSelections;
			if ( max && _.tags.length == max ) {
				_.setMessage("A maximum of " + max + " items can be selected.", true);
				return;
			}
		}

		var option = _.el.options[index];
		var docFrag = document.createDocumentFragment();
		var content = _.customSelected ? _.settings.renderSelection(option) : option.textContent;
		var tag = util.createElement("li", {
			class: "selectr-tag",
			html: content
		});
		var btn = util.createElement("button", {
			class: "selectr-tag-remove",
			type: "button"
		});

		util.append(tag, btn);

		// Set property to check against later
		tag.idx = index;
		tag.tag = option.value;
		_.selectedValues.push(tag.tag);
		_.selectedIndexes.push(index);

		_.tags.push(tag);

		if ( _.settings.sortSelected ) {

			var tags = _.tags.slice();

			tags.sort(function(a, b) {
				var x = [], y = [];

				// Deal with values that contain numbers
				a.tag.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { x.push([$1 || Infinity, $2 || ""]); });
				b.tag.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { y.push([$1 || Infinity, $2 || ""]); });

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
			util.append(docFrag, tag);
		}

		util.append(_.label, docFrag);


		option.defaultSelected = true;
		util.addClass(_.items[index], "selected");

		_.emit("selectr.select", option);

		if (!!_.label.children.length) {
			util.addClass(_.container, "has-selected");
		} else {
			util.removeClass(_.container, "has-selected");
		}
	};

	var removeTag = function(tag) {
		var _ = this,
			tagIdx = this.selectedValues.indexOf(tag),
			index, option;

		util.each(this.el.options, function(i, option) {
			if (tag == option.value) {
				index = i;
			}
		});

		if (index > -1) {
			option = _.el.options[index];
			_.tags[tagIdx].parentNode.removeChild(_.tags[tagIdx]);
			_.selectedValues.splice(tagIdx, 1);
			option.defaultSelected = false;
			_.tags.splice(tagIdx, 1);
			util.removeClass(_.items[index], "selected");

			var idxIndex = _.selectedIndexes.indexOf(index);
			_.selectedIndexes.splice(idxIndex, 1);

			_.emit("selectr.deselect", option);
		}

		if (!this.tags.length) {
			util.removeClass(this.container, "has-selected");
		}
	};

	var clearSearch = function() {
		var _  = this;
		_.input.value = null;
		_.searching = false;
		util.removeClass(_.inputContainer, "active");

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
	};

	var navigate = function(e) {
		e = e || window.event;

		var _ = this,
			keyCode = e.keyCode,
			keyCodes = [13, 38, 40];

		// Filter out the keys we don"t want
		if (!_.opened || keyCodes.indexOf(keyCode) < 0) return;

		util.preventDefault(e);

		var list = this.searching ? this.searchItems : this.list,
			dir;

		switch (keyCode) {
			case 13:
				var opt = _.optsOptions.querySelector(".active");
				var index = _.items.indexOf(opt);

				return void selectOption.call(_, index);
			case 38:
				dir = "up"; 
				if ( _.activeIdx > 0 ) { _.activeIdx--; }
				break;
			case 40:
				dir = "down"; 
				if ( _.activeIdx < list.length - 1 ) { _.activeIdx++; }
		}

		this.navigating = true;

		var nextElem = list[_.activeIdx];
		var nextRect = nextElem.getBoundingClientRect();
		var optsTop = _.optsOptions.scrollTop;
		var scrollY = window.scrollY || window.pageYOffset;
		var offset = _.optsRect.top + scrollY;
		var currentOffset, nextOffset;

		if (dir === "up") {
			var nextTop = nextRect.top + scrollY;
			currentOffset = offset;
			nextOffset = optsTop + (nextTop - currentOffset);

			if (_.activeIdx === 0) {
				_.optsOptions.scrollTop = 0;
			} else if (nextTop - currentOffset < 0) {
				_.optsOptions.scrollTop = nextOffset;
			}
		} else {
			var nextBottom = nextRect.top + scrollY + nextRect.height;
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

	/**
	 * Selectr
	 * @param {mixed} el      The element (HTMLSelectElement or CSS3 selector string)
	 * @param {obj} options User defined options
	 */
	function Selectr(el, options) {
		var defaults = {
			width: "auto",
			searchable: true,
			clearable: false,
			sortSelected: false
		};

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

		if (!this.el.options.length && !options.data) {
			throw new Error("You don't have any options in your select!");
		}

		this.settings = util.extend(defaults, options);

		Emitter.mixin(this);

		if (this.settings.multiple) {
			this.el.multiple = true;
		}

		this.multiple = this.el.type == "select-multiple";

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

		build.call(this);

		this.update();

		var _ = this;
		setTimeout(function() {
			_.emit("selectr.init");
		}, 20);
	}

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
		if ( !_.multiple && isArray ) {
			return;
		}

		util.each(this.el.options, function(i, opt) {
			if (isArray && util.includes(value.toString(), opt.value) || opt.value === value) {
				selectOption.call(_, i);
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

		if ( _.multiple ) {
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

	/**
	 * Perform a search
	 * @param  {string} query The query string
	 */
	Selectr.prototype.search = function(query, open) {

		query = query.trim();

		var _ = this;

		if (_.navigating) return;

		if (!util.hasClass(_.container, "notice")) {
			if (query.length > 0) {
				util.addClass(_.inputContainer, "active");
			} else {
				util.removeClass(_.inputContainer, "active");
			}
		}
		_.searching = true;
		_.searchItems = [];
		_.searchQuery = query;

		util.each(_.list, function(i, opt) {
			var text = opt.textContent.trim();
			if ( !util.includes(text.toLowerCase(), query.toLowerCase()) ) {
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
			if (!_.searchItems.length) {
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

		util.addClass(this.container, "open");

		_.optsRect = util.getBoundingRect(_.optsOptions);
		var wh = window.innerHeight;
		var scrollHeight = _.optsOptions.scrollHeight;

		if ( scrollHeight <= _.optsRect.height ) {
			paginate.call(_);
		}

		if (_.optsRect.bottom > wh) {
			util.addClass(this.container, "inverted");
		} else {
			util.removeClass(this.container, "inverted");
		}

		util.removeClass(this.container, "notice");

		if (this.settings.searchable) {
			setTimeout(function() {
				_.input.focus();
			}, 10);
		}

		this.opened = true;

		this.emit("selectr.open");
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

		this.opened = false;

		this.emit("selectr.close");
	};

	/**
	 * Reset to initial state
	 */
	Selectr.prototype.reset = function(init) {
		this.clear();

		setSelected.call(this);

		util.each(this.el.options, function(i,opt) {
			if ( opt.defaultSelected ) {
				selectOption.call(this, i);
			}
		}, this);

		this.emit("selectr.reset");
	};

	/**
	 * Clear all selections
	 */
	Selectr.prototype.clear = function(init) {
		if ( this.multiple ) {
			// Copy the array for reference otherwise it'll chuck an error
			var indexes = this.selectedIndexes.slice();
			util.each(indexes, function(i, index) {
				selectOption.call(this, index);
			}, this);
		} else {
			selectOption.call(this, this.selectedIndex);
		}

		clearSearch.call(this);

		this.emit("selectr.clear");
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
