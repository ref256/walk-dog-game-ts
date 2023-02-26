import React from 'react';
import {GameLoop} from './lib/engine/GameLoop';
import {WalkDogGame} from './lib/game/WalkDogGame';

export function App() {
    React.useEffect(() => {
        try {
            const game = new WalkDogGame();
            const gameLoop = new GameLoop();

            gameLoop.start(game);
        } catch (err) {
            console.error(err);
        }
    }, []);

    return (
        <canvas
            id="canvas"
            data-testid="canvas"
            tabIndex={0}
            style={{outline: 'none'}}
            height="600"
            width="600"
        >
            Your browser does not support canvas
        </canvas>
    );
}
