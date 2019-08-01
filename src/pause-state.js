import KeyboardHandler from "./keyboard-handler.js";
export default class PauseState {
    constructor(renderer) {
        this.renderer = renderer;
        this.keyboardHandler = new KeyboardHandler();
        this.PauseSound = new Audio("assets/sounds/pause_sound.wav");
    }
    enter() {
        this.PauseSound.play();
        this.keyboardHandler = new KeyboardHandler();
    }
    exit() { }
    update(stateStack, dt) { }
    render() {
        let context = this.renderer.layerMap["ui"].getContext("2d");
        if (context) {
            context.clearRect(0, 0, this.renderer.layerMap["ui"].width, this.renderer.layerMap["ui"].height);
            context.fillStyle = "White";
            context.font = "bold 48px Courier New";
            context.fillText(`PAUSE`, this.renderer.width / 2 - 68, this.renderer.height / 2 - 60);
        }
    }
    handleInputs(stateStack) {
        if (this.keyboardHandler.pressedKeys['p']) {
            stateStack.pop();
        }
    }
}
