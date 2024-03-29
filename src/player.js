import AABB, { Point } from "./aabb.js";
export const getPlayerHandler = (player, upKey, downKey, keyboardHandler) => {
    return () => {
        if (keyboardHandler.pressedKeys[upKey]) {
            player.handleInput("UP");
        }
        else if (keyboardHandler.pressedKeys[downKey]) {
            player.handleInput("DOWN");
        }
        else {
            player.handleInput("NONE");
        }
    };
};
export const getAiHandler = (player, ball) => {
    return () => {
        if (player.y + 2 * player.height / 3 < ball.y) {
            player.handleInput("DOWN");
        }
        else if (ball.y + ball.height < player.y + player.height / 3) {
            player.handleInput("UP");
        }
        else {
            player.handleInput("NONE");
        }
    };
};
var State;
(function (State) {
    State["Up"] = "UP";
    State["Down"] = "DOWN";
    State["Stopped"] = "STOPPED";
})(State || (State = {}));
export default class Player {
    constructor(x, y, colour = "black") {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.dy = 0;
        this.width = 10;
        this.height = 30;
        this.state = State.Stopped;
        this.paddleSpeed = 0.25;
    }
    isStopped() {
        return this.state === State.Stopped;
    }
    isUp() {
        return this.state === State.Up;
    }
    isDown() {
        return this.state === State.Down;
    }
    handleInput(command) {
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
    update(dt) {
        if (this.isUp()) {
            this.dy = -this.paddleSpeed;
        }
        else if (this.isDown()) {
            this.dy = this.paddleSpeed;
        }
        else {
            this.dy = 0;
        }
        this.y += this.dy * dt;
    }
    collidesWith(ball) {
        const aabb = new AABB(new Point(this.x, this.y), this.width, this.height);
        return aabb.intersects(ball.getBoundingBox());
    }
    getBoundingBox() {
        return new AABB(new Point(this.x, this.y), this.width, this.height);
    }
}
