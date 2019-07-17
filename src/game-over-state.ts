import StateStack, {State} from "./state-stack.js"
import KeyboardHandler from "./keyboard-handler.js"
import TitleState from "./title-state.js"

export default class GameOverState implements State {
    context: CanvasRenderingContext2D;
    keyboardHandler: KeyboardHandler;
    gameOverSound: HTMLAudioElement;
    
    constructor(public canvas: HTMLCanvasElement) {
        this.keyboardHandler = new KeyboardHandler();
        this.context = canvas.getContext('2d') || new CanvasRenderingContext2D();
        this.gameOverSound = new Audio("assets/sounds/game_over.wav");
    }
    enter(): void {
        this.gameOverSound.play();
        this.keyboardHandler = new KeyboardHandler();
    }
    exit(stateStack: StateStack): void {
        stateStack.push(new TitleState(this.canvas));
    }
    update(stateStack: StateStack, dt: number): void {
        
    }
    render(): void {
        this.context.font = "bold 48px Courier New";
        this.context.fillText(`GAME OVER`, this.canvas.width / 2 - 125, this.canvas.height / 2 - 60); 
    }
    handleInputs(stateStack: StateStack): void {
        if (this.keyboardHandler.pressedKeys['space']) {
            stateStack.pop();
        }
    }
}