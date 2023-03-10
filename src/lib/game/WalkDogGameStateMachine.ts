import {match} from 'ts-pattern';
import {drawUi, findHtmlElementById, hideUi} from '../browser';
import {KeyState} from '../engine/KeyState';
import {Renderer} from '../engine/Renderer';
import {TIMELINE_MINIMUM, World} from './World';

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
        if (keystate.isPressed('ArrowDown')) {
            this.world.boy.slide();
        }
        if (keystate.isPressed('Space')) {
            this.world.boy.jump();
        }

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

        this.world.obstacles = this.world.obstacles.filter((obstacle) => obstacle.right() > 0);
        this.world.obstacles.forEach((obstacle) => {
            obstacle.moveHorizontally(walkingSpeed);
            obstacle.checkIntersection(this.world.boy);
        });

        if (this.world.timeline < TIMELINE_MINIMUM) {
            this.world.generateNextSegment();
        } else {
            this.world.timeline += walkingSpeed;
        }

        if (this.world.knockedOut) {
            return this.endGame();
        }
        return this;
    }

    endGame() {
        return new GameOverState(this.world);
    }
}

class GameOverState extends State {
    private _newGamePressed: boolean;

    constructor(world: World) {
        super('GameOver', world);
        this._newGamePressed = false;
        drawUi(`<button id='new_game'>New Game</button>`);
        const button = findHtmlElementById('new_game');
        button.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick() {
        hideUi();
        this._newGamePressed = true;
    }

    update(): GameOverState | ReadyState {
        if (this._newGamePressed) {
            return this.newGame();
        }
        return this;
    }

    newGame() {
        return new ReadyState(World.reset(this.world));
    }
}

type WalkDogGameState = ReadyState | WalkingState | GameOverState;

export class WalkDogStateMachine {
    private _state: WalkDogGameState;

    constructor(world: World) {
        this._state = new ReadyState(world);
    }

    update(keystate: KeyState) {
        const newState = match([this._state])
            .with([{name: 'Ready'}], ([state]) => state.update(keystate))
            .with([{name: 'Walking'}], ([state]) => state.update(keystate))
            .with([{name: 'GameOver'}], ([state]) => (state as GameOverState).update())
            .exhaustive();
        if (newState) {
            this._state = newState;
        }
    }

    draw(renderer: Renderer) {
        match([this._state])
            .with([{name: 'Ready'}], ([state]) => state.draw(renderer))
            .with([{name: 'Walking'}], ([state]) => state.draw(renderer))
            .with([{name: 'GameOver'}], ([state]) => state.draw(renderer))
            .exhaustive();
    }
}
