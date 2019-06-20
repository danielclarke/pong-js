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
    update() {
        this.x += this.dx;
        this.y += this.dy;
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
            this.dx = 5;
            this.dy = Math.random() * 5 - 2.5;
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
}
