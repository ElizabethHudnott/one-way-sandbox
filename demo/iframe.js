window.x = 0;

function f(a) {
	const nodes = Unsandbox.htmlToNodes('<p>f invoked with ' + a + '</p>');
	document.body.appendChild(nodes[0]);
}
