const SQUARE_SIZE = 20;

export default class GameScreen {
  constructor({ squaresQtyHorizontal, squaresQtyVertical }) {
    this._canvas = document.createElement('canvas');
    this._canvas.width = squaresQtyHorizontal * SQUARE_SIZE;
    this._canvas.height = squaresQtyVertical * SQUARE_SIZE;
    this._context = this._canvas.getContext('2d');
    document.body.appendChild(this._canvas);

    this._square = new Image();
    this._square.width = SQUARE_SIZE;
    this._square.height = SQUARE_SIZE;
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
    this._context.drawImage(this._square, col * SQUARE_SIZE, row * SQUARE_SIZE);
    this._cellsEngaged[col][row] = true;
  }

  cleanSquare({ col, row }) {
    this._context.clearRect(col * SQUARE_SIZE, row * SQUARE_SIZE, col * SQUARE_SIZE + SQUARE_SIZE, row * SQUARE_SIZE + SQUARE_SIZE);
    this._cellsEngaged[col][row] = false;
  }

  isSquareEngaged({ col, row }) {
    return this._cellsEngaged[col][row];
  }
}
