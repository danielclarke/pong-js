export default class Player {
    constructor(x, y, colour = "black") {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.dy = 0;
        this.width = 10;
        this.height = 30;
        this.state = this.states()["stop"];
    }
    /*
    stop --up key--> up
    stop --down key--> down
    up  --down key--> down
    down --up key--> up
    up --no key-->stop
    down --no key--> stop
    */
    states() {
        return {
            "stop": 0,
            "up": 1,
            "down": 2,
        };
    }
    is_stopped() {
        return this.state === this.states()["stop"];
    }
    is_up() {
        return this.state === this.states()["up"];
    }
    is_down() {
        return this.state === this.states()["down"];
    }
}
