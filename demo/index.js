'use strict';

let inner = document.getElementById('inner');
Unsandbox.addElement(inner);

Unsandbox.addEventListener(inner, 'load', function () {
	console.log('Event: page loaded');
});
Unsandbox.addEventListener(inner, 'navigation', function (url) {
	console.log('Event: navigating to ' + url);
});
Unsandbox.addEventListener(inner, 'unload', function () {
	console.log('Event: unloaded');
});

Unsandbox.navigate(inner, 'iframe.html');

const booleanInput = document.getElementById('boolean');
const outputBox = document.getElementById('return-value');

function sendAddClass() {
	Unsandbox.send(inner, {
		op: 'addClass',
		selector: 'body',
		name: 'lemon',
	});
}

function sendAddScript() {
	Unsandbox.send(inner, {
		op: 'addScript',
		name: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_CHTML',
	});
}

function sendAppend() {
	Unsandbox.send(inner, {
		op: 'append',
		selector: 'body',
		value: '<div><ins><em>This content has been <strong>added</strong> by the parent document.</em></ins></div>'
	});
}

function sendCall() {
	Unsandbox.send(inner, {
		op: 'call',
		name: 'f',
		args: [ document.getElementById('arg').value ],
	});
}

function sendGetAttribute() {
	Unsandbox.send(inner, {
		op: 'getAttribute',
		selector: 'a',
		name: 'href'
	}).then (function (urls) {
		outputBox.innerText = String(urls);
	});
}

function sendHasAttribute() {
	Unsandbox.send(inner, {
		op: 'hasAttribute',
		selector: 'input[type=checkbox]',
		name: 'checked',
	}).then (function (checked) {
		outputBox.innerText = String(checked);
	});;
}

function sendHasClass() {
	Unsandbox.send(inner, {
		op: 'hasClass',
		selector: 'body',
		name: 'lemon',
	}).then (function (result) {
		outputBox.innerText = String(result);
	});;
}

function sendHide() {
	Unsandbox.send(inner, {
		op: 'hide',
		selector: '#links',
	});
}

function sendIncrementHTML() {
	Unsandbox.send(inner, {
		op: 'increment',
		selector: '#scratch',
	});
}

function sendIncrementJS() {
	Unsandbox.send(inner, {
		op: 'increment',
		name: 'x',
	});
}

function sendIncrementAttribute() {
	Unsandbox.send(inner, {
		op: 'incrementAttribute',
		selector: '#number',
		name: 'value',
	});
}

function sendIncrementStyle() {
	Unsandbox.send(inner, {
		op: 'incrementStyle',
		selector: 'div',
		name: 'margin',
		value: 2,
	});
}

function sendSetInnerHTML() {
	Unsandbox.send(inner, {
		op: 'innerHTML',
		selector: '#scratch',
		value: '<ins><em>This content has been <strong>edited</strong> by the parent document.</em></ins>'
	});
}

function sendSetInnerText() {
	Unsandbox.send(inner, {
		op: 'innerText',
		selector: '#scratch',
		value: '<ins><em>This content has been <strong>edited</strong> by the parent document.</em></ins>'
	});
}

function sendGetInnerHTML() {
	Unsandbox.send(inner, {
		op: 'innerHTML',
		selector: 'ul',
	}).then(function (html) {
		outputBox.innerText = String(html);
	});
}

function sendGetInnerText() {
	Unsandbox.send(inner, {
		op: 'innerText',
		selector: 'ul',
	}).then(function (text) {
		outputBox.innerText = String(text);
	});
}

function sendSetOuterHTML() {
	Unsandbox.send(inner, {
		op: 'outerHTML',
		selector: 'h1',
		value: '<ins><h2>This h2 Was Formerly a h1.</h2></ins>'
	});
}

function sendGetOuterHTML() {
	Unsandbox.send(inner, {
		op: 'outerHTML',
		selector: 'ul',
	}).then(function (html) {
		outputBox.innerText = String(html);
	});
}

function sendReload() {
	Unsandbox.send(inner, {
		op: 'reload',
	});
}

function sendRemove() {
	Unsandbox.send(inner, {
		op: 'remove',
		selector: 'h1, h2',
	});
}

function sendRemoveAttribute() {
	Unsandbox.send(inner, {
		op: 'removeAttribute',
		selector: 'input[type=checkbox]',
		name: 'disabled'
	});
}

function sendRemoveClass() {
	Unsandbox.send(inner, {
		op: 'removeClass',
		selector: 'body',
		name: 'lemon',
	});
}

function sendRemoveStyle() {
	Unsandbox.send(inner, {
		op: 'removeStyle',
		selector: 'body',
		name: 'background-color',
	});
}

function sendReplaceClass() {
	Unsandbox.send(inner, {
		op: 'replaceClass',
		selector: 'body',
		name: 'lemon',
		value: 'cursive',
	});
}

function sendSet() {
	Unsandbox.send(inner, {
		op: 'set',
		name: 'x',
		value: 5
	});
}

function sendSetFx() {
	Unsandbox.send(inner, {
		op: 'set',
		name: 'x',
		func: 'timesTwo',
		args: [10]
	});
}

function sendSetAttribute() {
	Unsandbox.send(inner, {
		op: 'setAttribute',
		selector: '#textbox',
		name: 'value',
		value: 'Parent document wrote this'
	});
}

function sendSetBooleanAttribute() {
	Unsandbox.send(inner, {
		op: 'setAttribute',
		selector: 'input[type=checkbox]',
		name: 'checked',
		value: booleanInput.checked,
	});
}

function sendSetStyle() {
	Unsandbox.send(inner, {
		op: 'setStyle',
		selector: 'body',
		name: 'background-color',
		value: 'lavender',
	});
}

function sendShow() {
	Unsandbox.send(inner, {
		op: 'show',
		selector: '#links',
	});
}

function sendShowBool() {
	Unsandbox.send(inner, {
		op: 'show',
		selector: '#links',
		value: booleanInput.checked,
	});
}

function sendToggleHTML() {
	Unsandbox.send(inner, {
		op: 'toggle',
		selector: '#links',
	});
}

function sendToggleJS() {
	Unsandbox.send(inner, {
		op: 'toggle',
		name: 'x',
	});
}

function sendToggleAttribute() {
	Unsandbox.send(inner, {
		op: 'toggleAttribute',
		selector: 'input[type=checkbox]',
		name: 'checked',
	});
}

function sendToggleClass() {
	Unsandbox.send(inner, {
		op: 'toggleClass',
		selector: 'body',
		name: 'lemon',
	});
}

function sendUseClass() {
	Unsandbox.send(inner, {
		op: 'useClass',
		selector: 'body',
		name: 'lemon',
		value: booleanInput.checked,
	});
}
