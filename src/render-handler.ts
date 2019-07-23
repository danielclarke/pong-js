export default class RenderHandler {
    layerMap: {[layer: string]: HTMLCanvasElement};
    constructor(public canvas: HTMLCanvasElement, public width: number, public height: number, public layerNames: string[]) {
        this.layerMap = {};
        for (let layerName of layerNames) {
            this.layerMap[layerName] = document.createElement("canvas");
            this.layerMap[layerName].width = canvas.width;
            this.layerMap[layerName].height = canvas.height;
        }
    }

    getLayer(layerName: string): HTMLCanvasElement {
        return this.layerMap[layerName];
    }

    render(): HTMLCanvasElement {
        let context = this.canvas.getContext('2d');
        if (context) {
            for (let layerName of this.layerNames) {
                context.drawImage(this.layerMap[layerName], 0, 0, this.width, this.height);
            }
        }
        return this.canvas;
    }
}