import KeyboardHandler from "./keyboard-handler.js";
import TitleState from "./title-state.js";
export default class GameOverState {
    constructor(canvas) {
        this.canvas = canvas;
        this.keyboardHandler = new KeyboardHandler();
        this.context = canvas.getContext('2d') || new CanvasRenderingContext2D();
        this.gameOverSound = new Audio("assets/sounds/game_over.wav");
    }
    enter() {
        this.gameOverSound.play();
        this.keyboardHandler = new KeyboardHandler();
    }
    exit(stateStack) {
        stateStack.push(new TitleState(this.canvas));
    }
    update(stateStack, dt) {
    }
    render() {
        this.context.font = "bold 48px Courier New";
        this.context.fillText(`GAME OVER`, this.canvas.width / 2 - 125, this.canvas.height / 2 - 60);
    }
    handleInputs(stateStack) {
        if (this.keyboardHandler.pressedKeys['space']) {
            stateStack.pop();
        }
    }
}