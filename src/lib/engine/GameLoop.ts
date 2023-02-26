import {getContext, getNow} from '../browser';
import {Game} from './Game';
import {Renderer} from './Renderer';

const FRAME_SIZE = (1 / 60) * 1000;

export class GameLoop {
    private _lastFrame: number;
    private _accumulatedDelta: number;

    constructor() {
        this._lastFrame = getNow();
        this._accumulatedDelta = 0;
    }

    async start(newGame: Game) {
        const game = await newGame.initialize();
        const renderer = new Renderer(getContext());

        const frame = (perf: number) => {
            const frameTime = perf - this._lastFrame;
            this._accumulatedDelta += frameTime;
            while (this._accumulatedDelta > FRAME_SIZE) {
                game.update();
                this._accumulatedDelta -= FRAME_SIZE;
            }
            this._lastFrame = perf;
            game.draw(renderer);

            requestAnimationFrame(frame.bind(this));
        };

        try {
            requestAnimationFrame(frame.bind(this));
        } catch {
            throw new Error('Failed to start GameLoop');
        }
    }
}
