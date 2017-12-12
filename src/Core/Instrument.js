const Pluggable = require('./Pluggable');
const keyMap = require('./keyMap');
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
     * TODO: Replace addEventLisnter
     */
    on(type, cb){
        this.addEventListener(type, cb);
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