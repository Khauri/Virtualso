/**
 * Instrument.js
 * ===
 * All 
 */
class Instrument{
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
/**
 * A playable component of an instrument
 * Examples include Guitar Strings, Piano Keys, Drumpads, etc...
 */
class Playable{
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