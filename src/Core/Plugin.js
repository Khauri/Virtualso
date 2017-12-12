/**
 * Plugin format
 */

class Plugin{
    constructor(tag = "generic", plug = function(){}){
        this.tag = tag; // case sensitive
        this._plug = plug;
    }

    plug(pluggable, ...extra){
        if(pluggable.constructor.name === this.tag)
            if( typeof this._plug === "function")
                this._plug.call(this, ...extra);
    }
}

module.exports = Plugin;