# General Patterns
- getXXX
- incrementXXX
- removeXXX
- setXXX
- toggleXXX
- xxx (enabled `true` or `false`)

# Operations for Making Changes
## HTML
### Elements
- [x] innerHTML
- [x] outerHTML
- [ ] addEventListener
- [ ] removeEventListener
- [x] append
- [ ] element (enabled `true` or `false`)
- [ ] filterUpdate
- [ ] insertBefore
- [ ] insertAfter
- [ ] mapUpdate
- [ ] prepend
- [x] remove
- [ ] scrollIntoView
- [ ] hide
- [ ] show
- [ ] toggle
- [ ] update
- [ ] wrap (like jQuery)
- [ ] wrapAll (like jQuery)
- [ ] MathJax support

### Element Attributes
- [ ] attribute (enabled `true` or `false`)
- [ ] incrementAttribute
- [x] removeAttribute
- [x] setAttribute
- [x] toggleAttribute

## CSS
### Element Classes
- [x] addClass
- [ ] class (enabled `true` or `false`)
- [x] removeClass
- [x] replaceClass
- [x] toggleClass

### style Attribute
Sets Element.style.xxx
- [ ] incrementStyle
- [x] removeStyle
- [x] setStyle

### Style Sheets
- [ ] addStyleSheet
- [ ] removeStyleSheet
- [ ] styleSheet (enabled `true` or `false`)
- [ ] toggleStyleSheet (enable/disable)

### Declarations Inside a Style Sheet
- [ ] incrementProperty
- [ ] removeProperty
- [ ] setProperty
- [ ] features relating to other kinds of declarations

## JavaScript
The `x = `... forms (except for `toggle`) can be applied to elements too. `x` is considered to be the `innerHTML` of the element in this case.
- [ ] addEventListener
- [ ] removeEventListener
- [x] addScript (append a `<script>` tag)
- [ ] update	x = f(x, v)
- [ ] methodUpdate	x = x.f(v)
- [ ] filterUpdate	x = x.filter(f)
- [ ] mapUpdate	x = x.map(f)
- [x] call		x(v)
	- [ ] or	x(v, f)
- [ ] forEach	f(x)
- [x] increment	x = x + v
- [x] set		x = v
	- [ ] or	x = f(v)
	- [ ] applied to elements
- [ ] toggle	x = !x

## Miscellaneous
- [x] reload
- [x] srcDoc

# Operations for Querying
Query operations return promises.

## HTML
- [ ] innerHTML
- [ ] outerHTML
- [ ] getAttribute

## CSS
- [ ] hasClass
- [ ] getComputedStyle
- [ ] getStyle
- [ ] getProperty

## JavaScript
### General
These operate on the first match only.
- [ ] calc	x(v) or x(v, f)
- [ ] constructorName
- [ ] get
- [ ] instanceof

### Iteration
These operate on a collection of matches.
- [ ] every
- [ ] filter
- [ ] find
- [ ] findIndex
- [ ] map
- [ ] reduce
- [ ] reduceRight
- [ ] some

# Possible Targets
- [x] Array of child indices
- [x] CSS selector

# Properties of a Request Object
- [x] operation
- [x] selector
- [x] name (list of dot separated or square bracketed JS property names (without quotes))
- [x] value or args
- [ ] func
- [ ] mathJax (true/false if new content needs MathJax parsing)
- [x] integrity (addScript and addStyleSheet only)
- [ ] id (addStyleSheet only)

# Events
- [ ] error
- [x] load
- [x] navigation
- [ ] return
- [x] unload

# Error Types
- TargetNotFound
- UnknownOperation

# URL Parameters
- `allownavigation`: Fires ` navigation` and `load` events when clicking on a link to another page within the same site instead of `unload` events. The same-site protection can be circumvented by an attacker if they're able to inject code into the child window.
	- [x] Works with hyperlinks
	- [ ] Works with form submission

# No Demo Supplied Yet
- srcdoc
