const {Plugin} = require('../Base');
const tag = "Viano";

module.exports = {
    /**
     * Easily adds mouse events
     */
    mouseEvents : function(){
        // flags
        let mousedown = false,
            keydown = null;
        // listeners
        this.addEventListener("mousedown", (data)=>{
            mousedown = true;
            if(data.key){
                keydown = data.key;
                data.key.setState("pressed");
            }
            this.render();
        })
        .addEventListener("mouseup", (data)=>{
            mousedown = false;
            if(data.key){
                keydown = data.key;
                data.key.setState("hover");
            }
            this.render();
        })
        .addEventListener("mousemove", (data)=>{
            if(data.key && data.key !== keydown){
                this.reset();
                if(mousedown){
                    data.key.setState("pressed");
                }else if(data.key){
                    data.key.setState("hover");
                }
                keydown = data.key;
            }
            this.render();
        })
        .addEventListener("mouseleave", ()=>{
            this.reset();
            keydown = null;
            this.render();
        });
    },
    /**
     * Add keyboard functionality
     */
    keyboardEvents : function(){
        this.addEventListener('keydown', (d)=>{
            if(d.key)
                d.key.setState("pressed");
            this.render();
            //console.log(d);
        })
        .addEventListener('keyup', (d)=>{
            if(d.key)
                d.key.setState("default");
            this.render();
            //console.log(d);
        });
    },
    /**
     * TODO: FIX
     * Maybe use an array(?)
     */
    timer : function(cb){
        if(typeof cb !== "function")
            throw "This timer plugin needs takes a callback function";
        let t1 = null,
            t2 = null,
            key = null;
        this.addEventListener("keystatechange",(data)=>{
            switch(data.stateName){
                case "pressed":
                    key = data.key;
                    t1 = performance.now();
                    break;
                default:
                    if(!key)
                        break;
                    t2 = performance.now() - t1;
                    cb({
                        key : key,
                        time : parseFloat(t2.toFixed(4))
                    });
                    t1 = null;
                    key = null;
                    break;
            }
        })
    }
}