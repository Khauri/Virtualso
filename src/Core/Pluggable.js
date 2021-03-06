/**
 * Pluggables are what plugins hook on to
 * A pluggable has certain functionality
 */

const {deep_extend} = require('./helpers');
const Plugin = require('./Plugin');

/**
 * Allows plugins
 */
class Pluggable{
    constructor(...opts){
        deep_extend(this, ...opts);
    }
    /**
     * Reapply or configure this object
     * @param {*} props 
     */
    config(...props){
        deep_extend(this, ...props);
    }
    /**
     * Immediately apply a plugin's effects
     */
    apply(plugin, ...extra){
        if(typeof plugin === "function"){
            plugin.call(this, ...extra);
        }else if(plugin instanceof Plugin){
            plugin.plug(this, ...extra);
        }
        return this;
    }
    /**
     * Use a plugin/function to modify the results of this before returning
     * TBC
     */
    use(plugin){
        if(typeof plugin === "function"){
            plugin.bind(this/*, next */);
        }else if(plugin instanceof Plugin){

        }
        return this;
    }
    // Private //
    _callPlugins(){

    }
}

module.exports = Pluggable;