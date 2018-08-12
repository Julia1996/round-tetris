import * as utils from './utils';
const APPEARANCE_VARIANTS = ['top', 'left', 'right', 'bottom'];
const SHAPE = ['long', 'square', 'pyramid', 'hook'];

export default class Figure {
  constructor({ screen, horizontalMiddle, verticalMiddle, squaresQtyHorizontal, squaresQtyVertical }) {
    this._screen = screen;
    this._horizontalMiddle = horizontalMiddle;
    this._verticalMiddle = verticalMiddle;
    this._squaresQtyHorizontal = squaresQtyHorizontal;
    this._squaresQtyVertical = squaresQtyVertical;
    this._placeToAppear = utils.getRandomElem(APPEARANCE_VARIANTS);
    this._shape = utils.getRandomElem(SHAPE);

    this._timerId = setInterval(() => {});
  }

  onReachCenter() {}

  createCoordinates() {
    switch (this._shape) {
      case 'long':
        this._coordinatesVariants = [
          [{ x: 0, y: 1 }, { x: 1, y: 1 }, {x: 2, y: 1}, {x: 3, y: 1}],
          [{ x: 1, y: 0 }, { x: 1, y: 1 }, {x: 1, y: 2}, {x: 1, y: 3}],
          [{ x: 0, y: 1 }, { x: 1, y: 1 }, {x: 2, y: 1}, {x: 3, y: 1}],
          [{ x: 1, y: 0 }, { x: 1, y: 1 }, {x: 1, y: 2}, {x: 1, y: 3}]
        ];
        break;
      case 'square':
        this._coordinatesVariants = [
          [{ x: 0, y: 0 }, { x: 1, y: 0 }, {x: 0, y: 1}, {x: 1, y: 1}],
          [{ x: 0, y: 0 }, { x: 1, y: 0 }, {x: 0, y: 1}, {x: 1, y: 1}],
          [{ x: 0, y: 0 }, { x: 1, y: 0 }, {x: 0, y: 1}, {x: 1, y: 1}],
          [{ x: 0, y: 0 }, { x: 1, y: 0 }, {x: 0, y: 1}, {x: 1, y: 1}]
        ];
        break;
      case 'pyramid':
        this._coordinatesVariants = [
          [{ x: 1, y: 0 }, { x: 0, y: 1 }, {x: 1, y: 1}, {x: 2, y: 1}],
          [{ x: 0, y: 0 }, { x: 0, y: 1 }, {x: 0, y: 2}, {x: 1, y: 1}],
          [{ x: 1, y: 1 }, { x: 0, y: 0 }, {x: 1, y: 0}, {x: 2, y: 0}],
          [{ x: 1, y: 0 }, { x: 1, y: 1 }, {x: 1, y: 2}, {x: 0, y: 1}]
        ];
        break;
      case 'hook':
        this._coordinatesVariants = [
          [{ x: 0, y: 0 }, { x: 0, y: 1 }, {x: 1, y: 1}, {x: 2, y: 1}],
          [{ x: 0, y: 0 }, { x: 0, y: 1 }, {x: 0, y: 2}, {x: 1, y: 0}],
          [{ x: 2, y: 1 }, { x: 0, y: 0 }, {x: 1, y: 0}, {x: 2, y: 0}],
          [{ x: 1, y: 0 }, { x: 1, y: 1 }, {x: 1, y: 2}, {x: 0, y: 2}]
        ];
        break;
      default:
        throw new Error(`Unknown shape ${this._shape}`);
    }
    this._currentVariant = utils.getRandomElem([0, 1, 2, 3]);
    this._coordinates = this._coordinatesVariants[this._currentVariant].map(point => ({ x: point.x, y: point.y }));

    switch (this._placeToAppear) {
      case 'top':
        this._coordinates.forEach(point => {
          point.x += this._horizontalMiddle;
          point.y += 1;
        });
        break;
      case 'left':
        this._coordinates.forEach(point => {
          point.x += 1;
          point.y += this._verticalMiddle;
        });
        break;
      case 'right':
        this._coordinates.forEach(point => {
          point.x += this._squaresQtyHorizontal - 4;
          point.y += this._verticalMiddle - 2;
        });
        break;
      case 'bottom':
        this._coordinates.forEach(point => {
          point.x += this._horizontalMiddle;
          point.y += this._squaresQtyVertical - 3;
        });
        break;
      default:
        throw new Error('Unknown appearance');
    }
  }

  appendToGame() {
    this._coordinates.forEach(point => {
      this._screen.fillSquare({ col: point.x, row: point.y });
    });
  }

  move(direction) {
    const newCoordinates = this._coordinates.map(point => {
      switch (direction) {
        case 'left':
          return { x: point.x - 1, y: point.y};
        case 'top':
          return { x: point.x, y: point.y -1 };
        case 'right':
          return { x: point.x + 1, y: point.y };
        case 'bottom':
          return { x: point.x, y: point.y +1 };
      }
    });

    const result = this._checkNewCoordinates(this._coordinates, newCoordinates);
    if (!result.figureInsideScreen) return;
    if (result.clash) {
      this.onReachCenter();
      return;
    }
    this._updateFigure(newCoordinates);
  }

  rotate() {
    console.log(this._coordinatesVariants);
    let newVariant = this._currentVariant + 1;
    if (newVariant >= 4) newVariant = 0;

    const newCoordinates = this._coordinates.map((point, i) => ({
      x: point.x - this._coordinatesVariants[this._currentVariant][i].x + this._coordinatesVariants[newVariant][i].x,
      y: point.y - this._coordinatesVariants[this._currentVariant][i].y + this._coordinatesVariants[newVariant][i].y
    }));

    const result = this._checkNewCoordinates(this._coordinates, newCoordinates);
    if (!result.figureInsideScreen || result.clash) return;

    this._currentVariant = newVariant;
    this._updateFigure(newCoordinates);
  }

  _checkNewCoordinates(oldCoords, newCoordinates) {
    const figureInsideScreen = newCoordinates.every(
      point => point.x >= 0 && point.y >= 0 && point.x < this._squaresQtyHorizontal && point.y < this._squaresQtyVertical
    );
    if (!figureInsideScreen) return { figureInsideScreen };

    oldCoords.forEach(point => this._screen.cleanSquare({ col: point.x, row: point.y }));
    const clash = newCoordinates.some(
      point => this._screen.isSquareEngaged({ col: point.x, row: point.y }) || this._screen.clashWithEarth({ col: point.x, row: point.y })
    );
    if (clash) {
      oldCoords.forEach(point => this._screen.fillSquare({ col: point.x, row: point.y }));
    }
    return { clash, figureInsideScreen };
  }

  _updateFigure(newCoordinates) {
    this._coordinates = newCoordinates;
    this._coordinates.forEach(point => this._screen.fillSquare({ col: point.x, row: point.y }));
  }
}
