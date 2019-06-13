import AABB, {Point} from "./aabb.js";

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const FPS = 60;
const paddleWidth = 10;
const paddleHeight = 30;
let loop;

let kdCallbacks = {};
let kuCallbacks = {};
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
    
    if (kdCallbacks[key]) {
        kdCallbacks[key](evt);
    }
}

function keyupEventHandler(evt) {    
    let key = keyMap[evt.which];
    pressedKeys[key] = false;
    
    if (kuCallbacks[key]) {
        kuCallbacks[key](evt);
    }
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

class Player {
    states() {
        return {
            "stop": 0,
            "up": 1,
            "down": 2,
        }
    }

    constructor(x, y, colour="black") {
        this.x = x;
        this.y = y;
        this.dy = 0;
        this.width = paddleWidth;
        this.height = paddleHeight;
        this.colour = colour;
        this.state = this.states()["stop"];
    }
}

class Ball {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.width = 10;
        this.height = 10;
        this.colour = colour;
        this.served = false;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }

    serve() {
        if (this.served === false) {
            this.served = true;
            this.dx = 5;
        }
    }
}

class Loop {
    constructor() {

        this.p1 = new Player(0, 0, "magenta");
        this.p2 = new Player(canvas.width - paddleWidth, canvas.height - paddleHeight, "cyan");
        this.ball = new Ball(canvas.width / 2, canvas.height / 2, "yellow");

        kdCallbacks['space'] = (evt) => this.ball.serve();

        kdCallbacks['w'] = (evt) => this.p1_up(evt);
        kdCallbacks['s'] = (evt) => this.p1_down(evt);
        kuCallbacks['w'] = (evt) => this.p1_stop(evt);
        kuCallbacks['s'] = (evt) => this.p1_stop(evt);

        kdCallbacks['up'] = (evt) => this.p2_up(evt);
        kdCallbacks['down'] = (evt) => this.p2_down(evt);
        kuCallbacks['up'] = (evt) => this.p2_stop(evt);
        kuCallbacks['down'] = (evt) => this.p2_stop(evt);
    }

    p1_up(evt) {
        this.p1.state = this.p1.states()["up"];
    }

    p1_down(evt) {
        this.p1.state = this.p1.states()["down"];
    }

    p1_stop(evt) {
        this.p1.state = this.p1.states()["stop"];
    }

    p2_up(evt) {
        this.p2.state = this.p2.states()["up"];
    }

    p2_down(evt) {
        this.p2.state = this.p2.states()["down"];
    }

    p2_stop(evt) {
        this.p2.state = this.p2.states()["stop"];
    }

    update(dt) {

        let paddleSpeed = dt / 4;

        if (this.p1.state === this.p1.states()["up"]) {
            this.p1.dy = - paddleSpeed;
        } else if (this.p1.state === this.p1.states()["down"]) {
            this.p1.dy = paddleSpeed;
        } else {
            this.p1.dy = 0;
        }

        this.p1.y += this.p1.dy;
        
        if (canvas.height - paddleHeight < this.p1.y) {
            this.p1.y = canvas.height - paddleHeight;
        }
        if (this.p1.y < 0) {
            this.p1.y = 0;
        }

        // if (this.p2.state === this.p2.states()["up"]) {
        //     this.p2.dy = - paddleSpeed;
        // } else if (this.p2.state === this.p2.states()["down"]) {
        //     this.p2.dy = paddleSpeed;
        // } else {
        //     this.p2.dy = 0;
        // }

        if (this.p2.y + 2 * this.p2.height / 3 < this.ball.y) {
            this.p2.dy = paddleSpeed;
        } else if (this.ball.y + this.ball.height < this.p2.y + this.p2.height / 3) {
            this.p2.dy = - paddleSpeed;
        } else {
            this.p2.dy = 0;
        }

        this.p2.y += this.p2.dy;
        if (canvas.height - paddleHeight < this.p2.y) {
            this.p2.y = canvas.height - paddleHeight;
        }
        if (this.p2.y < 0) {
            this.p2.y = 0;
        }

        this.ball.update();

        let ballAABB = new AABB(new Point(this.ball.x, this.ball.y), this.ball.width, this.ball.height);
        let p1AABB = new AABB(new Point(this.p1.x, this.p1.y), this.p1.width, this.p1.height);
        let p2AABB = new AABB(new Point(this.p2.x, this.p2.y), this.p2.width, this.p2.height);

        if (ballAABB.intersects(p1AABB)) {
            this.ball.dx = - this.ball.dx * 1.05;
            this.ball.dy += this.p1.dy;
            if (this.ball.x < this.p1.x + this.p1.width) {
                this.ball.x = this.p1.x + this.p1.width;
            }
        }
        if (ballAABB.intersects(p2AABB)) {
            this.ball.dx = - this.ball.dx * 1.05;
            this.ball.dy += this.p2.dy;
            if (this.p2.x - this.ball.width < this.ball.x) {
                this.ball.x = this.p2.x - this.ball.width;
            }
        }

        if (this.ball.y < 0) {
            this.ball.y = 0;
            this.ball.dy = - this.ball.dy * 0.9;
        } else if (canvas.height < this.ball.y + this.ball.height) {
            this.ball.y = canvas.height - this.ball.height;
            this.ball.dy = - this.ball.dy * 0.9;
        } 
        if (this.ball.x < 0) {
            this.ball.x = 0;
            this.ball.dx = - this.ball.dx * 0.9;
        } else if (canvas.width < this.ball.x + this.ball.width) {
            this.ball.x = canvas.width - this.ball.width;
            this.ball.dx = - this.ball.dx * 0.9;
        }

    }

    render() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = this.p1.colour;
        context.fillRect(this.p1.x, this.p1.y, this.p1.width, this.p1.height);
        context.fillStyle = this.p2.colour;
        context.fillRect(this.p2.x, this.p2.y, this.p2.width, this.p2.height);
        context.fillStyle = this.ball.colour;
        context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);
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

        let dt = _dt();

        accumulator += dt;
        // i += 1;
        // if (i > 20) {
        //     console.log(1000.0 / dt);
        //     i = 0;
        // }

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