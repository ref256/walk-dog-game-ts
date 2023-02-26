import {loadImage} from '../browser';
import {Game} from '../engine/Game';
import {Image} from '../engine/Image';
import {Rect} from '../engine/Rect';
import {Renderer} from '../engine/Renderer';
import {RedHatBoy} from './RedHatBoy';
import {World} from './World';

export class WalkDogGame implements Game {
    private _world?: World;

    async initialize(): Promise<Game> {
        const rhbJson = await (await fetch('rhb.json')).json();
        const rhbImage = await loadImage('rhb.png');
        const boy = new RedHatBoy(rhbJson, rhbImage);

        const background = await loadImage('BG.png');
        const backgroundWidth = background.width;

        this._world = new World(boy, [
            new Image(background, {x: 0, y: 0}),
            new Image(background, {x: backgroundWidth, y: 0}),
        ]);

        return this;
    }

    update() {
        if (this._world) {
            this._world.boy.update();

            const walkingSpeed = this._world.velocity;
            const [firstBackground, secondBackground] = this._world.backgrounds;

            firstBackground.moveHorizontally(walkingSpeed);
            secondBackground.moveHorizontally(walkingSpeed);

            if (firstBackground.right < 0) {
                firstBackground.x = secondBackground.right;
            }
            if (secondBackground.right < 0) {
                secondBackground.x = firstBackground.right;
            }
        }
    }

    draw(renderer: Renderer) {
        renderer.clear(new Rect({x: 0, y: 0}, 600, 600));
        if (this._world) {
            this._world.backgrounds.forEach((background) => {
                background.draw(renderer);
            });
            this._world.boy.draw(renderer);
        }
    }
}
