/*!
 * Selectr 2.1.7
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
		createElement: function(e, a) {
			var d = document,
				el = d.createElement(e);
			if (a && util.isObject(a)) {
				var i;
				for (i in a)
					if (i in el) el[i] = a[i];
					else if ("html" === i) el.innerHTML = a[i];
				else if ("text" === i) {
					var t = d.createTextNode(a[i]);
					el.appendChild(t);
				} else el.setAttribute(i, a[i]);
			}
			return el;
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
		attr: function(el, attr, val) {
			if ( util.isObject(attr) ) {
				util.each(attr, function(a,v) {
					el.setAttribute(a,v);
				});
			} else {
				el.setAttribute(attr, val);
			}
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
		getRect: function(el, abs) {
			var w = window;
			var r = el.getBoundingClientRect();
			var x = abs ? w.pageXOffset : 0;
			var y = abs ? w.pageYOffset : 0;

			return {
				bottom: r.bottom + y,
				height: r.height,
				left  : r.left + x,
				right : r.right + x,
				top   : r.top + y,
				width : r.width
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

	/**
	 * Check for selected options
	 * @param {bool} reset
	 */
	var setSelected = function(reset) {
		var o = this.settings;
		var ops = this.el.options;

		if ( o.selectedValue ) {
			var val = o.selectedValue.toString();
			util.each(ops, function(i, op) {
				if ( util.includes(val, op.value) )  {
					op.selected = true;
					op.defaultSelected = true;
				}
			});
		}

		if ( !ops[0].defaultSelected && ops[0].selected ) {
			this.el.selectedIndex = -1;
		}

		// Check the original data for selected options on form.reset()
		if ( reset ) {
			if ( o.data ) {
				util.each(o.data, function(idx, itm) {
					var selected = itm.hasOwnProperty('selected') && itm.selected === true;
					util.each(ops, function(i, op) {
						if ( op.value === itm.value && selected ) {
							op.selected = true;
							op.defaultSelected = true;
						}
					});
				});
			}
		}
	};

	/**
	 * Set the custom width
	 */
	var setWidth = function() {
		var o = this.settings;
		var w = o.width;

		if (w) {
			if (util.isInt(w)) {
				w += "px";
			} else {
				if (w === "auto") {
					w = "100%";
				} else if (util.includes(o.width, "%")) {
					w = o.width;
				}
			}

			this.width = w;
		}
	};

	/**
	 * Render the containers
	 * @return {void}
	 */
	var build = function() {
		var _ = this;
		var o = _.settings;

		util.addClass(_.el, "hidden-input");

		// Check for data
		_.data = [];
		if ( o.data ) {
			_.pageIndex = 1;
			var data = o.pagination ? o.data.slice(0, o.pagination) : o.data;
			var firstSelected = false;

			var dataToOption = function (idx, obj) {
				var selected = obj.hasOwnProperty('selected') && obj.selected === true;
				var option = new Option(obj.text, obj.value, selected, selected);

				if ( obj.disabled ) {
					option.disabled = true;
				}

				if ( idx === 0 && selected ) {
					firstSelected = true;
				}

				return option;
			};

			var i = 0;

			util.each(data, function(idx, itm) {
				if ( itm.hasOwnProperty('children') ) {
					var g = util.createElement("optgroup", {
						label: itm.text
					});

					util.each(itm.children, function(k,c) {
						g.appendChild(dataToOption(i, c));
						i++;
					});

					_.el.appendChild(g);
				} else {
					_.el.appendChild(dataToOption(i, itm));
					i++;
				}
			});

			if ( !firstSelected ) {
				_.el.selectedIndex = -1;
			}

			if ( o.pagination ) {
				_.pages = o.data.map( function(v, i) {
					return i % o.pagination === 0 ? o.data.slice(i, i+o.pagination) : null;
				}).filter(function(pages){ return pages; });
			}

			_.data = o.data;
		}

		setSelected.call(_);

		util.each(_.data, function(i,o) {
			o.idx = i;
		});

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
			class: "selectr-selected",
			disabled: _.disabled,
			tabIndex: _.el.tabIndex, // enable tabIndex (#9)
			"aria-expanded": false
		});

		_.label = util.createElement(_.el.multiple ? "ul" : "span", {
			class: "selectr-label"
		});

		var optsContainer = util.createElement("div", {
			class: "selectr-options-container"
		});

		_.tree = util.createElement("ul", {
			class: "selectr-options",
			role: "tree",
			"aria-hidden": true,
			"aria-expanded": false
		});

		_.notice = util.createElement("div", {
			class: "selectr-notice"
		});

		// We don't want to focus on the native select box
		_.el.tabIndex = -1;

		util.attr(_.el, {
			"aria-hidden": true
		});

		if ( _.disabled ) {
			_.el.disabled = true;
		}

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

		if ( _.el.multiple && o.clearable || !_.el.multiple && o.allowDeselect ) {
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
				placeholder: "Enter a tag...",
				tagIndex: 0,
				autocomplete: "off",
				autocorrect: "off",
				autocapitalize: "off",
				spellcheck: "false",
				role: "textbox",
				type: "search"
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
				class: "selectr-input",
				tagIndex: -1,
				autocomplete: "off",
				autocorrect: "off",
				autocapitalize: "off",
				spellcheck: "false",
				role: "textbox",
				type: "search"
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

		var j = 0;

		// Check for optgroups
		if (_.hasOptGroups) {
			var x = 0;
			util.addClass(_.tree, "optgroups");
		}

		util.each(_.el.children, function(idx, opt) {
			if (opt.nodeName === "OPTGROUP") {
				var group = util.createElement("ul", {
					class: "selectr-optgroup",
					role: "group"
				});
				group.appendChild(util.createElement("li", {
					class: "selectr-optgroup--label",
					text: opt.label
				}));
				_.tree.appendChild(group);

				if (opt.children) {
					util.each(opt.children, function(i, option) {
						if ( o.pagination && o.data && x >= o.pagination ) return;
						buildOption.call(_, x, option, group);
						x++;
					});
				}
			} else {
				if ( o.pagination && o.data && j >= o.pagination ) return;
				buildOption.call(_, j, opt);
				j++;
			}
		});

		util.addClass(_.list[_.activeIdx], "active");

		optsContainer.appendChild(_.notice);
		optsContainer.appendChild(_.tree);

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

	/**
	 * Build an list item from the HTMLOptionElement
	 * @param  {int} i      HTMLOptionElement index
	 * @param  {HTMLOptionElement} option
	 * @param  {bool} group  Has parent optgroup
	 * @return {void}
	 */
	var buildOption = function(i, option, group) {
		if (option.nodeName !== "OPTION" || !option.value) return;

		var content = this.customOption ? this.settings.renderOption(option) : option.textContent.trim();
		var opt = util.createElement("li", {
			class: "selectr-option",
			html: content,
			role: "treeitem",
			"aria-selected": false
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
			this.tree.appendChild(opt);
		}

		if (!option.disabled) {
			this.list.push(opt);
		}
	};

	/**
	 * Add the required event listeners
	 */
	var addListeners = function() {
		var _ = this, o = _.settings;

		this.events = {};

		this.events.keyup = keyup.bind(_);
		this.events.navigate = navigate.bind(_);
		this.events.dismiss = dismiss.bind(_);
		this.events.reset = this.reset.bind(_);

		_.requiresPagination = o.data && o.data.length > o.pagination;

		// Global listener
		util.on(_.container, "click", function(e) {

			if ( _.disabled ) return false;

			e = e || window.event;

			var t = e.target;

			var isSelected = util.closest(t, function(el) {
				return (el && el == _.selected);
			});

			if ( t === _.input ) {
				return;
			}


			// Clear
			if ( o.clearable && t === _.selectClear ) {
				_.clear();
				return;
			}

			// Remove tag button
			if (util.hasClass(t, "selectr-tag-remove")) {
				deselect.call(_, t.parentNode.idx);
			}

			// Click on placeholder or selected text
			if (t === _.label || t === _.placeEl) {
				t = _.placeEl.parentNode;
			}

			// Open / close dropdown
			if (isSelected || t === _.selected) {
				_.toggle();
			}

			// Select option
			if (util.hasClass(t, "selectr-option")) {
				var index = _.items.indexOf(t);
				change.call(_, index);
			}


			util.preventDefault(e);
		});

		// Prevent text selection
		util.on(_.tree, "mousedown", function(e) { util.preventDefault(e); });

		// Mouseover list items
		util.on(_.tree, "mouseover", function(e) {
			var t = e.target;

			var option = util.closest(t, function(el) {
				return el && util.hasClass(el, "selectr-option");
			});

			if ( option ) {
				util.removeClass(_.items[_.activeIdx], "active");
				util.addClass(t, "active");
				_.activeIdx = [].slice.call(_.items).indexOf(t);
			}
		});

		if (o.searchable) {
			util.on(_.inputClear, "click", function(e) {
				clearSearch.call(_);
			});
		}

		util.on(document, "click", this.events.dismiss);
		util.on(document, "keydown", this.events.navigate);
		util.on(document, "keyup", this.events.keyup);

		_.update = util.debounce(function() {
			// Optionally close dropdown on scroll / resize (#11)
			if (_.opened && o.closeOnScroll) {
				_.close();
			}
			if ( this.width ) {
				this.container.style.width = this.width;
			}
			checkInvert.call(_);
		}, 50);

		util.on(window, "resize", _.update);
		util.on(window, "scroll", _.update);

		if (_.requiresPagination) {
			_.paginateItems = util.debounce(function() {
				paginate.call(_);
			}, 50);

			util.on(_.tree, "scroll", _.paginateItems);
		}

		// Listen for form.reset() (#13)
		var form = _.el.form;
		if ( form ) {
			util.on(form, "reset", this.events.reset);
		}
	};

	/**
	 * Trigger a change
	 * @param  {int} index
	 * @param  {bool} init
	 * @return {void}
	 */
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

	/**
	 * Select an option
	 * @param  {int} index
	 * @return {void}
	 */
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

			util.each(this.el.options, function(i, o) {
				var opt = this.items[i];

				if ( i !== index ) {
					if ( opt ) {
						util.removeClass(opt, "selected");
					}
					o.selected = false;
					o.defaultSelected = false;
				}
			}, this);
		}

		util.attr(this.items[index], {
			"aria-selected": true
		});

		util.addClass(this.items[index], "selected");
		util.addClass(this.container, "has-selected");

		option.selected = true;
		option.defaultSelected = true;

		this.emit("selectr.select", option);
		this.emit("selectr.change", option);
	};

	/**
	 * Deselect an options
	 * @param  {int} index
	 * @return {void}
	 */
	var deselect = function(index) {
		var option = this.el.options[index];

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
			if ( !this.settings.allowDeselect ) {
				return false;
			}

			this.label.innerHTML = "";
			this.selectedValue = null;

			this.el.selectedIndex = -1;

			util.removeClass(this.container, "has-selected");
		}

		util.attr(this.items[index], {
			"aria-selected": false
		});

		util.removeClass(this.items[index], "selected");

		option.selected = false;
		option.defaultSelected = false;

		this.emit("selectr.deselect", option);
		this.emit("selectr.change", option);
	};

	/**
	 * Add a tag
	 * @param {int} index
	 */
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

	/**
	 * Remove a tag
	 * @param  {int}
	 * @return {void}
	 */
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

	/**
	 * Clear a search
	 * @return {void}
	 */
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

	/**
	 * keyup listener
	 * @param  {obj} e
	 * @return {void}
	 */
	var keyup = function(e) {
		var _ = this;
		if ( e.target === _.input ) {
			_.search(_.input.value, true);
		}
		if (_.navigating && e.keyCode !== 13) {
			_.navigating = false;
		}

		if ( _.settings.taggable && _.input.value.length ) {
			var val = _.input.value.trim();

			if ( _.searchItems.length ) {
				return false;
			}

			if ( e.which === 13 || util.includes(_.tagSeperators, e.key) ) {

				util.each(_.tagSeperators, function(i,k) {
					val = val.replace(k, '');
				});

				var option = _.addOption({
					value: val,
					text: val,
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

	/**
	 * Navigate through the dropdown
	 * @param  {obj} e
	 * @return {void}
	 */
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
					_.input.value = "";
				}
				var opt = _.tree.querySelector(".active");
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

		var nxtEl = list[_.activeIdx];
		var nxtRct = util.getRect(nxtEl);
		var opsTop = _.tree.scrollTop;
		var offset = _.optsRect.top;
		var curOffset, nxtOffset;

		if (dir > 0) {
			var nxtTp = nxtRct.top;
			curOffset = offset;
			nxtOffset = opsTop + (nxtTp - curOffset);

			if (_.activeIdx === 0) {
				_.tree.scrollTop = 0;
			} else if (nxtTp - curOffset < 0) {
				_.tree.scrollTop = nxtOffset;
			}
		} else {
			var nxtBottom = nxtRct.top + nxtRct.height;
			curOffset = offset + _.optsRect.height;
			nxtOffset = opsTop + (nxtBottom - curOffset);

			if (_.activeIdx === 0) {
				_.tree.scrollTop = 0;
			} else if (nxtBottom > curOffset) {
				_.tree.scrollTop = nxtOffset;
			}

			if ( _.requiresPagination ) {
				paginate.call(_);
			}
		}

		util.removeClass(_.tree.querySelector(".active"), "active");
		util.addClass(list[_.activeIdx], "active");
	};

	/**
	 * Paginate the dataset
	 * @return {void}
	 */
	var paginate = function() {
		var _ = this;
		var opts = _.tree;
		var scrollTop = opts.scrollTop;
		var scrollHeight = opts.scrollHeight;
		var offsetHeight = opts.offsetHeight;
		var atBottom = scrollTop >= (scrollHeight - offsetHeight);

		if ( (atBottom && _.pageIndex < _.pages.length) || _.activeIdx === _.list.length - 1 ) {
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

	/**
	 * Keep the dropdown within the window
	 * @return {void}
	 */
	var checkInvert = function() {
		var s = util.getRect(this.selected);
		var o = this.tree.parentNode.offsetHeight;
		var wh = window.innerHeight;
		var doInvert =  s.top + s.height + o > wh;

		if (doInvert) {
			util.addClass(this.container, "inverted");
			this.isInverted = true;
		} else {
			util.removeClass(this.container, "inverted");
			this.isInverted = false;
		}

		this.optsRect = util.getRect(this.tree);
	};

	/**
	 * Dismiss / close the dropdown
	 * @param  {obj} e
	 * @return {void}
	 */
	var dismiss = function(e) {
		var target = e.target;
		if (!this.container.contains(target) && (this.opened || this.container.classList.contains("notice"))) {
			this.close();
		}
	};

	/**
	 * Query matching for searches
	 * @param  {string} query
	 * @param  {HTMLOptionElement} opt
	 * @param  {string} text
	 * @return {bool}
	 */
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
	 * Plugin defaults
	 * @type {Object}
	 */
	var defaults = {
		width: "auto",
		disabled: false,
		searchable: true,
		clearable: false,
		sortSelected: false,
		allowDeselect: false,
		closeOnScroll: false
	};

	/**
	 * Selectr
	 * @param {mixed} el      The element (HTMLSelectElement or CSS3 selector string)
	 * @param {obj} options User defined options
	 */
	function Selectr(el, options) {

		options = options || {};

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

		this.sortDirection = "asc";
		this.originalType = this.el.type;
		this.originalIndex = this.el.tabIndex;

		this.render(options);
	}

	/**
	 * Render the instance
	 * @param  {object} options
	 * @return {void}
	 */
	Selectr.prototype.render = function(options) {

		if ( this.rendered ) return;

		this.disabled = false;

		this.settings = util.extend(defaults, options);

		if (this.settings.multiple || this.settings.taggable) {
			this.el.multiple = true;
		}

		if ( this.settings.taggable ) {
			this.settings.searchable = false;
		}

		if ( this.settings.disabled ) {
			this.disabled = true;
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

		Emitter.mixin(this);

		build.call(this);

		this.update();

		this.optsRect = util.getRect(this.tree);

		this.rendered = true;

		var _ = this;
		setTimeout(function() {
			_.emit("selectr.init");
		}, 20);
	};

	/**
	 * Destroy the instance
	 * @return {void}
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

		// Remove reset listener from parent form
		var form = this.el.form;
		if ( form ) {
			util.off(form, "reset", this.events.reset);
		}

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

		// Can't pass array to select-one
		if ( !_.el.multiple && isArray ) {
			return false;
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

	/**
	 * Add a new option
	 * @param {object} data
	 */
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
				option.selected = true;
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
	 * @return {void}
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
	 * @return {void}
	 */
	Selectr.prototype.open = function() {
		var _ = this;

		util.addClass(_.container, "open");

		checkInvert.call(_);

		var scrollHeight = this.tree.scrollHeight;

		if ( scrollHeight <= _.optsRect.height ) {
			if ( _.requiresPagination ) {
				paginate.call(_);
			}
		}

		util.removeClass(_.container, "notice");

		util.attr(_.selected, "aria-expanded", true);
		util.attr(_.tree, {
			"aria-hidden": false,
			"aria-expanded": true
		});

		if (_.settings.searchable && !_.settings.taggable) {
			setTimeout(function() {
				_.input.focus();
				// Allow tab focus
				_.input.tabIndex = 0;
			}, 10);
		}

		if ( !this.opened ) {
			_.emit("selectr.open");
		}

		_.opened = true;
	};

	/**
	 * Close the dropdown
	 * @return {void}
	 */
	Selectr.prototype.close = function() {
		var notice = util.hasClass(this.container, "notice");

		if (this.settings.searchable && !notice) {
			this.input.blur();
			// Disable tab focus
			this.input.tabIndex = -1;
			this.searching = false;
		}

		if (notice) {
			util.removeClass(this.container, "notice");
			this.notice.textContent = "";
		}

		util.removeClass(this.container, "open");

		util.attr(this.selected, "aria-expanded", false);
		util.attr(this.tree, {
			"aria-hidden": true,
			"aria-expanded": false
		});

		clearSearch.call(this);

		if ( this.opened ) {
			this.emit("selectr.close");
		}

		this.opened = false;
	};

	/**
	 * Reset to initial state
	 * @return {void}
	 */
	Selectr.prototype.reset = function() {
		if ( !this.disabled ) {
			this.clear();

			setSelected.call(this, true);

			util.each(this.el.options, function(i,opt) {
				if ( opt.defaultSelected ) {
					change.call(this, i);
				}
			}, this);

			this.emit("selectr.reset");
		}
	};

	/**
	 * Clear all selections
	 * @return {void}
	 */
	Selectr.prototype.clear = function() {
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

	/**
	 * Return serialised data
	 * @param  {boolean} toJson
	 * @return {mixed} Returns either an object or JSON string
	 */
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

	/**
	 * Localised version of serialise() method
	 */
	Selectr.prototype.serialize = function(toJson) {
		return this.serialise(toJson);
	};

	/**
	 * Enable the element
	 * @return {void}
	 */
	Selectr.prototype.enable = function() {
		if ( this.disabled ) {
			this.disabled = false;
			this.el.disabled = false;

			this.selected.tabIndex = this.originalIndex;

			util.each(this.tags, function(i,t) {
				t.lastElementChild.tabIndex = 0;
			});

			util.removeClass(this.container, "disabled");
		}
	};

	/**
	 * Disable the element
	 * @param  {boolean} container Disable the container only (allow value submit with form)
	 * @return {void}
	 */
	Selectr.prototype.disable = function(container) {
		if ( !this.disabled ) {
			if ( !container ) {
				this.el.disabled = true;
			}

			this.selected.tabIndex = -1;

			util.each(this.tags, function(i,t) {
				t.lastElementChild.tabIndex = -1;
			});

			this.disabled = true;
			util.addClass(this.container, "disabled");
		}
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