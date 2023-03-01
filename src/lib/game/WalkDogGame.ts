import {loadImage} from '../browser';
import {Game} from '../engine/Game';
import {Image} from '../engine/Image';
import {KeyState} from '../engine/KeyState';
import {Rect} from '../engine/Rect';
import {Renderer} from '../engine/Renderer';
import {SpriteSheet} from '../engine/SpriteSheet';
import {getStoneAndPlatform, getStoneAndStone, rightmostObstacle} from './helpers/segments';
import {RedHatBoy} from './RedHatBoy';
import {WalkDogStateMachine} from './WalkDogGameStateMachine';
import {World} from './World';

export class WalkDogGame implements Game {
    private _machine?: WalkDogStateMachine;

    async initialize(): Promise<Game> {
        const rhbJson = await (await fetch('rhb.json')).json();
        const rhbImage = await loadImage('rhb.png');
        const boy = new RedHatBoy(rhbJson, rhbImage);

        const background = await loadImage('BG.png');
        const backgroundWidth = background.width;

        const stone = await loadImage('stone.png');

        const tilesJson = await (await fetch('tiles.json')).json();
        const tilesSpriteSheet = new SpriteSheet(tilesJson, await loadImage('tiles.png'));

        // const startingObstacles = getStoneAndStone(stone, 0);
        const startingObstacles = getStoneAndPlatform(stone, tilesSpriteSheet, 0);
        const timeline = rightmostObstacle(startingObstacles);

        const world = new World(
            boy,
            [
                new Image(background, {x: 0, y: 0}),
                new Image(background, {x: backgroundWidth, y: 0}),
            ],
            startingObstacles,
            tilesSpriteSheet,
            stone,
            timeline,
        );

        this._machine = new WalkDogStateMachine(world);

        return this;
    }

    update(keystate: KeyState) {
        if (this._machine) {
            this._machine.update(keystate);
        }
    }

    draw(renderer: Renderer) {
        renderer.clear(new Rect({x: 0, y: 0}, 600, 600));
        if (this._machine) {
            this._machine.draw(renderer);
        }
    }
}
