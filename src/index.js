const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const FPS = 60;
const paddleWidth = 10;
const paddleHeight = 30;
let loop;

let callbacks = {};
let pressedKeys = {};

export let keyMap = {
    // named keys
    13: 'enter',
    27: 'esc',
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

function keydownEventHandler(evt) {
    let key = keyMap[evt.which];
    pressedKeys[key] = true;
    
    if (callbacks[key]) {
        callbacks[key](evt);
    }
}

function keyupEventHandler(evt) {
    pressedKeys[ keyMap[evt.which] ] = false;
}

export function initKeys() {
    let i;
    
    // alpha keys
    // @see https://stackoverflow.com/a/43095772/2124254
    for (i = 0; i < 26; i++) {
        // rollupjs considers this a side-effect (for now), so we'll do it in the
        // initKeys function
        // @see https://twitter.com/lukastaegert/status/1107011988515893249?s=20
        keyMap[65+i] = (10 + i).toString(36);
    }
    
    // numeric keys
    for (i = 0; i < 10; i++) {
        keyMap[48+i] = ''+i;
    }
    
    window.addEventListener('keydown', keydownEventHandler);
    window.addEventListener('keyup', keyupEventHandler);
    // window.addEventListener('blur', blurEventHandler);
}

class Loop {
    constructor() {

        this.p1 = "stop";
        this.x = 0;
        this.y = 0;

        this.u = canvas.width - paddleWidth;
        this.v = canvas.height - paddleHeight;

        callbacks['w'] = (evt) => this.p1_up(evt);
        callbacks['s'] = (evt) => this.p1_down(evt);
    }

    p1_up(evt) {
        this.p1 = "up";
        // console.log(this.y);
    }

    p1_down(evt) {
        this.p1 = "down"
        // console.log(this.y);
    }

    update(dt) {
        if (this.p1 === "up") {
            this.y += dt;
            this.p1 = "stop";
        }
        if (this.p1 === "down") {
            this.y -= dt;
            this.p1 = "stop";
        }
        if (canvas.height - paddleHeight < this.y) {
            this.y = canvas.height - paddleHeight;
        }
        if (this.y < 0) {
            this.y = 0;
        }
    }

    render() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'yellow';
        context.fillRect(this.x, this.y, paddleWidth, paddleHeight);
        context.fillStyle = 'cyan';
        context.fillRect(this.u, this.v, paddleWidth, paddleHeight);
    }
}

function init() {
    initKeys();
    loop = new Loop();
}

function animator() {
    const period = 1000.0 / FPS;
    let accumulator = 0;
    let last = 0;

    let i = 0;

    function _dt() {
        let now = performance.now();
        let dt = now - last;
        last = now;
        return dt;
    }

    function animate(timestamp) {
        requestAnimationFrame(animate);

        accumulator += _dt();

        while (accumulator > period) {
            loop.update(period);
            accumulator -= period;
        }

        loop.render();
    }

    return animate;
}

init();
animator()();