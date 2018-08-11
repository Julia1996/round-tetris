import GameScreen from './game-screen';
import Figure from './figure';

const SQUARE_SIZE = 20;

export default class Game {
  constructor() {
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;

    const squaresQtyHorizontal = Math.floor(clientWidth / SQUARE_SIZE);
    const squaresQtyVertical = Math.floor(clientHeight / SQUARE_SIZE);

    const horizontalMiddle = Math.round(squaresQtyHorizontal / 2);
    const verticalMiddle = Math.round(squaresQtyVertical / 2);

    this.screen = new GameScreen({ squaresQtyHorizontal, squaresQtyVertical });
    this.screen.fillSquare({ col:  horizontalMiddle, row: verticalMiddle});
  }

  start() {
    const figure = new Figure({ screen: this.screen });
    figure.createCoordinates({ horizontalMiddle, verticalMiddle, squaresQtyHorizontal, squaresQtyVertical });
  }
}
