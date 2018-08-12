export default class GameScreen {
  constructor({ squaresQtyHorizontal, squaresQtyVertical, squareSize }) {
    this._canvas = document.createElement('canvas');
    this._squareSize = squareSize;
    this._canvas.width = squaresQtyHorizontal * this._squareSize;
    this._canvas.height = squaresQtyVertical * this._squareSize;
    this._context = this._canvas.getContext('2d');
    document.body.appendChild(this._canvas);

    this._square = new Image();
    this._square.width = this._squareSize;
    this._square.height = this._squareSize;
    this._square.onload = () => this._squareLoaded = true;
    this._square.src = '../img/square.jpg';

    this._cellsEngaged = [];
    for (let i = 0; i < squaresQtyHorizontal - 1; i++) {
      this._cellsEngaged.push([]);
    }
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
      this._context.drawImage(this._earth, earthCoords.xStart * this._squareSize, earthCoords.yStart * this._squareSize);
    };
  }

  clashWithEarth({ col, row }) {
    return col >= this._earthCoords.xStart && col < this._earthCoords.xEnd && row >= this._earthCoords.yStart && row < this._earthCoords.yEnd;
  }
}
