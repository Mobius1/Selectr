# Selectr
A lightweight dependency-free select box replacement written in vanilla javascript. Similar to Select2 and Chosen without the dependencies.

Features:

* Supports single and multiple select boxes
* Supports optgroups
* Searchable options
* Custom events
* Custom styling
* Much more...

Supports most modern browsers including IE9 and above.

[Demos & Documentation](http://mobius.ovh/docs/selectr)

#Change Log

## v.2.0.0
* Complete rewrite
* New options added
* New methods added
* New events added

Updated functions:
* `getValue()` (see [docs](http://mobius.ovh/docs/selectr/pages/functions))
* `setValue()` (see [docs](http://mobius.ovh/docs/selectr/pages/functions))

Added options:
* `clearable` (see [docs](http://mobius.ovh/docs/selectr/pages/options-2))
* `sortSelected` (see [docs](http://mobius.ovh/docs/selectr/pages/options-2))

Updated options:
* `selectedValue` is now used for both single and multi selects (see [docs](http://mobius.ovh/docs/selectr/pages/options-2))

Removed options:

* `ajax`
* `minChars`
* `emptyOption`
* `selectedValues`
* `selectedIndex, selectedIndexes`

Removed events:
* `selectr.change` (see [docs](http://mobius.ovh/docs/selectr/pages/events-2))

# License

Copyright 2016 Karl Saunders

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
