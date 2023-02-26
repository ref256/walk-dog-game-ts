import {Image} from '../engine/Image';
import {Renderer} from '../engine/Renderer';
import {RedHatBoy} from './RedHatBoy';

export class World {
    private _boy: RedHatBoy;
    private _backgrounds: [Image, Image];
    // private _timeline: number;

    constructor(boy: RedHatBoy, backgrounds: [Image, Image]) {
        this._boy = boy;
        this._backgrounds = backgrounds;
        // this._timeline = timeline;
    }

    get boy() {
        return this._boy;
    }

    get backgrounds() {
        return this._backgrounds;
    }

    get velocity() {
        return -this._boy.walkingSpeed;
    }

    draw(renderer: Renderer) {
        this._backgrounds.forEach((background) => {
            background.draw(renderer);
        });
        this._boy.draw(renderer);
    }
}
