import KeyboardHandler from "./keyboard-handler"
import AABB, {Point} from "./aabb"
import Ball from "./ball"
import Player, {getPlayerHandler, getAiHandler} from "./player"
import {restrictPlayerMovement, restrictBallMovement} from "./physics"
import StateStack, {State} from "./state-stack"
import GameOverState from "./game-over-state"


enum LoopState {
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

export default class Loop implements State {

    state: LoopState;
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

    constructor(public canvas: HTMLCanvasElement, public bgCanvas: HTMLCanvasElement) {

        this.context = canvas.getContext('2d') || new CanvasRenderingContext2D();
        this.bgContext = bgCanvas.getContext('2d') || new CanvasRenderingContext2D();

        this.state = LoopState.PreGame;
        this.keyboardHandler = new KeyboardHandler();

        this.scoreSound = new Audio("assets/sounds/score.wav");
        this.paddleHitSound = new Audio("assets/sounds/paddle_hit.wav");
        this.wallHitSound = new Audio("assets/sounds/wall_hit.wav");

        this.ball = new Ball(canvas.width / 2, canvas.height / 2, "#B1F70E");

        this.p1 = new Player(10, 0, "#FF1B0F");
        this.p2 = new Player(canvas.width - this.p1.width - 10, canvas.height - this.p1.height, "#E10D92");
        this.p1Score = 0;
        this.p2Score = 0;
        this.p1Handler = getAiHandler(this.p1, this.ball);
        this.p2Handler = getAiHandler(this.p2, this.ball);

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
    }

    reset(): void {
        this.p1Score = 0;
        this.p2Score = 0;
    }

    gameOver(stateStack: StateStack): void {
        this.p1Handler = getAiHandler(this.p1, this.ball);
        this.p2Handler = getAiHandler(this.p2, this.ball);
        this.render();
        stateStack.push(new GameOverState(this.canvas));
    }

    isGameOver(): boolean {
        const max_score = 1;
        if (this.p1Score === max_score || this.p2Score === max_score) {
            return true;
        }
        return false;
    }

    handleInputs(): void {

        this.p1Handler();
        this.p2Handler();

        switch (this.state) {
            case LoopState.PreGame: {
                const p1PlayerHandler = getPlayerHandler(this.p1, 'w', 's', this.keyboardHandler);
                const p2PlayerHandler = getPlayerHandler(this.p2, 'up', 'down', this.keyboardHandler);
        
                if (this.keyboardHandler.pressedKeys['w']) {
                    this.p1Handler = p1PlayerHandler;
                }
                if (this.keyboardHandler.pressedKeys['s']) {
                    this.p1Handler = p1PlayerHandler;
                }
                if (this.keyboardHandler.pressedKeys['up']) {
                    this.p2Handler = p2PlayerHandler;
                }
                if (this.keyboardHandler.pressedKeys['down']) {
                    this.p2Handler = p2PlayerHandler;
                }
                if (this.keyboardHandler.pressedKeys['space']) {
                    this.reset();
                    this.ball.handleInput("SERVE");
                    this.state = LoopState.Active;
                }
                break;
            }
            case LoopState.Serve: {
                if (this.keyboardHandler.pressedKeys['space']) {
                    this.ball.handleInput("SERVE");
                    this.state = LoopState.Active;
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    enter(): void {
        this.reset();
        this.state = LoopState.PreGame;
        this.keyboardHandler = new KeyboardHandler();
    }

    exit(): void {}

    handleCollision(): void {
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
    }

    handleScore(): void {
        // move to scoring handler
        if (this.ball.x + 4 * this.ball.width < 0) {
            this.ball.reset();
            this.scoreSound.play();
            this.p2Score += 1;
            this.state = LoopState.Serve;
            // this.ball.x = 0;
            // this.ball.dx = - this.ball.dx * 0.9;
        } else if (this.canvas.width < this.ball.x - 4 * this.ball.width) {
            this.ball.reset();
            this.scoreSound.play();
            this.p1Score += 1;
            this.state = LoopState.Serve;
            // this.ball.x = canvas.width - this.ball.width;
            // this.ball.dx = - this.ball.dx * 0.9;
        }
    }

    update(stateStack: StateStack, dt: number) {

        const paddleSpeed = dt / 4;
        const ballSpeed = paddleSpeed * 1.1 / dt;
        const padding = 10;

        const playerBoundary = new AABB(new Point(padding, padding), this.canvas.width - padding * 2, this.canvas.height - padding * 2);
        const ballBoundary = new AABB(new Point(0, 0), this.canvas.width, this.canvas.height);

        this.p1.update(dt);
        restrictPlayerMovement(this.p1, playerBoundary);
        this.p2.update(dt);
        restrictPlayerMovement(this.p2, playerBoundary);

        this.ball.update(dt);
        // replace with sub pub or component
        if(restrictBallMovement(this.ball, ballBoundary)) {
            this.wallHitSound.play();
        }
        if (this.ball.dy < -ballSpeed) {
            this.ball.dy = -ballSpeed;
        }
        if (this.ball.dy > ballSpeed) {
            this.ball.dy = ballSpeed;
        }

        this.handleCollision();
        this.handleScore();

        if (this.isGameOver()) {
            this.gameOver(stateStack);
            this.ball.reset();
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
    }
}