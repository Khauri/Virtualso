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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const {deep_extend} = __webpack_require__(3);
const Plugin = __webpack_require__(2);

/**
 * Allows plugins
 */
class Pluggable{
    constructor(...opts){
        deep_extend(this, ...opts);
    }
    /**
     * Immediately apply a plugin's effects
     */
    apply(plugin, ...extra){
        if(typeof plugin === "function"){
            plugin.call(this, ...extra);
        }else if(plugin instanceof Plugin){
            plugin.plug(this, ...extra);
        }
        return this;
    }
    /**
     * Use a plugin/function to modify the results of this before returning
     * TBC
     */
    use(plugin){
        if(typeof plugin === "function"){
            plugin.bind(this/*, next */);
        }else if(plugin instanceof Plugin){

        }
        return this;
    }
    // Private //
    _callPlugins(){

    }
}

module.exports = Pluggable;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
    helpers : __webpack_require__(3),
    Instrument : __webpack_require__(6),
    Playable : __webpack_require__(7),
    Pluggable : __webpack_require__(0),
    Plugin : __webpack_require__(2)
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * Plugin format
 */

class Plugin{
    constructor(tag = "generic", plug = function(){}){
        this.tag = tag; // case sensitive
        this._plug = plug;
    }

    plug(pluggable, ...extra){
        if(pluggable.constructor.name === this.tag)
            if( typeof this._plug === "function")
                this._plug.call(this, ...extra);
    }
}

module.exports = Plugin;

/***/ }),
/* 3 */
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
        let [fullMatch, fullNote, baseNote, acc = false, octave = undefined] = n.toUpperCase().match(/(([a-g])([#sb]?))(\d+)?/i);
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const {Plugin} = __webpack_require__(1);
const tag = "Viano";

module.exports = {
    /**
     * Easily adds mouse events
     */
    mouseEvents : function(){
        // flags
        let mousedown = false,
            keydown = null;
        // listeners
        this.addEventListener("mousedown", (data)=>{
            mousedown = true;
            if(data.key){
                keydown = data.key;
                data.key.setState("pressed");
            }
            this.render();
        })
        .addEventListener("mouseup", (data)=>{
            mousedown = false;
            if(data.key){
                keydown = data.key;
                data.key.setState("hover");
            }
            this.render();
        })
        .addEventListener("mousemove", (data)=>{
            if(data.key && data.key !== keydown){
                this.reset();
                if(mousedown){
                    data.key.setState("pressed");
                }else if(data.key){
                    data.key.setState("hover");
                }
                keydown = data.key;
            }
            this.render();
        })
        .addEventListener("mouseleave", ()=>{
            this.reset();
            keydown = null;
            this.render();
        });
    },
    /**
     * Add keyboard functionality
     */
    keyboardEvents : function(){
        this.addEventListener('keydown', (d)=>{
            if(d.key)
                d.key.setState("pressed");
            this.render();
            //console.log(d);
        })
        .addEventListener('keyup', (d)=>{
            if(d.key)
                d.key.setState("default");
            this.render();
            //console.log(d);
        });
    },
    /**
     * TODO: FIX
     * Maybe use an array(?)
     */
    timer : function(cb){
        if(typeof cb !== "function")
            throw "This timer plugin needs takes a callback function";
        let t1 = null,
            t2 = null,
            key = null;
        this.addEventListener("keystatechange",(data)=>{
            switch(data.stateName){
                case "pressed":
                    key = data.key;
                    t1 = performance.now();
                    break;
                default:
                    if(!key)
                        break;
                    t2 = performance.now() - t1;
                    cb({
                        key : key,
                        time : parseFloat(t2.toFixed(4))
                    });
                    t1 = null;
                    key = null;
                    break;
            }
        })
    }
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Pluggable = __webpack_require__(0);
const keyMap = __webpack_require__(11);
/**
 * Instrument.js
 * ===
 * Base Instrument Class
 */
module.exports = class Instrument extends Pluggable{
    constructor(...opts){
        super( 
        {
            active : true,
            // whether or not this instrument is in focus
            // useful for deciding if keyboard inputs affect it
            focused : true,

            scheme : Instrument.defaultNotemap,
            keymap : Instrument.defaultKeymap,

            rotation : 0,

            /*
            * Set top, left, width, and height of instrument
            * useful for positioning inside another view and also
            * keeping
            */
            // this is not the width and height of the view
            width : 500, // width of instrument
            height : 250, // height of instrument
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
                    "mousemove" : [],
                    "keyup" : [],
                    "keydown" : [],
                    "statechange" : [],
                }
            },
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
                    case "mousedown":
                    case "mouseup":
                    case "mousemove":
                    case "mouseleave":
                        this.view.addEventListener(type, this.__viewEventHandler.bind(this));
                        break;
                    case "keyup":
                    case "keydown":
                        this.view.addEventListener(type, this.__keyboardEventHandler.bind(this))
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
    callEvents(data, ...types){
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
            // Set the tabIndex so the canvas can be focused
            // This is necessary for keyboard input
            // Now there's an outline around the canvas that can only be removed via css
            this["[[private]]"].view.tabIndex = 0;
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

    //// STATIC METHODS  ////

    static get defaultNotemap(){
        return ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    }

    static get defaultKeyMap(){
        return keyMap;
    }

    //// PRIVATE METHODS ////

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
        
        return false;
    }

    __keyboardEventHandler(e){
        // get the corresponding note
        let keyMap = Instrument.defaultKeyMap,
            data = {
                note : keyMap[e.key]
            }
        if(typeof this.__keyboardEventHook === "function")
            this.__keyboardEventHook(data);

        this.callEvents(data, e.type);
    }
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const Pluggable = __webpack_require__(0);
/**
 * A playable component of an instrument
 * Examples include Guitar Strings, Piano Keys, Drumpads, etc...
 */
module.exports = class Playable extends Pluggable{
    constructor(parent, ...opts){
        super({
            parent : parent,
            instrumentName : parent.constructor.name,
            note : 'C',
            octave : 4,
            width : 0,
            height : 0,
            top : 0,
            left : 0,
            // z-index
            zIndex : 0,
            // render states
            states : {
                default : {}
            },
            "[[private]]" : {
                currState : null,
                stateStack : []
            }
        }, ...opts);
        
        this.setState("default");
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
    /**
     * Set the state
     * @param {*} s the new state string or object
     * @param {} isQuiet whether or not to trigger stateChange events
     */
    setState(s, isQuiet = false){
        // Don't bother setting the state if it hasn't changed
        let curr = this.getStateName();
        if(s === 'default'){
            if(curr === "default")
                return this;
            this.state = this.states.default;
            this["[[private]]"].stateName = "default";
        }
        else if(typeof s === "object" && !(s instanceof Array)){
            this.state = Object.assign({}, this.states.default, s);
            this["[[private]]"].stateName = "custom";
        }
        else if(this.states[s]){
            if(curr === s)
                return this;
            this.state = Object.assign({}, this.states.default, this.states[s]);
            this["[[private]]"].stateName = s;
        }
        else
            throw `State ${s} is not defined`;

        // append the state stack?
        this._stateStack.push(this.state);

        // State change event
        if(!isQuiet && this.parent && this.parent.callEvents)
            this.parent.callEvents({
                type : "keyStateChange",
                key : this,
                stateName : this["[[private]]"].stateName
            }, "keyStateChange", "stateChange");
        return this;
    }
    /**
     * 
     */
    getStateName(){
        return this["[[private]]"].stateName;
    }
    /**
     * Serializes this playable
     */
    serialize(){
        return {
            note : this.note,
            octave : this.octave,
        };
    }
    /**
     * 
     */
    toString(){
        return `${this.note + this.octave}`;
    }
    //// GETTERS ////
    /**
     * Gets the stateStack
     */
    get _stateStack(){
        // keep the stateStack limited to a certain number
        this["[[private]]"].stateStack = this["[[private]]"].stateStack.splice(-5);
        return this["[[private]]"].stateStack;
    }
}

/***/ }),
/* 8 */
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
            states : {
                default : {
                    stroke : "#000",
                    fill : "#fff"
                },
                hover : {
                    stroke : "#000",
                    fill : "#fff"
                }
            }
        }, ...opts);
    }
    /**
     * Renders the key
     * TODO: svg fallback(?)
     */
    render(ctx, left = 0, top = 0, width = 40, height = 250, fill, stroke, lineWidth){
        super.render(ctx, left, top, width, height); // does some setup stuff
        /* basically just draws a rectangle lol 
            TODO: Draaw lines instead(?)*/
        let state = this.state;
        //console.log(state);
        ctx.strokeStyle = this.state.stroke;
        ctx.fillStyle = this.state.fill;
        
        ctx.fillRect(this.left, this.top, this.width, this.height);
        ctx.strokeRect(this.left, this.top, this.width, this.height);
    }
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const {Instrument, helpers} = __webpack_require__(1);
const Key = __webpack_require__(8);
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
                default : {
                    width : null, // auto-generate
                    height : null,
                    stroke : '#222',
                    fill : "#f7f7f7",
                    lineWidth : 5, // border stroke width
                },
                hover : {
                    fill : "#e2e2e2"
                },
                pressed : {
                    fill : "#999"
                }
            },
            black: {
                default : {
                    width : null, // auto-generate
                    height : null,
                    stroke : '#333',
                    fill : "#333",
                    lineWidth : 5, // border stroke width
                },
                hover : {
                    fill : "#000"
                },
                pressed : {
                    fill : "#555"
                }
            },
            "[[private]]": {
                events : {
                    "keystatechange" : []
                },
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
        let res = [],
            keys = this.keys;
        if(typeof note === "string")
            note = helpers.parseNote(note);
        this.keys.map((k)=>{
            if(k.note === note.note)
                if((note.octave !== 0 || !note.octave) || note.octave === k.octave)
                    res.push(k);
        });
        
        if(!res.length)
            return null;
        return res.length === 1 ? res[0] : res;
    }
    /**
     * Chainable shortcut for this.keys.map
     */
    forEachKey( cb ){
        this.keys.map(cb);
        return this;
    }
    /**
     * Resets the Viano and it's keys to their default states
     */
    reset(){
        this.keys.map((k)=>{
            k.setState("default");
        });
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
                this.keys.map((k)=>{k.setState()});
        });
        return this;
    }

    /**
     * Render or Re-Render the Viano
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

    //// getters ////

    get data(){
        return this["[[private]]"].data;
    }

    get keys(){
        return this["[[private]]"].keys;
    }

    //// PRIVATE METHODS ////

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
                states : accidental ? this.black : this.white
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

    //// EVENT HOOKS ////

    __viewEventHook(data){
        if(data.x && data.y)
            data.key = this.getKeyAtPosition(data.x, data.y);
    }

    __keyboardEventHook(data){
        if(data.note)
            data.key = this.getKeyByNote(data.note);
    }
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
    // Virtual Piano
    Viano : __webpack_require__(5),
    VianoPlugins : __webpack_require__(4)
}

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = {
	"0": "e1",
	"1": "c0",
	"2": "d0",
	"3": "e0",
	"4": "f0",
	"5": "g0",
	"6": "a0",
	"7": "b0",
	"8": "c1",
	"9": "d1",
	"Escape": "",
	"F1": "",
	"F2": "",
	"F3": "",
	"F4": "",
	"F5": "",
	"F6": "",
	"F7": "",
	"F8": "",
	"F9": "",
	"F10": "",
	"F11": "",
	"F12": "",
	"Insert": "",
	"Delete": "",
	"`": "",
	"-": "f1",
	"=": "f2",
	"Backspace": "",
	"~": "",
	"!": "c#0",
	"@": "d#0",
	"#": "f0",
	"$": "f#0",
	"%": "g#0",
	"^": "",
	"&": "",
	"*": "",
	"(": "",
	")": "",
	"_": "",
	"+": "",
	"Tab": "",
	"q": "",
	"w": "",
	"e": "",
	"r": "",
	"t": "",
	"y": "",
	"i": "",
	"o": "",
	"p": "",
	"[": "",
	"]": "",
	"\\": "",
	"Q": "",
	"W": "",
	"E": "",
	"R": "",
	"T": "",
	"Y": "",
	"I": "",
	"O": "",
	"P": "",
	"{": "",
	"}": "",
	"|": ""
};

/***/ })
/******/ ]);