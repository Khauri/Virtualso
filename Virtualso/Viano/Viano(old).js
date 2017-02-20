//old version
//it works but it don't look pretty

var Viano = {
    keymap: [],
    notemap: ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b", ],
    generate: function(start, amount, width, height) {
        var vo = new Viano.VianoObject(width, height);
        //12 keys in an octave
        //startkey probably shouldn't be a sharp
        //but w/e, I don't tell you how to live your life
        var start = start.replace("s", "#").substring(0, 3);
        //start and end indices
        var sI = this.keymap.indexOf(start),
            eI = sI + amount,
            keyval;
        for (var i = sI; i < eI; i++) {
            keyval = this.keymap[i];
            if (keyval) {
                vo.addKey(keyval);
            }
        }
        return vo;
    },
    VianoObject: function(width, height) {
        this.keys = [];
        this.pressed = [];
        this.whiteCount = 0;
        this.blackCount = 0;
        this.width = width || 900;
        this.height = height || 200;
        if (document && document.createElement) {
            this.canvas = document.createElement("canvas");
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.ctx = this.canvas.getContext('2d');
        }
        this.__getKeyAt__ = function(x, y) {
            //return 
            var results = [];
            for (var i = 0; i < this.keys.length; i++) {
                k = this.keys[i];
                if (x >= k.box.x && x <= k.box.x2) {
                    if (y >= k.box.y && y <= k.box.y2) {
                        if (k.type == "black") {
                            results.unshift(k);
                        } else {
                            results.push(k);
                        }
                    }
                }
            }
            //console.log(results);
            return results;
        }
        this.__releaseAll__ = function() {
            while (this.pressed[0]) {
                this.pressed[0].pressed = false;
                this.pressed.shift();
            }
            this.render();
        }
        this.releaseKey = function(key) {
            var key = key.replace("s", "#");
            for (var i = 0; i < this.pressed.length; i++) {
                if (this.pressed[i].note == key) {
                    var key = this.pressed[i].toggle(false, i);
                    return key;
                }
            }
        }
        this.__getEvent__ = function(type, e) {
            //e.preventDefault();
            var rect = this.canvas.getBoundingClientRect(),
                hasShift;
            if (e.shiftKey) {
                hasShift = true;
            }
            if (e.pageX) {
                var x = e.pageX - rect.left - this.canvas.offsetLeft,
                    y = e.pageY - rect.top - this.canvas.offsetTop;
            }

            switch (type) {
                case "keyup":
                    if (e.keyCode == 13 && hasShift) {
                        for (var i = 0; i < this.pressed.length; i++) {
                            this.pressed[i].toggle();
                        }
                    }
                    break;
                case "mousedown":
                    var key = this.__getKeyAt__(x, y)[0];
                    if (key) {
                        key.toggle();
                        if (typeof this.onkeydown == "function") {
                            if (hasShift) {
                                this.onkeydown(this.pressed);
                            } else {
                                this.onkeydown([key]);
                            }
                        };
                        this.mouseKeyDown = key;
                    }
                    break;
                case "touchstart":
                    e.preventDefault();
                    var x, y;
                    for (var i = 0; i < e.touches.length; i++) {
                        x = e.touches[i].pageX - rect.left - this.canvas.offsetLeft;
                        y = e.touches[i].pageY - rect.top - this.canvas.offsetTop;
                        key = this.__getKeyAt__(x, y)[0];
                        if (key.pressed === false) {
                            key.toggle();
                            if (typeof this.onkeydown == "function") this.onkeydown(key);
                        }
                    }
                    break;
                case "touchend":
                    e.preventDefault();
                    for (var i = 0; i < e.changedTouches.length; i++) {
                        x = e.changedTouches[i].pageX - rect.left - this.canvas.offsetLeft;
                        y = e.changedTouches[i].pageY - rect.top - this.canvas.offsetTop;
                        key = this.__getKeyAt__(x, y)[0];
                        if (key.pressed === true) {
                            key.toggle();
                            if (typeof this.onkeyup == "function") this.onkeyup(key);
                        }
                    }
                    break;
                case "touchmove":
                    break;
                case "mouseup":
                    //if not holding down shift to select
                    //multiple keys; 
                    if (hasShift) {

                    } else {
                        if (this.mouseKeyDown) this.mouseKeyDown.toggle();
                    }
                    break;
            }
        }

        this.transpose = function(amount) {
            if (!this.keys[0]) return;
            var si = Viano.keymap.find(this.keys[0].note);
        }

        this.addKey = function(keyvalue, alt) {
            var key;
            if (keyvalue.indexOf("#") != -1) {
                key = new Viano.Key(keyvalue, "black", this);
                this.blackCount++;
            } else {
                key = new Viano.Key(keyvalue, "white", this);
                this.whiteCount++;
            }
            this.keys.push(key);
        }
        //return a list of keys pressed
        this.getPressed = function() {
            return viano.pressed.map(function(a) {
                return a.note
            }).sort(function(a, b) {
                return a.charCodeAt(0) * parseInt(a.replace(/[^0-9]/g, "")) - b.charCodeAt(0) * parseInt(b.replace(/[^0-9]/g, ""));
            });
        }
        this.getKey = function(note) {
            //might be faster than searching through 88 keys
            //might not be, w/e
            if (!note || typeof note != "string") return undefined;
            var note = note.replace("s", "#");
            for (var i = 0; i < this.keys.length; i++) {
                if (this.keys[i].note == note) {
                    return this.keys[i];
                }
            }

        }
        this.render = function() {
            this.ctx.clearRect(0, 0, this.width, this.height);
            //black ke
            var keyWidth = (this.width - 10) / this.whiteCount;
            var keyHeight = this.height - 10;
            var x = 5,
                y = 5;
            for (var ki in this.keys) {
                key = this.keys[ki];
                x = key.render(x, y, keyWidth, keyHeight, this.ctx);
            }
            return this.canvas;
        }
        this.setAll = function(key, value) {
            for (var i = 0; i < this.keys.length; i++) {
                this.keys[i].set(key, value);
            }
        }
        //generate the events
        var events = ["touchstart", "touchend", "touchmove", "mousedown", "mouseover", "mouseout", "mouseup", "keydown", "keyup"]
        for (var evt in events) {
            this.canvas.addEventListener(events[evt], this.__getEvent__.bind(this, events[evt]), false);
        }
        document.addEventListener("keydown", this.__getEvent__.bind(this, "keydown"), false);
        document.addEventListener("keyup", this.__getEvent__.bind(this, "keydown"), false);
    },
    Key: function(note, type, viano) {
        this.enabled = true;
        this.note = note;
        this.type = type;
        this.viano = viano;
        this.box = {
            x: 0,
            y: 0,
            x2: 0,
            y2: 0
        };
        this.pressed = false;
        this.hovered = false;
        this.stroke = (this.type == "black") ? "#a9a9a9" : "#a9a9a9";
        this.fill = (this.type == "black") ? "#2d2d2d" : "#fff";
        this.pressedFill = (this.type == "black") ? "black" : "#999";
        this.disabledFill = (this.type == "black") ? "#aaa" : "#ccc";
        //for simulating pressure
        this.pressIntensity = 1;
        this.render = function(x, y, width, height, ctx, rotation) {
            var w = (this.type == "black") ? width / 2 : width,
                h = (this.type == "black") ? height / 2 : height,
                x = (this.type == "black") ? x - w / 2 : x;
            ctx.globalCompositeOperation = (this.type == "black") ? "source-over" : "destination-over";
            ctx.beginPath();
            ctx.strokeStyle = this.stroke;
            ctx.fillStyle = (this.pressed) ? this.pressedFill : this.fill;
            if (this.pressed) {
                var grd = ctx.createLinearGradient(0, 0, 0, h);
                grd.addColorStop(0, "white");
                grd.addColorStop(1, "#a9a9a9");
                ctx.fillStyle = grd;
            }
            if (!this.enabled) {
                ctx.fillStyle = this.disabledFill;
            }
            ctx.rect(x, y, w, h);
            ctx.stroke();
            ctx.fill();
            this.box = {
                x: x,
                y: y,
                x2: x + w,
                y2: y + h
            };
            return (this.type == "black") ? x + w / 2 : x + w;
        }
        this.toggle = function(triggerEvent, __index__) {
            if (!this.enabled) return;
            this.pressed = !this.pressed;

            if (this.pressed && this.viano) {
                this.viano.pressed.push(this);
            } else if (!this.pressed && this.viano) {
                if (!__index__) {
                    for (var i = 0; i < this.viano.pressed.length; i++) {
                        if (this.viano.pressed[i] == this) {
                            __index__ = i;
                        }
                    }
                }
                this.viano.pressed.splice(__index__, 1);
                if (triggerEvent === true && typeof this.viano.onkeyup == "function") {
                    this.viano.onkeyup(this);
                }
            }
            this.viano.render();
            return this;
        }
        this.set = function(key, value) {
            this[key] = value;
            this.viano.render();
        }
    },
    //generate an array of keynames to make transposing easier and what not
    init: function() {
        var notes = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b", ];
        for (var i = -4; i < 8; i++) {
            for (var j in notes) {
                this.keymap.push(notes[j] + i);
            }
        }
    }

}
Viano.init();