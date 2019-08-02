export default class RenderHandler {
    constructor(canvas, width, height, layerNames) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.layerNames = layerNames;
        this.layerMap = {};
        for (let layerName of layerNames) {
            this.layerMap[layerName] = document.createElement("canvas");
            this.layerMap[layerName].width = width;
            this.layerMap[layerName].height = height;
        }
    }
    getLayer(layerName) {
        return this.layerMap[layerName];
    }
    render() {
        let sHeight = this.layerMap[this.layerNames[0]].height;
        let sWidth = this.layerMap[this.layerNames[0]].width;
        let dHeight = sHeight;
        let dWidth = sWidth;
        let heightRatio = this.canvas.height / sHeight;
        let widthRatio = this.canvas.width / sWidth;
        let dx = 0;
        let dy = 0;
        if (widthRatio < heightRatio) {
            dWidth = widthRatio * sWidth;
            dHeight = widthRatio * sHeight;
        }
        else {
            dWidth = heightRatio * sWidth;
            dHeight = heightRatio * sHeight;
        }
        dx = (this.canvas.width - dWidth) / 2;
        dy = (this.canvas.height - dHeight) / 2;
        let context = this.canvas.getContext('2d');
        if (context) {
            context.fillStyle = "#000000";
            context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            for (let layerName of this.layerNames) {
                context.drawImage(this.layerMap[layerName], 0, 0, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
        }
        return this.canvas;
    }
}
