(function (_) {
    /**
     * A class representing a color gradient
     * @class GXGradient
     * @constructor
     */
    function GXGradient(stops) {
        if (stops) {
            this._stops = [];
            for (var i = 0; i < stops.length; ++i) {
                this._stops.push({
                    position: stops[i].position < 0 ? 0 : stops[i].position > 100 ? 100 : stops[i].position,
                    color: stops[i].color
                });
            }
        } else {
            this._stops = [new GXColor(GXColor.Type.Black), new GXColor(GXColor.Type.White)];
        }
    }

    /**
     * Gradient's mime-type
     * @type {string}
     */
    GXGradient.MIME_TYPE = "application/infinity+gradient";

    /**
     * Parse a string into a GXGradient
     * @param {String} string
     * @return {GXGradient}
     */
    GXGradient.parseGradient = function (string) {
        if (!string || string === "") {
            return null;
        }

        var blob = JSON.parse(string);
        if (blob && blob instanceof Array) {
            var result = new GXGradient();

            result._stops = [];

            for (var i = 0; i < blob.length; ++i) {
                var stop = blob[i];
                result._stops.push({
                    position: stop.p,
                    color: GXColor.parseColor(stop.c)
                })
            }

            return result;
        }

        return null;
    };

    /**
     * Compare two gradients for equality Also takes care of null parameters
     * @param {GXGradient} left left side gradient
     * @param {GXGradient} right right side gradient
     * @return {Boolean} true if left and right are equal (also if they're null!)
     */
    GXGradient.equals = function (left, right) {
        if (!left && left === right) {
            return true;
        } else if (left && right) {
                if (left._stops.length !== right._stops.length) {
                    return false;
                }

                var s1 = left._stops;
                var s2 = right._stops;
                for (var i = 0; i < s1.length; ++i) {
                    if (s1[i].position !== s2[i].position) {
                        return false;
                    }

                    if (!GXColor.equals(s1[i].color, s2[i].color)) {
                        return false;
                    }
                }
        }
        return false;
    };

    /**
     * @type {Array<{{position: Number, color: GXColor}}>}
     * @private
     */
    GXGradient.prototype._stops = null;

    /**
     * You may modify the return value though this class
     * is supposed to be immutable so ensure you know what
     * you are actually doing!!
     * @returns {Array<{{position: Number, color: GXColor}}>}
     */
    GXGradient.prototype.getStops = function () {
        return this._stops;
    };

    /**
     * Return string representation of the underlying gradient
     * @return {String}
     */
    GXGradient.prototype.asString = function () {
        var blob = [];

        for (var i = 0; i < this._stops.length; ++i) {
            blob.push({
                p: this._stops[i].position,
                c: this._stops[i].color.asString()
            })
        }

        return JSON.stringify(blob);
    };

    /**
     * Return CSS-Compatible string representation of the underlying gradient
     * stops separated by comma
     * @param {Boolean} forceLinear if true, will always return a linear gradient,
     * otherwise the internal gradient's type will be taken instead
     * @return {String}
     */
    GXGradient.prototype.asCSSString = function (ignoreType) {
        var cssStops = [];

        for (var i = 0; i < this._stops.length; ++i) {
            var stop = this._stops[i];
            cssStops.push('' + stop.color.asCSSString() + ' ' + stop.position + '%');
        }

        return cssStops.join(', ');
    };

    /** @override */
    GXGradient.prototype.toString = function () {
        return "[Object GXGradient]";
    };

    _.GXGradient = GXGradient;
})(this);