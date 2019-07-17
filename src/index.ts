import Loop from "./loop.js"
import TitleState from "./title-state.js"
import StateStack, { State } from "./state-stack.js"

let canvas: HTMLCanvasElement = document.getElementById('main-layer') as HTMLCanvasElement;
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

const FPS = 60;

function animator(stateStack: StateStack) {
    const period = 1000.0 / FPS;
    let accumulator = 0;
    let last = 0;

    function _dt() {
        let now = performance.now();
        let dt = now - last;
        last = now;
        return dt;
    }

    function animate(timestamp: number): void {
        requestAnimationFrame(animate);

        accumulator += _dt();

        stateStack.handleInputs()

        while (accumulator > period) {
            stateStack.update(period);
            accumulator -= period;
        }

        stateStack.render();
    }

    return animate;
}

function init(): void {
    let stateStack = new StateStack();
    stateStack.push(new Loop(canvas));
    stateStack.push(new TitleState(canvas));
    animator(stateStack)(0);
}
init();