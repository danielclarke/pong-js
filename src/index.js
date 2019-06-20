import Loop from "./loop.js"

let canvas = document.getElementById('main-layer');
let context = canvas.getContext('2d');
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

let bgCanvas = document.createElement('canvas');
let bgContext = bgCanvas.getContext('2d');
bgCanvas.width = canvas.width;
bgCanvas.height = canvas.height;

const FPS = 60;
const paddleWidth = 10;
const paddleHeight = 30;
let loop;

function init() {
    loop = new Loop(canvas, bgCanvas);
}

function animator(loop) {
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

        loop.handleInputs()

        while (accumulator > period) {
            loop.update(period);
            accumulator -= period;
        }

        loop.render();
    }

    return animate;
}

init();
animator(loop)();