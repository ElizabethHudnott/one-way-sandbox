'use strict';
{
	if (!('Unsandbox' in window)) {
		window.Unsandbox = {};
	}

	const myURL = document.currentScript.src;
	const urlParams = new URLSearchParams(myURL.indexOf('?') !== -1? myURL.slice(myURL.indexOf('?')) : '');
	const paramAllowNavigation = /^(true|1)?$/i.test(urlParams.get('allownavigation'));

	const loadListeners = new Map();
	const listeners = new Map();
	const promises = new Map();

	let requestID = 0;

	function CustomError(name, data, message) {
		this.name = name;
		this.message = message === undefined? data : message;
		this.data;
	}
	CustomError.prototype = new Error();

	function init(windowToInit) {
		listeners.set(windowToInit, {
			load: [],
			navigation: [],
			unload: [],
		});
	}

	Unsandbox.addElement = function (id, loadListener) {
		loadListeners.set(id, loadListener);
	}

	Unsandbox.removeElement = function (id) {
		loadListeners.delete(id);
		const element = document.getElementById(id);
		if (element !== null) {
			listeners.delete(element.contentWindow);
		}
	}

	Unsandbox.addWindow = function (windowToAdd) {
		if (!listeners.has(windowToAdd)) {
			init(windowToAdd);
		}
	}

	Unsandbox.removeWindow = function (windowToRemove) {
		listeners.delete(windowToRemove);
	}

	Unsandbox.addEventListener = function (target, type, listener) {
		if (typeof(target) === 'string') {
			target = document.getElementById(target).contentWindow;
		}
		listeners.get(target)[type].push(listener);
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

		let destination = undefined;
		if (typeof(target) === 'string') {
			const destinationElement = document.getElementById(target);
			if (destinationElement !== null) {
				const destinationWindow = destinationElement.contentWindow;
				if (destinationWindow) {
					if (listeners.has(destinationWindow)) {
						destination = destinationWindow;
					}
				}
			}
		} else if (listeners.has(target)) {
			destination = target;
		}

		if (destination !== undefined) {
			requestID++;
			command.requestID = requestID;
			destination.postMessage(command, '*');

			if (command.operation.slice(0, 3) === 'get') {
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

		if (listeners.has(source)) {
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
				const listenersToFire = listeners.get(source)[eventType];
				if (eventType === 'unload') {
					listeners.delete(source);
				}
				for (const listener of listenersToFire) {
					listener(data.value);
				}
			}
		} else if (eventType === 'load') {
			for (const id of loadListeners.keys()) {
				const element = document.getElementById(id);
				if (element !== null && element.contentWindow === source) {
					const listener = loadListeners.get(id);
					init(element.contentWindow);
					loadListeners.delete(id);
					if (listener) {
						listener();
					}
					break;
				}
			}
		}
	});
}
