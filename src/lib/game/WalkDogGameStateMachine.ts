import {match} from 'ts-pattern';
import {KeyState} from '../engine/KeyState';
import {Renderer} from '../engine/Renderer';
import {World} from './World';

type StateName = 'Ready' | 'Walking' | 'GameOver';

class State {
    name: StateName;
    world: World;

    constructor(name: StateName, world: World) {
        this.name = name;
        this.world = world;
    }

    draw(renderer: Renderer) {
        this.world.draw(renderer);
    }
}

class ReadyState extends State {
    constructor(world: World) {
        super('Ready', world);
    }

    update(keystate: KeyState): WalkingState | ReadyState {
        this.world.boy.update();
        if (keystate.isPressed('ArrowRight')) {
            return this.startRunning();
        }
        return this;
    }

    startRunning() {
        this.runRight();
        return new WalkingState(this.world);
    }

    private runRight() {
        this.world.boy.runRight();
    }
}

class WalkingState extends State {
    constructor(world: World) {
        super('Walking', world);
    }

    update(keystate: KeyState) {
        this.world.boy.update();

        const walkingSpeed = this.world.velocity;
        const [firstBackground, secondBackground] = this.world.backgrounds;

        firstBackground.moveHorizontally(walkingSpeed);
        secondBackground.moveHorizontally(walkingSpeed);

        if (firstBackground.right < 0) {
            firstBackground.x = secondBackground.right;
        }
        if (secondBackground.right < 0) {
            secondBackground.x = firstBackground.right;
        }
        return this;
    }
}

class GameOverState extends State {
    constructor(world: World) {
        super('GameOver', world);
    }

    update() {
        return this;
    }

    newGame() {
        console.log('new game');
    }
}

type WalkDogGameState = ReadyState | WalkingState | GameOverState;

export class WalkDogStateMachine {
    private _state: WalkDogGameState;

    constructor(world: World) {
        this._state = new ReadyState(world);
    }

    update(keystate: KeyState) {
        this._state = match([this._state])
            .with([{name: 'Ready'}], ([state]) => state.update(keystate))
            .with([{name: 'Walking'}], ([state]) => state.update(keystate))
            .with([{name: 'GameOver'}], ([state]) => (state as GameOverState).update())
            .exhaustive();
    }

    draw(renderer: Renderer) {
        match([this._state])
            .with([{name: 'Ready'}], ([state]) => state.draw(renderer))
            .with([{name: 'Walking'}], ([state]) => state.draw(renderer))
            .with([{name: 'GameOver'}], ([state]) => state.draw(renderer))
            .exhaustive();
    }
}
