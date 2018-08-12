import GameScreen from './game-screen';
import Figure from './figure';

const SQUARE_SIZE = 20,
  LEFT_KEY_CODE = 37,
  TOP_KEY_CODE = 38,
  RIGTH_KEY_CODE = 39,
  BOTTOM_KEY_CODE = 40,
  SPACE_KEY_CODE = 32,
  EARTH_SIZE = 8;

export default class Game {
  constructor() {
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;

    this._squaresQtyHorizontal = Math.floor(clientWidth / SQUARE_SIZE);
    this._squaresQtyVertical = Math.floor(clientHeight / SQUARE_SIZE);

    this._horizontalMiddle = Math.round(this._squaresQtyHorizontal / 2);
    this._verticalMiddle = Math.round(this._squaresQtyVertical / 2);

    this.figuresCount = 0;

    this.screen = new GameScreen({
      squaresQtyHorizontal: this._squaresQtyHorizontal,
      squaresQtyVertical: this._squaresQtyVertical,
      squareSize: SQUARE_SIZE,
    });

    this._earthCoordinates = {
      xStart: this._horizontalMiddle - EARTH_SIZE / 2,
      yStart: this._verticalMiddle - EARTH_SIZE / 2,
      xEnd: this._horizontalMiddle + EARTH_SIZE / 2,
      yEnd: this._verticalMiddle + EARTH_SIZE / 2
    };

    this.screen.drowEarth(this._earthCoordinates, EARTH_SIZE);
    this.screen.drowTitle(this._earthCoordinates);

    document.addEventListener('keydown', event => {
      switch (event.keyCode) {
        case LEFT_KEY_CODE:
          this.figure.move('left');
          break;
        case TOP_KEY_CODE:
          this.figure.move('top');
          break;
        case RIGTH_KEY_CODE:
          this.figure.move('right');
          break;
        case BOTTOM_KEY_CODE:
          this.figure.move('bottom');
          break;
        case SPACE_KEY_CODE:
          this.figure.rotate();
          break;
      }
    });

    this.addFigure();
  }

  addFigure() {
    this.figure = new Figure({
      screen: this.screen,
      horizontalMiddle: this._horizontalMiddle,
      verticalMiddle: this._verticalMiddle,
      squaresQtyHorizontal: this._squaresQtyHorizontal,
      squaresQtyVertical: this._squaresQtyVertical
    });
    this.figure.createCoordinates();
    this.figure.appendToGame();
    this.figure.onReachCenter = () => {
      this.deleteFilledRows();
      this.addFigure();
    };
  }

  deleteFilledRows() {}
}
