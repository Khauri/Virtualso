/**
 * Viano.js 
 * ===
 * A customizable (V)irtual Piano for your website
 * 
 * Part of a suite of virtual instruments 
 * Everything usable in the API is camelCased
 * anything not usable is snake_cased
 * 
 * @author AnotherBlacKid
 */
class Viano{
    constructor( opts ){
        Object.assign(this,
            {
                scheme : Viano.defaultNotemap,
                range: ["A", 88]
            }, opts);
        // These values are set after the user's values so that they can't be overwritten
        this.keyMap = [];
        this.isInBrowser = window && document;
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
     * This method is called when any key is triggered on the keyboard
     */
    set onTrigger( func ){

    }

    /* Getters */
    
    /**
     * Returns all the keys
     * @return Array of keys
     */
    get keys(){
        return [];
    }
    /**
     * Returns the canvas in which viano is drawn on
     */
    get view(){
        if(!this._view && this.isInBrowser){
            this._view = document.createElement('canvas');
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
                'octave' : octave
            })
            //this.keyMap[note + octave] = key;
            this.keyMap.push(key);
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
        Object.assign(this, {}, opts)
        this.state = 0;
        this.type = 1;
        this.box = [0,0,0,0]; //x, y, w, h
        this.padding = [0,0,0,0] // left, top, right, bottom
        this.color;
        this.highlightColor;
        this.outline;
        this.customRender;
    }
    /**
     * Draws the key
     * TODO: canvas default w/ svg fallback(?)
     */
    _draw(){

    }

    trigger(){

    }
}