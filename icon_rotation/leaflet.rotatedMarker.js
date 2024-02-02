(function() {
    // save these original methods before they are overwritten
    var proto_initIcon = L.Marker.prototype._initIcon;
    var proto_setPos = L.Marker.prototype._setPos;

    var oldIE = (L.DomUtil.TRANSFORM === 'msTransform');

    L.Marker.addInitHook(function () {
        var iconOptions = this.options.icon && this.options.icon.options;
        var iconAnchor = iconOptions && this.options.icon.options.iconAnchor;
        if (iconAnchor) {
            iconAnchor = (iconAnchor[0] + 'px ' + iconAnchor[1] + 'px');
        }
        this.options.rotationOrigin = this.options.rotationOrigin || iconAnchor || 'center bottom' ;
        this.options.rotationAngle = this.options.rotationAngle || 0;

        // Ensure marker keeps rotated during dragging
        this.on('drag', function(e) { e.target._applyRotation(); });
    });

    L.Marker.include({
        _initIcon: function() {
            proto_initIcon.call(this);
        },

        _setPos: function (pos) {
            proto_setPos.call(this, pos);
            this._applyRotation();
        },

        _applyRotation: function () {
    if (this.options.rotationAngle) {
        var oldTransform = this._icon.style[L.DomUtil.TRANSFORM];
        // 提取除了旋转之外的所有变换
        var translateMatch = oldTransform.match(/translate\(.+?\)/g);
        var rotateMatch = oldTransform.match(/rotate\(.+?\)/g);
        var newTransform = translateMatch ? translateMatch.join(' ') : '';
        newTransform += rotateMatch ? rotateMatch.join(' ') : '';
        // 添加新的旋转角度
        newTransform += ' rotateZ(' + this.options.rotationAngle + 'deg)';
        this._icon.style[L.DomUtil.TRANSFORM] = newTransform;
    }
},

        setRotationAngle: function(angle) {
            this.options.rotationAngle = angle;
            this.update();
            return this;
        },

        setRotationOrigin: function(origin) {
            this.options.rotationOrigin = origin;
            this.update();
            return this;
        }
    });
})();