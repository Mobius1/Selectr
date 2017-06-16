# Selectr
[![Build Status](https://travis-ci.org/Mobius1/Selectr.svg?branch=master)](https://travis-ci.org/Mobius1/Selectr) [![npm version](https://badge.fury.io/js/mobius1-selectr.svg)](https://badge.fury.io/js/mobius1-selectr) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/Mobius1/Selectr/blob/master/LICENSE) [![Browser Status](https://badges.herokuapp.com/browsers?firefox=26&iexplore=9&microsoftedge=12&opera=12&safari=5.1&googlechrome=53)](https://saucelabs.com/u/wml-little-loader)
A lightweight dependency-free select box replacement written in vanilla javascript. Just 6KB minified and gzipped. Similar to Select2 and Chosen without the dependencies.

Supports most modern browsers including IE9.

Features:

* Supports single and multiple select boxes
* Supports optgroups
* Custom datasets
* Searchable options
* Tagging support
* Custom events
* Custom styling
* Native select for mobile devices
* Dynamically add options
* Much more...

[Documentation](https://github.com/Mobius1/Selectr/wiki) | [Demo](http://codepen.io/Mobius1/full/jBqpze/)

---

## Install

### bower

```
bower install mobius1-selectr --save
```

### npm

```
npm install mobius1-selectr --save
```

## Browser

Grab the files from the CDN and include them in your page:

```html
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/mobius1/selectr@latest/dist/selectr.min.css">

<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/mobius1/selectr@latest/dist/selectr.min.js"></script>
```

CDN courtesy of [jsDelivr](http://www.jsdelivr.com/)

---

## Initialisation

#### HTML

Start with a standard select box you want to convert:

```html
<select id="mySelect">
	<option vlaue="value-1">Value 1</option>
	<option vlaue="value-2">Value 2</option>
	<option vlaue="value-3">Value 3</option>
	...
</select>
```

#### Javascript

You can then instantiate Selectr by passing a reference to your select box as the first parameter as either a DOM node or a CSS3 selector string:

```javascript
new Selectr(document.getElementById('#mySelect'));

// or

new Selectr('#mySelect');
```

Selectr accepts the options object as a second parameter:

```javascript
new Selectr('#mySelect', {
	searchable: false,
	width: 300
});
```

---

## Change Log

### 2.2.0
* Empty select elements can now be used ([#23](https://github.com/Mobius1/Selectr/issues/23))
* Improved IE9 compatibility (removed pointer-events usage)
* Allow the use of native dropdown
* Native select is now triggered on mobile devices (single and multiple) ([#14](https://github.com/Mobius1/Selectr/issues/14), [#19](https://github.com/Mobius1/Selectr/issues/19), [#25](https://github.com/Mobius1/Selectr/issues/25))
* Pagination can be applied to options already defined in the DOM (previously only possible with the `data` option)
* Searching with pagination active will now return results from entire set instead of the loaded set ([#15](https://github.com/Mobius1/Selectr/issues/15))
* Custom renderers (`renderOption`, `renderSelection`) can now be used along with the `data` option.
* The tag input placeholder can now be customised ([#21](https://github.com/Mobius1/Selectr/issues/21), [#22](https://github.com/Mobius1/Selectr/issues/22))
* Reduced memory usage
* Public method `addOption` now accepts an array of objects for dynamically adding multiple options
* Various other fixes

### v2.1.5
* Improved accessibility
* New methods `disable()` and `enable()` (see [docs](http://mobius.ovh/docs/selectr/pages/functions))
* Fixed navigation bug ([#5](https://github.com/Mobius1/Selectr/issues/5))

### v2.1.4
* Fixed form.reset() not resetting Selectr elements ([#13](https://github.com/Mobius1/Selectr/issues/13))
* Fixed autocomplete bug in Chrome ([#12](https://github.com/Mobius1/Selectr/issues/12))
* Fixed pagination not incrementing when navigating with the down key
* Fixed `reset()` method not checking `data`

# License

Copyright 2016 Karl Saunders

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
