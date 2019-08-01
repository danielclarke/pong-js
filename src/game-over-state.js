import KeyboardHandler from "./keyboard-handler.js";
import TitleState from "./title-state.js";
export default class GameOverState {
    constructor(renderer) {
        this.renderer = renderer;
        this.keyboardHandler = new KeyboardHandler();
        this.gameOverSound = new Audio("assets/sounds/game_over.wav");
    }
    enter() {
        this.gameOverSound.play();
        this.keyboardHandler = new KeyboardHandler();
    }
    exit(stateStack) {
        stateStack.push(new TitleState(this.renderer));
    }
    update(stateStack, dt) {
    }
    render() {
        let context = this.renderer.layerMap["ui"].getContext("2d");
        if (context) {
            context.clearRect(0, 0, this.renderer.layerMap["ui"].width, this.renderer.layerMap["ui"].height);
            context.font = "bold 48px Courier New";
            context.fillText(`GAME OVER`, this.renderer.width / 2 - 125, this.renderer.height / 2 - 60);
            this.renderer.render();
        }
    }
    handleInputs(stateStack) {
        if (this.keyboardHandler.pressedKeys['space']) {
            stateStack.pop();
        }
    }
}
