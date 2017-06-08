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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
    Instrument : __webpack_require__(2),
    Playable : __webpack_require__(3)
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * Instrument.js
 * ===
 * Base Instrument Class
 */
module.exports = class Instrument{
    constructor(...opts){
        Instrument.__merge(this, 
        {
            active : true,

            scheme : this.constructor.defaultNotemap,
            keymap : this.constructor.defaultKeymap,

            rotation : 0,

            /*
            * Set top, left, width, and height of instrument
            * useful for positioning inside another view and also
            * keeping
            */
            width : 500,
            height : 250,
            top : 0,
            left : 0,
            /**
             * [left, top, right, buttom] padding of container
             * Set to 1 to fix a particular bug
             */
            pad : [1,1,1,1]
        },
        ...opts);
        this.__events = { 
            "hover": [], 
            "keydown": [],
            "keyup":[],
            // mousedown and touch events should be the same(?)
            "mousedown":[], 
            "mouseup":[],
            "touchdown" : [],
            "touchup":[]
        };
    }
    /**
     * Adds an event listener to the view
     */
    addEventListener(type, cb){
        // TODO: string check && cb function check
        var eventArr = this.__events[type.toLowerCase()];
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
            if(this.__events[type]){
                this.__events[type].map(function(cb){
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
     * The render function for the Instrument
     */
    render(){

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
     * Set this view to an html cnavas element
     */
    set view(v){
        if(!(v instanceof HTMLCanvasElement))
            throw "Error: view can only be set to HTMLCanvasElement"
        this._view = v;
        this._view._context = v.getContext('2d');
    }

    /* Static Methods */
    static get defaultNotemap(){
        return ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    }

    /* Private Methods */

    /**
     * Deep merge the properties of this object and any number of objects passed as arguments.
     * Similar to Object.Assign, but goes deeper. 
     * Infinite loops (and recursive errors) are possible so watch out...
     */
    static __merge( target, ...sources ){
        var source;
        while(sources.length){
            source = sources.shift();
            if (!!source && source.constructor == Object){ //merge objects
                for(let prop in source){
                    if(target[prop] && target[prop].constructor == Object && source[prop].constructor == Object){
                        Instrument.__merge(target[prop], source[prop]); // deep merge
                    }else{
                        target[prop] = source[prop];
                    }
                }
            }
        }
    }
    /**
     * Handles any events called upon the view
     */
    __viewEventHandler(e){
        // calculate position 
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left - this.top,
            y = e.clientY - rect.top -  this.left;
        // now transform mouse position by rotation
        
        //
        switch(e.type){
            default:
                this.callEvents(
                    {   
                        type : e.type,
                        x:x, 
                        y:y
                    }, e.type);
                break;
        }
    }
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Instrument = __webpack_require__(2);
/**
 * A playable component of an instrument
 * Examples include Guitar Strings, Piano Keys, Drumpads, etc...
 */
module.exports = class Playable{
    constructor(parent, ...opts){
        Instrument.__merge(this, {
            parent : parent,
            instrumentName : parent.constructor.name,
            note : 'C',
            octave : 4,
            width : 0,
            height : 0,
            top : 0,
            left : 0,
            state : 0
        }, ...opts);
    }

    onTrigger(){

    }

    render(){

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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const {Playable} = __webpack_require__(0);
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
                width : 0,
                height : 0,
                render : null,
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

       this.parent.render(); // remove later and orce user to call render themselves
       return this;
    }
    /**
     * Renders the key
     * TODO: svg fallback(?)
     */
    render(ctx){
        if(this.state <= 0){
            ctx.strokeStyle = this.options.stroke;
            ctx.fillStyle = this.options.fill;
        }else{
            ctx.strokeStyle = this.options.activeStroke;
            ctx.fillStyle = this.options.activeFill;
        }
        
        ctx.fillRect(this.left, this.top, this.width, this.height);
        ctx.strokeRect(this.left, this.top, this.width, this.height);
    }
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const {Instrument} = __webpack_require__(0);
const Key = __webpack_require__(4);
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
            }
        },
        ...opts, //user's overwritable options
        { // not overwrittable
            keys : [],
            data : {
                accidentals : 0,
                naturals : 0
            },
            isInBrowser : !!(window && document)
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
        var ctx = this.view._context;
            ctx.clearRect(0, 0, ctx.width, ctx.height);
        var x = this.pad[0]||1, 
            y = this.pad[1]||1, 
            width = (this.white.width || (this.width - this.pad[0] - this.pad[2]) / this.data.naturals ), 
            height = (this.white.height || this.height - this.pad[1] - this.pad[3]);

        this.forEachKey(function(key, index){
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
        // generator range parser
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
        // generator
        var key, note, isAccidental;
        for(var i = 0, index = this.scheme.indexOf(start); i < keysToGenerate; i++, index = (index + 1) % this.scheme.length){
            note = this.scheme[index];
            isAccidental = note.indexOf('#') > -1;
            key = new Key(this, {
                'note' : note,
                'accidental' : isAccidental,
                'octave' : octave,
                'options' : isAccidental ? this.black : this.white
            })
            // track accidentals and naturals
            if(key.accidental) this.data.accidentals ++;
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

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
    // Virtual Piano
    Viano : __webpack_require__(1)
}

/***/ })
/******/ ]);