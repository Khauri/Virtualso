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
     * Width of view generated
     */
    width : 400,
    /*
     * Height of view generated
     */
    height : 200,
    /*
     * Instrument's rotation in radians
     * Setting this rotation DOES NOT rotate the view itself, but the elements within it.
     * Make sure the view is big enough to contain the rotated div
     * To rotate the view itself use CSS or 
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
    range : ["C", 12],
    /*
     * Choose when to display the name of the note on the key
     * Possible values:
     * true - Always display noteName 
     * false - Never display noteName
     * "triggered" - Display only on triggered notes
     * "untriggered" - Display only on untriggered notes (why? I dunno, I just offer solutions okay)
     * [...'notes'] - String of specific notes to 
     */
    noteNames : false,
    /*
     * Turn keyboard control of Viano on/off
     * consider using the toggleInteraction method if you're using multiple Viano instances and 
     * are experiencing a problem with the Viano playing on all of them
     */
    keyboardControl : true,
    /*
     * Map keys on keyboard to keys on Viano 
     */
    keyMap : Viano.defaultKeymap
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
