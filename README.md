# Selectr

A lightweight, dependency-free, mobile-friendly select box replacement written in vanilla javascript. Just 6.5KB minified and gzipped. Similar to Select2 and Chosen, but without the dependencies.

Supports most modern mobile and desktop browsers including IE9.

Don't forget to check the [wiki](https://github.com/Mobius1/Selectr/wiki) out and view some [demos](https://s.codepen.io/Mobius1/debug/QgdpLN).

---

[![Build Status](https://travis-ci.org/Mobius1/Selectr.svg?branch=master)](https://travis-ci.org/Mobius1/Selectr) [![release](http://github-release-version.herokuapp.com/github/Mobius1/Selectr/release.svg?style=flat)](https://github.com/Mobius1/Selectr/releases/tag/2.3.5) [![npm version](https://badge.fury.io/js/mobius1-selectr.svg)](https://badge.fury.io/js/mobius1-selectr) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/Mobius1/Selectr/blob/master/LICENSE) ![](http://img.badgesize.io/Mobius1/selectr/master/dist/selectr.min.js) ![](http://img.badgesize.io/Mobius1/selectr/master/dist/selectr.min.js?compression=gzip&label=gzipped) [![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/mobius1/selectr.svg)](http://isitmaintained.com/project/mobius1/selectr "Average time to resolve an issue") [![Percentage of issues still open](http://isitmaintained.com/badge/open/mobius1/selectr.svg)](http://isitmaintained.com/project/mobius1/selectr "Percentage of issues still open")

[![Browser Status](https://badges.herokuapp.com/browsers?firefox=26&iexplore=9&microsoftedge=12&opera=12&safari=5.1&googlechrome=53)](https://saucelabs.com/u/wml-little-loader)

---


Features:

* Supports single and multiple select boxes
* Supports optgroups
* Custom datasets
* Searchable options
* Tagging support
* Custom events
* Custom styling
* Native select UI for mobile devices
* Dynamically add options
* Much more...

[Documentation](https://github.com/Mobius1/Selectr/wiki) | [Demo](https://s.codepen.io/Mobius1/debug/QgdpLN)

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
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/mobius1/selectr@2.3.5/dist/selectr.min.css">

<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/mobius1/selectr@2.3.5/dist/selectr.min.js"></script>
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

### 2.3.5
* Fixed bug causing first option to be selected when submitting new tag
* Fixed `enable` and `disabled` methods throwing an exception when used on a `select-one` type element

### 2.3.4
* Added option `defaultSelected` to enable/disable selecting the first option in the list
* Rename method `addOption` to `add`
* Added new method `remove`
* Added new method `removeAll`
* Prevent opening if there aren't any options to display
* Fixed top search result not highlighting ([#26](https://github.com/Mobius1/Selectr/issues/26))
* Fixed `clear` method not clearing for select-one elements
* Fixed pagination bug
* Fixed `checkDuplicate` not being used recursively
* Fixed first option in a select-multiple element being selected by default

### 2.2.4
* DESKTOP: Fixed incorrect tabIndex on container
* MOBILE: Improved accessibility
* MOBILE: Fixed multiselect requiring more than one click to open


### 2.2.3
* Fixed `defaultSelected` options not selecting
* Fixed form reset bug


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


# License

Copyright 2016 Karl Saunders

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
