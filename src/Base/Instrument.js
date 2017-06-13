const {deep_extend} = require('./helpers');
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