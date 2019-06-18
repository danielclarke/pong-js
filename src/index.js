import AABB, {Point} from "./aabb.js";
import KeyboardHandler from "./keyboard-handler.js"

const canvas = document.getElementById('main-layer');
const context = canvas.getContext('2d');

let bgCanvas = document.createElement('canvas');
let bgContext = bgCanvas.getContext('2d');
bgCanvas.width = canvas.width;
bgCanvas.height = canvas.height;

const FPS = 60;
const paddleWidth = 10;
const paddleHeight = 30;
let loop;

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
        this.start_x = x;
        this.start_y = y;
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.width = 10;
        this.height = 10;
        this.colour = colour;
        this.served = false;
        this.image = new Image();
        this.image.src = 'assets/imgs/ball.png';
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }

    serve() {
        if (this.served === false) {
            this.served = true;
            this.dx = 5;
            this.dy = Math.random() * 5 - 2.5;
        }
    }

    reset () {
        this.served = false;
        this.dx = 0;
        this.dy = 0;
        this.x = this.start_x;
        this.y = this.start_y;
    }
}

class Loop {
    constructor() {

        this.game_started = false;
        this.p1_playing = false;
        this.p2_playing = false;
        this.keyboardHandler = new KeyboardHandler();

        this.scoreSound = new Audio("assets/sounds/score.wav");
        this.paddleHitSound = new Audio("assets/sounds/paddle_hit.wav");
        this.wallHitSound = new Audio("assets/sounds/wall_hit.wav");

        this.p1 = new Player(10, 0, "#FF1B0F");
        this.p2 = new Player(canvas.width - paddleWidth - 10, canvas.height - paddleHeight, "#E10D92");
        this.p1_score = 0;
        this.p2_score = 0;
        this.ball = new Ball(canvas.width / 2, canvas.height / 2, "#B1F70E");
        
        this.grassImage = new Image();
        this.grassImage.src = 'assets/imgs/grass.png';

        // this.grassImages = [new Image(), new Image(), new Image()];
        // this.grassImages[0].src = 'assets/imgs/grass1.png';
        // this.grassImages[1].src = 'assets/imgs/grass2.png';
        // this.grassImages[2].src = 'assets/imgs/grass3.png';

        this.initKeyboard();

        this.grassImage.onload = () => {
            for (let i = 0; i < canvas.width; i+=7) {
                for (let j = 0; j < canvas.height; j+=7) {
                    bgContext.drawImage(
                        this.grassImage,
                        i,
                        j
                    );
                }
            }
            context.drawImage(bgCanvas, 0, 0);
        }
    }

    initKeyboard() {
        
        this.keyboardHandler.addKeyDownHandler('w', 
            (evt) => {
                if (this.game_started === false) {
                    this.p1_playing = true;
                }
                this.p1.state = this.p1.states()["up"];
            }
        )
        this.keyboardHandler.addKeyUpHandler('w', 
            (evt) => this.p1.state = this.p1.states()["stop"]
        )
        this.keyboardHandler.addKeyDownHandler('s', 
            (evt) => {
                if (this.game_started === false) {
                    this.p1_playing = true;
                }
                this.p1.state = this.p1.states()["down"];
            }
        )
        this.keyboardHandler.addKeyUpHandler('s', 
            (evt) => this.p1.state = this.p1.states()["stop"]
        )

        this.keyboardHandler.addKeyDownHandler('up', 
            (evt) => {
                if (this.game_started === false) {
                    this.p2_playing = true;
                }
                this.p2.state = this.p2.states()["up"];
            }
        )
        this.keyboardHandler.addKeyUpHandler('up', 
            (evt) => this.p2.state = this.p2.states()["stop"]
        )
        this.keyboardHandler.addKeyDownHandler('down', 
            (evt) => {
                if (this.game_started === false) {
                    this.p2_playing = true;
                }
                this.p2.state = this.p2.states()["down"];
            }
        )
        this.keyboardHandler.addKeyUpHandler('down', 
            (evt) => this.p2.state = this.p2.states()["stop"]
        )

        this.keyboardHandler.addKeyDownHandler('space',
            (evt) => {
                if (!this.game_started) {
                    this.reset();
                }
                this.ball.serve();
            }
        )
    }

    ai_update(player, paddleSpeed) {
        if (player.y + 2 * player.height / 3 < this.ball.y) {
            player.dy = paddleSpeed;
        } else if (this.ball.y + this.ball.height < player.y + player.height / 3) {
            player.dy = - paddleSpeed;
        } else {
            player.dy = 0;
        }
    }

    player_update(player, paddleSpeed) {
        if (player.state === player.states()["up"]) {
            player.dy = - paddleSpeed;
        } else if (player.state === player.states()["down"]) {
            player.dy = paddleSpeed;
        } else {
            player.dy = 0;
        }
    }

    reset() {
        this.p1_score = 0;
        this.p2_score = 0;
        this.game_started = true;
    }

    game_over() {
        this.p1_playing = false;
        this.p2_playing = false;
        this.game_started = false;
    }

    is_game_over() {
        const max_score = 11;
        if (this.p1_score === max_score || this.p2_score === max_score) {
            return true;
        }
        return false;
    }

    get_winner() {
        if (this.p1_score === 10) {
            return this.p1;
        }
        if (this.p2_score === 10) {
            return this.p2;
        }
        return null;
    }

    update(dt) {

        const paddleSpeed = dt / 4;
        const ballSpeed = paddleSpeed * 1.1;
        const padding = 10;

        if (this.p1_playing) {
            if (this.keyboardHandler.pressedKeys['w']) {
                this.p1.dy = -paddleSpeed;
            } else if (this.keyboardHandler.pressedKeys['s']) {
                this.p1.dy = paddleSpeed;    
            } else {
                this.p1.dy = 0;        
            }
        } else {
            this.ai_update(this.p1, paddleSpeed);
        }

        this.p1.y += this.p1.dy;
        if (canvas.height - paddleHeight - padding < this.p1.y) {
            this.p1.y = canvas.height - paddleHeight - padding;
        }
        if (this.p1.y < 0 + padding) {
            this.p1.y = 0 + padding;
        }

        if (this.p2_playing) {
            if (this.keyboardHandler.pressedKeys['up']) {
                this.p2.dy = -paddleSpeed;
            } else if (this.keyboardHandler.pressedKeys['down']) {
                this.p2.dy = paddleSpeed;    
            } else {
                this.p2.dy = 0;        
            }
        } else {
            this.ai_update(this.p2, paddleSpeed);
        }

        this.p2.y += this.p2.dy;
        if (canvas.height - paddleHeight - padding< this.p2.y) {
            this.p2.y = canvas.height - paddleHeight - padding;
        }
        if (this.p2.y < 0 + padding) {
            this.p2.y = 0 + padding;
        }

        this.ball.update();

        let ballAABB = new AABB(new Point(this.ball.x, this.ball.y), this.ball.width, this.ball.height);
        let p1AABB = new AABB(new Point(this.p1.x, this.p1.y), this.p1.width, this.p1.height);
        let p2AABB = new AABB(new Point(this.p2.x, this.p2.y), this.p2.width, this.p2.height);

        if (ballAABB.intersects(p1AABB) && this.ball.dx < 0) {
            this.ball.dx = - this.ball.dx * 1.05;
            this.ball.dy += this.p1.dy;
            if (this.ball.x < this.p1.x + this.p1.width) {
                this.ball.x = this.p1.x + this.p1.width;
            }
            this.paddleHitSound.play();
        }
        if (ballAABB.intersects(p2AABB) && 0 < this.ball.dx) {
            this.ball.dx = - this.ball.dx * 1.05;
            this.ball.dy += this.p2.dy;
            if (this.p2.x - this.ball.width < this.ball.x) {
                this.ball.x = this.p2.x - this.ball.width;
            }
            this.paddleHitSound.play();
        }

        if (this.ball.y < 0) {
            this.ball.y = 0;
            this.ball.dy = - this.ball.dy * 0.9;
            this.wallHitSound.play();
        } else if (canvas.height < this.ball.y + this.ball.height) {
            this.ball.y = canvas.height - this.ball.height;
            this.ball.dy = - this.ball.dy * 0.9;
            this.wallHitSound.play();
        } 
        if (this.ball.x + 4 * this.ball.width < 0) {
            this.ball.reset();
            this.scoreSound.play();
            this.p2_score += 1;
            // this.ball.x = 0;
            // this.ball.dx = - this.ball.dx * 0.9;
            if (this.is_game_over()) {
                this.game_over();
            }
        } else if (canvas.width < this.ball.x - 4 * this.ball.width) {
            this.ball.reset();
            this.scoreSound.play();
            this.p1_score += 1;
            // this.ball.x = canvas.width - this.ball.width;
            // this.ball.dx = - this.ball.dx * 0.9;
            if (this.is_game_over()) {
                this.game_over();
            }
        }

        if (this.is_game_over()) {
            this.ball.reset();
        }

        if (this.ball.dy < -ballSpeed) {
            this.ball.dy = -ballSpeed;
        }
        if (this.ball.dy > ballSpeed) {
            this.ball.dy = ballSpeed;
        }
    }

    render() {

        // make sure objects are rendered at integer coordinates to help stop tearing
        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#Avoid_floating-point_coordinates_and_use_integers_instead
        
        // context.fillStyle = "#2B294B";
        // context.fillRect(0, 0, canvas.width, canvas.height);

        // for (let i = 0; i < canvas.width; i+=7) {
        //     for (let j = 0; j < canvas.height; j+=7) {
        //         bgContext.drawImage(
        //             this.grassImage,
        //             i,
        //             j
        //         );
        //     }
        // }
        context.drawImage(bgCanvas, 0, 0);

        context.fillStyle = this.p1.colour;
        context.fillRect(Math.floor(this.p1.x), Math.floor(this.p1.y), this.p1.width, this.p1.height);
        context.fillStyle = this.p2.colour;
        context.fillRect(Math.floor(this.p2.x), Math.floor(this.p2.y), this.p2.width, this.p2.height);
        context.drawImage(
            this.ball.image,
            Math.floor(this.ball.x), 
            Math.floor(this.ball.y),
        );

        context.fillStyle = "White"
        context.font = "bold 25px Courier New";
        context.fillText(`${this.p1_score} - ${this.p2_score}`, canvas.width / 2 - 33, 30);
        if (this.is_game_over()) {
            context.font = "bold 48px Courier New";
            context.fillText(`GAME OVER`, canvas.width / 2 - 125, canvas.height / 2 - 60);        
        }
    }
}

function init() {
    loop = new Loop();
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

        let dt = _dt();

        accumulator += dt;

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