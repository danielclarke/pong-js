import AABB, {Point} from "./aabb"
import KeyboardHandler from "./keyboard-handler"
import Ball from "./ball"

export const getPlayerHandler = (player: Player, upKey: string, downKey: string, keyboardHandler: KeyboardHandler) => {
    return (): void => {
        if (keyboardHandler.pressedKeys[upKey]) {
            player.handleInput("UP");
        } else if (keyboardHandler.pressedKeys[downKey]) {
            player.handleInput("DOWN");
        } else {
            player.handleInput("NONE");
        }
    }
}

export const getAiHandler = (player: Player, ball: Ball) => {
    return (): void => {
        if (player.y + 2 * player.height / 3 < ball.y) {
            player.handleInput("DOWN");
        } else if (ball.y + ball.height < player.y + player.height / 3) {
            player.handleInput("UP")
        } else {
            player.handleInput("NONE");
        }
    }
}

enum State {
    Up = "UP",
    Down = "DOWN",
    Stopped = "STOPPED",
} 

export default class Player {

    /*
    stop --up key--> up
    stop --down key--> down
    up  --down key--> down
    down --up key--> up
    up --no key-->stop
    down --no key--> stop
    */

    dy: number;
    state: State;
    width: number;
    height: number;
    paddleSpeed: number;

    constructor(public x: number, public y: number, public colour: string="black") {
        this.dy = 0;
        this.width = 10;
        this.height = 30;
        this.state = State.Stopped;
        this.paddleSpeed = 0.25;
    }

    isStopped(): boolean {
        return this.state === State.Stopped;
    }

    isUp(): boolean {
        return this.state === State.Up;    
    }

    isDown(): boolean {
        return this.state === State.Down;    
    }

    handleInput(command: string): void {
        switch (command) {
            case "UP": {
                if (this.state !== State.Up) {
                    this.state = State.Up;
                }
                break;
            }
            case "DOWN": {
                if (this.state !== State.Down) {
                    this.state = State.Down;
                }
                break;
            }
            default: {
                this.state = State.Stopped;
                break;
            }
        }
    }

    update(dt: number): void {
        if (this.isUp()) {
            this.dy = -this.paddleSpeed;
        } else if(this.isDown()) {
            this.dy = this.paddleSpeed;
        } else {
            this.dy = 0;
        }

        this.y += this.dy * dt;
    }

    collidesWith(ball: Ball): boolean {
        const aabb = new AABB(new Point(this.x, this.y), this.width, this.height);
        return aabb.intersects(ball.getBoundingBox());
    }
}