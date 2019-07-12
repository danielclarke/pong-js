import Loop from "./loop.js"
import StateStack from "./state-stack.js"

let canvas = document.getElementById('main-layer');
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

let bgCanvas = document.createElement('canvas');
bgCanvas.width = canvas.width;
bgCanvas.height = canvas.height;

const FPS = 60;
let stateStack;

function init() {
    let loop = new Loop(canvas, bgCanvas);
    stateStack = new StateStack();
    stateStack.push(loop);
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