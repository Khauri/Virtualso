# Virtualso.js
A collection of customizable canvas-rendered virtual instruments 

## Instruments

### Viano
A Virtual Piano
```javascript
var options = {
    /*
     *
     */
    scheme : [],
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
     * Viano's width
     */
    width : 400,
    /*
     * Viano's height
     */
    height : 200

};

var piano = new Virtualso.Viano( options );
document.body.appendChild(piano.view);

```

### VGuitar

### 
