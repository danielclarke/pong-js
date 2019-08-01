import StateStack, {State} from "./state-stack.js"
import KeyboardHandler from "./keyboard-handler.js"
import TitleState from "./title-state.js"
import RenderHandler from "./render-handler.js"

export default class GameOverState implements State {
    keyboardHandler: KeyboardHandler;
    gameOverSound: HTMLAudioElement;
    
    constructor(public renderer: RenderHandler) {
        this.keyboardHandler = new KeyboardHandler();
        this.gameOverSound = new Audio("assets/sounds/game_over.wav");
    }
    enter(): void {
        this.gameOverSound.play();
        this.keyboardHandler = new KeyboardHandler();
    }
    exit(stateStack: StateStack): void {
        stateStack.push(new TitleState(this.renderer));
    }
    update(stateStack: StateStack, dt: number): void {
        
    }
    render(): void {
        let context = this.renderer.layerMap["ui"].getContext("2d");
        if (context) {
            context.clearRect(0, 0, this.renderer.layerMap["ui"].width, this.renderer.layerMap["ui"].height);
            context.font = "bold 48px Courier New";
            context.fillText(`GAME OVER`, this.renderer.width / 2 - 125, this.renderer.height / 2 - 60);
            this.renderer.render();
        }
    }
    handleInputs(stateStack: StateStack): void {
        if (this.keyboardHandler.pressedKeys['space']) {
            stateStack.pop();
        }
    }
}