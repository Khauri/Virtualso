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
        this.height = 250;
        this.width = 500;
        /**
         * [left, top, right, buttom] padding of container
         * Set to 1 to fix a particular bug
         */
        this.pad = [1,1,1,1];
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
    /* Static Methods */

    static get defaultNotemap(){
        return ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    }
}