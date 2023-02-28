import {Rect} from '../engine/Rect';
import {Renderer} from '../engine/Renderer';
import {Sheet, SpriteSheet} from '../engine/SpriteSheet';
import {RedHatBoyStateMachine} from './RedHatBoyStateMachine';

export class RedHatBoy {
    private _spriteSheet: SpriteSheet;
    private _machine: RedHatBoyStateMachine;

    constructor(sheet: Sheet, image: HTMLImageElement) {
        this._spriteSheet = new SpriteSheet(sheet, image);
        this._machine = new RedHatBoyStateMachine();
    }

    get frameName() {
        return `${this._machine.frameName} (${
            Math.floor(this._machine.context.frame / 3) + 1
        }).png`;
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
            {
                x: this._machine.context.position.x + sprite.spriteSourceSize.x,
                y: this._machine.context.position.y + sprite.spriteSourceSize.y,
            },
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
        return this._machine.context.position.y;
    }

    get velocityY() {
        return this._machine.context.velocity.y;
    }

    get walkingSpeed() {
        return this._machine.context.velocity.x;
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
        this._machine.update();
    }

    runRight() {
        this._machine.transition({name: 'Run'});
    }

    slide() {
        this._machine.transition({name: 'Slide'});
    }

    jump() {
        this._machine.transition({name: 'Jump'});
    }
}
