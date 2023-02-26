import {Point, Rect} from './Rect';
import {Renderer} from './Renderer';

export class Image {
    private _element: HTMLImageElement;
    private _boundingBox: Rect;

    constructor(element: HTMLImageElement, position: Point) {
        this._element = element;
        this._boundingBox = new Rect(position, element.width, element.height);
    }

    get boundingBox() {
        return this._boundingBox;
    }

    get right() {
        return this._boundingBox.right;
    }

    set x(value: number) {
        this._boundingBox.x = value;
    }

    moveHorizontally(distance: number) {
        this.x = this.boundingBox.x + distance;
    }

    draw(renderer: Renderer) {
        renderer.drawEntireImage(this._element, this.boundingBox.position);
    }
}
