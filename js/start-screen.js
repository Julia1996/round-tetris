import Game from './game';
import CompetitorScreen from './competitor-screen';

export class StartScreen {
    render() {
        document.getElementById('app').innerHTML = `<div class="welcome-screen">
            <div class="welcome-screen__inner">
                <h1>Round Tetris</h1>
                <h2>Choose type of the game:</h2>
                <button id="single">Single</button> 
                <button id="battle">Battle</button> 
                <h2>Rules:</h2>
                <p>Figuress fall from different sides to the center. Use arrows to move figures. Use 'Space' to rotate them. </p>
                <p>If you choose battle, you will play against a random player.</p>
            </div>
        </div>`;

        this.bind();
    }

    bind() {
        document.querySelector('#single').addEventListener('click', () => {
            document.getElementById('app').innerHTML = '';
            new Game({single: true});
        });
        document.querySelector('#battle').addEventListener('click', () => {
            document.getElementById('app').innerHTML = '';
            new Game({single: false});
            const mockData = { squaresQtyHorizontal: 30, squaresQtyVertical: 50 };
            new CompetitorScreen(mockData);
        });
    }
}