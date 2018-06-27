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
- [ ] reload
- [ ] srcDoc

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
- [x] ID
- [ ] Any CSS selector

# Attributes
- operation
- selector
- name (list of dot separated or square bracketed JS property names (without quotes))
- value/args
- func

# Messages Returned
- [ ] error
- [x] loaded
- [ ] return

# Error Types
- TargetNotFound
- UnknownOperation
