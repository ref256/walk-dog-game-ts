import {Point, Rect} from '../engine/Rect';
import {Renderer} from '../engine/Renderer';
import {Cell, SpriteSheet} from '../engine/SpriteSheet';
import {Obstacle} from './Obstacle';
import {RedHatBoy} from './RedHatBoy';

export class Platform implements Obstacle {
    private _sheet: SpriteSheet;
    private _position: Point;
    private _sprites: Cell[];
    private _boundingBoxes: Rect[];

    constructor(sheet: SpriteSheet, position: Point, spriteNames: string[], boundingBoxes: Rect[]) {
        this._sheet = sheet;
        this._position = position;

        const sprites = spriteNames
            .map((spriteName) => sheet.cell(spriteName))
            .filter((sprite) => Boolean(sprite));

        const adjustedBoundingBoxes = boundingBoxes.map(
            (boundingBox) =>
                new Rect(
                    {x: boundingBox.x + position.x, y: boundingBox.y + position.y},
                    boundingBox.width,
                    boundingBox.height,
                ),
        );
        this._sprites = sprites;
        this._boundingBoxes = adjustedBoundingBoxes;
    }

    get boundingBoxes() {
        return this._boundingBoxes;
    }

    draw(renderer: Renderer): void {
        let x = 0;
        this._sprites.forEach((sprite) => {
            this._sheet.draw(
                renderer,
                new Rect({x: sprite.frame.x, y: sprite.frame.y}, sprite.frame.w, sprite.frame.h),
                new Rect(
                    {x: this._position.x + x, y: this._position.y},
                    sprite.frame.w,
                    sprite.frame.h,
                ),
            );
            x += sprite.frame.w;
        });
    }

    moveHorizontally(x: number): void {
        this._position.x += x;
        this._boundingBoxes.forEach((boundingBox) => {
            boundingBox.x = boundingBox.position.x + x;
        });
    }

    right(): number {
        return this.boundingBoxes[this.boundingBoxes.length - 1].right;
    }

    checkIntersection(boy: RedHatBoy): void {
        const boxToLandOn = this.boundingBoxes.find((boundingBox) =>
            boy.boundingBox.intersects(boundingBox),
        );
        if (boxToLandOn) {
            if (boy.velocityY > 0 && boy.posY < this._position.y) {
                boy.landOn(boxToLandOn.y);
            } else {
                boy.knockOut();
            }
        }
    }
}
