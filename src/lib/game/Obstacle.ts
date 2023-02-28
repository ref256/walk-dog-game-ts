import {Renderer} from '../engine/Renderer';
import {RedHatBoy} from './RedHatBoy';

export abstract class Obstacle {
    abstract checkIntersection(boy: RedHatBoy): void;
    abstract draw(renderer: Renderer): void;
    abstract moveHorizontally(x: number): void;
    abstract right(): number;
}
