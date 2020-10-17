import config from './config';

export default class Calculator {
    constructor(options) {
        const clientWidth = document.documentElement.clientWidth;
        const clientHeight = document.documentElement.clientHeight;

        this.squaresQtyVertical = Math.floor(clientHeight / config.SQUARE_SIZE);

        if (options.single) {
            this.squaresQtyHorizontal = Math.floor(clientWidth / config.SQUARE_SIZE);
        } else {
            this.squaresQtyHorizontal = Math.floor(clientWidth / 2 / config.SQUARE_SIZE);
        }
    }
}