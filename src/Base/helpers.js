module.exports = {
    deep_extend : function de( target, ...sources ){
        var source;
        while(sources.length){
            source = sources.shift();
            if (!!source && source.constructor == Object){ //merge objects
                for(let prop in source){
                    if(target[prop] && target[prop].constructor == Object && source[prop].constructor == Object){
                        de(target[prop], source[prop]); // recursive extend
                    }else{
                        target[prop] = source[prop];
                    }
                }
            }
        }
    },
    /**
     * Parse a note string into usable parts
     * @param {*} n the note string 
     */
    parseNote(n){
        if(!(typeof n === "string"))
            throw "Can only parse string"
        let [fullMatch, fullNote, baseNote, acc = false, octave = undefined] = n.match(/(([a-g])([#sb]?))(\d+)?/i);
        return {
            full : fullMatch,
            note : fullNote,
            base : baseNote,
            acc : acc,
            octave : parseInt(octave)
        }
    }
}