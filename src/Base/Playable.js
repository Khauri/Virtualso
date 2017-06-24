const Pluggable = require('./Pluggable');
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