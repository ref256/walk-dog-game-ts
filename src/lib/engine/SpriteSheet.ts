import {Rect} from './Rect';
import {Renderer} from './Renderer';

export type Sheet = {
    frames: Record<string, Cell>;
};

type Cell = {
    frame: SheetRect;
    spriteSourceSize: SheetRect;
};

type SheetRect = {
    x: number;
    y: number;
    w: number;
    h: number;
};

export class SpriteSheet {
    private _sheet: Sheet;
    private _image: HTMLImageElement;

    constructor(sheet: Sheet, image: HTMLImageElement) {
        this._sheet = sheet;
        this._image = image;
    }

    get sheet() {
        return this._sheet;
    }

    get image() {
        return this._image;
    }

    cell(name: string) {
        return this._sheet.frames[name];
    }

    draw(renderer: Renderer, source: Rect, destination: Rect) {
        renderer.drawImage(this._image, source, destination);
    }
}
