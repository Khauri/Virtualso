/**
 * Viano.js 
 * ===
 * A customizable (V)irtual Piano for your website
 * 
 * Part of the Virtualso suite of es6 virtual instruments 
 * 
 * @author AnotherBlacKid
 */
class Viano extends Instrument{
    constructor( opts ){
        super();
        Object.assign(this,
            {
                scheme : Viano.defaultNotemap,
                range: ["C", 12],
                /**
                 * [left, top, right, buttom] padding of container
                 */
                pad : [0,0,0,0],
                /**
                 * Width of Viano in pixels
                 */
                width : 400,
                /**
                 * Height of Viano in pixels
                 */
                height : 150,
            }, opts);
        // These values are set after the user's values so that they can't be overwritten
        this.keys = [];
        this.isInBrowser = window && document;
        // set up the view and such
        this._init();
        // generate the viano
        this._generate();
    }
    /**
     * Gets a specific key by its note value 
     * @returns Key if found, null if not
     */
    getKeyByNote( note ){
        return null;
    }

    /**
     * Iterate through each key
     */
    forEachKey( cb ){
        return this;
    }

    /**
     * Trigger one or more keys
     */
    trigger(keyStr, val, callEvent = true){
        switch(typeof keyStr){
            case "object":
                // TODO
                break;
            case "string":
                if (keyStr.toLowerCase() == "all"){
                    this.forEachKey(function(key, index){
                        key.trigger( val, callEvent );
                    })
                }else{
                    var k = getKeyByNote(key);
                    if( key ) key.trigger();
                }
                break;
        }
        return this;
    }

    /**
     * This method is called when any key is triggered on the keyboard
     */
    set onTrigger( func ){

    }

    /* Getters */
    /**
     * Returns the canvas in which viano is drawn on
     */
    get view(){
        if(!this._view && this.isInBrowser){
            this._view = document.createElement('canvas');
            this._view._context = this._view.getContext('2d');
        }else if(!this._view){
            // throw error?
            this._view = {};
        }
        return this._view;
    }
    /**
     * Set the notemap
     */
    set notemap( map ){
        this.notemap = map;
    }

    /* Private methods */

    /**
     * Initializes the view and sets the dimensions
     */
    _init(){
        // the getter automagically creates the view
        this.view.width = this.width; 
        this.view.height = this.height;
    }
    /**
     * Draws all the keys
     */
    _draw(){
        this.forEachKey(function(key, index){
            key._draw();
        });
    }

    /**
     * Generate all the keys using the range
     */
    _generate(){
        var start = this.range[0].toUpperCase().replace('S',"#").replace(/\d/gi, ""),
            octave = parseInt(this.range[0].replace(/[^\d]/gi, "") , 10) || 0,
            keysToGenerate;
        switch(typeof this.range[1]){
            case "number":
                keysToGenerate = this.range[1];
                break;
            case "string":
                // find out how many keys to generate using math 
                // count elements between my key and end key
                var end = this.range[1].toUpperCase().replace('S',"#").replace(/\d/gi, "");
                
                // TODO: Check for start and end key in array
                var endOctave = parseInt(this.range[1].replace(/[^\d]/gi, "") , 10) || octave + 1,
                    keysToGenerate = 1 + this.scheme.indexOf(end) - this.scheme.indexOf(start) + (octave + endOctave)*this.scheme.length;
                break;
        }

        var key, note;
        for(var i = 0, index = this.scheme.indexOf(start); i < keysToGenerate; i++, index = (index + 1) % this.scheme.length){
            note = this.scheme[index];
            key = new Key(this, {
                'note' : note,
                'accidental' : true,
                'octave' : octave
            })
            //this.keys[note + octave] = key;
            this.keys.push(key);
            // increase the octave (?)
            if(index == this.scheme.length-1){
                octave++;
            }
        }
    }
    /**
     * Finds the index of a note in this viano's notemap
     */
    _index_of_note( note ){
        
    }

    /* Static Methods */

    static get defaultNotemap(){
        return ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    }
}

class Key{
    constructor(viano, opts){
        Object.assign(this, {
            viano : viano,
            note : "C",
            type : 0, // 0 for white, 1 for black
            /**
             * Top, Left, Width, Height
             */
            box : [],
            pad : [],
            customRender : null,
            outline: "#000",
            color : "",
            active_color : "",
            state : 0
        }, opts);
    }
    /**
     * 
     */
    trigger( val ){

    }
    /**
     * Draws the key
     * TODO: canvas default w/ svg fallback(?)
     */
    _draw(){
    }
    /**
     * Sets the state to a value between 0 and 1
     */
    /*set state( val ){
        this._state = Math.min(1, Math.max(0, val));
    }*/
}