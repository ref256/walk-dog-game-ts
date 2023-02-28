import {getContext, getNow} from '../browser';
import {Game} from './Game';
import {KeyState} from './KeyState';
import {Renderer} from './Renderer';

const FRAME_SIZE = (1 / 60) * 1000;

export class GameLoop {
    private _lastFrame: number;
    private _accumulatedDelta: number;

    private static FRAMES_COUNTED = 0;
    private static TOTAL_FRAME_TIME = 0;
    private static FRAME_RATE = 0;

    constructor() {
        this._lastFrame = getNow();
        this._accumulatedDelta = 0;
    }

    async start(newGame: Game) {
        const game = await newGame.initialize();
        const renderer = new Renderer(getContext());
        const keystate = new KeyState();

        const frame = (perf: number) => {
            const frameTime = perf - this._lastFrame;
            this._accumulatedDelta += frameTime;
            while (this._accumulatedDelta > FRAME_SIZE) {
                game.update(keystate);
                this._accumulatedDelta -= FRAME_SIZE;
            }
            this._lastFrame = perf;
            game.draw(renderer);

            if (process.env.NODE_ENV === 'development') {
                this.drawFrameRate(renderer, frameTime);
            }

            requestAnimationFrame(frame.bind(this));
        };

        try {
            requestAnimationFrame(frame.bind(this));
        } catch {
            throw new Error('Failed to start GameLoop');
        }
    }

    private drawFrameRate(renderer: Renderer, frameTime: number) {
        GameLoop.FRAMES_COUNTED += 1;
        GameLoop.TOTAL_FRAME_TIME += frameTime;

        if (GameLoop.TOTAL_FRAME_TIME > 1000) {
            GameLoop.FRAME_RATE = GameLoop.FRAMES_COUNTED;
            GameLoop.TOTAL_FRAME_TIME = 0;
            GameLoop.FRAMES_COUNTED = 0;
        }

        renderer.drawText(`Frame rate ${GameLoop.FRAME_RATE}`, {x: 400, y: 100});
    }
}
