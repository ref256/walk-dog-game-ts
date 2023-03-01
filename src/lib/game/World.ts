import {match, P} from 'ts-pattern';
import {Image} from '../engine/Image';
import {Renderer} from '../engine/Renderer';
import {SpriteSheet} from '../engine/SpriteSheet';
import {getPlatformAndStone, getStoneAndPlatform, rightmostObstacle} from './helpers/segments';
import {Obstacle} from './Obstacle';
import {RedHatBoy} from './RedHatBoy';

export const HEIGHT = 600;
export const TIMELINE_MINIMUM = 1000;
const OBSTACLE_BUFFER = 20;

export class World {
    private _boy: RedHatBoy;
    private _backgrounds: [Image, Image];
    private _obstacles: Obstacle[];
    private _obstacleSheet: SpriteSheet;
    private _stone: HTMLImageElement;
    private _timeline: number;

    constructor(
        boy: RedHatBoy,
        backgrounds: [Image, Image],
        obstacles: Obstacle[],
        obstacleSheet: SpriteSheet,
        stone: HTMLImageElement,
        timeline: number,
    ) {
        this._boy = boy;
        this._backgrounds = backgrounds;
        this._obstacles = obstacles;
        this._obstacleSheet = obstacleSheet;
        this._stone = stone;
        this._timeline = timeline;
    }

    get boy() {
        return this._boy;
    }

    get backgrounds() {
        return this._backgrounds;
    }

    get obstacles() {
        return this._obstacles;
    }

    set obstacles(value) {
        this._obstacles = value;
    }

    get obstacleSheet() {
        return this._obstacleSheet;
    }

    get timeline() {
        return this._timeline;
    }

    set timeline(value) {
        this._timeline = value;
    }

    get velocity() {
        return -this._boy.walkingSpeed;
    }

    get knockedOut() {
        return this.boy.knockedOut;
    }

    generateNextSegment() {
        const nextSegment = Math.floor(Math.random() * 2);

        const nextObstacles = match(nextSegment)
            .with(0, (_) =>
                getStoneAndPlatform(
                    this._stone,
                    this._obstacleSheet,
                    this.timeline + OBSTACLE_BUFFER,
                ),
            )
            .with(1, (_) =>
                getPlatformAndStone(
                    this._stone,
                    this._obstacleSheet,
                    this.timeline + OBSTACLE_BUFFER,
                ),
            )
            .with(P._, (_) => [])
            .exhaustive();

        this.timeline = rightmostObstacle(nextObstacles);
        this.obstacles = this.obstacles.concat(nextObstacles);
    }

    draw(renderer: Renderer) {
        this._backgrounds.forEach((background) => {
            background.draw(renderer);
        });
        this._boy.draw(renderer);
        this.obstacles.forEach((obstacle) => {
            obstacle.draw(renderer);
        });
    }
}
