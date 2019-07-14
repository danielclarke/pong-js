import KeyboardHandler from "./keyboard-handler.js";
export default class TitleState {
    constructor(canvas) {
        this.canvas = canvas;
        this.keyboardHandler = new KeyboardHandler();
        this.context = canvas.getContext('2d') || new CanvasRenderingContext2D();
        this.titleSound = new Audio("assets/sounds/title.wav");
    }
    enter() {
        this.titleSound.play();
        this.keyboardHandler = new KeyboardHandler();
    }
    exit() { }
    update(stateStack, dt) { }
    render() {
        this.context.fillStyle = "White";
        this.context.font = "bold 36px Courier New";
        this.context.fillText(`P1: W S`, this.canvas.width / 2 - 125, this.canvas.height / 2 - 30);
        this.context.fillText(`P2: UP DOWN`, this.canvas.width / 2 - 125, this.canvas.height / 2);
        this.context.fillText(`SERVE: SPACE`, this.canvas.width / 2 - 125, this.canvas.height / 2 + 30);
    }
    handleInputs(stateStack) {
        if (this.keyboardHandler.pressedKeys['space']) {
            stateStack.pop();
        }
    }
}
