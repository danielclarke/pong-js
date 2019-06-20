enum State {
    Set = "SET",
    Served = "SERVED",
}

export default class Ball {

    /*
        set --serve--> served
        served --score point--> set
    */

    start_x: number;
    start_y: number;
    dx: number;
    dy: number;
    width: number;
    height: number;
    state: State;
    image: HTMLImageElement;

    constructor(public x: number, public y: number, public colour: string) {
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

    is_served(): boolean {
        return this.state === State.Served;
    }

    is_set(): boolean {
        return this.state === State.Set;
    }

    update(): void {
        this.x += this.dx;
        this.y += this.dy;
    }

    handleInput(command: string): void {
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

    serve(): void {
        if (!this.is_served()) {
            this.dx = 5;
            this.dy = Math.random() * 5 - 2.5;
        }
    }

    reset(): void {
        if (!this.is_set()) {
            this.state = State.Set;
            this.dx = 0;
            this.dy = 0;
            this.x = this.start_x;
            this.y = this.start_y;
        }
    }
}