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
