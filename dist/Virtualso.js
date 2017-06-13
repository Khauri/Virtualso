var Virtualso =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = {
    deep_extend : function de( target, ...sources ){
        var source;
        while(sources.length){
            source = sources.shift();
            if (!!source && source.constructor == Object){ //merge objects
                for(let prop in source){
                    if(target[prop] && target[prop].constructor == Object && source[prop].constructor == Object){
                        de(target[prop], source[prop]); // recursive extend
                    }else{
                        target[prop] = source[prop];
                    }
                }
            }
        }
    },
    /**
     * Takes a list of arguments and returns the first one that's defined
     * @param {*} args 
     */
    getFirstDefined(...args){
        for(let i = 0; i < args.length; i++){
            if(args[i]) return args[i];
        }
        return null;
    },
    /**
     * Parse a note string into usable parts
     * @param {*} n the note string 
     */
    parseNote(n){
        if(!(typeof n === "string"))
            throw "Can only parse string"
        let [fullMatch, fullNote, baseNote, acc = false, octave = undefined] = n.match(/(([a-g])([#sb]?))(\d+)?/i);
        return {
            full : fullMatch,
            note : fullNote,
            base : baseNote,
            acc : acc,
            octave : parseInt(octave)
        }
    }
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
    Instrument : __webpack_require__(3),
    Playable : __webpack_require__(4),
    helpers : __webpack_require__(0)
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const {deep_extend} = __webpack_require__(0);
/**
 * Instrument.js
 * ===
 * Base Instrument Class
 */
module.exports = class Instrument{
    constructor(...opts){
        deep_extend(this, 
        {
            active : true,
            // whether or not this instrument is in focus
            // useful for deciding if keyboard inputs affect it
            focused : true,

            scheme : this.constructor.defaultNotemap,
            keymap : this.constructor.defaultKeymap,

            rotation : 0,

            /*
            * Set top, left, width, and height of instrument
            * useful for positioning inside another view and also
            * keeping
            */
            // this is not the width and height of the view
            width : 500, // width of instrument
            height : 250, // height of instrument
            origin : {x : this.width/2, y : this.height/2},
            top : 0,
            left : 0,
            /**
             * [left, top, right, buttom] padding of container
             * Set to 1 to fix a particular bug
             */
            pad : [1,1,1,1],
            // private 
            "[[private]]" : {
                events : {
                    "mousedown" : [],
                    "mouseup" : [],
                    "mouseleave" : [],
                    "mousemove" : []
                }
            },
            // event hooks
            __events : { 
                "hover": [], 
                "keydown": [],
                "keyup":[],
                "mousedown":[], 
                "mouseup":[],
                "touchdown" : [],
                "touchup":[]
            }
        }, ...opts);
        this.isInBrowser = !!(window && document)
    }
    /**
     * Adds an event listener to the view
     */
    addEventListener(type, cb){
        // TODO: string check && cb function check
        var eventArr = this["[[private]]"].events[type.toLowerCase()];
        if(eventArr){
            // Add event listener to 
            if(eventArr.length == 0){
                // TODO: Check if view exists
                switch(type){
                    default:
                        this.view.addEventListener(type, this.__viewEventHandler.bind(this));
                        break;
                }
            }
            eventArr.push(cb);
        }
        return this;
    }
    /**
     * Calls the events
     */
    callEvents(data,...types){
        if(!this.active) 
            return false;
        var type;
        while(types.length > 0){
            // TODO: string check
            type = types.shift().toLowerCase();
            if(this["[[private]]"].events[type]){
               this["[[private]]"].events[type].map(function(cb){
                    cb(data);
                })
            }
        }
        return true;
    }
    /**
     * The function called before the instrument is rendered
     */
    onStartRender(){

    }
    /**
     * The generic render function for an Instrument
     */
    render(){
        let view = this.view,
            ctx = view.getContext('2d');
        // resize canvas
        if(!this.clip){
            let aabb = this.AABB;
            view.width = aabb.width;
            view.height = aabb.height;
        }
        // rotate the context around the center of the instrument
        let centerX = (this.left + this.width / 2 ), 
            centerY = (this.top + this.height / 2 );

        ctx.translate(view.width/2, view.height/2);
        ctx.rotate(this.rotation * Math.PI/180);
        ctx.translate(-centerX, -centerY);
    }
    /**
     * The function called when the render is finished
     */
    onEndRender(){

    }
    /**
     * Toggle interactions on or off
     */
    toggleInteractions( val ){
        if(val)
            this.active = !!val;
        else
            this.active = !this.active;
    }
    /** Getters */
    /**
     * Get the (A)xis-(A)ligned (B)ounding (B)ox
     * Convolutes the dimensions with the rotation
     */
    get AABB(){
        let dim = this.dimensions,
            t = this.rotation * Math.PI/180,
            c = Math.cos(t),
            s = Math.sin(t);
        if (s < 0 ) s = -s;
        if (c < 0 ) c = -c;
        return{
            top : this.top, // TODO
            left : this.left, // TODO
            width : this.height * s + this.width * c,
            height : this.height * c + this.width * s
        }
    }

    /**
     * Gets the dimensions via padding calculation and such
     */
    get dimensions(){
        return {
            x : this.top + this.pad[0],
            y : this.left + this.pad[1],
            width : this.width - this.pad[0] - this.pad[2],
            height : this.height - this.pad[1] - this.pad[3],
        }
    }
    /**
     * Returns the canvas in which viano is drawn on
     */
    get view(){
        if(!this["[[private]]"].view && this.isInBrowser){
            this["[[private]]"].view = document.createElement('canvas');
        }else if(!this["[[private]]"].view){
            throw "Cannot get view while not in browser!";
        }
        return this["[[private]]"].view;
    }
    /**
     * Set this view to an html cnavas element
     */
    set view(v){
        if(!(v instanceof HTMLCanvasElement))
            throw "Error: view can only be set to HTMLCanvasElement"
        this["[[private]]"].view = v;
    }

    /* Static Methods */
    static get defaultNotemap(){
        return ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    }

    /* Private Methods */
    /**
     * Handles any events called upon the view
     */
    __viewEventHandler(e){
        // calculate position 
        let rect = e.target.getBoundingClientRect();
        // TODO: Check if actually a click
        let data = {
                type : e.type,
                // real x and y of click
                x : e.clientX - rect.left - this.top,
                y: e.clientY - rect.top -  this.left,
                // x and y of click relative to instrument
        };
        let s = Math.sin(this.rotation * Math.PI / 180),
            c = Math.cos(this.rotation * Math.PI / 180);
        //if (s < 0 ) s = -s;
        //if (c < 0 ) c = -c;
        // transform mouse position by rotation (?)
        let aabb = this.AABB;
        let cx = aabb.width / 2,
            cy = aabb.height / 2;
            
        data.rotatedX = cx * c - cy * s;
        data.rotatedY = cx * s + cy * c;

        data.rotatedX -= this.width/2;
        data.rotatedY -= this.height/2;

        if(typeof this.__viewEventHook === "function")
            this.__viewEventHook(data);
        this.callEvents(data, e.type);
    }
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const {deep_extend} = __webpack_require__(0);
/**
 * A playable component of an instrument
 * Examples include Guitar Strings, Piano Keys, Drumpads, etc...
 */
module.exports = class Playable{
    constructor(parent, ...opts){
        deep_extend(this, {
            parent : parent,
            instrumentName : parent.constructor.name,
            note : 'C',
            octave : 4,
            width : 0,
            height : 0,
            top : 0,
            left : 0,
            state : 0,
            // z-index
            zIndex : 0,
            // render states
            states : {}
        }, ...opts);
    }

    onTrigger(){

    }
    /**
     * Generic render function for a playable
     * @param {*} ctx The HTMLCanvas2dRenderingContext passed in
     * @param {*} top The top coordinate of the Axis-Aligned Bounding Box
     * @param {*} left The left coordinate of the Axis-Aligned Bounding Box
     * @param {*} width The width of the Axis-Aligned Bounding Box
     * @param {*} height The height of the Axis-Aligned Bounding Box
     */
    render(ctx, left, top, width, height){
        Object.assign(this, {top : top, left : left, width : width, height : height});
        // get the render state
        return this;
    }
    /**
     * Checks if a point (x, y) intersects this playable.
     * *Note: does not automatically transform x and y by the rotation or position!*
     */
    _isInIntersection(x, y){
        return (x >= this.left && x <= this.left + this.width) ? 
                    (y >= this.top && y <= this.top + this.height) : false;
    }
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const {Playable} = __webpack_require__(1);
/**
 * Represents a key
 * 
 * @author AnotherBlackKid
 */
module.exports = class Key extends Playable{
    constructor(viano, ...opts){
        super(viano, {
            options: {
                stroke : "#000",
                fill : "#fff",
                activeFill : "#aaa",
                render : null,
            },
            states : {
                neutral : {
                    stroke : "#000",
                    fill : "#fff",
                    activeFill : "#aaa"
                },
                hover : {

                }
            }
        }, ...opts);
    }
    /**
     * Changes the state of the key limited
     * Range [0, 1]
     */
    trigger( val ){
       this.state = Math.min(1, Math.max(0, val));
       if(this.state === NaN) this.state = 1;

       //this.parent.render(); // remove later and orce user to call render themselves
       return this;
    }
    /**
     * Renders the key
     * TODO: svg fallback(?)
     */
    render(ctx, left = 0, top = 0, width = 40, height = 250, fill, stroke, lineWidth){
        super.render(ctx, left, top, width, height); // does some setup stuff
        /* basically just draws a rectangle lol */
        if(this.state <= 0){
            ctx.strokeStyle = this.options.stroke;
            ctx.fillStyle = this.options.fill;
        }else{
            ctx.strokeStyle = this.options.activeStroke;
            ctx.fillStyle = this.options.activeFill;
        }
        //ctx.lineWidth = this.options.lineWidth;
        
        ctx.fillRect(this.left, this.top, this.width, this.height);
        ctx.strokeRect(this.left, this.top, this.width, this.height);
    }
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const {Instrument, helpers} = __webpack_require__(1);
const Key = __webpack_require__(5);
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
        super({ 
            range: ["C", 12],
            /**
             * Display settings
             */
            noteNames : false,
            noOverlap : false,
            // generic key settings
            keyOptions : {
                width : null,
                height : null
            },
            // specific key settings
            white: {
                width : null, // auto-generate
                height : null,
                fill : "#f7f7f7",
                stroke : "#222",
                lineWidth : 5, // border stroke width
                render : null,
            },
            black: {
                width : null, // auto-generate
                height : null,
                fill : "#333",
                stroke : "#333",
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
        ...opts);
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
    trigger(keys, val, callEvent = true){
        if(typeof keys === "string")
            keys = keys.split(/\s/g); // split string by spaces
        keys.map((key)=>{
            if(key.toLowerCase() === "all") // trigger all keys
                this.keys.map((k)=>{k.trigger(val)});
            else{
                let info = helpers.parseNote(key);
                this.keys.map((k)=>{
                    if(k.note.toUpperCase() === info.note.toUpperCase()){ //if it's the same note
                        if(isNaN(info.octave) || info.octave === k.octave) // same octave or none specified
                            k.trigger(val);
                    }
                });
            }
        });
        this.render();
        return this;
    }

    /**
     * Releases all keys in an array or string
     * @param {*} keys 
     */
    release(keys){
        if(typeof keys === "string")
            keys = keys.split();
        keys.map((key)=>{
            key = key.toLowerCase()
            if(key === "all")
                this.keys.map((k)=>{k.trigger(0)});
        });
        return this;
    }

    /**
     * Renders the Viano by rendering each key
     */
    render(){
        super.render(); // Performs the rotations and what-not so they needn't be worried about
        let view = this.view;
        let ctx = view.getContext('2d');
            //ctx.clearRect(this.top, this.left, this.width, this.height);
        let keys = this.keys;
        let x = this.left + this.pad[0] || 1, 
            y = this.top + this.pad[1] || 1;
            /*width = helpers.getFirstDefined( 
                        this.white.width,
                        this.keyOptions.width,
                        (this.width - this.pad[0] - this.pad[2]) / (this.data.naturals) // calculate
                    ),
            height = helpers.getFirstDefined(
                        Math.max(this.white.height || 0, this.black.height || 0),
                        this.keyOptions.height,
                        this.height - this.pad[1] - this.pad[3]
                    );*/
            //
            let wWidth = this.white.width ||
                         this.keyOptions.width ||
                         (this.width - this.pad[0] - this.pad[2]) / (this.data.naturals + (this.noOverlap ? this.data.accidentals : 0)),

                bWidth = this.black.width ||
                         this.keyOptions.width ||
                         this.noOverlap ? wWidth : wWidth / 2,

                wHeight = this.white.height ||
                          this.keyOptions.height ||
                          (this.height - this.pad[1] - this.pad[3]),

                bHeight = this.black.height ||
                          this.keyOptions.height || 
                          this.noOverlap ? wHeight : wHeight / 1.5;
                        
        let top, left, kWidth, kHeight;
        keys.map((key, index)=>{
            top = y;
            if(key.accidental){
                ctx.globalCompositeOperation = "source-over";
                if(this.noOverlap){
                    left = x;
                    x += bWidth; 
                }else{
                    left = x - bWidth / 2;
                }
                key.render(ctx, left, top, bWidth, bHeight);
            }else{
                ctx.globalCompositeOperation = "destination-over";
                // new
                left = x;
                x += wWidth;
                key.render(ctx, left, top, wWidth, wHeight);
            }
        });
    }
    /**
     * Returns the note at a particular position
     */
    getKeyAtPosition(x, y){
        let keys = this.keys,
            res = [];
        for(let i = 0; i < keys.length; i++){
            if(keys[i]._isInIntersection(x, y)){
                res.push(keys[i]);
            }
        }
        // reduce results to a single value
        // good enough for now tbh
        return res.reduce((a, c)=>{
            if(!a) return c;
            if(a.accidental && c.accidental) 
                return a.zIndex > c.zIndex ? a : c;
            else 
                return a.accidental ? a : c;
        }, null);
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
     */
    _generate(){
        // First parse the range into a start note and then the amount of notes to generate
        if(typeof this.range === "string")
            this.range = this.range.replace(/\s/gi,"").split(/[ ,-]/gi);
        
        let init = this.range[0],
            final = this.range[1] || 12;

        // Parse init value (should always be a string)
        let [, startNote, startAcc = "", startOct = 0] = init.toUpperCase().match(/([a-g])([#sb])?(\d+)?/i); startOct = parseInt(startOct);

        let keysToGenerate;
        // one easy case if it's already a number
        if(typeof final === "number")
            keysToGenerate = final;
        // two cases if it's a string
        else if (/^\d+/.test(final))
            keysToGenerate = parseInt(final);
        else{
            let [, endNote, endAcc = "", endOct = 0] = final.toUpperCase().match(/([a-g])([#sb])?(\d+)?/i); endOct = parseInt(endOct);
            if(startOct > endOct || ((startOct == endOct) && (endNote < startNote) && (startNote <= 'B')))
                throw `Impossible Generation Range from ${init} to ${final}!`
            keysToGenerate = 1 + this.scheme.indexOf(endNote) - this.scheme.indexOf(startNote) + (endOct - startOct) * this.scheme.length;
        }

        // generate the keys
        let octave = startOct, 
            key, note, accidental;
        let index = this.scheme.indexOf(startNote + startAcc); // doesn't currently account for using b or s.

        for(let i = 0; i < keysToGenerate; i++, index = (index + 1) % this.scheme.length){
            note = this.scheme[index];
            [, accidental = false] = note.match(/[a-g]([#sb])?/i);
            key = new Key(this, {
                note : note,
                accidental : accidental,
                octave : octave,
                options : accidental ? this.black : this.white
            });
            // track accidentals and naturals
            if(accidental) this.data.accidentals ++;
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

    /// event hooks ///
    __viewEventHook(data){
        if(data.x && data.y)
            data.key = this.getKeyAtPosition(data.x, data.y);
    }
    /// getters ///
    get data(){
        return this["[[private]]"].data;
    }

    get keys(){
        return this["[[private]]"].keys;
    }
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
    // Virtual Piano
    Viano : __webpack_require__(2)
}

/***/ })
/******/ ]);