const Instrument = require('./Instrument');
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