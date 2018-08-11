import * as utils from './utils';
const APPEARANCE_VARIANTS = ['top', 'left', 'right', 'bottom'];
const SHAPE = ['long', 'square', 'pyramid', 'hook'];

export default class Figure {
  constructor({ screen }) {
    this._screen = screen;
    this._placeToAppear = utils.getRandomElem(APPEARANCE_VARIANTS);
    this._shape = utils.getRandomElem(SHAPE);

    this._timerId = setInterval(() => {})
  }

  createCoordinates({ horizontalMiddle, verticalMiddle, squaresQtyHorizontal, squaresQtyVertical }) {
    switch (this._shape) {
      case 'long':
        this._coordinates = [{ x: 0, y: 0 }, { x: 1, y: 0 }, {x: 2, y: 0}, {x: 3, y: 0}];
        break;
      case 'square':
        this._coordinates = [{ x: 0, y: 0 }, { x: 1, y: 0 }, {x: 0, y: 1}, {x: 1, y: 1}];
        break;
      case 'pyramid':
        this._coordinates = [{ x: 1, y: 0 }, { x: 0, y: 1 }, {x: 1, y: 1}, {x: 2, y: 1}];
        break;
      case 'hook':
        this._coordinates = [{ x: 0, y: 0 }, { x: 1, y: 0 }, {x: 2, y: 0}, {x: 2, y: 1}];
        break;
      default:
        throw new Error('Unknown shape');
    }

    switch (this._placeToAppear) {
      case 'top':
        this._coordinates.forEach(point => point.x += horizontalMiddle);
        break;
      case 'left':
        this._coordinates.forEach(point => point.y += verticalMiddle);
        break;
      case 'right':
        this._coordinates.forEach(point => {
          point.x += squaresQtyHorizontal;
          point.y += verticalMiddle;
        });
        break;
      case 'bottom':
        this._coordinates.forEach(point => {
          point.x += horizontalMiddle;
          point.y += squaresQtyVertical;
        });
        break;
      default:
        throw new Error('Unknown appearance');
    }
  }
}
