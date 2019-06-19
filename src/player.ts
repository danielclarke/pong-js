export default class Player {

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
        }
    }

    dy: number;
    state: number;

    width: number;
    height: number;

    constructor(public x: number, public y: number, public colour: string="black") {
        this.dy = 0;
        this.width = 10;
        this.height = 30;
        this.state = this.states()["stop"];
    }

    is_stopped(): boolean {
        return this.state === this.states()["stop"];
    }

    is_up(): boolean {
        return this.state === this.states()["up"];    
    }

    is_down(): boolean {
        return this.state === this.states()["down"];    
    }
}