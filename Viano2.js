/*
 * Everything usable in the API is camelCased
 * anything not usable is snake_cased
 */

var Viano = (function() {

    var notemap = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
    /*
     * Viano_Keys
     */
    var Key = function(p) {

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
            // Call all the functions
            var s = {
                key: this,
                active: this.active,
                state: this.state,
                previous_state: previous_state
            }
        },
        /*
         * Set an action when this particular key is triggered
         */
        onTrigger: function() {

        },
        _render: function() {

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
            scheme: notemap,
            primary: {
                color: p.primary.color || "white",
                outline: p.primary.outline || "gray",
                highlight: p.primary.highlight || undefined,
                width: p.primary.width || undefined,
            },
            secondary: {
                color: "black",
                outline: "gray",
                highlight: undefined,
                width: undefined,
                height: undefined,
            }
        }
        this.generate();
    };
    VianoObject.prototype = {
        view: undefined,

        keys: [],

        getKey: function(index) {

        },
        forEachKey: function(fn) {
            if (typeof fn == "function") {

            }
        },
        //adds a key to the end
        addKey: function(index) {

        },
        removeKey: function(index) {

        },
        //create the canvas and such
        generate: function(start_index) {
            var scheme = this.settings.scheme,
                len = scheme.length - 1,
                i = start_index || 0,
                keys = this.settings.keys + i,
                key;
            if (keys >= 512) {
                console.warn("What, really? You need " + keys + "? Okay, but don't blame me if your browser crashes...")
            }
            while (i < keys) {
                key = scheme[i % len];

                i++;
            }
            this.view = generate_canvas.call(this);
        },
        /*
         * toString method returns a canvas
         */
        toString: function ts() {
            return this.view;
        }
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
        console.log(this);
        var c = document.createElement('canvas');
        return c;
    }
    return VianoObject;
})();
Viano();