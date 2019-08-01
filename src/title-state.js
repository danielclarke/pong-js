import KeyboardHandler from "./keyboard-handler.js";
export default class TitleState {
    constructor(renderer) {
        this.renderer = renderer;
        this.keyboardHandler = new KeyboardHandler();
        this.titleSound = new Audio("assets/sounds/title.wav");
    }
    enter() {
        this.titleSound.play();
        this.keyboardHandler = new KeyboardHandler();
    }
    exit() { }
    update(stateStack, dt) { }
    render() {
        let context = this.renderer.layerMap["ui"].getContext("2d");
        if (context) {
            context.clearRect(0, 0, this.renderer.layerMap["ui"].width, this.renderer.layerMap["ui"].height);
            context.fillStyle = "White";
            context.font = "bold 36px Courier New";
            context.fillText(`P1: W S`, this.renderer.width / 2 - 125, this.renderer.height / 2 - 30);
            context.fillText(`P2: UP DOWN`, this.renderer.width / 2 - 125, this.renderer.height / 2);
            context.fillText(`SERVE: SPACE`, this.renderer.width / 2 - 125, this.renderer.height / 2 + 30);
            this.renderer.render();
        }
    }
    handleInputs(stateStack) {
        if (this.keyboardHandler.pressedKeys['space']) {
            stateStack.pop();
        }
    }
}
