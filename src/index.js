import Loop from "./loop.js";
import TitleState from "./title-state.js";
import StateStack from "./state-stack.js";
import RenderHandler from "./render-handler.js";
let canvas = document.getElementById('main-layer');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const FPS = 60;
function handleResize(ev) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
        stateStack.handleInputs();
        while (accumulator > period) {
            stateStack.update(period);
            accumulator -= period;
        }
        stateStack.render();
    }
    return animate;
}
function init() {
    let renderer = new RenderHandler(canvas, 480, 360, ["background", "game", "ui"]);
    let stateStack = new StateStack(renderer);
    stateStack.push(new Loop(renderer));
    stateStack.push(new TitleState(renderer));
    animator(stateStack)(0);
}
init();
window.onresize = handleResize;
