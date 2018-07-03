# Parent Side Methods
- [x] addElement
- [x] removeElement
- [x] addWindow
- [x] removeWindow
- [x] addEventListener
- [ ] removeEventListener
- [x] hasTarget
- [x] navigate
- [x] send

# General Patterns
- getXXX
- getXXXs
- incrementXXX
- removeXXX
- setXXX
- toggleXXX
- useXXX (Boolean argument, enables or disables the item)

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
- [ ] show (with optional `true` or `false` argument)
- [x] toggle
- [ ] update
- [ ] wrap (like jQuery)
- [ ] wrapAll (like jQuery)
- [ ] MathJax support

### Element Attributes
- [ ] incrementAttribute
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
- [ ] incrementStyle
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
	- [ ] calling from the child to the parent
- [ ] forEach	f(x)
- [x] increment	x = x + v
- [x] set		x = v
	- [ ] or	x = f(v)
	- [ ] applied to elements
- [x] toggle	x = !x

## Miscellaneous
- [x] reload
- [x] srcDoc

# Operations for Querying
All operations return promises, which is used to obtain the result of a query.

## HTML
- [x] innerHTML
- [ ] outerHTML
- [x] getAttribute
- [ ] getAttributes
- [x] hasAttribute

## CSS
- [ ] hasClass
- [ ] getClasses
- [ ] getComputedStyle
- [ ] getStyle
- [ ] getStyles
- [ ] getProperty
- [ ] getProperties

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
- [x] load
- [x] navigation
- [x] unload

# Error Types
- BadArgs
- NoSuchElement

# URL Parameters
## Parent-Side
- [x] `allownavigation`: Fires `navigation` and `load` events when clicking on a link to another page within the same site instead of `unload` events. The same-site protection can easily be circumvented by an attacker if they're able to inject code into the child window. `unload` events can be suppressed if an attacker is able to load a customized version of the child window script in place of the proper one. Thus, `allownavigation` is higher risk but higher convenience but neither option is zero risk.
	- [x] Works with hyperlinks
	- [ ] Works with form submission

## Child-Side
- [x] `limitscript`: Limits requests without a selector to accessing the `Sandbox.remoteAccess` object rather than the `window` object. Unless a Content Security Policy (CSP) is used then global data can still be accessed indirectly using an `addScript` operation, `setAttribute` with `onclick`, etc. (See https://developers.google.com/web/fundamentals/security/csp/)
- [ ] `selectors` Requires the selectors used in requests to begin with one of a specified group of prefixes and not contain a comma. If `selectors` is specified then selection using array indices begins with the first element selected by the first selector rather than the `<html>` element.

# No Demo Supplied Yet
- srcdoc
