import {Renderer} from './Renderer';

export abstract class Game {
    abstract initialize(): Promise<Game>;
    abstract update(): void;
    abstract draw(renderer: Renderer): void;
}
