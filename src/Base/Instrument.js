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
            origin : {x : this.width/2, y : this.height/2},
            top : 0,
            left : 0,
            /**
             * [left, top, right, buttom] padding of container
             * Set to 1 to fix a particular bug
             */
            pad : [1,1,1,1],

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
        // rotate the context around the center
        ctx.translate(view.width/2, view.height/2);
        ctx.rotate(this.rotation * Math.PI/180);
        ctx.translate(-view.width/2, -view.height/2);
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
            top : 0,
            left : 0,
            width : this.height * s + this.width * c,
            height : this.height * c + this.width * s
        }
    }

    /**
     * Gets the dimensions via padding calculation and such
     */
    get dimensions(){
        return {
            x : this.x + this.pad[0],
            y : this.y + this.pad[1],
            width : this.width - this.pad[0] - this.pad[2],
            height : this.height - this.pad[1] - this.pad[3],
        }
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
     * Set this view to an html cnavas element
     */
    set view(v){
        if(!(v instanceof HTMLCanvasElement))
            throw "Error: view can only be set to HTMLCanvasElement"
        this._view = v;
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