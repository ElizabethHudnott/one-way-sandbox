'use strict';
let Unsandbox;
{
	let iFrameIDs = new Set();
	let loadHandlers = new Map();

	function CustomError(name, data) {
		this.name = name;
		this.message = data;
		this.data = data;
	}
	CustomError.prototype = new Error();

	Unsandbox = {
		addIFrame: function (id, loadHandler) {
			iFrameIDs.add(id);
			if (loadHandler) {
				loadHandlers.set(id, loadHandler);
			}
		},

		removeIFrame: function (id) {
			iFrameIDs.delete(id);
			loadHandlers.delete(id);
		},

		send: function (id, command) {
			if (iFrameIDs.has(id)) {
				const destinationWindow = document.getElementById(id).contentWindow;
				destinationWindow.postMessage(command, '*');
			} else {
				throw new CustomError('UnknownWindow', id);
			}
		}
	}

	window.addEventListener('message', function (event) {
		const source = event.source;
		const data = event.data;
		if (typeof(data) !== 'object') {
			return;
		}
		const eventType = data.type;
		let openedWindow, handler;

		for (const iFrameID of iFrameIDs) {
			const iFrame = document.getElementById(iFrameID);
			if (iFrame !== null) {
				openedWindow = iFrame.contentWindow;
				if (source === openedWindow) {
					switch (eventType) {
					case 'load':
						handler = loadHandlers.get(iFrameID);
						if (handler !== undefined) {
							handler();
						}
						break;
					case 'unload':
						Unsandbox.removeIFrame(iFrameID);
						break;
					}
					return;
				}
			}
		}
	});
}
