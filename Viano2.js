/*
 * Everything usable in the API is camelCased
 * anything not usable is snake_cased
 */

var Viano = (function() {

    var notemap = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    /*
     * Viano_Keys
     */
    var Key = function(note, p) {
        var p = p || {};
        this.note = note;
        this.width = p.width;
        this.height = p.height;
        this.x = p.x;
        this.y = p.y;
        this.color = p.color;
        this.highlight = p.highlight;
        this.outline = p.outline;
        this.index = p.index || undefined;
        this.customRender = p.render || false;
        this.trigger_cache = [];
    }
    Key.prototype = {
        /*
         * Active needed to determine if a key is triggerable
         */
        active: true,
        /*
         * Key state used to define pressure/intensity
         * Any nummber greater than 0 is considered on
         * Any number less than or equal to 0 is considered off
         */
        state: 0,
        /*
         * Set the key's state
         * trigger all personal key trigger events
         * bubble up to VianoObject trigger events
         */
        trigger: function(value) {
            // if value is undefined then toggle the current state to either an "on" or "off" value.
            var value = value || !this.state | 0;
            // Determine state of value
            switch (typeof value) {
                case "string":
                    value = value.toLowerCase();
                    if (value == "on") {
                        value = 1;
                    } else if (value == "off") {
                        value = 0;
                    } else {
                        //error
                    }
                    break;
                case "number":
                    // force value between 1 and 0
                    value = Math.max(Math.min(value, 1), 0);
                    break;
                default:
                    // error
                    break;
            }

            previous_state = this.state;
            this.state = value;
            // Call all the onTrigger functions and pass it this
            var s = {
                key: this,
                note: this.note,
                index: this.index,
                active: this.active,
                state: this.state,
                previous_state: previous_state,
                continueChain: true,
            }
            for (var i = 0, len = this.trigger_cache.length; i < len; i++) {
                this.trigger_cache[i].call(this, s);
            }
        },
        /*
         * Set an action when this particular key is triggered
         */
        onTrigger: function(fn) {
            if (typeof fn == "function") {
                this.trigger_cache.push(fn);
            } else {
                //error
            }
        },
        //sets the state without triggering any events
        setState: function() {

        },
        /*
         * Render the keys based on
         */
        render: function() {

        }
    }
    /*
     * VianoObject
     */
    var VianoObject = function(param) {
        if (!(this instanceof VianoObject)) {
            return new VianoObject(param);
        }

        var p = param || {}
        check_and_add(p, ["primary", "secondary"]);

        this.settings = {
            width: p.width || 300,
            height: p.height || 200,
            padding: extrapolate_padding(p.padding) || [5, 5, 5, 5],
            angle: p.angle || 0, //radians
            keys: p.keys || 12,
            // An auto-generation scheme. Defaults to a regular key layout.
            // Any key with a $ (flat) or # (sharp) at the end becomes a secondary key
            scheme: p.notemap || notemap,
            render: p.render || true,
            primary: {
                color: p.primary.color || "white",
                outline: p.primary.outline || "gray",
                highlight: p.primary.highlight || undefined,
                width: p.primary.width || undefined,
                render: p.primary.render || undefined
            },
            secondary: {
                color: "black",
                outline: "gray",
                highlight: undefined,
                width: undefined,
                height: undefined,
                render: p.secondary.render || undefined
            }
        }
        this.generate();
    };
    VianoObject.prototype = {
        /* 
         * The canvas and its associated ctx
         */
        view: {
            canvas: undefined,
            ctx: undefined
        },

        keys: [],
        /*
         * Get a key using a 0-based index
         * determine whether or not that indexing is circular
         */
        getKey: function(value, circular) {
            switch (typeof value) {
                case "number":
                    return (circular === true) ? this.keys[value % this.keys.length] : this.keys[value];
                    break;
                case "string":
                    //search for each key
                    break;
                case "object":
                    //iterate through array
                    break;
                default:
                    //error
                    break;
            }
        },
        forEachKey: function(fn, start_index) {
            var si = start_index || 0;
            if (typeof fn == "function") {
                for (var i = si, len = this.keys.length; i < len; i++) {
                    fn.call(this,this.keys[i]);
                }
            }
        },
        //adds a key to the end or a specific index
        addKey: function(index) {

        },
        removeKey: function(index) {

        },
        //create the canvas and such
        generate: function(start_index) {
            var scheme = this.settings.scheme,
                len = scheme.length,
                i = start_index || 0,
                keys = this.settings.keys + i,
                key, isSecondary;
            //send a nice warning if about to generate a lot of keys
            if (keys >= 512) {
                console.warn("What, really? You need " + keys + "? Okay, but don't blame me if your browser crashes...")
            }
            while (i < keys) {
                key = scheme[i % len];

                isSecondary = (key[key.length - 1] == "#" || key[key.length - 1] == "$"); //could be more robust in checking

                if (isSecondary) {
                    key = new Key(key, this.settings.secondary);
                } else {
                    key = new Key(key, this.settings.primary);

                }
                key.index = this.keys.push(key) - 1;
                i++;
            }
            //generate the canvas
            this.view = generate_canvas.call(this);
            //render
            if (this.settings.render === true) {
                this.render();
            }
        },
        render: function() {
            if (this.view.canvas && this.view.ctx) {
                //Draw all the keys to the canvas
                //this.forEachKey(function(key) {

                //});
                //Rotate/resize canvas if necessary

            } else {
                //error
            }
        },
        /*
         * toString method returns a canvas
         */
        onTrigger: function(fn) {

        },
        toString: function ts() {
            return this.view.canvas;
        },
    };
    /*
     * Helpers
     */

    // checks if array of keys in an object, adds if not
    function check_and_add(obj, keys) {
        for (var i = 0, len = keys.length, key; i < len; i++) {
            key = keys[i];
            if (!obj[key]) {
                obj[key] = {};
            };
        };
        return obj;
    }
    // gets an array of top,right,bottom,left padding values from string
    function extrapolate_padding(value) {
        if (!value) return undefined;
        switch (typeof value) {
            case "string":
                break;
            case "number":
                return [value, value, value, value];
                break;
            default:
                return undefined;
        }
    }
    // gets the first defined element passed to it
    // useful when checking for more than 2 (but can also just use ||)
    function get_first_defined() {
        for (var i = 0, len = arguments.length, def; i < len; i++) {
            if (def = arguments[i]) {
                return def;
            }
        }
    }
    //creates a canvas and such
    //call, apply, or bind
    function generate_canvas() {
        if (!document) return false; //error;
        var c = document.createElement('canvas');
        c.innerHTML = "Sorry HTML5 Canvas Not Supported In This Browser";
        return {
            canvas: c,
            ctx: c.getContext('2d')
        };
    }
    return VianoObject;
})();