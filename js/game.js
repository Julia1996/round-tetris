import GameScreen from './game-screen';
import Figure from './figure';
import config from './config';

export default class Game {
  constructor(options) {
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    this.app = document.getElementById('app');

    if (options.single) {
      this._squaresQtyHorizontal = Math.floor(clientWidth / config.SQUARE_SIZE);
      this.app.classList.add('single');
      this.screenContainer = this.app;
    } else {
      this._squaresQtyHorizontal = Math.floor(clientWidth / 2 / config.SQUARE_SIZE);
      this.app.classList.add('multiple');
      this.screenContainer = document.createElement('div');
      this.screenContainer.classList.add('main-screen');
      this.app.appendChild(this.screenContainer);
    }
    this._squaresQtyVertical = Math.floor(clientHeight / config.SQUARE_SIZE);

    this._horizontalMiddle = Math.round(this._squaresQtyHorizontal / 2);
    this._verticalMiddle = Math.round(this._squaresQtyVertical / 2);

    this.figuresCount = 0;

    this.screen = new GameScreen({
      squaresQtyHorizontal: this._squaresQtyHorizontal,
      squaresQtyVertical: this._squaresQtyVertical,
      squareSize: config.SQUARE_SIZE,
      container: this.screenContainer
    });

    this._earthCoordinates = {
      xStart: this._horizontalMiddle - config.EARTH_SIZE / 2,
      yStart: this._verticalMiddle - config.EARTH_SIZE / 2,
      xEnd: this._horizontalMiddle + config.EARTH_SIZE / 2,
      yEnd: this._verticalMiddle + config.EARTH_SIZE / 2
    };

    this.screen.drowEarth(this._earthCoordinates, config.EARTH_SIZE);
    this.screen.drowTitle(this._earthCoordinates);

    document.addEventListener('keydown', event => {
      switch (event.keyCode) {
        case config.LEFT_KEY_CODE:
          this.figure.move('left');
          break;
        case config.TOP_KEY_CODE:
          this.figure.move('top');
          break;
        case config.RIGTH_KEY_CODE:
          this.figure.move('right');
          break;
        case config.BOTTOM_KEY_CODE:
          this.figure.move('bottom');
          break;
        case config.SPACE_KEY_CODE:
          this.figure.rotate();
          break;
      }
    });

    setTimeout(() => {
      this.addFigure();
    }, 2000);
  }

  addFigure() {
    this.figure = new Figure({
      screen: this.screen,
      horizontalMiddle: this._horizontalMiddle,
      verticalMiddle: this._verticalMiddle,
      squaresQtyHorizontal: this._squaresQtyHorizontal,
      squaresQtyVertical: this._squaresQtyVertical
    });

    this.figuresCount += 1;
    this.screen.figuresCount(this.figuresCount);
    
    this.figure.createCoordinates();
    this.figure.appendToGame();
    this.figure.onReachCenter = () => {
      this.deleteFilledRows();
      this.addFigure();
    };
  }

  deleteFilledRows() {}
}
