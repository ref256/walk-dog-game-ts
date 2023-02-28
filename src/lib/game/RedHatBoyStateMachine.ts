import {match, P} from 'ts-pattern';
import {Point} from '../engine/Rect';
import {HEIGHT} from './World';

const GRAVITY = 1;
const TERMINAL_VELOCITY = 20;
const FLOOR = 475;
const PLAYER_HEIGHT = HEIGHT - FLOOR;
const STARTING_POINT = -20;

const IDLE_FRAME_NAME = 'Idle';
const RUNNING_FRAME_NAME = 'Run';
const SLIDING_FRAME_NAME = 'Slide';
const JUMPING_FRAME_NAME = 'Jump';
const FALLING_FRAME_NAME = 'Dead';

const IDLE_FRAMES = 29;
const RUNNING_FRAMES = 23;
const SLIDING_FRAMES = 14;
const JUMPING_FRAMES = 35;
const FALLING_FRAMES = 29;

const RUNNING_SPEED = 4;

type StateName = 'Idle' | 'Running';

class Context {
    frame: number;
    position: Point;
    velocity: Point;

    constructor(frame: number, position: Point, velocity: Point) {
        this.frame = frame;
        this.position = position;
        this.velocity = velocity;
    }

    update(frameCount: number) {
        if (this.velocity.y < TERMINAL_VELOCITY) {
            this.velocity.y += GRAVITY;
        }

        if (this.frame < frameCount) {
            this.frame += 1;
        } else {
            this.frame = 0;
        }

        this.position.y += this.velocity.y;

        if (this.position.y > FLOOR) {
            this.position.y = FLOOR;
        }

        return this;
    }

    resetFrame() {
        this.frame = 0;
        return this;
    }

    runRight() {
        this.velocity.x += RUNNING_SPEED;
        return this;
    }

    setVerticalVelocity(y: number) {
        this.velocity.y = y;
        return this;
    }

    stop() {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    setOn(position: number) {
        this.position.y = position - PLAYER_HEIGHT;
    }
}

class State {
    name: StateName;
    _context: Context;

    constructor(name: StateName, context: Context) {
        this.name = name;
        this._context = context;
    }

    get context() {
        return this._context;
    }
}

class IdleState extends State {
    constructor() {
        const context = new Context(0, {x: STARTING_POINT, y: FLOOR}, {x: 0, y: 0});
        super('Idle', context);
    }

    get frameName() {
        return IDLE_FRAME_NAME;
    }

    update() {
        this._context = this.context.update(IDLE_FRAMES);
        return this;
    }

    run() {
        return new RunningState(this.context.resetFrame().runRight());
    }
}

class RunningState extends State {
    constructor(context: Context) {
        super('Running', context);
    }

    get frameName() {
        return RUNNING_FRAME_NAME;
    }

    update() {
        this._context = this.context.update(RUNNING_FRAMES);
        return this;
    }
}

type RedHatBoyState = IdleState | RunningState;

export type Event = {name: 'Update'} | {name: 'Run'};

export class RedHatBoyStateMachine {
    private _state: RedHatBoyState;

    constructor() {
        this._state = new IdleState();
    }

    transition(event: Event) {
        this._state = match([this._state, event])
            .with([{name: 'Idle'}, {name: 'Run'}], ([state]) => (state as IdleState).run())
            .with([{name: 'Idle'}, {name: 'Update'}], ([state]) => state.update())
            .with([{name: 'Running'}, {name: 'Update'}], ([state]) => state.update())
            .with(P._, ([state]) => state)
            .exhaustive();
    }

    get frameName() {
        return match([this._state])
            .with([{name: 'Idle'}], ([state]) => state.frameName)
            .with([{name: 'Running'}], ([state]) => state.frameName)
            .exhaustive();
    }

    get context() {
        return match([this._state])
            .with([{name: 'Idle'}], ([state]) => state.context)
            .with([{name: 'Running'}], ([state]) => state.context)
            .exhaustive();
    }

    update() {
        this.transition({name: 'Update'});
    }
}
