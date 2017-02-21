# Virtualso.js
A collection of customizable canvas-rendered virtual instruments.
These instruments are purely visual and do not output sound, but can be 
configured to do so.

## Contents
- [Installation](#installation)
- [Usage](#Basic)
- [Instruments](#instruments) - Base Virtual Instrument Class
    - [Viano](#viano) - Virtual Piano
    - [VString](#VString) - Virtual Strings (Guitar, Violin, etc...)
    - [VDrumpad](#VDrumpad) - Virtual Drumpad 

# Installation
TODO: 
```bash
npm install 
```
# Instruments
All instruments share at least these fields and methods.

```javascript
var options = {
    /*
     * The not scheme to be used with the instrument
     */
    scheme : Virtualso.defaultScheme // ["C", "C#", "D" ...]
    /*
     * Instrument's width
     */
    width : 400,
    /*
     * Instrument's height
     */
    height : 200,
    /*
     * Instrument's rotation in radians
     */
    rotation : 0,

};
var instrument = new Virtualso.Instrument( options );
// methods
instrument.addEventListener(String, Function);
```
## Viano
A Virtual Piano. 

```javascript
var options = {
    /*
     * Specify the key range of the virtual keyboard
     *
     * Possible values:
     * ["C", 12] (default) - Start at C0 and generate 12 keys
     * ["C", "A"] - Start at C0 and generate to A0
     * ["A0", "C8"] - Start at A0 and Generate to C8 (standard 88 key piano)
     * ["A0", 88] - Start at A0 and generate 88 keys
     */
    range : ["C", 12]
};

// Create a new Viano
var piano = new Virtualso.Viano( options );
// Add the Viano's canvas to the DOM
document.body.appendChild(piano.view); 
```

## VString
VString represents an arbitrarily stringed instrument. Each string vibrates at a particular frequency when clicked.

## VDrumPad

The Virtual DrumPad class
