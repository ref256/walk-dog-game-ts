import {Point, Rect} from './Rect';

export class Renderer {
    private context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    clear(rect: Rect) {
        this.context.clearRect(rect.x, rect.y, rect.width, rect.height);
    }

    drawImage(image: HTMLImageElement, frame: Rect, destination: Rect) {
        this.context.drawImage(
            image,
            frame.x,
            frame.y,
            frame.width,
            frame.height,
            destination.x,
            destination.y,
            destination.width,
            destination.height,
        );
    }

    drawEntireImage(image: HTMLImageElement, position: Point) {
        this.context.drawImage(image, position.x, position.y);
    }

    drawText(text: string, location: Point) {
        this.context.font = '16px serif';
        this.context.fillText(text, location.x, location.y);
    }

    drawBoundingBox(boundingBox: Rect) {
        this.context.strokeStyle = '#FF0000';
        this.context.beginPath();
        this.context.rect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
    }
}
