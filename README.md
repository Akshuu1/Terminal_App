# Keycode Detector

A simple Node.js script to detect and display the raw buffer values of keyboard presses.

## Known Issues & Solutions

### Issue: Buffer converting to String inside template literals

When trying to log the raw `Buffer` object of a keyboard press to see its hexadecimal value (e.g. `<Buffer 64>`), using template literals hides the raw data:

```javascript
// Problematic code
process.stdin.on('data', (data) => {
    console.log(`You have pressed ${data.toString().trim()} key which has code ${data}`);
});
```

**What happens:** When `data` (which is a `Buffer`) is placed inside a template string (`${data}`), JavaScript automatically calls `.toString()` on it to force it into text. Instead of printing the raw hex code (like `<Buffer 1b 5b 41>`), it converts the buffer to the actual character (like `d`), losing the raw byte information you were trying to see.

### Solution

To print the human-readable string *and* the raw Buffer object in the same console log, pass them as **separate arguments** to `console.log`, rather than embedding them in a single string. 

```javascript
// Fixed code
process.stdin.on('data', (data) => {
    // Pass the string and the Buffer as separate arguments separated by commas!
    console.log("You have pressed", data.toString().trim(), "key which has code", data);
});
```

**Why this works:** By passing `data` as a standalone argument, `console.log` receives the raw `Buffer` object intact. Node.js natively knows how to print Buffers nicely, so it accurately outputs the `<Buffer ...>` format you need for debugging arrow keys and other special characters.
