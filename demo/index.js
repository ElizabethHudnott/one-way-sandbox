function addLogs() {
	console.log('Event: page loaded, connection initialized');
	Unsandbox.addEventListener('inner', 'load', function () {
		console.log('Event: page loaded');
	});
	Unsandbox.addEventListener('inner', 'navigation', function (url) {
		console.log('Event: navigating to ' + url);
	});
	Unsandbox.addEventListener('inner', 'unload', function () {
		console.log('Event: unloaded');
	});
}

Unsandbox.addElement('inner', addLogs);

function sendAddClass() {
	Unsandbox.send('inner', {
		operation: 'addClass',
		selector: 'body',
		name: 'lemon',
	});
}

function sendAppend() {
	Unsandbox.send('inner', {
		operation: 'append',
		selector: 'body',
		value: '<div><ins><em>This content has been <strong>added</strong> by the parent document.</em></ins></div>'
	});
}

function sendInnerHTML() {
	Unsandbox.send('inner', {
		operation: 'innerHTML',
		selector: '#scratch',
		value: '<ins><em>This content has been <strong>edited</strong> by the parent document.</em></ins>'
	});
}

function sendOuterHTML() {
	Unsandbox.send('inner', {
		operation: 'outerHTML',
		selector: 'h1',
		value: '<ins><h2>This h2 Was Formerly a h1.</h2></ins>'
	});
}

function sendReload() {
	Unsandbox.send('inner', {
		operation: 'reload',
	});
}

function sendRemove() {
	Unsandbox.send('inner', {
		operation: 'remove',
		selector: 'h1, h2',
	});
}

function sendRemoveAttribute() {
	Unsandbox.send('inner', {
		operation: 'removeAttribute',
		selector: 'input',
		name: 'disabled'
	});
}

function sendRemoveClass() {
	Unsandbox.send('inner', {
		operation: 'removeClass',
		selector: 'body',
		name: 'lemon',
	});
}

function sendSet() {
	Unsandbox.send('inner', {
		operation: 'set',
		name: 'x',
		value: '5'
	});
}

function sendSetAttribute() {
	Unsandbox.send('inner', {
		operation: 'setAttribute',
		selector: '#textbox',
		name: 'value',
		value: 'Parent document wrote this'
	});
}

function sendToggleClass() {
	Unsandbox.send('inner', {
		operation: 'toggleClass',
		selector: 'body',
		name: 'lemon',
	});
}
