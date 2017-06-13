const {deep_extend} = require('./helpers');
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
            state : 0
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