import {Image} from '../../engine/Image';
import {Rect} from '../../engine/Rect';
import {Barrier} from '../Barrier';
import {Obstacle} from '../Obstacle';

const LOW_PLATFORM = 420;
const HIGH_PLATFORM = 375;

const STONE_ON_GROUND = 546;

const FLOATING_PLATFORM_SPRITES: [string, string, string] = ['13.png', '14.png', '15.png'];
const PLATFORM_WIDTH = 384;
const PLATFORM_HEIGHT = 93;
const PLATFORM_EDGE_WIDTH = 60;
const PLATFORM_EDGE_HEIGHT = 54;
const FLOATING_PLATFORM_BOUNDING_BOXES: [Rect, Rect, Rect] = [
    new Rect({x: 0, y: 0}, PLATFORM_EDGE_WIDTH, PLATFORM_EDGE_HEIGHT),
    new Rect(
        {x: PLATFORM_EDGE_WIDTH, y: 0},
        PLATFORM_WIDTH - PLATFORM_EDGE_WIDTH * 2,
        PLATFORM_HEIGHT,
    ),
    new Rect(
        {x: PLATFORM_WIDTH - PLATFORM_EDGE_WIDTH, y: 0},
        PLATFORM_EDGE_WIDTH,
        PLATFORM_EDGE_HEIGHT,
    ),
];

export function getStoneAndStone(stone: HTMLImageElement, offsetX: number) {
    const INITIAL_STONE_OFFSET = 150;
    const INITIAL_STONE2_OFFSET = 500;

    return [
        new Barrier(new Image(stone, {x: offsetX + INITIAL_STONE_OFFSET, y: STONE_ON_GROUND})),
        new Barrier(new Image(stone, {x: offsetX + INITIAL_STONE2_OFFSET, y: STONE_ON_GROUND})),
    ];
}

export function rightmostObstacle(obstacles: Obstacle[]) {
    return Math.max(...obstacles.map((obstacle) => obstacle.right()));
}
