import {KeyState} from './KeyState';
import {Renderer} from './Renderer';

export abstract class Game {
    abstract initialize(): Promise<Game>;
    abstract update(keystate: KeyState): void;
    abstract draw(renderer: Renderer): void;
}
