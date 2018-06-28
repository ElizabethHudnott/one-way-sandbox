'use strict';
{
	const parentWindow = window.parent !== window? window.parent : window.opener;

	if (parentWindow) {
		const myURL = document.currentScript.src;

		if (!('Unsandbox' in window)) {
			window.Unsandbox = {};
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

			const selector = modification.selector;
			const operation = modification.operation;
			const name = modification.name;
			const value = modification.value;
			let elements;

			if (operation === undefined || (selector === undefined && name === undefined && !/^(reload|srcdoc)$/.test(operation))) {
				return;
			}
			event.stopImmediatePropagation();

			switch (operation) {
			case 'reload':
				window.removeEventListener('beforeunload', beforeUnload);
				window.location.reload();
				return;
				break;
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

			let charIndex;

			for (const element of elements) {
				let obj = element;
				for (let i = 0; i < names.length - 1; i++) {
					obj = obj[names[i]];
				}

				switch (operation) {
				case 'append':
					let newNodes = Unsandbox.htmlToNodes(value);
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
				default:
					console.error('Document update: unknown operation ' + operation);
				}
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
