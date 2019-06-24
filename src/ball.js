import AABB, { Point } from "./aabb.js";
var State;
(function (State) {
    State["Set"] = "SET";
    State["Served"] = "SERVED";
})(State || (State = {}));
export default class Ball {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.start_x = x;
        this.start_y = y;
        this.dx = 0;
        this.dy = 0;
        this.width = 10;
        this.height = 10;
        this.state = State.Set;
        this.image = new Image();
        this.image.src = 'assets/imgs/ball.png';
    }
    is_served() {
        return this.state === State.Served;
    }
    is_set() {
        return this.state === State.Set;
    }
    update(dt) {
        this.x += this.dx * dt;
        this.y += this.dy * dt;
    }
    handleInput(command) {
        switch (command) {
            case "SERVE": {
                if (this.state !== State.Served) {
                    this.serve();
                    this.state = State.Served;
                }
            }
            default: {
                break;
            }
        }
    }
    serve() {
        if (!this.is_served()) {
            this.dx = 0.25;
            this.dy = Math.random() * 0.25 - 0.125;
        }
    }
    reset() {
        if (!this.is_set()) {
            this.state = State.Set;
            this.dx = 0;
            this.dy = 0;
            this.x = this.start_x;
            this.y = this.start_y;
        }
    }
    getBoundingBox() {
        return new AABB(new Point(this.x, this.y), this.width, this.height);
    }
}
