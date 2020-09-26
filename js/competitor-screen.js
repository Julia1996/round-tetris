import GameScreen from './game-screen';
const SQUARE_SIZE = 20;

export default class CompetitorScreen {
    constructor(options) {
        this.competitorSquaresQtyX = options.squaresQtyHorizontal;
        this.competitorSquaresQtyY = options.squaresQtyVertical;

        const clientWidth = document.documentElement.clientWidth;
        const clientHeight = document.documentElement.clientHeight;

        this.mainSquaresQtyX = Math.floor(clientWidth / 2 / SQUARE_SIZE);
        this.mainSquaresQtyY = Math.floor(clientHeight / SQUARE_SIZE);

        // считаем пропорционально и получаем размер square
        const mainRatio = this.mainSquaresQtyX / this.mainSquaresQtyY;
        const competitorRatio = this.competitorSquaresQtyX / this.competitorSquaresQtyY;

        if (competitorRatio < mainRatio) {
            // ужимаем по вертикали
            console.log('ужимаем по вертикали');
            this.squareSize = this.competitorSquaresQtyY * SQUARE_SIZE / this.mainSquaresQtyY;
            console.log(this.competitorSquaresQtyY, SQUARE_SIZE, this.mainSquaresQtyY, this.squareSize);
        } else {
            // ужимаем по горизонтали
            console.log('ужимаем по горизонтали');
            this.squareSize = this.competitorSquaresQtyX * SQUARE_SIZE / this.mainSquaresQtyX;
        }

        // append canvas with corresponding styles 
        new GameScreen({ 
            squaresQtyHorizontal: this.competitorSquaresQtyY,
            squaresQtyVertical: this.competitorSquaresQtyX,
            squareSize: this.squareSize
        });
    }
}