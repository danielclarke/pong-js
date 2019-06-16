export default class KeyboardHandler {
    constructor() {
        this.keyMap = {};
        this.kdCallbacks = {};
        this.kuCallbacks = {};
        this.pressedKeys = {};
        this.initKeys();
        this.initKeyDownHandler();
        this.initKeyUpHandler();
    }
    initKeys() {
        this.keyMap = {
            // named keys
            13: 'enter',
            27: 'esc',
            32: 'space',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        // alpha keys
        // @see https://stackoverflow.com/a/43095772/2124254
        for (let i = 0; i < 26; i++) {
            // rollupjs considers this a side-effect (for now), so we'll do it in the
            // initKeys function
            // @see https://twitter.com/lukastaegert/status/1107011988515893249?s=20
            this.keyMap[65 + i] = (10 + i).toString(36);
        }
        // numeric keys
        for (let i = 0; i < 10; i++) {
            this.keyMap[48 + i] = '' + i;
        }
        // window.addEventListener('blur', blurEventHandler);
    }
    initKeyDownHandler() {
        const keydownEventHandler = (evt) => {
            let key = this.keyMap[evt.which];
            this.pressedKeys[key] = true;
            if (this.kdCallbacks[key]) {
                this.kdCallbacks[key](evt);
            }
        };
        window.addEventListener('keydown', keydownEventHandler);
    }
    initKeyUpHandler() {
        const keyupEventHandler = (evt) => {
            let key = this.keyMap[evt.which];
            this.pressedKeys[key] = false;
            if (this.kuCallbacks[key]) {
                this.kuCallbacks[key](evt);
            }
        };
        window.addEventListener('keyup', keyupEventHandler);
    }
    addKeyDownHandler(key, f) {
        this.kdCallbacks[key] = f;
    }
    addKeyUpHandler(key, f) {
        this.kuCallbacks[key] = f;
    }
}
