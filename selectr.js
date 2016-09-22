/*!
 * Selectr 1.0.2
 * http://mobiuswebdesign.co.uk/plugins/selectr
 *
 * Released under the MIT license
 */

(function (root, factory) {
	var plugin = 'Selectr';

	if (typeof define === 'function' && define.amd) {
		define([], factory(plugin));
	} else if (typeof exports === 'object') {
		module.exports = factory(plugin);
	} else {
		root[plugin] = factory(plugin);
	}
}(this, function (plugin) {
	'use strict';

	/* HELPERS */
	var extend = function (src, props) {
		var p;
		for (p in props)
			if (props.hasOwnProperty(p)) src[p] = props[p];
		return src;
	};

	var _newElem = function(a, b) {
		var c, d = document.createElement(a);
		if (b && "object" == typeof b)
			for (c in b)
				if (c in d) "innerHTML" === c ? d.innerHTML = b[c] : d[c] = b[c];
				else if ("class" === c)
			for (var e = b[c].split(" "), f = e.length - 1; f >= 0; f--) {
				if ( e[f].length )
					d.classList.add(e[f]);
			}
		else d.setAttribute(c, b[c]);
		return d
	};

	var forEach = function(a, b, c) {
		if ("[object Object]" === Object.prototype.toString.call(a)) {
			var d;
			for (d in a) Object.prototype.hasOwnProperty.call(a, d) && b.call(c, d, a[d], a)
		} else
			for (var e = 0, f = a.length; e < f; e++) b.call(c, e, a[e], a)
	};

	var debounce = function(a, b, c) {
		var d;
		return function() {
			var e = this, f = arguments, g = function() { d = null, c || a.apply(e, f) }, h = c && !d;
			clearTimeout(d), d = setTimeout(g, b), h && a.apply(e, f)
		}
	};

	var _hasClass = function(e,c) {
		if (e.classList) {
			return e.classList.contains(c);
		} else {
			return !!e.className.match(new RegExp('(\\s|^)'+c+'(\\s|$)'))
		}
	}

	var _addClass=function(e,c){
		if (e.classList) {
			e.classList.add(c);
		} else {
			e.className = e.className.trim()+" "+c;
		}
	}

	var _removeClass=function(e,c){
		if (e.classList) {
			e.classList.remove(c);
		} else {
			e.c = e.c.replace(new RegExp('(^|\\b)' +
							c.split(' ').join('|') +
							'(\\b|$)', 'gi'), ' ');
		}
	}

	var _append = function(p, c) { p.appendChild(c) }
	var _addListener = function(e, type, callback, capture) { e.addEventListener(type, callback, capture || false); }

	/**
	 * PLUGIN
	 */
	function Plugin(elem, opts) {

		if ( elem === null ) {
			throw new Error('Selectr requires an element to work.');
			return;
		}

		var defaults = {
			minChars: 1,
			width: 'auto',
			emptyOption: true,
			searchable: true,
			selectedIndex: null,
			selectedValue: null,
			selectedIndexes: [],
			selectedValues: [],
			containerClass: '',
			maxSelections: null,
		};

		this.elem = elem;
		this.elemRect = this.elem.getBoundingClientRect();
		this.selectedVal = null;
		this.selectedVals = [];
		this.ajaxOpts = false;
		this.tags = [];
		this.opts = [];
		this.values = [];
		this.list = [];
		this.lastLen = 0;
		this.disabled = false;
		this.opened = false;
		this.searching = false;
		this.searchList = [];
		this.activeIdx = 0;
		this.remote = false;

		this.options = extend(defaults, opts);

		this.hasTemplate = this.options.hasOwnProperty('render') && typeof this.options.render === 'function';

		this.initialise();
	}


	// Plugin prototype
	Plugin.prototype = {

		initialise: function()
		{
			if ( this.initialised ) return;

			var _this = this;

			this.on = function(event, callback) {
				this.elem.addEventListener(event, function(e) {
					callback.call(this, e, _this);
				});
			};

			if ( _this.options.multiple ) {
				_this.elem.setAttribute('multiple', true);
				_this.elem.multiple = true;
			}

			if ( this.options.data ) {
				var docFrag = document.createDocumentFragment();
				_forEach(this.options.data, function(idx, itm) {
					let opt = _newElem('option', { value: itm.value });
					opt.textContent = itm.text;
					docFrag.appendChild(opt);
				});
				this.elem.appendChild(docFrag);
			}

			if ( _this.options.ajax && typeof _this.options.ajax === 'object' ) {
				_this.setAjaxUrl();
			} else {
				this.setSelections();
			}

			this.build();

			this.initialised = true;

			setTimeout(function() {
				_this.emit('selectr.init');
			}, 100);
		},

		/**
		 * Check for selected indexes / values in the user options and set.
		 */
		setSelections: function()
		{
			var _this = this;

			if ( this.elem.options[0].parentNode.nodeName === 'OPTGROUP' ) {
				this.hasOptGroups = true;
			}

			if ( !this.elem.multiple ) {
				if ( this.options.emptyOption ) {
					this.emptyOpt = _newElem('option', { value: '', selected: true });

					if ( this.hasOptGroups ) {
						this.elem.insertBefore(this.emptyOpt, this.elem.options[0].parentNode);
					} else {
						this.elem.insertBefore(this.emptyOpt, this.elem.options[0]);
					}
				}
				if ( this.options.selectedIndex !== null ) {
					if ( this.options.emptyOption ) {
						this.options.selectedIndex++;
					}
					this.elem.value = this.elem.options[this.options.selectedIndex].value;
				} else if ( this.options.selectedValue !== null ) {
					this.elem.value = this.options.selectedValue;
					this.selectedVal = this.options.selectedValue;
				}
			} else {
				this.options.emptyOption = false;
				if ( this.options.selectedIndexes.length || this.options.selectedValues.length ) {
					forEach(this.elem.options, function(i, option) {
						option.selected = false;
						if ( _this.options.selectedIndexes.indexOf(i) > -1 || _this.options.selectedValues.indexOf(option.value) > -1 ) {
							option.selected = true;
						}
					});
				}
			}
		},

		setAjaxUrl: function()
		{
			this.ajaxOpts = true;

			var _this = this, ajax = _this.options.ajax;

			_this.ajax_url = ajax.url;

			if ( ajax.queryParam ) {
				_this.ajax_url += '?';
				if ( ajax.params ) {
					forEach(ajax.params, function(p, v) {
						_this.ajax_url += p + '=' + v + '&';
					});
				}
				_this.ajax_url += ajax.queryParam + '=';
			}

			if ( typeof _this.options.ajax.formatSelected !== 'function' ) {
				_this.options.ajax.formatSelected = function(item) {
					return item.text;
				}
			}
		},

		/**
		 * Build the elems
		 * @return void
		 */
		build: function()
		{
			var _this = this;
			this.optsFrag = document.createDocumentFragment();

			_addClass(this.elem, 'hidden-input');

			this.container = _newElem('div', { id: 'selectr-' + _this.elem.id, class: 'selectr-container ' + this.options.containerClass });
			this.selected = _newElem('div', { class: 'selectr-selected' });
			this.txt = _newElem(this.elem.multiple ? 'ul' : 'span', { class: 'selectr-text' });
			this.optsContainer = _newElem('div', { class: 'selectr-options-container' });
			this.optsOptions = _newElem('ul', { class: 'selectr-options' });
			this.notice = _newElem('div', { class: 'selectr-notice' });

			// Create the elems for tagging
			if ( !!this.elem.multiple ) {
				_addClass(this.txt, 'selectr-tags');
				_addClass(this.container, 'multiple');
			}

			// Create the elems needed for the search option
			if ( this.options.searchable ) {
				this.input = _newElem('input', { class: 'selectr-input' });
				this.clear = _newElem('button', { class: 'selectr-clear', type: 'button' });
				this.inputContainer = _newElem('div', { class: 'selectr-input-container' });
			}

			if ( !_this.options.ajax ) {

				// Check for optgroups
				if ( this.hasOptGroups ) {
					_addClass(this.optsOptions, 'optgroups');
					forEach(this.elem.children, function(idx, opt) {
						if ( opt.nodeName === 'OPTGROUP' ) {
							let group = _newElem('li', { class: 'selectr-optgroup', innerHTML: opt.label });
							_append(_this.optsFrag, group);

							if ( opt.children ) {
								forEach(opt.children, function(i, option) {
									_this.buildOption(i, option);
								});
							}
						}
					});
				} else {
					forEach(this.elem.options, function(i, option) {
						_this.buildOption(i, option);
					});
				}

				_addClass(this.list[this.activeIdx], 'active');
			}


			_append(this.optsOptions, this.optsFrag);
			_append(this.selected, this.txt);
			_append(this.container, this.selected);

			if ( this.options.searchable ) {
				_append(this.inputContainer, this.input);
				_append(this.inputContainer, this.clear);
				_append(this.optsContainer, this.inputContainer);
			}

			_append(this.optsContainer, this.optsOptions);
			_append(this.optsContainer, this.notice);
			_append(this.container, this.optsContainer);

			// Set the placeholder
			var placeholder = this.options.placeholder || this.elem.getAttribute('placeholder') || 'Choose...';
			_append(this.selected, _newElem('div', { class: 'selectr-placeholder', innerHTML:  placeholder}));

			if ( (!this.elem.multiple && !!this.elem.value.length) || (this.elem.multiple && !!this.txt.children.length) ) {
				_addClass(this.container, 'has-selected');
				if ( !this.elem.multiple && this.emptyOpt ) {
					this.emptyOpt.selected = false;
				}
			}

			// Append the new container
			this.elem.parentNode.insertBefore(this.container, this.elem);

			// Append the elem to it's new container
			_append(this.container, this.elem);

			this.setDimensions();

			this.attachEventListeners();
		},

		buildOption: function(index, option)
		{
			if ( option === this.emptyOpt || option.nodeName !== 'OPTION' || !option.value ) return;

			var content = this.hasTemplate ? this.options.render(option) : option.textContent.trim();
			var opt = _newElem('li', { class: 'selectr-option', innerHTML: content });

			if ( option.hasAttribute('selected') ) {
				option.selected = true;
			}

			_append(this.optsFrag, opt);

			if ( option.selected ) {

				_addClass(opt, 'selected');

				if ( this.elem.multiple ) {
					this.createTag(option);
				} else {
					this.txt.innerHTML = content;
					this.selectedIndex = index;
				}

				this.selectedVals.push(option.value);
			}

			if ( option.disabled )  {
				_addClass(opt, 'disabled');
				return;
			}

			this.opts.push(option);
			this.values.push(option.value);
			this.list.push(opt);
		},

		attachEventListeners: function()
		{
			var _this = this;

			// Prevent text selection
			_addListener(_this.selected, 'mousedown', function(e){ e.preventDefault(); });
			_addListener(_this.optsOptions, 'mousedown', function(e){ e.preventDefault(); });

			_addListener(_this.selected, 'click', _this.toggleOptions.bind(_this));
			_addListener(_this.optsOptions, 'click', function(event) {
				_this.selectOption(event);
			});

			if ( _this.elem.multiple ) {
				_addListener(_this.txt, 'click', _this.removeTags.bind(_this));
			}

			if ( _this.options.searchable ) {
				_addListener(_this.input, 'keyup', _this.search.bind(_this));
				_addListener(_this.clear, 'click', _this.clearOptions.bind(_this));
			}


			_this.handleDismiss = _this.dismiss.bind(_this);
			_this.handleNavigate = _this.navigate.bind(_this);

			_addListener(document, 'click', _this.handleDismiss);
			_addListener(document, 'keydown', _this.handleNavigate);

			_this.resize = debounce(function() {
				_this.setDimensions();
			}, 100);

			_addListener(window, 'resize', _this.resize);
		},

		navigate: function(event)
		{
			event = event || window.event;

			var _this = this, keyCode = event.keyCode;

			// Filter out the keys we don't want
			if ( !_this.opened || (keyCode !== 13 && keyCode !== 38 && keyCode !== 40) ) return;

			event.preventDefault();

			var list = this.searching ? this.searchList : this.list, dir;

			switch (keyCode) {
				case 13: // select option
					_this.selectOption(event);
					return;
					break;
				case 38: // Scroll up options
					dir = 'up';
					if ( _this.activeIdx > 0 ) {
						_this.activeIdx--;
					}
					break;
				case 40: // scroll down options
					dir = 'down';
					if ( _this.activeIdx < list.length - 1 ) {
						_this.activeIdx++;
					};
					break;
			}

			var nextElem = list[_this.activeIdx];
			var nextRect = nextElem.getBoundingClientRect();

			if ( dir === 'up' ) {
				var currentOffset = _this.optsRect.top;
				var nextTop = nextRect.top;
				var nextOffset = _this.optsOptions.scrollTop + (nextTop - currentOffset);

				if (_this.activeIdx === 0) {
					_this.optsOptions.scrollTop = 0;
				} else if (nextTop - currentOffset < 0) {
					_this.optsOptions.scrollTop = nextOffset;
				}
			} else {
				var currentOffset = _this.optsRect.top +
					_this.optsOptions.offsetHeight;
				var nextBottom = nextRect.top + nextElem.offsetHeight;
				var nextOffset = _this.optsOptions.scrollTop + nextBottom - currentOffset;

				if (_this.activeIdx === 0) {
					_this.optsOptions.scrollTop = 0;
				} else if (nextBottom > currentOffset) {
					_this.optsOptions.scrollTop = nextOffset;
				}
			}


			// Set the class for highlighting
			forEach(list, function(i, opt) {
				if ( i === _this.activeIdx ) {
					_addClass(opt, 'active');
				} else {
					_removeClass(opt, 'active');
				}
			});
		},

		search: function(event)
		{
			var _this = this;
			var value = _this.input.value;
			var len = value.length;
			var navigating = event.keyCode === 38 || event.keyCode === 40;

			if ( ( len < this.options.minChars && len >= this.lastLen ) || navigating ) return;

			if ( this.ajaxOpts ) {
				this.ajaxSearch();
				return;
			}

			if ( !this.container.classList.contains('notice') ) {
				if ( value.length > 0 ) {
					_addClass(this.inputContainer, 'active');
				} else {
					_removeClass(this.inputContainer, 'active');
				}
			}

			_this.searching = true;
			_this.searchList = [];

			forEach(_this.opts, function(i, option) {
				let opt = _this.list[i];
				let val = option.textContent.trim();
				let val2 = value.trim();
				if ( !val.toLowerCase().includes(val2.toLowerCase()) ) {
					_addClass(opt, 'excluded');
					_removeClass(opt, 'match');
				} else {

					_this.searchList.push(opt);

					if ( _this.hasTemplate ) {
						_addClass(opt, 'match');
					} else {
						let result = new RegExp(val2, 'i').exec(val);
						opt.innerHTML = option.textContent.replace(result[0], '<span>'+result[0]+'</span>');
					}
					_removeClass(opt, 'excluded');
				}
			});

			if ( !_this.searchList.length ) {
				_this.notify('No results.');
				this.input.focus();
			} else {
				this.open();
			}

			this.lastLen = this.input.value.length;
		},

		selectOption: function(event)
		{
			event = event || window.event;

			var _this = this;
			var selected = event.target;
			var list = this.searching ? this.searchList : this.list;

			if ( event.type === 'keydown' ) {
				selected = list[_this.activeIdx];
			}

			if ( selected.nodeName !== 'LI' || selected.classList.contains('disabled') ) return;

			if ( _this.ajaxOpts ) {
				_this.selectRemoteOption(selected);
				return;
			}

			var index = _this.list.indexOf(selected);
			var option = _this.opts[index];
			var hasValue = false;


			if ( _this.elem.multiple ) {
				if ( selected.classList.contains('selected') ) {
					var _selectedTag;
					forEach(_this.tags, function(i, tag) {
						if ( tag.getAttribute('data-value') === option.value ) {
							_selectedTag = tag;
						}
					});

					if ( _selectedTag ) {
						_this.removeTag(_selectedTag);
					}
				} else {

					if ( _this.options.maxSelections !== null && _this.selectedVals.length >= _this.options.maxSelections ) {
						_this.notify('A maximum of ' + _this.options.maxSelections + ' items can be selected.');
						return;
					}

					_this.selectedVals.push(option.value);
					_this.createTag(option);

					option.selected = true;
					_addClass(selected, 'selected');
					_this.emit("selectr.select");

					_this.input.value = '';
				}

				if ( !!_this.txt.children.length ) {
					hasValue = true;
				}
			} else {
				// Deselect
				if ( _this.selectedIndex === index ) {
					_this.txt.innerHTML = '';

					option.selected = false;
					_removeClass(selected, 'selected');
					_this.selectedVal = null;
					_this.selectedIndex = null;
					_this.elem.value = null;
					_this.emit("selectr.deselect");
				} else {

					let old = _this.optsOptions.getElementsByClassName('selected')[0];
					if ( old ) _removeClass(old, 'selected');

					_this.txt.innerHTML = _this.hasTemplate ? _this.options.render(option) : option.textContent;

					option.selected = true;
					_addClass(selected, 'selected');
					_this.selectedVal = option.value;
					_this.selectedIndex = index;
					_this.emit("selectr.select");

					hasValue = true;
				}
			}

			if ( !!hasValue ) {
				_addClass(_this.container, 'has-selected');
			} else {
				_removeClass(_this.container, 'has-selected');
			}

			_this.reset();

			// Keep open for multi-selects
			if ( !_this.elem.multiple ) {
				_this.close();
			}

			_this.emit("selectr.change");
		},


		ajaxSearch: function()
		{
			this.searching = true;

			_addClass(this.inputContainer, 'loading');

			var ajax = this.options.ajax;

			var that = this;
			var xhr = new XMLHttpRequest();
			xhr.onload = function() {
				if (xhr.readyState === 4 && xhr.status === 200){
					var data = JSON.parse(xhr.responseText);

					if ( typeof ajax.parseResults !== 'function' ) {
						return;
					}

					var items = ajax.parseResults(data);


					parseRenderItems(items);

					_removeClass(that.inputContainer, 'loading');

					that.remoteItems = items;
				}
			}
			xhr.open("GET", that.ajax_url + that.input.value, true);
			xhr.send();


			function parseRenderItems(parsedItems) {
				var itmFrag = document.createDocumentFragment();
				var optFrag = document.createDocumentFragment();

				that.searchList = [];
				that.opts = [];

				forEach(parsedItems, function(i, item) {
					let result = ajax.formatResults(item) || item.text;

					// Create the item
					let li = _newElem('li', {
						class: 'selectr-option',
						'data-value': item.value,
						'data-text': item.text || '',
						innerHTML: result
					});

					// Create the option
					let opt = _newElem('option', {
						value: item.value
					});

					opt.textContent = item.text;

					that.searchList.push(li);
					that.opts.push(opt);

					_append(itmFrag, li);
					_append(optFrag, opt);
				});


				that.optsOptions.innerHTML = '';
				_append(that.optsOptions, itmFrag);

				that.elem.innerHTML = '';
				_append(that.elem, optFrag);
			}
		},

		selectRemoteOption: function(selected)
		{
			var _this = this, option, selectItem, selectIdx,
				value = selected.getAttribute('data-value');

			forEach(_this.remoteItems, function(idx, item) {
				if ( item.value == value ) {
					selectItem = item;
					selectIdx = idx;
					option = _this.opts[idx];
				}
			});

			if ( this.elem.multiple ) {
				if ( selected.classList.contains('selected') && _this.selectedVals.indexOf(value) > -1 ) {
					var _selectedTag;
					forEach(_this.tags, function(i, tag) {
						if ( tag.getAttribute('data-value') === value ) {
							_selectedTag = tag;
						}
					});

					if ( _selectedTag ) {
						_this.removeTag(_selectedTag);
					}
				} else {
					_this.createTag(selected, selectItem);
					_this.selectedVals.push(value);
					_this.opts[selectIdx].selected = true;
					_this.emit("selectr.select");

					_addClass(selected, 'selected');
				}
			} else {
				// Deselect
				if ( _this.selectedIndex === selectIdx ) {
					_this.txt.innerHTML = '';

					option.selected = false;
					_removeClass(selected, 'selected');
					_this.selectedVal = null;
					_this.selectedIndex = null;
					_this.elem.value = null;
					_this.emit("selectr.deselect");
				} else {

					let old = _this.optsOptions.getElementsByClassName('selected')[0];
					if ( old ) _removeClass(old, 'selected');

					_this.txt.innerHTML = this.options.ajax.formatSelected(selectItem) || option.getAttribute('data-text') || option.textContent;

					option.selected = true;
					_addClass(selected, 'selected');
					_this.selectedVal = option.value;
					_this.selectedIndex = selectIdx;
					_this.emit("selectr.select");
				}
			}

			if ( !!this.elem.value ) {
				_addClass(this.container, 'has-selected');
			} else {
				_removeClass(this.container, 'has-selected');
			}

			this.emit("selectr.select");
			this.emit("selectr.change");
			this.close();
		},

		createTag: function(option, selectItem)
		{
			var _this = this, docFrag = document.createDocumentFragment();

			var content;

			if ( selectItem ) {
				content = this.options.ajax.formatSelected(selectItem) || option.getAttribute('data-text') || option.textContent;
			} else {
				content = this.hasTemplate ? this.options.render(option) : option.textContent
			}

			let tag = _newElem('li', { class: 'selectr-tag', innerHTML: content });
			let btn = _newElem('button', { class: 'selectr-tag-remove', type: 'button' });

			_append(tag, btn);
			_append(docFrag, tag);
			_append(this.txt, docFrag);
			this.tags.push(tag);

			if ( !!this.txt.children.length ) {
				_addClass(this.container, 'has-selected');
			} else {
				_removeClass(this.container, 'has-selected');
			}

			if ( selectItem ) {
				tag.setAttribute('data-value', option.getAttribute('data-value'));
			} else {
				tag.setAttribute('data-value', option.value);
			}

		},

		removeTags: function(event)
		{
			if ( this.disabled ) return;

			event = event || window.event;

			var target = event.target;
			var nodeName = target.nodeName;

			if ( nodeName !== 'BUTTON' ) return;

			event.preventDefault();
			event.stopPropagation();

			this.removeTag(target.parentNode);
		},

		removeTag: function(tag)
		{
			var _this = this, value = tag.getAttribute('data-value');
			var option, index;

			forEach(this.opts, function(idx, opt) {
				if ( opt.value == value ) {
					index = idx;
					option = _this.opts[index]
				}
			});

			option.selected = false;
			_removeClass(this.list[index], 'selected');

			this.selectedVals.splice(this.selectedVals.indexOf(option.value), 1);
			this.tags.splice(this.tags.indexOf(tag) ,1);

			this.txt.removeChild(tag);

			if ( !this.tags.length ) {
				_removeClass(this.container, 'has-selected');
			}

			this.emit("selectr.deselect");
		},

		toggleOptions: function()
		{
			var _this = this, open = this.container.classList.contains('open');

			if ( this.disabled ) return;

			if ( open ) {
				this.close()
			} else {
				this.open();
			}
		},

		clearOptions: function()
		{
			if ( this.options.searchable ) {
				this.input.value = null;
				this.searching = false;
				_removeClass(this.inputContainer, 'active');
				_removeClass(this.container, 'notice');
				_addClass(this.container, 'open');
				this.input.focus();
			}

			this.reset();
		},

		reset: function()
		{
			var _this = this;
			forEach(this.list, function(i, elem) {
				let option = _this.opts[i];
				elem.innerHTML = _this.hasTemplate ? _this.options.render(option) : option.textContent;
				_removeClass(elem, 'match');
				_removeClass(elem, 'excluded');
			});
		},

		open: function()
		{
			var _this = this;

			var bottom = this.elemRect.top + this.elemRect.height + 230;
			var wh = window.innerHeight;

			if ( bottom > wh ) {
				_addClass(this.container, 'inverted');
			} else {
				_removeClass(this.container, 'inverted');
			}

			_addClass(this.container, 'open');
			_removeClass(this.container, 'notice');

			if ( this.options.searchable ) {
				setTimeout(function() {
					_this.input.focus();
				}, 10);
			}

			this.optsRect = this.optsOptions.getBoundingClientRect();

			this.opened = true;

			if ( this.ajaxOpts ) {
				this.searching = true;
			}

			this.emit("selectr.open");
		},

		close: function()
		{
			var notice = this.container.classList.contains('notice');

			if ( this.options.searchable && !notice ) {
				this.input.blur();
				this.searching = false;
			}

			if ( notice ) {
				this.container.classList.remove('notice');
				this.notice.textContent = '';
			}

			_removeClass(this.container, 'open');

			this.opened = false;

			this.emit("selectr.close");
		},

		dismiss: function(event)
		{
			var target = event.target;
			if ( !this.container.contains(target) && (this.opened || this.container.classList.contains('notice')) ) {
				this.close();
			}
		},

		notify: function(notice)
		{
			this.close();
			this.container.classList.add('notice');
			this.notice.textContent = notice;
		},

		setValue: function(value)
		{
			var _this = this, index = [].slice.call(_this.values).indexOf(value);

			if ( index < 0 ) return;

			if ( _this.elem.multiple ) {
				if ( _this.selectedVals.indexOf(value) < 0 ) {
					_this.createTag(_this.opts[index]);
				}
			} else {
				_this.txt.innerHTML = _this.hasTemplate ? _this.options.render(_this.opts[index]) : _this.opts[index].textContent;

				let old = _this.optsOptions.getElementsByClassName('selected')[0];
				if ( old ) {
					_removeClass(old, 'selected');
				}
			}

			_this.selectedVals.push(value);
			_addClass(_this.list[index], 'selected');
			_addClass(_this.container, 'has-selected');
			_this.opts[index].selected = true;

			_this.emit('selectr.select');
		},

		getValue: function()
		{
			if ( this.elem.multiple ) {
				return this.selectedVals;
			}
			return this.selectedVal;
		},

		removeValue: function(value)
		{
			if ( !this.tags.length ) return;

			var _this = this, index = [].slice.call(this.values).indexOf(value);

			if ( index < 0 ) return;

			var selected = this.list[index], option = this.opts[index];

			if ( this.elem.multiple ) {
				var selectedTag;
				forEach(this.tags, function(i, tag) {
					if ( tag.getAttribute('data-value') === value ) {
						selectedTag = tag;
					}
				});

				if ( selectedTag ) {
					_this.removeTag(selectedTag);
				}
			} else {
				this.txt.innerHTML = this.hasTemplate ? this.options.render(option) : option.textContent;
				if ( this.elem.selectedIndex !== null ) {
					_removeClass(this.list[this.elem.selectedIndex], 'selected');
				}
			}

			option.selected = false;
			_removeClass(selected, 'selected');

			this.emit('selectr.select');
		},


		setDimensions: function()
		{
			var w = this.options.width || this.elemRect.width;

			if ( this.options.width === 'auto' ) {
				w = '100%';
			} else {
				w += 'px';
			}

			this.container.style.cssText += 'width: '+w+'; ';

			if ( this.opened ) {
				this.elemRect = this.elem.getBoundingClientRect();
				var bottom = this.elemRect.top + this.elemRect.height + 230;
				var wh = window.innerHeight;

				if ( bottom > wh ) {
					_addClass(this.container, 'inverted');
				} else {
					_removeClass(this.container, 'inverted');
				}
			}
		},

		emit: function(event)
		{
			this.elem.dispatchEvent(new Event(event));
		},

		enable: function()
		{
			this.disabled = false;
			_removeClass(this.container, 'disabled');
		},

		disable: function()
		{
			this.disabled = true;
			_addClass(this.container, 'disabled');
		},

		destroy: function()
		{
			if ( !this.initialised ) return;

			var _this = this;

			// Cull all created elems.
			var p = _this.container.parentNode;
			p.insertBefore(_this.elem, _this.container);
			p.removeChild(_this.container);

			_removeClass(_this.elem, 'hidden-input');

			if ( !_this.elem.multiple && _this.options.emptyOption ) {
				_this.elem.removeChild(_this.elem.options[0]);
			}

			_this.container = null;
			_this.selected = null;
			_this.txt = null;
			_this.optsContainer = null;
			_this.optsOptions = null;
			_this.input = null;
			_this.clear = null;
			_this.inputContainer = null;

			window.removeEventListener('resize', _this.resize);
			document.removeEventListener('click', _this.handleDismiss);
			document.removeEventListener('keydown', _this.handleNavigate);

			_this.initialised = false;
		}
	};

	return Plugin;
}));