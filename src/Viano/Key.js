const {Playable} = require('../Base');
/**
 * Represents a key
 * 
 * @author AnotherBlackKid
 */
module.exports = class Key extends Playable{
    constructor(viano, ...opts){
        super(viano, {
            options: {
                stroke : "#000",
                fill : "#fff",
                activeFill : "#aaa",
                render : null,
            },
            states : {
                neutral : {
                    stroke : "#000",
                    fill : "#fff",
                    activeFill : "#aaa"
                },
                hover : {

                }
            }
        }, ...opts);
    }
    /**
     * Changes the state of the key limited
     * Range [0, 1]
     */
    trigger( val ){
       this.state = Math.min(1, Math.max(0, val));
       if(this.state === NaN) this.state = 1;

       //this.parent.render(); // remove later and orce user to call render themselves
       return this;
    }
    /**
     * Renders the key
     * TODO: svg fallback(?)
     */
    render(ctx, left = 0, top = 0, width = 40, height = 250, fill, stroke, lineWidth){
        super.render(ctx, left, top, width, height); // does some setup stuff
        /* basically just draws a rectangle lol */
        if(this.state <= 0){
            ctx.strokeStyle = this.options.stroke;
            ctx.fillStyle = this.options.fill;
        }else{
            ctx.strokeStyle = this.options.activeStroke;
            ctx.fillStyle = this.options.activeFill;
        }
        //ctx.lineWidth = this.options.lineWidth;
        
        ctx.fillRect(this.left, this.top, this.width, this.height);
        ctx.strokeRect(this.left, this.top, this.width, this.height);
    }
}