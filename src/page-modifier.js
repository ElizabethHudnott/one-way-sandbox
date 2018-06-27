let Unsandbox;
{
	let iFrameIDs = new Set();
	let loadHandlers = new Map();

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
			const destinationWindow = document.getElementById(id).contentWindow;
			destinationWindow.postMessage(command, '*');
		}
	}

	window.addEventListener('message', function (event) {
		const data = event.data;
		if (typeof(data) !== 'object') {
			return;
		}
		const eventType = data.type;
		let sourceWindow, handler;

		for (const iFrameID of iFrameIDs) {
			const iFrame = document.getElementById(iFrameID);
			if (iFrame !== null) {
				sourceWindow = iFrame.contentWindow;
				if (event.source === sourceWindow) {
					switch (eventType) {
					case 'load':
						handler = loadHandlers.get(iFrameID);
						if (handler !== undefined) {
							handler();
						}
					}
					return;
				}
			}
		}
	});
}
