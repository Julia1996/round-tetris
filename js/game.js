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
  constructor(options) {
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    this.app = document.getElementById('app');

    if (options.single) {
      this._squaresQtyHorizontal = Math.floor(clientWidth / SQUARE_SIZE);
      this.app.classList.add('single');
      this.screenContainer = this.app;
    } else {
      this._squaresQtyHorizontal = Math.floor(clientWidth / 2 / SQUARE_SIZE);
      this.app.classList.add('multiple');
      this.screenContainer = document.createElement('div');
      this.screenContainer.classList.add('main-screen');
      this.app.appendChild(this.screenContainer);
    }
    this._squaresQtyVertical = Math.floor(clientHeight / SQUARE_SIZE);

    this._horizontalMiddle = Math.round(this._squaresQtyHorizontal / 2);
    this._verticalMiddle = Math.round(this._squaresQtyVertical / 2);

    this.figuresCount = 0;

    console.log(this._squaresQtyHorizontal);
    console.log(this._squaresQtyVertical);
    this.screen = new GameScreen({
      squaresQtyHorizontal: this._squaresQtyHorizontal,
      squaresQtyVertical: this._squaresQtyVertical,
      squareSize: SQUARE_SIZE,
      container: this.screenContainer
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

  deleteFilledRows() {
    let quantityOfRows = Math.max(this._earthCoordinates.xStart - 1, this._earthCoordinates.yStart - 1);
    for (let k = 1; k < quantityOfRows; k++) {
      let cleared;
      do {
        const points = {
          xStart: this._earthCoordinates.xStart - k,
          yStart: this._earthCoordinates.yStart - k,
          xEnd: this._earthCoordinates.xEnd + k,
          yEnd: this._earthCoordinates.yEnd + k
        };
        cleared = this._clearRowIfFilled(points);
        if (cleared) {
          setTimeout(() => this._fallToEmptyRow(points, quantityOfRows), 1000);
        }
      } while (cleared);
    }
  }

  _clearRowIfFilled(points) {
    for (let i = points.xStart; i < points.xEnd; i++) {
      if (!this.screen.isSquareEngaged({ col: i, row: points.yStart })) return false;
      if (!this.screen.isSquareEngaged({ col: i, row: points.yEnd - 1 })) return false;
    }

    for (let j = points.yStart + 1; j < points.yEnd - 1; j++) {
      if (!this.screen.isSquareEngaged({ col: points.xStart, row: j })) return false;
      if (!this.screen.isSquareEngaged({ col: points.xEnd - 1, row: j })) return false;
    }

    // we will rich this place if row filled, then clear it
    for (let i = points.xStart; i < points.xEnd; i++) {
      this.screen.cleanSquare({ col: i, row: points.yStart });
      this.screen.cleanSquare({ col: i, row: points.yEnd - 1 });
    }

    for (let j = points.yStart + 1; j < points.yEnd - 1; j++) {
      this.screen.cleanSquare({ col: points.xStart, row: j });
      this.screen.cleanSquare({ col: points.xEnd - 1, row: j });
    }
    return true;
  }

  _fallToEmptyRow(points, quantityOfRows) {
    for (let r = 0; r < quantityOfRows; r++) {
      for (let i = points.xStart; i < points.xEnd; i++) {
        // top falls
        // copy row above
        if (this.screen.isSquareEngaged({col: i, row: points.yStart - (r + 1)})) {
          this.screen.fillSquare({col: i, row: points.yStart - r});
        }
        // clean that row
        this.screen.cleanSquare({col: i, row: points.yStart - (r + 1)});

        // bottom falls
        // copy row above
        if (this.screen.isSquareEngaged({col: i, row: points.yEnd - 1 + (r + 1)})) {
          this.screen.fillSquare({col: i, row: points.yEnd - 1 + r});
        }
        // clean that row
        this.screen.cleanSquare({col: i, row: points.yEnd - 1 + (r + 1)});
      }

      for (let j = points.yStart + 1; j < points.yEnd - 1; j++) {
        // left falls
        // copy row above
        if (this.screen.isSquareEngaged({ col: points.xStart - (r + 1), row: j })) {
          this.screen.fillSquare({ col: points.xStart - r, row: j });
        }
        // clean that row
        this.screen.cleanSquare({ col: points.xStart - (r + 1), row: j });

        // rigth falls
        if (this.screen.isSquareEngaged({ col: points.xEnd - 1 + (r + 1), row: j })) {
          this.screen.fillSquare({ col: points.xEnd - 1 + r, row: j })
        }
        // copy row above
        this.screen.cleanSquare({ col: points.xEnd - 1 + (r + 1), row: j });
      }
    }
  }
}
