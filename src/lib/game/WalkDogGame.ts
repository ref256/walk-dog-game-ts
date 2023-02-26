import {loadImage} from '../browser';
import {Game} from '../engine/Game';
import {Rect} from '../engine/Rect';
import {Renderer} from '../engine/Renderer';
import {RedHatBoy} from './RedHatBoy';

export class WalkDogGame implements Game {
    private _boy?: RedHatBoy;

    async initialize(): Promise<Game> {
        const rhbJson = await (await fetch('rhb.json')).json();
        const rhbImage = await loadImage('rhb.png');
        this._boy = new RedHatBoy(rhbJson, rhbImage);
        return this;
    }

    update() {
        if (this._boy) {
            this._boy.update();
        }
    }

    draw(renderer: Renderer) {
        renderer.clear(new Rect({x: 0, y: 0}, 600, 600));
        if (this._boy) {
            this._boy.draw(renderer);
        }
    }
}
