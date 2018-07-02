'use strict';
{
	const parentWindow = window.parent !== window? window.parent : window.opener;

	if (parentWindow) {
		const myURL = document.currentScript.src;

		if (!('Unsandbox' in window)) {
			window.Unsandbox = {};
		}

		function findObject(name, begin) {
			let obj = begin;
			const names = [];
			const accessorRE = /(?:(?:^|\.)([a-z_$][\w$]*))|(?:\[([^\]]*)])/giy;
			if (name !== undefined) {
				let match;
				while ((match = accessorRE.exec(name)) !== null) {
					if (match[1] !== undefined) {
						names.push(match[1]);
					} else {
						names.push(match[2]);
					}
				}
				for (let i = 0; i < names.length - 1; i++) {
					obj = obj[names[i]];
				}
				const lastName = names[names.length - 1];
				return [obj, lastName];
			}
		}

		/*	Converts a string into a live list of nodes.
			@param {string} html The HTML to convert into DOM objects.
			@return {NodeList}
		*/
		Unsandbox.htmlToNodes = function (html) {
		    var template = document.createElement('template');
		    template.innerHTML = html;
		    return template.content.childNodes;
		}

		function sendError(errorName, message, requestID) {
			console.error('Page modification: ' + message);
			parentWindow.postMessage({
				eventType: 'error',
				errorName: errorName,
				value: message,
				requestID: requestID
			}, '*');
		}

		function beforeUnload() {
			const activeElem = document.activeElement;
			if (activeElem !== null) {
				const linkOrigin = activeElem.protocol + '//' + activeElem.host;
				const ourOrigin = window.location.protocol + '//' + window.location.host;
				if (linkOrigin === ourOrigin) {
					const path = activeElem.pathname + activeElem.search;
					parentWindow.postMessage({eventType: 'navigation', value: path}, '*');
					return;
				}
			}
			parentWindow.postMessage({eventType: 'unload'}, '*');
		}

		function modifyPage(event) {
			if (event.source !== parentWindow) {
				return;
			}

			const modification = event.data;
			if (typeof(modification) !== 'object') {
				return;
			}

			const operation = modification.operation;
			const selector = modification.selector;
			const name = modification.name;
			const value = modification.value;
			const args = modification.args;
			const requestID = modification.requestID;
			let elements;

			if (operation === undefined) {
				return;
			}
			if (selector === undefined && name === undefined && !/^(reload|srcdoc)$/.test(operation)) {
				sendError('BadArgs', 'Missing selector or attribute name.', requestID);
				return;
			}
			if (args !== undefined && !Array.isArray(args)) {
				//Throws an incomprehensible error message otherwise.
				sendError('BadArgs', 'args must be an array.', requestID);
				return;
			}
			event.stopImmediatePropagation();

			switch (operation) {
			case 'addScript':
				let element = document.createElement('script');
				element.setAttribute('src', name);
				element.setAttribute('crossorigin', 'anonymous');
				if (modification.integrity !== undefined) {
					element.setAttribute('integrity', modification.integrity);
				}
				document.head.appendChild(element);
				return;
			case 'reload':
				window.removeEventListener('beforeunload', beforeUnload);
				window.location.reload();
				return;
			}

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
						sendError('NoSuchElement', 'Insufficient number of child nodes at depth ' + depth + ' in path ' + selector);
						return;
					}
					element = children[index];
					depth++;
				}
				elements = [element];
			}

			let charIndex, obj, jsPropertyName;
			let returnValues = [];

loop:		for (const element of elements) {
				switch (operation) {
				case 'addClass':
					element.classList.add(name);
					break;
				case 'append':
					let newNodes = Unsandbox.htmlToNodes(value);
					while (newNodes.length > 0) {
						element.appendChild(newNodes[0]);
					}
					break;
				case 'call':
					[obj, jsPropertyName] = findObject(name, element);
					obj[jsPropertyName].apply(obj, args);
					break;
				case 'getAttribute':
					returnValues.push(element.getAttribute(name));
					break;
				case 'increment':
					const amount = value === undefined? 1 : value;
					if (name === undefined) {
						let value = parseFloat(element.innerHTML) + amount;
						element.innerHTML = value;
					} else {
						[obj, jsPropertyName] = findObject(name, element);
						obj[jsPropertyName] = obj[jsPropertyName] + amount;
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
				case 'removeClass':
					element.classList.remove(name);
					break;
				case 'removeStyle':
					element.style.removeProperty(name);
					break;
				case 'replaceClass':
					element.classList.replace(name, value);
					break;
				case 'set':
					[obj, jsPropertyName] = findObject(name, element);
					obj[jsPropertyName] = value;
					break;
				case 'setAttribute':
					element.setAttribute(name, value);
					break;
				case 'srcdoc':
					window.removeEventListener('beforeunload', beforeUnload);
					charIndex = value.lastIndexOf('</body>');
					if (charIndex === -1) {
						document.writeln(value + '<script src="' + myURL + '"></script>');
					} else {
						document.writeln(value.slice(0, charIndex) + '<script src="' + myURL + '"></script></body></html>');
					}
					document.close();
					break;
				case 'setStyle':
					element.style.setProperty(name, value);
					break;
				case 'toggle':
					if (name === undefined) {
						const display = getComputedStyle(element).getPropertyValue('display');
						if (display === 'none') {
							element.style.display = null;
						} else {
							element.style.display = 'none';
						}
					} else {
						[obj, jsPropertyName] = findObject(name, element);
						obj[jsPropertyName] = !obj[jsPropertyName];
					}
					break;
				case 'toggleAttribute':
					if (element.hasAttribute(name)) {
						element.removeAttribute(name);
					} else {
						element.setAttribute(name, name);
					}
					break;
				case 'toggleClass':
					element.classList.toggle(name);
					break;
				default:
					sendError('BadArgs', 'Unknown operation ' + operation);
					break loop;
				}
			}

			if (returnValues.length > 0) {
				parentWindow.postMessage({eventType: 'return', requestID: requestID, value: returnValues}, '*');
			}
		}

		Unsandbox.unsandbox = function () {
			window.addEventListener("message", modifyPage);
		}

		Unsandbox.unsandbox();

		Unsandbox.resandbox = function () {
			window.removeEventListener('message', modifyPage);
			parentWindow.postMessage({eventType: 'unload'}, '*');
			window.removeEventListener('beforeunload', beforeUnload);
		}

		/*	Signal to the container page to stop sending any more data if we navigate to another
			origin or notify the container page of the new address otherwise.
		*/
		window.addEventListener('beforeunload', beforeUnload);

		//Signal to the container page that we're loaded and ready.
		parentWindow.postMessage({eventType: 'load'}, '*');

	}
}
