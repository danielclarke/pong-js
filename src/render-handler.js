export default class RenderHandler {
    constructor(canvas, layerNames) {
        this.canvas = canvas;
        this.layerNames = layerNames;
        this.layerMap = {};
        for (let layerName of layerNames) {
            this.layerMap[layerName] = document.createElement("canvas");
            this.layerMap[layerName].width = canvas.width;
            this.layerMap[layerName].height = canvas.height;
        }
    }
    getLayer(layerName) {
        return this.layerMap[layerName];
    }
    render() {
        let context = this.canvas.getContext('2d');
        if (context) {
            for (let layerName of this.layerNames) {
                context.drawImage(this.layerMap[layerName], 0, 0);
            }
        }
        return this.canvas;
    }
}
