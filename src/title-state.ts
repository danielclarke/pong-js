import StateStack, {State} from "./state-stack.js"
import KeyboardHandler from "./keyboard-handler.js"

export default class TitleState implements State {
    context: CanvasRenderingContext2D;
    keyboardHandler: KeyboardHandler;
    titleSound: HTMLAudioElement;
    constructor(public canvas: HTMLCanvasElement) {
        this.keyboardHandler = new KeyboardHandler();
        this.context = canvas.getContext('2d') || new CanvasRenderingContext2D();
        this.titleSound = new Audio("assets/sounds/title.wav");
    }
    enter(): void {
        this.titleSound.play();
        this.keyboardHandler = new KeyboardHandler();
    }
    exit(): void {}
    update(stateStack: StateStack, dt: number): void {}
    render(): void {
        this.context.fillStyle = "White"
        this.context.font = "bold 36px Courier New";
        this.context.fillText(`P1: W S`, this.canvas.width / 2 - 125, this.canvas.height / 2 - 30);
        this.context.fillText(`P2: UP DOWN`, this.canvas.width / 2 - 125, this.canvas.height / 2);
        this.context.fillText(`SERVE: SPACE`, this.canvas.width / 2 - 125, this.canvas.height / 2 + 30);
    }
    handleInputs(stateStack: StateStack): void {
        if (this.keyboardHandler.pressedKeys['space']) {
            stateStack.pop();
        }
    }
}