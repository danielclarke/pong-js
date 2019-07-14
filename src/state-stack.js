export default class StateStack {
    constructor() {
        this.states = [];
    }
    update(dt) {
        this.states[this.states.length - 1].update(this, dt);
    }
    render() {
        this.states.forEach((state) => { state.render(); });
    }
    handleInputs() {
        this.states[this.states.length - 1].handleInputs(this);
    }
    push(state) {
        this.states.push(state);
        state.enter();
    }
    pop() {
        let state = this.states.pop();
        if (state) {
            state.exit(this);
        }
        if (this.states.length > 0) {
            this.states[this.states.length - 1].enter();
        }
        return state;
    }
    clear() {
        this.states = [];
    }
}
