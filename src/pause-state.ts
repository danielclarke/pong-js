import StateStack, {State} from "./state-stack.js"
import KeyboardHandler from "./keyboard-handler.js"

export default class PauseState implements State {
    context: CanvasRenderingContext2D;
    keyboardHandler: KeyboardHandler;
    PauseSound: HTMLAudioElement;
    
    constructor(public canvas: HTMLCanvasElement) {
        this.keyboardHandler = new KeyboardHandler();
        this.context = canvas.getContext('2d') || new CanvasRenderingContext2D();
        this.PauseSound = new Audio("assets/sounds/pause_sound.wav");
    }
    enter(): void {
        this.PauseSound.play();
        this.keyboardHandler = new KeyboardHandler();
    }
    exit(): void {}
    update(stateStack: StateStack, dt: number): void {
        
    }
    render(): void {
        this.context.fillStyle = "White"
        this.context.font = "bold 48px Courier New";
        this.context.fillText(`PAUSE`, this.canvas.width / 2 - 68, this.canvas.height / 2 - 60); 
    }
    handleInputs(stateStack: StateStack): void {
        if (this.keyboardHandler.pressedKeys['p']) {
            stateStack.pop();
        }
    }
}