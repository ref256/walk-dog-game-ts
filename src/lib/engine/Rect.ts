export type Point = {
    x: number;
    y: number;
};

export class Rect {
    private _position: Point;
    private _width: number;
    private _height: number;

    constructor(position: Point, width: number, height: number) {
        this._position = position;
        this._width = width;
        this._height = height;
    }

    get x() {
        return this._position.x;
    }

    get y() {
        return this._position.y;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get position() {
        return this._position;
    }

    get right() {
        return this.x + this.width;
    }

    get bottom() {
        return this.y + this.height;
    }

    set x(value: number) {
        this._position.x = value;
    }

    intersects(rect: Rect) {
        return (
            this.x < rect.right &&
            this.right > rect.x &&
            this.y < rect.bottom &&
            this.bottom > rect.y
        );
    }
}
