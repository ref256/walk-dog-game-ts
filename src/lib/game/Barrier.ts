import {Image} from '../engine/Image';
import {Renderer} from '../engine/Renderer';
import {Obstacle} from './Obstacle';
import {RedHatBoy} from './RedHatBoy';

export class Barrier implements Obstacle {
    private _image: Image;

    constructor(image: Image) {
        this._image = image;
    }

    draw(renderer: Renderer): void {
        this._image.draw(renderer);
    }

    moveHorizontally(x: number): void {
        this._image.moveHorizontally(x);
    }

    right(): number {
        return this._image.right;
    }

    checkIntersection(boy: RedHatBoy): void {
        if (boy.boundingBox.intersects(this._image.boundingBox)) {
            boy.knockOut();
        }
    }
}
