import KeyboardHandler from "./keyboard-handler"
import AABB, {Point} from "./aabb"
import Ball from "./ball"
import Player from "./player"


enum State {
    Title = "TITLE",
    PreGame = "PRE_GAME",
    Serve = "SERVE",
    Active = "ACTIVE",
    GameOver = "GAME_OVER",
    Paused = "PAUSED",
}
/*
    title --enter--> pre game
    pre game --space--> active
    active --final score--> game over
    active --p--> pause
    pause --p--> active
    pause --escape--> title
    game over --enter--> pre game
*/

export default class Loop {

    state: State;
    context: CanvasRenderingContext2D;
    bgContext: CanvasRenderingContext2D;

    p1: Player;
    p2: Player;
    p1Handler: () => void;
    p2Handler: () => void;
    p1Score: number;
    p2Score: number;
    ball: Ball;
    keyboardHandler: KeyboardHandler;
    grassImages: Array<HTMLImageElement>;
    scoreSound: HTMLAudioElement;
    paddleHitSound: HTMLAudioElement;
    wallHitSound: HTMLAudioElement;
    gameOverSound: HTMLAudioElement;

    constructor(public canvas: HTMLCanvasElement, public bgCanvas: HTMLCanvasElement) {
        this.context = canvas.getContext('2d') || new CanvasRenderingContext2D();
        this.bgContext = bgCanvas.getContext('2d') || new CanvasRenderingContext2D();

        this.state = State.PreGame;
        this.keyboardHandler = new KeyboardHandler();

        this.scoreSound = new Audio("assets/sounds/score.wav");
        this.paddleHitSound = new Audio("assets/sounds/paddle_hit.wav");
        this.wallHitSound = new Audio("assets/sounds/wall_hit.wav");
        this.gameOverSound = new Audio("assets/sounds/game_over.wav");

        this.p1 = new Player(10, 0, "#FF1B0F");
        this.p2 = new Player(canvas.width - this.p1.width - 10, canvas.height - this.p1.height, "#E10D92");

        this.p1Handler = this.getAiHandler(this.p1);
        this.p2Handler = this.getAiHandler(this.p2);

        this.p1Score = 0;
        this.p2Score = 0;
        this.ball = new Ball(canvas.width / 2, canvas.height / 2, "#B1F70E");

        this.grassImages = [new Image(), new Image(), new Image()];
        this.grassImages[0].src = 'assets/imgs/grass1.png';
        this.grassImages[1].src = 'assets/imgs/grass2.png';
        this.grassImages[2].src = 'assets/imgs/grass3.png';

        let numLoaded = 0;
        const f = () => {
            numLoaded += 1;
            if (numLoaded < this.grassImages.length) {
                return;
            }
            for (let i = 0; i < canvas.width; i+=7) {
                for (let j = 0; j < canvas.height; j+=7) {
                    this.bgContext.drawImage(
                        this.grassImages[Math.floor(Math.random() * 3)],
                        i,
                        j
                    );
                }
            }
            this.context.drawImage(bgCanvas, 0, 0);
        }

        for (let img of this.grassImages) {
            img.onload = f;
        }

        this.initKeyboard();
    }

    initKeyboard() {
        
        this.keyboardHandler.addKeyDownHandler('w', 
            (evt) => {
                if (this.state === State.PreGame) {
                    this.p1Handler = this.getPlayerHandler(this.p1, 'w', 's');
                }
            }
        )
        this.keyboardHandler.addKeyDownHandler('s', 
            (evt) => {
                if (this.state === State.PreGame) {
                    this.p1Handler = this.getPlayerHandler(this.p1, 'w', 's');
                }
            }
        )

        this.keyboardHandler.addKeyDownHandler('up', 
            (evt) => {
                if (this.state === State.PreGame) {
                    this.p2Handler = this.getPlayerHandler(this.p2, 'up', 'down');
                }
            }
        )
        this.keyboardHandler.addKeyDownHandler('down', 
            (evt) => {
                if (this.state === State.PreGame) {
                    this.p2Handler = this.getPlayerHandler(this.p2, 'up', 'down');
                }
            }
        )

        this.keyboardHandler.addKeyDownHandler('space',
            (evt) => {
                switch (this.state) {
                    case State.PreGame: {
                        this.reset();
                        this.ball.handleInput("SERVE");
                        this.state = State.Active;
                        break;
                    }
                    case State.Serve: {
                        this.ball.handleInput("SERVE");
                        this.state = State.Active;
                        break;
                    }
                    case State.GameOver: {
                        this.reset();
                        this.state = State.PreGame;
                    }
                    default: {
                        break;
                    }
                }
            }
        )
    }

    reset() {
        this.p1Score = 0;
        this.p2Score = 0;
    }

    gameOver() {
        this.gameOverSound.play();
        this.state = State.GameOver;
        this.p1Handler = this.getAiHandler(this.p1);
        this.p2Handler = this.getAiHandler(this.p2);
    }

    isGameOver() {
        const max_score = 11;
        if (this.p1Score === max_score || this.p2Score === max_score) {
            return true;
        }
        return false;
    }

    getPlayerHandler(player: Player, upKey: string, downKey: string) {
        return () => {
            if (this.keyboardHandler.pressedKeys[upKey]) {
                player.handleInput("UP");
            } else if (this.keyboardHandler.pressedKeys[downKey]) {
                player.handleInput("DOWN");
            } else {
                player.handleInput("NONE");
            }
        }
    }

    getAiHandler(player: Player) {
        return () => {
            if (player.y + 2 * player.height / 3 < this.ball.y) {
                player.handleInput("DOWN");
            } else if (this.ball.y + this.ball.height < player.y + player.height / 3) {
                player.handleInput("UP")
            } else {
                player.handleInput("NONE");
            }
        }
    }

    handleInputs() {
        this.p1Handler();
        this.p2Handler();
    }

    update(dt: number) {

        const paddleSpeed = dt / 4;
        const ballSpeed = paddleSpeed * 1.1;
        const padding = 10;

        if (this.p1.isUp()) {
            this.p1.dy = -paddleSpeed;
        } else if(this.p1.isDown()) {
            this.p1.dy = paddleSpeed;
        } else {
            this.p1.dy = 0;
        }

        this.p1.y += this.p1.dy;
        if (this.canvas.height - this.p1.height - padding < this.p1.y) {
            this.p1.y = this.canvas.height - this.p1.height - padding;
        }
        if (this.p1.y < 0 + padding) {
            this.p1.y = 0 + padding;
        }

        if (this.p2.isUp()) {
            this.p2.dy = -paddleSpeed;
        } else if(this.p2.isDown()) {
            this.p2.dy = paddleSpeed;
        } else {
            this.p2.dy = 0;
        }

        this.p2.y += this.p2.dy;
        if (this.canvas.height - this.p2.height - padding< this.p2.y) {
            this.p2.y = this.canvas.height - this.p2.height - padding;
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
        } else if (this.canvas.height < this.ball.y + this.ball.height) {
            this.ball.y = this.canvas.height - this.ball.height;
            this.ball.dy = - this.ball.dy * 0.9;
            this.wallHitSound.play();
        } 

        if (this.ball.x + 4 * this.ball.width < 0) {
            this.ball.reset();
            this.scoreSound.play();
            this.p2Score += 1;
            this.state = State.Serve;
            // this.ball.x = 0;
            // this.ball.dx = - this.ball.dx * 0.9;
        } else if (this.canvas.width < this.ball.x - 4 * this.ball.width) {
            this.ball.reset();
            this.scoreSound.play();
            this.p1Score += 1;
            this.state = State.Serve;
            // this.ball.x = canvas.width - this.ball.width;
            // this.ball.dx = - this.ball.dx * 0.9;
        }

        if (this.isGameOver() && this.state !== State.GameOver) {
            this.gameOver();
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
        //         this.bgContext.drawImage(
        //             this.grassImage,
        //             i,
        //             j
        //         );
        //     }
        // }

        // move to BG Layer
        this.context.drawImage(this.bgCanvas, 0, 0);

        // move to player layer
        this.context.fillStyle = this.p1.colour;
        this.context.fillRect(Math.floor(this.p1.x), Math.floor(this.p1.y), this.p1.width, this.p1.height);
        this.context.fillStyle = this.p2.colour;
        this.context.fillRect(Math.floor(this.p2.x), Math.floor(this.p2.y), this.p2.width, this.p2.height);
        this.context.drawImage(
            this.ball.image,
            Math.floor(this.ball.x), 
            Math.floor(this.ball.y),
        );

        // move to UI layer
        this.context.fillStyle = "White"
        this.context.font = "bold 25px Courier New";
        this.context.fillText(`${this.p1Score} - ${this.p2Score}`, this.canvas.width / 2 - 33, 30);
        if (this.state === State.GameOver) {
            this.context.font = "bold 48px Courier New";
            this.context.fillText(`GAME OVER`, this.canvas.width / 2 - 125, this.canvas.height / 2 - 60);        
        }
    }
}