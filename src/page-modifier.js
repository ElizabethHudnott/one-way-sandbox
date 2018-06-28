'use strict';
if (!('Unsandbox' in window)) {
	window.Unsandbox = {};
}

{
	let loadListeners = new Map();
	let listeners = new Map();

	function CustomError(name, data) {
		this.name = name;
		this.message = data;
		this.data = data;
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

	Unsandbox.send = function (target, command) {
		if (typeof(target) === 'string') {
			const destinationElement = document.getElementById(target);
			if (destinationElement !== null) {
				const destinationWindow = destinationElement.contentWindow;
				if (destinationWindow) {
					if (listeners.has(destinationWindow)) {
						destinationWindow.postMessage(command, '*');
						return;
					}
				}
			}
		} else if (listeners.has(target)) {
			target.postMessage(command, '*');
			return;
		}
		throw new CustomError('UnknownWindow', target);
	}

	window.addEventListener('message', function (event) {
		const data = event.data;
		if (typeof(data) !== 'object') {
			return;
		}
		const eventType = data.eventType;
		if (!/^(load|navigation|unload)$/.test(eventType)) {
			return;
		}
		event.stopImmediatePropagation();

		const source = event.source;

		if (listeners.has(source)) {
			const listenersToFire = listeners.get(source)[eventType];
			if (eventType === 'unload') {
				listeners.delete(source);
			}
			for (const listener of listenersToFire) {
				listener(data.value);
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
