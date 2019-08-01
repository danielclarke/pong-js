import StateStack, {State} from "./state-stack.js"
import KeyboardHandler from "./keyboard-handler.js"
import RenderHandler from "./render-handler.js"

export default class PauseState implements State {
    keyboardHandler: KeyboardHandler;
    PauseSound: HTMLAudioElement;
    constructor(public renderer: RenderHandler) {
        this.keyboardHandler = new KeyboardHandler();
        this.PauseSound = new Audio("assets/sounds/pause_sound.wav");
    }
    enter(): void {
        this.PauseSound.play();
        this.keyboardHandler = new KeyboardHandler();
    }
    exit(): void {}
    update(stateStack: StateStack, dt: number): void {}
    render(): void {
        let context = this.renderer.layerMap["ui"].getContext("2d");
        if (context) {
            context.clearRect(0, 0, this.renderer.layerMap["ui"].width, this.renderer.layerMap["ui"].height);
            context.fillStyle = "White"
            context.font = "bold 48px Courier New";
            context.fillText(`PAUSE`, this.renderer.width / 2 - 68, this.renderer.height / 2 - 60);
        }
    }
    handleInputs(stateStack: StateStack): void {
        if (this.keyboardHandler.pressedKeys['p']) {
            stateStack.pop();
        }
    }
}