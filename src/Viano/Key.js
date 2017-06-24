const {Playable} = require('../Base');
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