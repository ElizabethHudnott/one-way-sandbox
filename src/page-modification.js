'use strict';
{
	const parentWindow = window.parent !== window? window.parent : window.opener;

	if (parentWindow) {
		const origin = window.location.protocol + '//' + window.location.host;
		const msgTarget = window.location.protocol === 'file:'? '*' : origin;
		const myURL = document.currentScript.src;
		const urlParams = new URLSearchParams(myURL.indexOf('?') !== -1? myURL.slice(myURL.indexOf('?')) : '');
		const paramLimitScript= /^(true|1)?$/i.test(urlParams.get('limitscript'));

		if (!('Unsandbox' in window)) {
			window.Unsandbox = {};
			Unsandbox.remoteAccess = {};
		}

		function findObject(name, begin) {
			let prevObj, lastName;
			if (name !== undefined) {
				const accessorRE = /(?:(?:^|\.)([a-z_$][\w$]*))|(?:\[([^\]]*)])/giy;
				let obj = begin;
				let match;
				while ((match = accessorRE.exec(name)) !== null) {
					prevObj = obj;
					if (typeof(prevObj) !== 'object') {
//TODO throw an error
					}
					if (match[1] !== undefined) {
						lastName = match[1];
					} else {
						lastName = match[2];
					}
					obj = obj[lastName];
				}
			}
			if (lastName === undefined) {
//TODO throw an error
			} else {
				return [prevObj, lastName];
			}
		}

		function increment(str, amount) {
			if (amount === undefined) {
				amount = 1;
			}
			let number, units;
			if (str) {
				number = parseFloat(str);
				if (Number.isNaN(number)) {
					number = 0;
				}
				units = str.match(/[a-zA-Z%]*$/)[0];
			} else {
				number = 0;
				units = '';
			}
			return String(number + parseFloat(amount)) + units;
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
			}, msgTarget);
		}

		function beforeUnload() {
			const activeElem = document.activeElement;
			if (activeElem !== null) {
				const linkOrigin = activeElem.protocol + '//' + activeElem.host;
				if (linkOrigin === origin) {
					const path = activeElem.pathname + activeElem.search;
					parentWindow.postMessage({eventType: 'navigation', value: path}, msgTarget);
					return;
				}
			}
			parentWindow.postMessage({eventType: 'unload'}, msgTarget);
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
				elements = paramLimitScript? [Unsandbox.remoteAccess] : [window];
			} else if (typeof(selector) === 'string') {
				if (modification.firstMatch) {
					let element = document.querySelector(selector);
					if (element === null) {
						elements = [];
					} else {
						elements = [element];
					}
				} else {
					elements = document.querySelectorAll(selector);
				}
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
				case 'hasAttribute':
					returnValues.push(element.hasAttribute(name));
					break;
				case 'increment':
					if (name === undefined) {
						element.innerHTML = increment(element.innerHTML, value);
					} else {
						const amount = value === undefined? 1 : parseFloat(value);
						[obj, jsPropertyName] = findObject(name, element);
						obj[jsPropertyName] = obj[jsPropertyName] + amount;
					}
					break;
				case 'incrementAttribute':
					element.setAttribute(name, increment(element.getAttribute(name), value));
					break;
				case 'incrementStyle':
					let currentValue = element.style.getPropertyValue(name);
					if (!currentValue) {
						currentValue = getComputedStyle(element).getPropertyValue(name);
					}
					element.style.setProperty(
						name,
						increment(currentValue, value),
						element.style.getPropertyPriority(name)
					);
					break;
				case 'innerHTML':
					if ('value' in modification) {
						element.innerHTML = String(value);
					} else {
						returnValues.push(element.innerHTML);
					}
					break;
				case 'outerHTML':
					if ('value' in modification) {
						element.outerHTML = String(value);
					} else {
						returnValues.push(element.outerHTML);
					}
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
					if (value === true) {
						element.setAttribute(name, name);
					} else if (value === false) {
						element.removeAttribute(name);
					} else {
						element.setAttribute(name, value);
					}
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
					let match = String(value).match(/^(.*?)(?:!\s*(important)\s*)?$/);
					element.style.setProperty(name, match[1], match[2]);
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
				case 'useClass':
					element.classList.toggle(name, value);
					break;
				default:
					sendError('BadArgs', 'Unknown operation ' + operation);
					break loop;
				}
			}

			if (returnValues.length > 0 || elements.length === 0) {
				parentWindow.postMessage({eventType: 'return', requestID: requestID, value: returnValues}, msgTarget);
			}
		}

		Unsandbox.unsandbox = function () {
			window.addEventListener("message", modifyPage);
		}

		window.addEventListener('load', Unsandbox.unsandbox);

		Unsandbox.resandbox = function () {
			window.removeEventListener('message', modifyPage);
			parentWindow.postMessage({eventType: 'unload'}, msgTarget);
			window.removeEventListener('beforeunload', beforeUnload);
		}

		/*	Signal to the container page to stop sending any more data if we navigate to another
			origin or notify the container page of the new address otherwise.
		*/
		window.addEventListener('beforeunload', beforeUnload);

		//Signal to the container page that we're loaded and ready.
		parentWindow.postMessage({eventType: 'load'}, msgTarget);

	}
}
