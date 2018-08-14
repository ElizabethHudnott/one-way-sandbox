# Purpose
Have you ever wanted to isolate some web content so its scripts and CSS didn't mess with the rest of your page? Perhaps you *want* users to be able to write their own code? Simple. Use a sandboxed iframe, right? But sandboxing also prevents the parent page from accessing the embedded page. All of your parent page's goodness and clever manipulations won't work on content inside the iframe. What if you wanted the sandbox restriction to be one-way, so the parent issues commands to the embedded page and the child obeys? You'll find numerous tutorials on the web explaining how to do this using `Window.postMessage`. But what if you don't want to spend time developing your own protocol for describing your application's commands, encoding them into some specially designed format, and decoding them at the other end (not to mention doing the whole process in reverse if the function in the child frame returns a value)? Can't it be made to "just work" in a general way?  Maybe something a bit like a cross-frame version of jQuery? That's the purpose of this library.

# Getting Started
## Set Up
### 1. On the Parent Frame or Window Opener
1. Add the script: `<script src="page-modifier.js"></script>`
2. Register a sandboxed iframe (`Unsandbox.addElement(frame);`) or open and register a pop-up (`popup = Unsandbox.addWindow(url, 'myWindow');`).

### 2. Inside an iFrame or Opened Window
Add the script: `<script src="page-modification.js"></script>`

## Sending Commands from Parent to Child
````javascript
Unsandbox.send(frame, {
	op: 'setStyle',
	selector: 'body',
	name: 'background-color',
	value: 'lavender',
});
````

## Getting a Return Value Back
Return values are catered for using promises.

````javascript
Unsandbox.send(frame, {
	op: 'getAttribute',
	selector: 'a',
	name: 'href'
}).then (function (urls) {
	// urls in an array of URL strings.
});
````

A [complete list of commands](https://github.com/ElizabethHudnott/one-way-sandbox/tree/master/doc) and their current implementation status is available. There's also a [demo page](https://elizabethhudnott.github.io/one-way-sandbox/demo/index.html) and accompanying [source code](https://github.com/ElizabethHudnott/one-way-sandbox/tree/master/demo).
