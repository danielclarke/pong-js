import KeyboardHandler from "./keyboard-handler.js";
export default class PauseState {
    constructor(canvas) {
        this.canvas = canvas;
        this.keyboardHandler = new KeyboardHandler();
        this.context = canvas.getContext('2d') || new CanvasRenderingContext2D();
        this.PauseSound = new Audio("assets/sounds/pause_sound.wav");
    }
    enter() {
        this.PauseSound.play();
        this.keyboardHandler = new KeyboardHandler();
    }
    exit() { }
    update(stateStack, dt) {
    }
    render() {
        this.context.fillStyle = "White";
        this.context.font = "bold 48px Courier New";
        this.context.fillText(`PAUSE`, this.canvas.width / 2 - 68, this.canvas.height / 2 - 60);
    }
    handleInputs(stateStack) {
        if (this.keyboardHandler.pressedKeys['p']) {
            stateStack.pop();
        }
    }
}
