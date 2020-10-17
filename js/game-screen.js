import SpaceItem from './space-item';
import { getRandom, getRandomElem } from './utils';
import config from './config';


export default class GameScreen {
  constructor({ squaresQtyHorizontal, squaresQtyVertical, squareSize, container, socket }) {
    this._canvas = document.createElement('canvas');
    this._canvas2 = document.createElement('canvas');
    this._socket = socket;

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

    container.appendChild(this._canvas);
    container.appendChild(this._canvas2);

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
    if (this._cellsEngaged[col]) { // such column can not exist if a new figure is started to appear from the right
      this._context.drawImage(this._square, col * this._squareSize, row * this._squareSize);
      this._cellsEngaged[col][row] = true;
      if (this._socket) {
        this._socket.send(JSON.stringify({points: [{col, row, engaged: true}]}));
      }
    }
  }

  cleanSquare({ col, row }) {
    if (this._cellsEngaged[col]) { // such column can not exist if a new figure is started to appear from the right
      this._context.clearRect(col * this._squareSize, row * this._squareSize, this._squareSize, this._squareSize);
      this._cellsEngaged[col][row] = false;
      if (this._socket) {
        this._socket.send(JSON.stringify({points: [{row, col, engaged: false}]}));
      }
    }
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
      const earthSizePx = this._squareSize * config.EARTH_SIZE;
      this._context.drawImage(this._earth, xStart * this._squareSize, yStart * this._squareSize, earthSizePx, earthSizePx);   
    };
  }

  drowNickname(nickname) {
    this._context.font = "50px Comic Sans MS";
    this._context.fillStyle = "orange";
    this._context.fillText(nickname, 50, 50, 260);
  }

  figuresCount(count) {
    this._context.font = "35px Comic Sans MS";
    this._context.fillStyle = "orange";

    this._context.clearRect(50, 70, 110, 50);
    this._context.fillText(`Figures count: ${count}`, 50, 100, 100, 100);
  }

  clashWithEarth({ col, row }) {
    return col >= this._earthCoords.xStart && col < this._earthCoords.xEnd && row >= this._earthCoords.yStart && row < this._earthCoords.yEnd;
  }
}
