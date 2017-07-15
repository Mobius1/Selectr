# Selectr

A lightweight, dependency-free, mobile-friendly select box replacement written in vanilla javascript. Just 6.5KB minified and gzipped. Similar to Select2 and Chosen, but without the dependencies.

Supports most modern mobile and desktop browsers including IE9.

Don't forget to check the [wiki](https://github.com/Mobius1/Selectr/wiki) out and view some [demos](https://s.codepen.io/Mobius1/debug/QgdpLN).

---

[![Build Status](https://travis-ci.org/Mobius1/Selectr.svg?branch=master)](https://travis-ci.org/Mobius1/Selectr) [![release](http://github-release-version.herokuapp.com/github/Mobius1/Selectr/release.svg?style=flat)](https://github.com/Mobius1/Selectr/releases/tag/2.3.6) [![npm version](https://badge.fury.io/js/mobius1-selectr.svg)](https://badge.fury.io/js/mobius1-selectr) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/Mobius1/Selectr/blob/master/LICENSE) ![](http://img.badgesize.io/Mobius1/selectr/master/dist/selectr.min.js) ![](http://img.badgesize.io/Mobius1/selectr/master/dist/selectr.min.js?compression=gzip&label=gzipped) [![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/mobius1/selectr.svg)](http://isitmaintained.com/project/mobius1/selectr "Average time to resolve an issue") [![Percentage of issues still open](http://isitmaintained.com/badge/open/mobius1/selectr.svg)](http://isitmaintained.com/project/mobius1/selectr "Percentage of issues still open")

[![Sauce Test Status](https://saucelabs.com/browser-matrix/M0bius01.svg)](https://saucelabs.com/u/M0bius01)

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

Grab the files from one of the CDNs and include them in your page:

```html
<link href="https://unpkg.com/mobius1-selectr@latest/dist/selectr.min.css" rel="stylesheet" type="text/css">
<script src="https://unpkg.com/mobius1-selectr@latest/dist/selectr.min.js" type="text/javascript"></script>

//or

<link href="https://cdn.jsdelivr.net/gh/mobius1/selectr@latest/dist/selectr.min.css" rel="stylesheet" type="text/css">
<script src="https://cdn.jsdelivr.net/gh/mobius1/selectr@latest/dist/selectr.min.js" type="text/javascript"></script>
```

You can replace `latest` with the required release number if needed.

CDNs courtesy of [unpkg](https://unpkg.com/#/) and [jsDelivr](http://www.jsdelivr.com/)

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

If this project helps you then you can grab me a coffee or beer to say thanks.

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=9B9KD4X57X8V8)

---

# License

Copyright 2016 Karl Saunders

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
