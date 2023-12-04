export default class Canvas {
    constructor(target, scale) {
        this.target = target;
        const ctx = target.getContext('2d');
        if (!ctx)
            throw new Error('getContext(2d) is null');
        this._ctx = ctx;
        this._scale = scale;
        this._target = target;
    }
    size(width, height) {
        const { _target, _scale } = this;
        // Set display size (css pixels).
        _target.style.width = `${width}px`;
        _target.style.height = `${height}px`;
        const dpr = window.devicePixelRatio;
        // Set actual size in memory (scaled to account for extra pixel density).
        _target.width = Math.floor(width * dpr);
        _target.height = Math.floor(height * dpr);
        // Normalize coordinate system to use css pixels.
        this._ctx.scale(dpr * _scale, dpr * _scale);
        return this;
    }
    prop(key, value) {
        if (value) {
            this._ctx[key] = value;
            return this;
        }
        if (typeof key === 'string') {
            return this._ctx[key];
        }
        Object.entries(key).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
                this._ctx[k] = v;
            }
        });
        return this;
    }
    measureTextWidth(text) {
        return this.measureText(text).width;
    }
    // draw line
    line(x1, y1, x2, y2) {
        this.moveTo(x1, y1).lineTo(x2, y2).stroke();
        return this;
    }
    // Drawing rectangles
    clearRect(x, y, width, height) {
        this._ctx.clearRect(x, y, width, height);
        return this;
    }
    fillRect(x, y, width, height) {
        this._ctx.fillRect(x, y, width, height);
        return this;
    }
    strokeRect(x, y, width, height) {
        this._ctx.strokeRect(x, y, width, height);
        return this;
    }
    // Drawing text
    fillText(text, x, y, maxWidth) {
        this._ctx.fillText(text, x, y, maxWidth);
        return this;
    }
    strokeText(text, x, y, maxWidth) {
        this._ctx.strokeText(text, x, y, maxWidth);
        return this;
    }
    measureText(text) {
        return this._ctx.measureText(text);
    }
    // Line styles
    getLineDash() {
        return this._ctx.getLineDash();
    }
    setLineDash(segments) {
        this._ctx.setLineDash(segments);
        return this;
    }
    // Gradients and patterns
    createLinearGradient(x0, y0, x, y) {
        return this._ctx.createLinearGradient(x0, y0, x, y);
    }
    createRadialGradient(x0, y0, r0, x1, y1, r1) {
        return this._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    }
    createPattern(image, repetition) {
        return this._ctx.createPattern(image, repetition);
    }
    // Paths
    beginPath() {
        this._ctx.beginPath();
        return this;
    }
    closePath() {
        this._ctx.closePath();
        return this;
    }
    moveTo(x, y) {
        this._ctx.moveTo(x, y);
        return this;
    }
    lineTo(x, y) {
        this._ctx.lineTo(x, y);
        return this;
    }
    bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
        this._ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        return this;
    }
    quadraticCurveTo(cpx, cpy, x, y) {
        this._ctx.quadraticCurveTo(cpx, cpy, x, y);
        return this;
    }
    arc(x, y, radius, startAngle, endAngle, counterclockwise) {
        this._ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);
        return this;
    }
    arcTo(x1, y1, x2, y2, radius) {
        this._ctx.arcTo(x1, y1, x2, y2, radius);
        return this;
    }
    ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise) {
        this._ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise);
        return this;
    }
    rect(x, y, width, height) {
        this._ctx.rect(x, y, width, height);
        return this;
    }
    roundRect(x, y, width, height, radius) {
        this.beginPath()
            .moveTo(x + radius, y)
            .arcTo(x + width, y, x + width, y + height, radius)
            .arcTo(x + width, y + height, x, y + height, radius)
            .arcTo(x, y + height, x, y, radius)
            .arcTo(x, y, x + width, y, radius)
            .closePath();
        return this;
    }
    // Drawing paths
    fill(fillRule) {
        this._ctx.fill(fillRule);
        return this;
    }
    stroke() {
        this._ctx.stroke();
        return this;
    }
    clip(fillRule) {
        this._ctx.clip(fillRule);
        return this;
    }
    isPointInPath(x, y, fillRule) {
        return this._ctx.isPointInPath(x, y, fillRule);
    }
    isPointInStroke(x, y) {
        return this._ctx.isPointInStroke(x, y);
    }
    // Transformations
    getTransform() {
        return this._ctx.getTransform();
    }
    rotate(angle) {
        this._ctx.rotate(angle);
        return this;
    }
    scale(x, y) {
        this._ctx.scale(x, y);
        return this;
    }
    translate(x, y) {
        this._ctx.translate(x, y);
        return this;
    }
    setTransform(a, b, c, d, e, f) {
        this._ctx.setTransform(a, b, c, d, e, f);
        return this;
    }
    // Drawing images
    drawImage(image, dx, dy) {
        this._ctx.drawImage(image, dx, dy);
        return this;
    }
    // Pixel manipulation
    createImageData(width, height) {
        return this._ctx.createImageData(width, height);
    }
    getImageData(sx, sy, sw, sh) {
        return this._ctx.getImageData(sx, sy, sw, sh);
    }
    putImageData(imageData, dx, dy) {
        this._ctx.putImageData(imageData, dx, dy);
        return this;
    }
    // The canvas state
    save() {
        this._ctx.save();
        return this;
    }
    restore() {
        this._ctx.restore();
        return this;
    }
}
