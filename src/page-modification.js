/*	Converts a string into a live list of nodes.
	@param {string} html The HTML to convert into DOM objects.
	@return {NodeList}
*/
function htmlToNodes(html) {
	'use strict';
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

/*	Allows other windows to modify this page using the postMessage mechanism.
*/
window.addEventListener("message", function (event) {
	'use strict';
	let modification = event.data;
	let selector = modification.selector;
	let operation = modification.operation;
	let name = modification.name;
	let value = modification.value;
	let element;

	if (typeof(selector) === 'string') {
		element = document.getElementById(selector.slice(1));
		if (element === null) {
			console.error('Document update: no elements matched by ' + selector);
			return;
		}
	} else {
		let depth = 0;
		element = document.documentElement;
		for (const index of selector) {
			let children = element.children;
			if (index >= children.length) {
				console.error('Document update: insufficient number of child nodes at depth ' + depth + ' in path ' + selector);
				return;
			}
			element = children[index];
			depth++;
		}
	}

	switch (operation) {
	case 'append':
		let newNodes = htmlToNodes(value);
		while (newNodes.length > 0) {
			element.appendChild(newNodes[0]);
		}
		break;
	case 'innerHTML':
		element.innerHTML = value;
		break;
	case 'outerHTML':
		element.outerHTML = value;
		break;
	case 'remove':
		element.parentNode.removeChild(element);
		break;
	case 'removeAttribute':
		element.removeAttribute(name);
		break;
	case 'set':
		element[name] = value;
		break;
	case 'setAttribute':
		element.setAttribute(name, value);
		break;
	default:
		console.error('Document update: unknown operation ' + operation);
	}
});

//Signal to the container page that we're loaded and ready.
window.parent.postMessage({type: 'load'}, '*');
