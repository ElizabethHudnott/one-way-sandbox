'use strict';
{
	if (!('Unsandbox' in window)) {
		window.Unsandbox = {};
	}

	const myURL = document.currentScript.src;
	const urlParams = new URLSearchParams(myURL.indexOf('?') !== -1? myURL.slice(myURL.indexOf('?')) : '');
	const paramAllowNavigation = /^(true|1)?$/i.test(urlParams.get('allownavigation'));

	const windows = new Set();
	const navigating = new Set();
	const listeners = new Map();
	const promises = new Map();

	let requestID = 0;

	function CustomError(name, data, message) {
		this.name = name;
		this.message = message === undefined? data : message;
		this.data;
	}
	CustomError.prototype = new Error();

	function findWindow(target, mustBeEnabled) {
		if (typeof(target) === 'string') {
			const targetElement = document.getElementById(target);
			if (targetElement !== null) {
				const targetWindow = targetElement.contentWindow;
				if (windows.has(targetWindow) || (!mustBeEnabled && listeners.has(targetWindow))) {
					return targetWindow;
				}
			}
		} else if (windows.has(target)) {
			return target;
		}
		return undefined;
	}

	function init(windowToInit) {
		windows.add(windowToInit);
		if (!listeners.has(windowToInit)) {
			listeners.set(windowToInit, {
				load: [],
				navigation: [],
				unload: [],
			});
		}
	}

	Unsandbox.addElement = function (id) {
		const elementToAdd = document.getElementById(id);
		if (elementToAdd !== null && elementToAdd.contentWindow) {
			init(elementToAdd.contentWindow);
		} else {
			throw new CustomError('UnknownWindow', id);
		}
	}

	Unsandbox.removeElement = function (id) {
		const element = document.getElementById(id);
		const windowToRemove = element.contentWindow;
		if (element !== null) {
			windows.delete(windowToRemove);
			navigating.delete(windowToRemove);
			listeners.delete(windowToRemove);
		}
	}

	Unsandbox.addWindow = function (url, windowName, windowFeatures) {
		const temporaryWindow = window.open('', windowName);
		temporaryWindow.close();
		const windowToAdd = window.open(url, windowName, windowFeatures === undefined? '' : windowFeatures);
		init(windowToAdd);
		return windowToAdd;
	}

	Unsandbox.removeWindow = function (windowToRemove) {
		windows.delete(windowToRemove);
		navigating.delete(windowToRemove);
		listeners.delete(windowToRemove);
	}

	Unsandbox.navigate = function (target, urlString) {
		let targetWindow = findWindow(target, false);
		if (targetWindow === undefined) {
			throw new CustomError('UnknownWindow', target);
		}

		const thisURL = document.location;
		const destinationURL = new URL(urlString, document.location.href);
		const sameOrigin = thisURL.protocol === destinationURL.protocol && thisURL.host === destinationURL.host;

		if (sameOrigin) {
			windows.add(targetWindow);
			navigating.add(targetWindow);
		} else {
			if (windows.has(targetWindow)) {
				windows.delete(targetWindow);
				const listenersToFire = listeners.get(targetWindow).unload;
				for (const listener of listenersToFire) {
					listener();
				}
			}
		}
		targetWindow.location.href = urlString;
	}

	Unsandbox.hasTarget = function (target) {
		return findWindow(target, true) !== undefined;
	}

	Unsandbox.addEventListener = function (target, type, listener) {
		const targetWindow = findWindow(target, false);
		if (targetWindow !== undefined) {
			listeners.get(targetWindow)[type].push(listener);
		} else {
			throw new CustomError('UnknownWindow', target);
		}
	}

	function pendingPromise() {
		let onresolve, onreject;
		const promise = new Promise(function (resolve, reject) {
			onresolve = resolve;
			onreject = reject;
		});
		promise.onresolve = onresolve;
		promise.onreject = onreject;
		return promise;
	}

	Unsandbox.send = function (target, command) {
		if (command.operation === undefined) {
			throw new CustomError('BadArgs', 'operation', 'Operation not specified.');
		}

		const targetWindow = findWindow(target, true);

		if (targetWindow !== undefined) {
			const operation = command.operation;
			requestID++;
			command.requestID = requestID;
			targetWindow.postMessage(command, '*');
			if (/^(get|has)/.test(operation) ||
				(!('value' in command) && /^(innerHTML|outerHTML)$/.test(operation))
			) {
				const promise = pendingPromise();
				promises.set(requestID, promise);
				return promise;
			} else {
				return Promise.resolve(undefined);
			}
		} else {
			return Promise.reject(new CustomError('UnknownWindow', target));
		}
	}

	window.addEventListener('message', function (event) {
		const data = event.data;
		if (typeof(data) !== 'object') {
			return;
		}
		let eventType = data.eventType;
		if (!/^(error|load|navigation|return|unload)$/.test(eventType)) {
			return;
		}
		event.stopImmediatePropagation();
		if (eventType === 'navigation' && !paramAllowNavigation) {
			eventType = 'unload';
		}

		const source = event.source;

		if (windows.has(source)) {
			let promise;
			switch (eventType) {
			case 'error':
				promise = promises.get(data.requestID);
				if (promise !== undefined) {
					promise.onreject(new CustomError(data.errorName, undefined, data.value));
				}
				break;
			case 'return':
				promise = promises.get(data.requestID);
				if (promise !== undefined) {
					promise.onresolve(data.value);
				}
				break;
			default:
				if (eventType === 'load') {
					navigating.delete(source);
				} else if (eventType === 'unload') {
					if (navigating.has(source)) {
						navigating.delete(source);
						return;
					} else {
						windows.delete(source);
					}
				}
				const listenersToFire = listeners.get(source)[eventType];
				for (const listener of listenersToFire) {
					listener(data.value);
				}
			}
		}
	});
}
