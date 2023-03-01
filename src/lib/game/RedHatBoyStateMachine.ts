import {isMatching, match, P} from 'ts-pattern';
import {Audio, Sound} from '../engine/Audio';
import {Point} from '../engine/Rect';
import {HEIGHT} from './World';

const GRAVITY = 1;
const TERMINAL_VELOCITY = 20;
const FLOOR = 475;
const PLAYER_HEIGHT = HEIGHT - FLOOR;
const STARTING_POINT = -20;
const JUMP_SPEED = -25;

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

type StateName = 'Idle' | 'Running' | 'Sliding' | 'Jumping' | 'Falling' | 'KnockedOut';

class Context {
    frame: number;
    position: Point;
    velocity: Point;
    audio: Audio;
    jumpSound: Sound;

    constructor(frame: number, position: Point, velocity: Point, audio: Audio, jumpSound: Sound) {
        this.frame = frame;
        this.position = position;
        this.velocity = velocity;
        this.audio = audio;
        this.jumpSound = jumpSound;
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

    playJumpSound() {
        try {
            this.audio.playSound(this.jumpSound);
        } catch (err) {
            console.error('Error playing jump sound', err);
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
        return this;
    }

    setOn(position: number) {
        this.position.y = position - PLAYER_HEIGHT;
        return this;
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
    constructor(audio: Audio, jumpSound: Sound) {
        const context = new Context(
            0,
            {x: STARTING_POINT, y: FLOOR},
            {x: 0, y: 0},
            audio,
            jumpSound,
        );
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

    slide() {
        return new SlidingState(this.context.resetFrame());
    }

    jump() {
        return new JumpingState(
            this.context.resetFrame().setVerticalVelocity(JUMP_SPEED).playJumpSound(),
        );
    }

    landOn(position: number) {
        return new RunningState(this.context.setOn(position));
    }

    knockOut() {
        return new FallingState(this.context.resetFrame().stop());
    }
}

class SlidingState extends State {
    constructor(context: Context) {
        super('Sliding', context);
    }

    get frameName() {
        return SLIDING_FRAME_NAME;
    }

    update(): SlidingState | RunningState {
        this._context = this.context.update(SLIDING_FRAMES);
        if (this.context.frame >= SLIDING_FRAMES) {
            return this.stand();
        }
        return this;
    }

    stand() {
        return new RunningState(this.context.resetFrame());
    }

    landOn(position: number) {
        return new SlidingState(this.context.setOn(position));
    }

    knockOut() {
        return new FallingState(this.context.resetFrame().stop());
    }
}

class JumpingState extends State {
    constructor(context: Context) {
        super('Jumping', context);
    }

    get frameName() {
        return JUMPING_FRAME_NAME;
    }

    update(): JumpingState | RunningState {
        this._context = this.context.update(JUMPING_FRAMES);
        if (this.context.position.y >= FLOOR) {
            return this.landOn(HEIGHT);
        }
        return this;
    }

    landOn(position: number) {
        return new RunningState(this.context.resetFrame().setOn(position));
    }

    knockOut() {
        return new FallingState(this.context.resetFrame().stop());
    }
}

class FallingState extends State {
    constructor(context: Context) {
        super('Falling', context);
    }

    get frameName() {
        return FALLING_FRAME_NAME;
    }

    update(): FallingState | KnockedOutState {
        this._context = this.context.update(FALLING_FRAMES);
        if (this.context.frame >= FALLING_FRAMES) {
            return this.knockOut();
        }
        return this;
    }

    knockOut() {
        return new KnockedOutState(this.context);
    }
}

class KnockedOutState extends State {
    constructor(context: Context) {
        super('KnockedOut', context);
    }

    get frameName() {
        return FALLING_FRAME_NAME;
    }

    update() {
        return this;
    }
}

type RedHatBoyState =
    | IdleState
    | RunningState
    | SlidingState
    | JumpingState
    | FallingState
    | KnockedOutState;

export type Event =
    | {name: 'Update'}
    | {name: 'Run'}
    | {name: 'Slide'}
    | {name: 'Jump'}
    | {name: 'KnockOut'}
    | {name: 'Land'; position: number};

export class RedHatBoyStateMachine {
    private _state: RedHatBoyState;

    constructor(audio: Audio, jumpSound: Sound) {
        this._state = new IdleState(audio, jumpSound);
    }

    transition(event: Event) {
        this._state = match([this._state, event])
            .with([{name: 'Idle'}, {name: 'Run'}], ([state]) => (state as IdleState).run())
            .with([{name: 'Running'}, {name: 'Slide'}], ([state]) =>
                (state as RunningState).slide(),
            )
            .with([{name: 'Running'}, {name: 'Jump'}], ([state]) => (state as RunningState).jump())
            .with([{name: 'Running'}, {name: 'Land'}], ([state, {position}]) =>
                (state as RunningState).landOn(position),
            )
            .with([{name: 'Sliding'}, {name: 'Land'}], ([state, {position}]) =>
                (state as SlidingState).landOn(position),
            )
            .with([{name: 'Jumping'}, {name: 'Land'}], ([state, {position}]) =>
                (state as JumpingState).landOn(position),
            )
            .with([{name: 'Running'}, {name: 'KnockOut'}], ([state]) =>
                (state as RunningState).knockOut(),
            )
            .with([{name: 'Sliding'}, {name: 'KnockOut'}], ([state]) =>
                (state as SlidingState).knockOut(),
            )
            .with([{name: 'Jumping'}, {name: 'KnockOut'}], ([state]) =>
                (state as JumpingState).knockOut(),
            )
            .with([{name: 'Idle'}, {name: 'Update'}], ([state]) => state.update())
            .with([{name: 'Running'}, {name: 'Update'}], ([state]) => state.update())
            .with([{name: 'Sliding'}, {name: 'Update'}], ([state]) => state.update())
            .with([{name: 'Jumping'}, {name: 'Update'}], ([state]) => state.update())
            .with([{name: 'Falling'}, {name: 'Update'}], ([state]) => state.update())
            .with(P._, ([state]) => state)
            .exhaustive();
    }

    get frameName() {
        return match([this._state])
            .with([{name: 'Idle'}], ([state]) => state.frameName)
            .with([{name: 'Running'}], ([state]) => state.frameName)
            .with([{name: 'Sliding'}], ([state]) => state.frameName)
            .with([{name: 'Jumping'}], ([state]) => state.frameName)
            .with([{name: 'Falling'}], ([state]) => state.frameName)
            .with([{name: 'KnockedOut'}], ([state]) => state.frameName)
            .exhaustive();
    }

    get context() {
        return match([this._state])
            .with([{name: 'Idle'}], ([state]) => state.context)
            .with([{name: 'Running'}], ([state]) => state.context)
            .with([{name: 'Sliding'}], ([state]) => state.context)
            .with([{name: 'Jumping'}], ([state]) => state.context)
            .with([{name: 'Falling'}], ([state]) => state.context)
            .with([{name: 'KnockedOut'}], ([state]) => state.context)
            .exhaustive();
    }

    get knockedOut() {
        return this._state.name === 'KnockedOut';
    }

    update() {
        this.transition({name: 'Update'});
    }
}
