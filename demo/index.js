'use strict';

Unsandbox.addElement('inner');

Unsandbox.addEventListener('inner', 'load', function () {
	console.log('Event: page loaded');
});
Unsandbox.addEventListener('inner', 'navigation', function (url) {
	console.log('Event: navigating to ' + url);
});
Unsandbox.addEventListener('inner', 'unload', function () {
	console.log('Event: unloaded');
});

Unsandbox.navigate('inner', 'iframe.html');

const booleanInput = document.getElementById('boolean');
const outputBox = document.getElementById('return-value');

function sendAddClass() {
	Unsandbox.send('inner', {
		operation: 'addClass',
		selector: 'body',
		name: 'lemon',
	});
}

function sendAddScript() {
	Unsandbox.send('inner', {
		operation: 'addScript',
		name: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_CHTML',
	});
}

function sendAppend() {
	Unsandbox.send('inner', {
		operation: 'append',
		selector: 'body',
		value: '<div><ins><em>This content has been <strong>added</strong> by the parent document.</em></ins></div>'
	});
}

function sendCall() {
	Unsandbox.send('inner', {
		operation: 'call',
		name: 'f',
		args: [ document.getElementById('arg').value ],
	});
}

function sendGetAttribute() {
	Unsandbox.send('inner', {
		operation: 'getAttribute',
		selector: 'a',
		name: 'href'
	}).then (function (urls) {
		outputBox.innerText = String(urls);
	});
}

function sendHasAttribute() {
	Unsandbox.send('inner', {
		operation: 'hasAttribute',
		selector: 'input[type=checkbox]',
		name: 'checked',
	}).then (function (checked) {
		outputBox.innerText = String(checked);
	});;
}

function sendHasClass() {
	Unsandbox.send('inner', {
		operation: 'hasClass',
		selector: 'body',
		name: 'lemon',
	}).then (function (result) {
		outputBox.innerText = String(result);
	});;
}

function sendHide() {
	Unsandbox.send('inner', {
		operation: 'hide',
		selector: '#links',
	});
}

function sendIncrementHTML() {
	Unsandbox.send('inner', {
		operation: 'increment',
		selector: '#scratch',
	});
}

function sendIncrementJS() {
	Unsandbox.send('inner', {
		operation: 'increment',
		name: 'x',
	});
}

function sendIncrementAttribute() {
	Unsandbox.send('inner', {
		operation: 'incrementAttribute',
		selector: '#number',
		name: 'value',
	});
}

function sendIncrementStyle() {
	Unsandbox.send('inner', {
		operation: 'incrementStyle',
		selector: 'div',
		name: 'margin',
		value: 2,
	});
}

function sendSetInnerHTML() {
	Unsandbox.send('inner', {
		operation: 'innerHTML',
		selector: '#scratch',
		value: '<ins><em>This content has been <strong>edited</strong> by the parent document.</em></ins>'
	});
}

function sendGetInnerHTML() {
	Unsandbox.send('inner', {
		operation: 'innerHTML',
		selector: 'ul',
	}).then(function (html) {
		outputBox.innerText = String(html);
	});
}

function sendSetOuterHTML() {
	Unsandbox.send('inner', {
		operation: 'outerHTML',
		selector: 'h1',
		value: '<ins><h2>This h2 Was Formerly a h1.</h2></ins>'
	});
}

function sendGetOuterHTML() {
	Unsandbox.send('inner', {
		operation: 'outerHTML',
		selector: 'ul',
	}).then(function (html) {
		outputBox.innerText = String(html);
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
		selector: 'input[type=checkbox]',
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

function sendRemoveStyle() {
	Unsandbox.send('inner', {
		operation: 'removeStyle',
		selector: 'body',
		name: 'background-color',
	});
}

function sendReplaceClass() {
	Unsandbox.send('inner', {
		operation: 'replaceClass',
		selector: 'body',
		name: 'lemon',
		value: 'cursive',
	});
}

function sendSet() {
	Unsandbox.send('inner', {
		operation: 'set',
		name: 'x',
		value: 5
	});
}

function sendSetFx() {
	Unsandbox.send('inner', {
		operation: 'set',
		name: 'x',
		func: 'timesTwo',
		args: [10]
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

function sendSetBooleanAttribute() {
	Unsandbox.send('inner', {
		operation: 'setAttribute',
		selector: 'input[type=checkbox]',
		name: 'checked',
		value: booleanInput.checked,
	});
}

function sendSetStyle() {
	Unsandbox.send('inner', {
		operation: 'setStyle',
		selector: 'body',
		name: 'background-color',
		value: 'lavender',
	});
}

function sendShow() {
	Unsandbox.send('inner', {
		operation: 'show',
		selector: '#links',
	});
}

function sendShowBool() {
	Unsandbox.send('inner', {
		operation: 'show',
		selector: '#links',
		value: booleanInput.checked,
	});
}

function sendToggleHTML() {
	Unsandbox.send('inner', {
		operation: 'toggle',
		selector: '#links',
	});
}

function sendToggleJS() {
	Unsandbox.send('inner', {
		operation: 'toggle',
		name: 'x',
	});
}

function sendToggleAttribute() {
	Unsandbox.send('inner', {
		operation: 'toggleAttribute',
		selector: 'input[type=checkbox]',
		name: 'checked',
	});
}

function sendToggleClass() {
	Unsandbox.send('inner', {
		operation: 'toggleClass',
		selector: 'body',
		name: 'lemon',
	});
}

function sendUseClass() {
	Unsandbox.send('inner', {
		operation: 'useClass',
		selector: 'body',
		name: 'lemon',
		value: booleanInput.checked,
	});
}
