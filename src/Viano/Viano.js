const {Instrument} = require('../Base');
const Key = require('./Key');
/**
 * Viano.js 
 * ===
 * A customizable (V)irtual Piano for your website
 * 
 * Part of the Virtualso suite of es6 virtual instruments 
 * 
 * @author AnotherBlacKid
 */
module.exports = class Viano extends Instrument{
    constructor(...opts){
        super({ // overwritable
            range: ["C", 12],
            noteNames : false,
            white: {
                width : null, // auto-generate
                height : null,
                fill : "#fff",
                stroke : "#222",
                render : null,
            },
            black: {
                width : null, // auto-generate
                height : null,
                fill : "#333",
                stroke : "#222",
                render : null,
            },
            "[[private]]": {
                keys : [],
                data : {
                    accidentals : 0,
                    naturals : 0
                }
            }
        },
        ...opts, //user's overwritable options
        { // not overwrittable
            keys : [],
            data : {
                accidentals : 0,
                naturals : 0
            },
            
        });
        // set up the view and such
        this._init();
        // generate the viano
        this._generate();

        this.render();
    }
    /**
     * Gets a specific key by its note value 
     * @returns Key if found, null if not
     */
    getKeyByNote( note ){
        return null;
    }

    /**
     * Chainable shortcut for this.keys.map
     */
    forEachKey( cb ){
        this.keys.map(cb);
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
                    keys = keyStr.split(/\S/gi);
                    for(var i = 0;  i < keys.length; i++){
                        var k = getKeyByNote(key);
                        if( key ) key.trigger();
                    }
                }
                break;
        }
        return this;
    }

    /**
     * Renders the Viano by rendering each key
     */
    render(){
        super.render(); // does the rotations and stuff
        let view = this.view;
        var ctx = view.getContext('2d');
            ctx.clearRect(0, 0, view.width, view.height);
        var x = this.left + this.pad[0] || 1, 
            y = this.top + this.pad[1] || 1, 
            width = (this.white.width || (this.width - this.pad[0] - this.pad[2]) / this.data.naturals ), 
            height = (this.white.height || this.height - this.pad[1] - this.pad[3]);

        this.forEachKey((key, index)=>{
            key.top = y;
            if(key.accidental){
                ctx.globalCompositeOperation = "source-over";
                key.left = x - width/4;
                key.width = width/2;
                key.height = height/1.5;
            }else{
                ctx.globalCompositeOperation = "destination-over";
                key.left = x;
                key.width = width;
                key.height = height;
                x += width;
            }
            key.render(ctx);
        });
    }
    /**
     * Returns the note at a particular position
     */
    getKeyAtPosition(x, y){
        // if the viano is rotated "unrotate" it by rotating x, y around middle
        var key;
        for(var i = 0; i < this.keys.length; i++){
            key = this.keys[i];
            if(key._isInIntersection(x,y))
                return key;
        }
    }

    mousedown(e){

    }
    /**
     * This method is called when any key is triggered on the keyboard
     */
    set onTrigger( func ){

    }

    /* Getters */

    /**
     * Set the notemap
     */
    set notemap( map ){
        this.notemap = map;
    }
    /**
     * 
     */
    /*get keys(){
        return this["[[private]]"].keys;
    }*/
    /* Private methods */

    /**
     * Initializes the view and sets the dimensions
     */
    _init(){
        // the getter (this.view) automagically creates the view if it doesn't exist
        this.view.width = this.width; 
        this.view.height = this.height;
    }

    /**
     * Generate all the keys using the range
     * (Exponential Growth?)
     */
    _generate(){
        // First parse the range
        if(typeof this.range === "string")
            this.range = this.range.replace(/\s/gi,"").split(/[ ,-]/gi);
        
        let init = this.range[0],
            final = this.range[1] || 12;

        // Parse init value (should always be a string)
        let [, startNote, startAcc, startOct = 0] = init.toUpperCase().match(/([a-g])([#sb])?(\d+)?/i); startOct = parseInt(startOct);

        let keysToGenerate;
        // one easy case if it's already a number
        if(typeof final === "number")
            keysToGenerate = final;
        // two cases if it's a string
        else if (/^\d+/.test(final))
            keysToGenerate = parseInt(final);
        else{
            let [, endNote, endAcc, endOct = 0] = final.toUpperCase().match(/([a-g])([#sb])?(\d+)?/i); endOct = parseInt(endOct);
            if(startOct > endOct || ((startOct == endOct) && (endNote < startNote) && (startNote <= 'B')))
                throw `Impossible Generation Range from ${init} to ${final}`
            keysToGenerate = 1 + this.scheme.indexOf(endNote) - this.scheme.indexOf(startNote) + (endOct - startOct) * this.scheme.length;
        }

        // generate the keys
        let octave = startOct, 
            key, note, isAccidental;
        let index = this.scheme.indexOf(startNote + startAcc);
        for(let i = 0; i < keysToGenerate; i++, index = (index + 1) % this.scheme.length){
            note = this.scheme[index];
            isAccidental = note.indexOf('#') > -1;
            key = new Key(this, {
                'note' : note,
                'accidental' : isAccidental,
                'octave' : octave,
                'options' : isAccidental ? this.black : this.white
            })
            // track accidentals and naturals
            if(isAccidental) this.data.accidentals ++;
            else this.data.naturals ++;

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
}