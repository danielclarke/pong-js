import KeyboardHandler from "./keyboard-handler.js";
import AABB, { Point } from "./aabb.js";
import Ball from "./ball.js";
import Player, { getPlayerHandler, getAiHandler } from "./player.js";
import { restrictPlayerMovement, restrictBallMovement } from "./physics.js";
import GameOverState from "./game-over-state.js";
import PauseState from "./pause-state.js";
import RenderHandler from "./render-handler.js";
var LoopState;
(function (LoopState) {
    LoopState["PreGame"] = "PRE_GAME";
    LoopState["Serve"] = "SERVE";
    LoopState["Active"] = "ACTIVE";
})(LoopState || (LoopState = {}));
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
    constructor(realCanvas) {
        this.realCanvas = realCanvas;
        this.canvas = document.createElement("canvas");
        this.canvas.width = 480;
        this.canvas.height = 360;
        this.gameRenderer = new RenderHandler(this.canvas, ["background", "game", "ui"]);
        this.context = this.canvas.getContext('2d') || new CanvasRenderingContext2D();
        this.state = LoopState.PreGame;
        this.keyboardHandler = new KeyboardHandler();
        this.scoreSound = new Audio("assets/sounds/score.wav");
        this.paddleHitSound = new Audio("assets/sounds/paddle_hit.wav");
        this.wallHitSound = new Audio("assets/sounds/wall_hit.wav");
        this.ball = new Ball(this.canvas.width / 2, this.canvas.height / 2, "#B1F70E");
        this.p1 = new Player(10, 10, "#FF1B0F");
        this.p2 = new Player(this.canvas.width - this.p1.width - 10, this.canvas.height - this.p1.height - 10, "#E10D92");
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
            this.renderBackground();
            this.renderEntities();
            this.renderScore();
            this.gameRenderer.render();
        };
        for (let img of this.grassImages) {
            img.onload = f;
        }
    }
    pause(stateStack) {
        stateStack.push(new PauseState(this.canvas));
    }
    gameOver(stateStack) {
        this.render();
        this.state = LoopState.PreGame;
        this.p1Score = 0;
        this.p2Score = 0;
        this.p1Handler = getAiHandler(this.p1, this.ball);
        this.p2Handler = getAiHandler(this.p2, this.ball);
        stateStack.push(new GameOverState(this.canvas));
    }
    isGameOver() {
        const max_score = 11;
        if (this.p1Score === max_score || this.p2Score === max_score) {
            return true;
        }
        return false;
    }
    handleInputs(stateStack) {
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
            case LoopState.Active: {
                if (this.keyboardHandler.pressedKeys['p']) {
                    this.pause(stateStack);
                }
            }
            default: {
                break;
            }
        }
    }
    enter() {
        this.keyboardHandler = new KeyboardHandler();
        this.renderEntities();
        this.renderScore();
        this.gameRenderer.render();
    }
    exit(stateStack) { }
    handleCollision() {
        let ballAABB = new AABB(new Point(this.ball.x, this.ball.y), this.ball.width, this.ball.height);
        let p1AABB = new AABB(new Point(this.p1.x, this.p1.y), this.p1.width, this.p1.height);
        let p2AABB = new AABB(new Point(this.p2.x, this.p2.y), this.p2.width, this.p2.height);
        if (ballAABB.intersects(p1AABB) && this.ball.dx < 0) {
            this.ball.dx = -this.ball.dx * 1.05;
            this.ball.dy += this.p1.dy;
            if (this.ball.x < this.p1.x + this.p1.width) {
                this.ball.x = this.p1.x + this.p1.width;
            }
            this.paddleHitSound.play();
        }
        if (ballAABB.intersects(p2AABB) && 0 < this.ball.dx) {
            this.ball.dx = -this.ball.dx * 1.05;
            this.ball.dy += this.p2.dy;
            if (this.p2.x - this.ball.width < this.ball.x) {
                this.ball.x = this.p2.x - this.ball.width;
            }
            this.paddleHitSound.play();
        }
    }
    handleScore() {
        // move to scoring handler
        if (this.ball.x + 4 * this.ball.width < 0) {
            this.ball.reset();
            this.scoreSound.play();
            this.p2Score += 1;
            this.state = LoopState.Serve;
            // this.ball.x = 0;
            // this.ball.dx = - this.ball.dx * 0.9;
            this.renderScore();
        }
        else if (this.canvas.width < this.ball.x - 4 * this.ball.width) {
            this.ball.reset();
            this.scoreSound.play();
            this.p1Score += 1;
            this.state = LoopState.Serve;
            // this.ball.x = canvas.width - this.ball.width;
            // this.ball.dx = - this.ball.dx * 0.9;
            this.renderScore();
        }
    }
    update(stateStack, dt) {
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
        if (restrictBallMovement(this.ball, ballBoundary)) {
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
        this.renderEntities();
    }
    renderBackground() {
        let bgContext = this.gameRenderer.layerMap["background"].getContext("2d");
        if (bgContext) {
            for (let i = 0; i < this.canvas.width; i += 7) {
                for (let j = 0; j < this.canvas.height; j += 7) {
                    bgContext.drawImage(this.grassImages[Math.floor(Math.random() * 3)], i, j);
                }
            }
        }
    }
    renderEntities() {
        let gameContext = this.gameRenderer.layerMap["game"].getContext("2d");
        if (gameContext) {
            gameContext.clearRect(0, 0, this.gameRenderer.layerMap["game"].width, this.gameRenderer.layerMap["game"].height);
            gameContext.fillStyle = this.p1.colour;
            gameContext.fillRect(Math.floor(this.p1.x), Math.floor(this.p1.y), this.p1.width, this.p1.height);
            gameContext.fillStyle = this.p2.colour;
            gameContext.fillRect(Math.floor(this.p2.x), Math.floor(this.p2.y), this.p2.width, this.p2.height);
            gameContext.drawImage(this.ball.image, Math.floor(this.ball.x), Math.floor(this.ball.y));
        }
    }
    renderScore() {
        // move to UI layer
        let uiContext = this.gameRenderer.layerMap["ui"].getContext("2d");
        if (uiContext) {
            uiContext.clearRect(0, 0, this.gameRenderer.layerMap["game"].width, this.gameRenderer.layerMap["game"].height);
            uiContext.fillStyle = "White";
            uiContext.font = "bold 25px Courier New";
            uiContext.fillText(`${this.p1Score} - ${this.p2Score}`, this.canvas.width / 2 - 33, 30);
        }
    }
    render() {
        let context = this.realCanvas.getContext("2d");
        if (context) {
            context.drawImage(this.gameRenderer.render(), 0, 0, this.realCanvas.width, this.realCanvas.height);
        }
    }
}
