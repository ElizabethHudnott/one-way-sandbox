# General To-Do
- [ ] Introduce pre-defined constants for the `op` strings

# Parent Side Methods
- [x] addElement
- [x] addWindow
- [x] removeTarget
- [x] addEventListener
- [x] removeEventListener
- [x] hasTarget
- [x] navigate
- [x] send

# Child Side Methods
- [x] do (emulate being sent a command)
- [x] htmlToNodes
- [x] resandbox
- [x] unsandbox

# General Patterns
- get*XXX*
- get*XXX*s (retrieves all available names)
- increment*XXX*
- remove*XXX*
- set*XXX*
- toggle*XXX*
- use*XXX* (Boolean argument, enables or disables the item)

# Operations for Making Changes
- [ ] Extend the ability to use functions to include nearly all of these operations.
	- [x] in the `value` position
	- [ ] in the `name` position (when `value` isn't relevant)

## HTML
### Elements
- [x] innerHTML
- [x] innerText
- [x] outerHTML
- [x] append
- [ ] filterUpdate
- [x] increment
- [ ] insertBefore
- [ ] insertAfter
- [ ] mapUpdate
- [ ] prepend
- [x] remove
- [ ] scrollIntoView
- [x] hide
- [x] show (with optional `true` or `false` argument)
- [x] toggle
- [ ] update
- [ ] wrap (like jQuery)
- [ ] wrapAll (like jQuery)
- [ ] MathJax support

### Element Attributes
- [x] incrementAttribute
- [x] removeAttribute
- [x] setAttribute
- [x] toggleAttribute

## CSS
### Element Classes
- [x] addClass
- [x] removeClass
- [x] replaceClass
- [x] toggleClass
- [x] useClass

### style Attribute
Sets Element.style.xxx
- [x] incrementStyle
- [x] removeStyle
- [x] setStyle

### Style Sheets
- [ ] addStyleSheet
- [ ] removeStyleSheet
- [ ] toggleStyleSheet (toggles `disabled` attribute)
- [ ] useStyleSheet

### Declarations Inside a Style Sheet
- [ ] incrementProperty
- [ ] removeProperty
- [ ] setProperty
- [ ] features relating to other kinds of declarations

## JavaScript
Many of the `x = `... forms can be applied to elements too (see above). `x` is considered to be the `innerHTML` property of the element in this case.
- [ ] addEventListenerThere
- [ ] removeEventListenerThere
- [ ] addEventListenerHere
- [ ] removeEventListenerHere
- [x] addScript (append a `<script>` tag)
- [ ] update	x = f(x, v)
- [ ] methodUpdate	x = x.f(v)
- [ ] filterUpdate	x = x.filter(f)
- [ ] mapUpdate	x = x.map(f)
- [x] call		x(v)
	- [ ] or	x(v, f)
	- [ ] calling from the child to the parent
- [ ] forEach	f(x)
- [x] increment	x = x + v
- [x] set		x = v
	- [x] or	x = f(v)
- [x] toggle	x = !x

## Miscellaneous
- [x] reload
- [x] srcDoc

# Operations for Querying
All operations return promises, which is used to obtain the result of a query.

## HTML
- [x] innerHTML
- [x] innerText
- [x] outerHTML
- [x] getAttribute
- [ ] getAttributes
- [x] hasAttribute

## CSS
- [x] hasClass
- [ ] getClasses
- [ ] getComputedStyle
- [ ] getStyle
- [ ] getStyles
- [ ] getProperty
- [ ] getProperties

## JavaScript
### General
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

# Possible Selectors
- [x] Array of child indices
- [x] CSS selector
- [x] Mixed array of numeric indices and CSS selectors

# Properties of a Request Object
- [x] op
- [x] selector
- [x] firstMatch (`true`, `false` or absent, used to restrict changes or queries to the first matching element only)
- [x] name (a list of dot separated or square bracketed JS property names (without quotes))
	- [x] a single name, as a string
	- [ ] multiple names, as an array
- [x] value or args
	- [x] a single value
	- [x] arguments to a function
	- [ ] an object that maps names to values
- [x] func
- [x] perMatch (`true` if func needs to be re-evaluated for each element, thus f(v, e, i) rather than f(v) )
- [ ] mathJax (true/false if new content needs MathJax parsing)
- [x] integrity (addScript and addStyleSheet only)
- [ ] id (addStyleSheet only)

# Events
- [x] error
- [x] load
- [x] navigation
- [x] unload

# Error Types
## Passed from Child to Parent
- BadArgs

## Originating on the Parent Side
- UnknownWindow

# URL Parameters
## Parent-Side
- [x] `allownavigation`: Fires `navigation` and `load` events when clicking on a link to another page within the same site instead of `unload` events. The same-site protection can easily be circumvented by an attacker if they're able to inject code into the child window.
	- [x] Works with hyperlinks
	- [ ] Works with form submission

## Child-Side
- [x] `limitscript`: Limits requests without a selector to accessing the `Sandbox.remoteAccess` object rather than the `window` object. Unless a Content Security Policy (CSP) is used then global data can still be accessed indirectly using an `addScript` operation, `setAttribute` with `onclick`, etc. (See https://developers.google.com/web/fundamentals/security/csp/)
- [ ] `selectors` Requires the selectors used in requests to begin with one of a specified group of prefixes and not contain a comma. If `selectors` is specified then selection using array indices begins with the first element selected by the first selector rather than the `<html>` element.

# No Demo Supplied Yet
- srcdoc
