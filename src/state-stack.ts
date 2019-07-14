export interface State {
    enter(): void;
    exit(stateStack: StateStack): void;
    update(stateStack: StateStack, dt: number): void;
    render(): void;
    handleInputs(stateStack: StateStack): void;
}

export default class StateStack {

    states: State[];

    constructor() {
        this.states = [];
    }

    update(dt: number): void {
        this.states[this.states.length - 1].update(this, dt);
    }

    render(): void {
        this.states.forEach((state: State) => {state.render()});
    }

    handleInputs(): void {
        this.states[this.states.length - 1].handleInputs(this);
    }

    push(state: State): void {
        this.states.push(state);
        state.enter();
    }

    pop(): State | undefined {
        let state = this.states.pop();
        if (state) {
            state.exit(this);
        }
        if (this.states.length > 0) {
            this.states[this.states.length - 1].enter();
        }
        return state;
    }

    clear(): void {
        this.states = [];
    }
}