export class KeyState {
    private _pressedKeys: Map<string, KeyboardEvent>;

    constructor() {
        this._pressedKeys = new Map();
        this.addKeyboardEventListeners();
    }

    private addKeyboardEventListeners() {
        if (window) {
            window.addEventListener('keydown', this.onKeyDown.bind(this));
            window.addEventListener('keyup', this.onKeyUp.bind(this));
        }
    }

    private onKeyDown(event: KeyboardEvent) {
        this.setPressed(event.code, event);
    }

    private onKeyUp(event: KeyboardEvent) {
        this.setReleased(event.code);
    }

    private setPressed(code: string, event: KeyboardEvent) {
        this._pressedKeys.set(code, event);
    }

    private setReleased(code: string) {
        this._pressedKeys.delete(code);
    }

    isPressed(code: string) {
        return this._pressedKeys.has(code);
    }
}

export function processInput(state: KeyState) {}
