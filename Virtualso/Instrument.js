/**
 * Instrument.js
 * ===
 * All 
 */
class Instrument{
    constructor(opts){
        this.active = true;
        this.scheme = this.constructor.defaultNotemap;
        this.keymap = this.constructor.defaultKeymap;
        this.rotation = 0;
        /*
         * Set top, left, width, and height of instrument
         * useful for positioning inside another view and also
         * keeping
         */
        this.height = 250;
        this.width = 500;
        this.top = 0;
        this.left = 0;
        /**
         * [left, top, right, buttom] padding of container
         * Set to 1 to fix a particular bug
         */
        this.pad = [1,1,1,1];

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
     * Deep merge the properties of this object and any number of objects passed as arguments
     * Similar to underscore's extend
     * Infinite loops are possible...
     */
    __merge( ...sources ){
        var source;
        while(sources.length){
            source = source.shift();
            if (!!source && source.constructor == Object){
                this.__merge(source);
            }else{

            }
        }
    }
    /**
     * Handles any events called upon the view
     */
    __viewEventHandler(){

    }
}