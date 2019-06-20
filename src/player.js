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
}
