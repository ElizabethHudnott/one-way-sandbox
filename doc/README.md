# General Patterns
- getXXX
- incrementXXX
- removeXXX
- setXXX
- toggleXXX

# Operations for Making Changes
## HTML
### Elements
- [x] innerHTML
- [x] outerHTML
- [ ] addEventListener
- [ ] removeEventListener
- [x] append
- [ ] filterUpdate
- [ ] increment
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

### Element Attributes
- [ ] incrementAttribute
- [x] removeAttribute
- [x] setAttribute
- [ ] toggleAttribute

## CSS
### Element Classes
- [ ] addClass
- [ ] removeClass
- [ ] replaceClass
- [ ] toggleClass

### style Attribute
Sets Element.style.xxx
- [ ] incrementStyle
- [ ] removeStyle
- [ ] setStyle

### Property Declarations in Stylesheets
- [ ] incrementProperty
- [ ] removeProperty
- [ ] setProperty

## JavaScript
- [ ] addEventListener
- [ ] removeEventListener
- [ ] update	x = f(x, v)
- [ ] methodUpdate	x = x.f(v)
- [ ] filterUpdate	x = x.filter(f)
- [ ] mapUpdate	x = x.map(f)
- [ ] call		x(v) or x(v, f)
- [ ] forEach	f(x)
- [ ] increment	x = x + v
- [ ] set		x = v or x = f(v)
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

# Attributes
- [x] operation
- [x] selector
- [x] name (list of dot separated or square bracketed JS property names (without quotes))
- [x] value/args
- [ ] func

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

# No Demo Supplied Yet
- srcdoc
