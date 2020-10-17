import Game from './game';
import Battle from './battle';
import Calculator from './calculator';

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
            // TODO: memory leak
            document.getElementById('app').innerHTML = '';
            const calculator = new Calculator({single: true});
            new Game({
                single: true,
                squaresQtyVertical: calculator.squaresQtyVertical,
                squaresQtyHorizontal: calculator.squaresQtyHorizontal,
            });
        });
        document.querySelector('#battle').addEventListener('click', () => {
            new Battle(this);
        });
    }
}