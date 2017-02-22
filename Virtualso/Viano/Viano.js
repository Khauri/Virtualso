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
                }
            }, opts);
        // These values are set after the user's values so that they can't be overwritten
        this.keys = [];
        this.data = {
            accidentals : 0,
            naturals: 0
        };
        this.isInBrowser = !!(window && document);
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
        var ctx = this.view._context;
            ctx.clearRect(0, 0, ctx.width, ctx.height);
        var x = this.pad[0]||1, 
            y = this.pad[1]||1, 
            width = (this.white.width || (this.width - this.pad[0] - this.pad[2]) / this.keys.length ), 
            height = (this.white.height || this.height - this.pad[1] - this.pad[3]);

        this.forEachKey(function(key, index){
            key.box = [x, y, width, height];
            if(key.accidental){
                ctx.globalCompositeOperation = "source-over";
                key.render(ctx, x - width/4, y, width/2, height/1.5);
                //x += width
            }else{
                ctx.globalCompositeOperation = "destination-over";
                key.render(ctx, x, y, width, height);
                x += width;
            }
        });
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
                'accidental' : note.indexOf('#') > -1,
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
     * Renders the key
     * TODO: svg fallback(?)
     */
    render(ctx, top, left, width, height){
        if(this.accidental){
            ctx.strokeStyle = this.viano.black.stroke;
            ctx.fillStyle = this.viano.black.fill;
        }else{
            ctx.strokeStyle = this.viano.white.stroke;
            ctx.fillStyle = this.viano.white.fill;
        }
        ctx.fillRect(top, left, width, height);
        ctx.strokeRect(top, left, width, height);
    }
    /**
     * Sets the state to a value between 0 and 1
     */
    /*set state( val ){
        this._state = Math.min(1, Math.max(0, val));
    }*/

    /**
     * Checks if a point (x, y) intersects this key
     */
    _isInIntersection(x, y){
        // transform the hitbox by the rotaton
    }
}