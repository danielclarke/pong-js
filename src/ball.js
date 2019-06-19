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
        this.state = this.states()["set"];
        this.image = new Image();
        this.image.src = 'assets/imgs/ball.png';
    }
    /*
        set --serve--> served
        served --score point--> set
    */
    states() {
        return {
            "set": 0,
            "served": 1,
        };
    }
    is_served() {
        return this.state === this.states()["served"];
    }
    is_set() {
        return this.state === this.states()["set"];
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;
    }
    serve() {
        if (!this.is_served()) {
            this.state = this.states()["served"];
            this.dx = 5;
            this.dy = Math.random() * 5 - 2.5;
        }
    }
    reset() {
        if (!this.is_set()) {
            this.state = this.states()["set"];
            this.dx = 0;
            this.dy = 0;
            this.x = this.start_x;
            this.y = this.start_y;
        }
    }
}
