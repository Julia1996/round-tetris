import SpaceItem from './space-item';
import { getRandom, getRandomElem } from './utils';


export default class GameScreen {
  constructor({ squaresQtyHorizontal, squaresQtyVertical, squareSize }) {
    this._canvas = document.createElement('canvas');
    this._canvas2 = document.createElement('canvas');

    this._squareSize = squareSize;

    this.height = squaresQtyVertical * this._squareSize;
    this.width = squaresQtyHorizontal * this._squareSize; 

    this._canvas.width = this.width;
    this._canvas.height = this.height;

    this._canvas2.width = this.width;
    this._canvas2.height = this.height;

    this._context = this._canvas.getContext('2d');
    this._context2 = this._canvas2.getContext('2d');

    this._canvas.style.zIndex = 1;
    this._canvas2.style.zIndex = 2;

    const app = document.getElementById('app');

    app.appendChild(this._canvas);
    app.appendChild(this._canvas2);

    this._square = new Image();
    this._square.width = this._squareSize;
    this._square.height = this._squareSize;
    this._square.onload = () => this._squareLoaded = true;
    this._square.src = '../img/square.jpg';

    this._cellsEngaged = [];
    for (let i = 0; i < squaresQtyHorizontal - 1; i++) {
      this._cellsEngaged.push([]);
    }
    
    const spaceItems = [];
    // TODO: возможно переместить это в Game
    spaceItems.push(new SpaceItem(this._context2, { width: this.width, height: this.height }));
    
    setInterval(() => {

      spaceItems.push(new SpaceItem(this._context2, { width: this.width, height: this.height }));

      spaceItems.forEach((item, index) => {
        if (item.x <= 0 || item.x > window.innerWidth || item.y <= 0 || item.y > window.innerHeight) {
          clearInterval(item.interval);
          spaceItems.splice(index, 1);
        }

      });
      
    }, getRandom(4500, 6000));
  }

  fillSquare({ col, row }) {
    if (!this._squareLoaded) {
      setTimeout(() => this.fillSquare({ col, row }), 100);
      return;
    }
    this._context.drawImage(this._square, col * this._squareSize, row * this._squareSize);
    this._cellsEngaged[col][row] = true;
  }

  cleanSquare({ col, row }) {
    this._context.clearRect(col * this._squareSize, row * this._squareSize, this._squareSize, this._squareSize);
    this._cellsEngaged[col][row] = false;
  }

  isSquareEngaged({ col, row }) {
    return this._cellsEngaged[col][row];
  }

  drowEarth(earthCoords, earthSize) {
    this._earthCoords = earthCoords;
    
    const { xEnd, xStart, yEnd, yStart} = earthCoords;
    this._earthCenter = {
      x: (xEnd + xStart) / 2,
      y: (yEnd + yStart) / 2,
    }

    this._earth = new Image();
    this._earth.width = this._earthSize * this._squareSize;
    this._earth.height = this._earthSize * this._squareSize;
    this._earth.src = '../img/earth.png';
    
    this._earth.onload = () => {
      // this._context.beginPath();
      // this._context.lineWidth="3";
      // this._context.strokeStyle="orange";
      
      // this._context.rect(earthCoords.xStart * this._squareSize, earthCoords.yStart * this._squareSize, 160, 160);
      // this._context.stroke();
      this._context.drawImage(this._earth, earthCoords.xStart * this._squareSize, earthCoords.yStart * this._squareSize, 160, 160);   
    };
  }

  drowTitle(earthCoords) {
    this._context.font = "60px Comic Sans MS";
    this._context.fillStyle = "orange";
    this._context.textAlign = "center";
    this._context.fillText("Round tetris", earthCoords.xStart * this._squareSize + 100, 100, 260);

    setTimeout(() => {
      this._context.clearRect(earthCoords.xStart * this._squareSize - 100, 0, 500, 200);
    }, 2000);
  }

  figuresCount(count) {
    this._context.font = "35px Comic Sans MS";
    this._context.fillStyle = "orange";
    this._context.textAlign = "center";

    this._context.clearRect(window.innerWidth - 200, 0, 300, 300);
    this._context.fillText(`Figures count: ${count}`, window.innerWidth - 100, 100, 100, 100);
  }

  clashWithEarth({ col, row }) {
    return col >= this._earthCoords.xStart && col < this._earthCoords.xEnd && row >= this._earthCoords.yStart && row < this._earthCoords.yEnd;
  }
}
