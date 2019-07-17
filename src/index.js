import Loop from "./loop.js"
import TitleState from "./title-state.js"
import StateStack from "./state-stack.js"

let canvas = document.getElementById('main-layer');
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

const FPS = 60;
let stateStack;

function init() {
    stateStack = new StateStack();
    stateStack.push(new Loop(canvas));
    stateStack.push(new TitleState(canvas));
}

function animator(stateStack) {
    const period = 1000.0 / FPS;
    let accumulator = 0;
    let last = 0;

    function _dt() {
        let now = performance.now();
        let dt = now - last;
        last = now;
        return dt;
    }

    function animate(timestamp) {
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

init();
animator(stateStack)();