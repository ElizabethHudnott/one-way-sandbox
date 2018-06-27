'use strict';
/*	Converts a string into a live list of nodes.
	@param {string} html The HTML to convert into DOM objects.
	@return {NodeList}
*/
function htmlToNodes(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

window.addEventListener("message", function (event) {
	if (event.source !== window.parent) {
		return;
	}

	let modification = event.data;
	let selector = modification.selector;
	let operation = modification.operation;
	let name = modification.name;
	let value = modification.value;
	let elements;

	if (selector === undefined) {
		elements = [window];
	} else if (typeof(selector) === 'string') {
		elements = document.querySelectorAll(selector);
	} else {
		let depth = 0;
		let element = document.documentElement;
		for (const index of selector) {
			let children = element.children;
			if (index >= children.length) {
				console.error('Document update: insufficient number of child nodes at depth ' + depth + ' in path ' + selector);
				return;
			}
			element = children[index];
			depth++;
		}
		elements = [element];
	}

	const names = [];
	const accessorRE = /(?:(?:^|\.)([a-z_$][\w$]*))|(?:\[([^\]]*)])/giy;
	let lastName;
	if (name !== undefined) {
		let match;
		while ((match = accessorRE.exec(name)) !== null) {
			if (match[1] !== undefined) {
				names.push(match[1]);
			} else {
				names.push(match[2]);
			}
		}
		lastName = names[names.length - 1];
	}

	for (const element of elements) {
		let obj = element;
		for (let i = 0; i < names.length - 1; i++) {
			obj = obj[names[i]];
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
			obj[lastName] = value;
			break;
		case 'setAttribute':
			element.setAttribute(name, value);
			break;
		default:
			console.error('Document update: unknown operation ' + operation);
		}
	}
});

window.addEventListener('beforeunload', function (event) {
	window.parent.postMessage({type: 'unload'}, '*');
});

function resandbox(event) {
	window.parent.postMessage({type: 'unload'}, '*');
}

//Signal to the container page that we're loaded and ready.
window.parent.postMessage({type: 'load'}, '*');
