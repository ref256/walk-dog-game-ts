import {Rect} from '../engine/Rect';
import {Renderer} from '../engine/Renderer';
import {Sheet, SpriteSheet} from '../engine/SpriteSheet';

const IDLE_FRAMES = 29;

export class RedHatBoy {
    private _spriteSheet: SpriteSheet;
    private _frameName: string;
    private _frame: number;

    constructor(sheet: Sheet, image: HTMLImageElement) {
        this._spriteSheet = new SpriteSheet(sheet, image);
        this._frameName = 'Idle';
        this._frame = 0;
    }

    get frameName() {
        return `${this._frameName} (${Math.floor(this._frame / 3) + 1}).png`;
    }

    get currentSprite() {
        const sprite = this._spriteSheet.sheet.frames[this.frameName];
        if (!sprite) {
            throw new Error('Sprite not found');
        }
        return sprite;
    }

    get destinationBox() {
        const sprite = this.currentSprite;
        return new Rect(
            {x: sprite.spriteSourceSize.x, y: sprite.spriteSourceSize.y},
            sprite.frame.w,
            sprite.frame.h,
        );
    }

    get boundingBox() {
        const X_OFFSET = 18;
        const Y_OFFSET = 14;
        const WIDTH_OFFSET = 28;
        const boundingBox = this.destinationBox;

        return new Rect(
            {x: boundingBox.x + X_OFFSET, y: boundingBox.y + Y_OFFSET},
            boundingBox.width - WIDTH_OFFSET,
            boundingBox.height - Y_OFFSET,
        );
    }

    get posY() {
        return 475;
    }

    get velocityY() {
        return 0;
    }

    get walkingSpeed() {
        return 0;
    }

    reset(boy: RedHatBoy) {
        this._spriteSheet = boy._spriteSheet;
    }

    draw(renderer: Renderer) {
        const sprite = this.currentSprite;
        renderer.drawImage(
            this._spriteSheet.image,
            new Rect({x: sprite.frame.x, y: sprite.frame.y}, sprite.frame.w, sprite.frame.h),
            this.destinationBox,
        );
    }

    update() {
        if (this._frame < IDLE_FRAMES) {
            this._frame += 1;
        } else {
            this._frame = 0;
        }
    }
}
