'use strict';
{
	const parentWindow = window.parent !== window? window.parent : window.opener;

	if (parentWindow) {
		const origin = window.location.protocol + '//' + window.location.host;
		const msgTarget = window.location.protocol === 'file:'? '*' : origin;
		const myURL = document.currentScript.src;
		const urlParams = new URLSearchParams(myURL.indexOf('?') !== -1? myURL.slice(myURL.indexOf('?')) : '');
		const paramLimitScript = /^(true|1)?$/i.test(urlParams.get('limitscript'));

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
			const source = event.source;
			if (source !== parentWindow && source !== window) {
				return;
			}

			const modification = event.data;
			if (typeof(modification) !== 'object') {
				return;
			}

			const operation = modification.op;
			const selector = modification.selector;
			const firstMatch = modification.firstMatch;
			const name = modification.name;
			const value = modification.value;
			const qualifiedFuncName = modification.func;
			const args = 'args' in modification? modification.args : [];
			const perMatch = modification.perMatch;
			const requestID = modification.requestID;
			let elements;

			if (operation === undefined) {
				return;
			}
			if (selector === undefined && name === undefined && !/^(reload|srcdoc)$/.test(operation)) {
				sendError('BadArgs', 'Missing selector or attribute name.', requestID);
				return;
			}
			if (!Array.isArray(args)) {
				//Throws an incomprehensible error message otherwise.
				sendError('BadArgs', 'args must be an array.', requestID);
				return;
			}
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			}

			const rootObject = paramLimitScript? Unsandbox.remoteAccess : window;

			let func, applyFunc;
			if (qualifiedFuncName !== undefined) {
				let funcParent;
				if (typeof(qualifiedFuncName) === 'function') {
					func = qualifiedFuncName;
					funcParent = undefined;
				} else {
					let funcName;
					[funcParent, funcName] = findObject(qualifiedFuncName, rootObject);
					func = funcParent[funcName];
				}
				applyFunc = function (argsToUse) {
					return func.apply(funcParent, argsToUse);
				}
			}
			let finalValue;
			if (perMatch) {
				args.push(undefined, undefined);
			} else if (func === undefined) {
				finalValue = value;
			} else {
				finalValue = applyFunc(args);
			}
			const numArgs = args.length;

			let charIndex, obj, jsPropertyName;

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
			case 'srcdoc':
				window.removeEventListener('beforeunload', beforeUnload);
				charIndex = finalValue.lastIndexOf('</body>');
				if (charIndex === -1) {
					document.writeln(finalValue + '<script src="' + myURL + '"></script>');
				} else {
					document.writeln(finalValue.slice(0, charIndex) + '<script src="' + myURL + '"></script></body></html>');
				}
				document.close();
				return;
			}

			if (selector === undefined) {
				elements = [rootObject];
			} else if (typeof(selector) === 'string') {
				if (firstMatch) {
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
				elements = [document.documentElement];
				const numberOfSubselectors = selector.length;
				for (let depth = 0; depth < numberOfSubselectors; depth++) {
					const subselector = selector[depth];
					let newElements = [];
					for (const element of elements) {
						if (typeof(subselector) === 'number') {
							const children = element.children;
							const numChildren = children.length;
							if (subselector < 0 && subselector >= -numChildren) {
								newElements.push(children[numChildren + subselector]);
							} else if (subselector < numChildren) {
								newElements.push(children[subselector]);
							} else if (elements.length === 1) {
								console.warn('Insufficient number of child nodes at depth ' + depth + ' in path ' + selector);
							}
						} else {
							if (firstMatch && depth === numberOfSubselectors - 1) {
								const newElement = element.querySelector(subselector);
								if (newElement !== null) {
									newElements.push(newElement);
								}
							} else {
								newElements = newElements.concat(Array.from(element.querySelectorAll(subselector)));
							}
						}
					}
					elements = newElements;
				}
				if (firstMatch && elements.length > 1) {
					elements = [elements[0]];
				}
			}

			let returnValues = [], show;

loop:		for (let i = 0; i < elements.length; i++) {
				const element = elements[i];
				if (perMatch) {
					args[numArgs - 2] = element;
					args[numArgs - 1] = i;
					finalValue = applyFunc(args);
				}
				switch (operation) {
				case 'addClass':
					element.classList.add(name);
					break;
				case 'append':
					let newNodes = Unsandbox.htmlToNodes(finalValue);
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
				case 'hasClass':
					returnValues.push(element.classList.contains(name));
					break;
				case 'hasAttribute':
					returnValues.push(element.hasAttribute(name));
					break;
				case 'increment':
					if (name === undefined) {
						element.innerHTML = increment(element.innerHTML, finalValue);
					} else {
						const amount = (value === undefined && func === undefined)? 1 : parseFloat(finalValue);
						[obj, jsPropertyName] = findObject(name, element);
						obj[jsPropertyName] = obj[jsPropertyName] + amount;
					}
					break;
				case 'incrementAttribute':
					element.setAttribute(name, increment(element.getAttribute(name), finalValue));
					break;
				case 'incrementStyle':
					let currentValue = element.style.getPropertyValue(name);
					if (!currentValue) {
						currentValue = getComputedStyle(element).getPropertyValue(name);
					}
					element.style.setProperty(
						name,
						increment(currentValue, finalValue),
						element.style.getPropertyPriority(name)
					);
					break;
				case 'innerHTML':
					if ('value' in modification || func) {
						element.innerHTML = String(finalValue);
					} else {
						returnValues.push(element.innerHTML);
					}
					break;
				case 'innerText':
					if ('value' in modification || func) {
						element.innerText = String(finalValue);
					} else {
						returnValues.push(element.innerText);
					}
					break;
				case 'outerHTML':
					if ('value' in modification || func) {
						element.outerHTML = String(finalValue);
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
					element.classList.replace(name, finalValue);
					break;
				case 'set':
					[obj, jsPropertyName] = findObject(name, element);
					obj[jsPropertyName] = finalValue;
					break;
				case 'setAttribute':
					if (value === true) {
						element.setAttribute(name, name);
					} else if (value === false) {
						element.removeAttribute(name);
					} else {
						element.setAttribute(name, finalValue);
					}
					break;
				case 'setStyle':
					let match = String(finalValue).match(/^(.*?)(?:!\s*(important)\s*)?$/);
					element.style.setProperty(name, match[1], match[2]);
					break;
				case 'hide':
					show = false;
					// fall through
				case 'show':
					if (show === undefined) {
						show = !('value' in modification) || finalValue;
					}
					// fall through
				case 'toggle':
					if (name === undefined) {
						const computedStyle = getComputedStyle(element);
						if (show === undefined) {
							show = computedStyle.getPropertyValue('display') === 'none';
						}
						const displayStyle = element.style.display;
						if (show) {
							//Show element
							if (displayStyle === '' || displayStyle === 'none') {
								element.style.display = element.getAttribute('data-x-unsandbox-display');
							}
							element.removeAttribute('data-x-unsandbox-display')
							if (computedStyle.getPropertyValue('display') === 'none') {
								element.style.display = 'initial';
							}
						} else {
							//Hide element
							if (displayStyle !== '' && displayStyle !== 'none') {
								element.setAttribute('data-x-unsandbox-display', displayStyle);
							}
							element.style.display = 'none';
						}
					} else {
						// Toggle JS boolean variable
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
					element.classList.toggle(name, finalValue);
					break;
				default:
					sendError('BadArgs', 'Unknown operation ' + operation);
					break loop;
				}
			}

			if (returnValues.length > 0 || elements.length === 0) {
				if (source === window) {
					return returnValues;
				} else {
					parentWindow.postMessage({eventType: 'return', requestID: requestID, value: returnValues}, msgTarget);
				}
			}
		}

		Unsandbox.unsandbox = function () {
			window.addEventListener("message", modifyPage);
		}

		window.addEventListener('load', function (event) {
			/*	Signal to the container page to stop sending any more data if we navigate
				to another origin or notify the container page of the new address otherwise.
			*/
			window.addEventListener('beforeunload', beforeUnload);

			Unsandbox.unsandbox();

			//Signal to the container page that we're loaded and ready to instructions.
			parentWindow.postMessage({eventType: 'load'}, msgTarget);
		});

		Unsandbox.resandbox = function () {
			window.removeEventListener('message', modifyPage);
			parentWindow.postMessage({eventType: 'unload'}, msgTarget);
			window.removeEventListener('beforeunload', beforeUnload);
		}

		Unsandbox.do = function (command) {
			return modifyPage({data: command, source: window});
		}

	}
}
