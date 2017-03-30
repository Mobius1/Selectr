# Selectr [![Build Status](https://travis-ci.org/Mobius1/Selectr.svg?branch=master)](https://travis-ci.org/Mobius1/Selectr) [![npm version](https://badge.fury.io/js/mobius1-selectr.svg)](https://badge.fury.io/js/mobius1-selectr) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/Mobius1/Selectr/blob/master/LICENSE)
A lightweight dependency-free select box replacement written in vanilla javascript. Similar to Select2 and Chosen without the dependencies.

Supports most modern browsers including IE9.

Features:

* Supports single and multiple select boxes
* Supports optgroups
* Searchable options
* Tagging support
* Custom events
* Custom styling
* Much more...

[Demos](http://mobius.ovh/docs/selectr/pages/demos) | [Documentation](http://mobius.ovh/docs/selectr) | [Playground](http://codepen.io/Mobius1/full/jBqpze/)

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
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/selectr/2.1.2/selectr.min.css">

<script type="text/javascript" src="https://cdn.jsdelivr.net/selectr/2.1.2/selectr.min.js"></script>
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

You can then instantiate Selectr by passing a reference to your select box as the first parameter:

You can either pass a DOM node or a CSS3 selector string:

```javascript
new Selectr(document.getElementById('#mySelect'));

// or 

new Selectr('#mySelect');
```

Selectr accepts a second parameter as an object with the options you want to set:

```javascript
new Selectr('#mySelect', {
    searchable: false,
    width: 300
});
```

---

## Change Log

### v2.1.3
* Fixed bug with tagging system

### v2.1.2

* New option `closeOnScroll` ([#11](https://github.com/Mobius1/Selectr/issues/11)) (see [docs](http://mobius.ovh/docs/selectr/pages/options))
* Fixed bug with checking dropdown is on-screen ([#10](https://github.com/Mobius1/Selectr/issues/10))
* Fixed navigation bug ([70168f2](/Mobius1/Selectr/commit/70168f2df967881818116a81ac4edbaa98588381))

### v2.1.1

* new option `allowDeselect` (see [docs](http://mobius.ovh/docs/selectr/pages/options))
* tabIndex enabled on th main container
* tabIndex disabled on search input when closed

### v2.1.0

* New tagging feature (see [docs](http://mobius.ovh/docs/selectr/pages/options))

New functions:
* `addOption()` (see [docs](http://mobius.ovh/docs/selectr/pages/functions))
* `serialize()` (see [docs](http://mobius.ovh/docs/selectr/pages/functions))
* `destroy()` (see [docs](http://mobius.ovh/docs/selectr/pages/functions))
* `render()` (see [docs](http://mobius.ovh/docs/selectr/pages/functions))

New options:
* `taggable` (see [docs](http://mobius.ovh/docs/selectr/pages/options))
* `tagSeperators` (see [docs](http://mobius.ovh/docs/selectr/pages/options))

Updated options:
* `sortSelected` (see [docs](http://mobius.ovh/docs/selectr/pages/options))


### v2.0.0
* Complete rewrite
* New options added
* New methods added
* New events added

Updated functions:
* `getValue()` (see [docs](http://mobius.ovh/docs/selectr/pages/functions))
* `setValue()` (see [docs](http://mobius.ovh/docs/selectr/pages/functions))

Added options:
* `clearable` (see [docs](http://mobius.ovh/docs/selectr/pages/options))
* `sortSelected` (see [docs](http://mobius.ovh/docs/selectr/pages/options))

Updated options:
* `selectedValue` is now used for both single and multi selects (see [docs](http://mobius.ovh/docs/selectr/pages/options))

Removed options:

* `ajax`
* `minChars`
* `emptyOption`
* `selectedValues`
* `selectedIndex, selectedIndexes`

Removed events:
* `selectr.change` (see [docs](http://mobius.ovh/docs/selectr/pages/events))

# License

Copyright 2016 Karl Saunders

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
