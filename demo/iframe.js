window.x = 0;

function f(a) {
	const nodes = Unsandbox.htmlToNodes('<p>f invoked with ' + a + '</p>');
	document.body.appendChild(nodes[0]);
}

document.getElementById('show-x-button').addEventListener('click', function (event) {
	document.getElementById('scratch').innerHTML = x;
});

document.getElementById('set-x-button').addEventListener('click', function (event) {
	x = 0;
});
