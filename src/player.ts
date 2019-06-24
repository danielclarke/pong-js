import KeyboardHandler from "./keyboard-handler"
import Ball from "./ball"

export const getPlayerHandler = (player: Player, upKey: string, downKey: string, keyboardHandler: KeyboardHandler) => {
    return () => {
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
    return () => {
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

    constructor(public x: number, public y: number, public colour: string="black") {
        this.dy = 0;
        this.width = 10;
        this.height = 30;
        this.state = State.Stopped;
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
}