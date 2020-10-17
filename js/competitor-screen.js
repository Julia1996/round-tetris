import GameScreen from './game-screen';
import config from './config';

export default class CompetitorScreen {
    constructor(options, socket) {
        this.app = document.getElementById('app');

        this.competitorSquaresQtyX = options.squaresQtyHorizontal;
        this.competitorSquaresQtyY = options.squaresQtyVertical;

        const clientWidth = document.documentElement.clientWidth;
        const clientHeight = document.documentElement.clientHeight;

        this.mainSquaresQtyX = Math.floor(clientWidth / 2 / config.SQUARE_SIZE);
        this.mainSquaresQtyY = Math.floor(clientHeight / config.SQUARE_SIZE);

        // считаем пропорционально и получаем размер square
        const mainRatio = this.mainSquaresQtyX / this.mainSquaresQtyY;
        const competitorRatio = this.competitorSquaresQtyX / this.competitorSquaresQtyY;

        if (competitorRatio < mainRatio) {
            // ужимаем по вертикали
            this.squareSize = this.mainSquaresQtyY * config.SQUARE_SIZE / this.competitorSquaresQtyY;
        } else {
            // ужимаем по горизонтали
            this.squareSize = this.mainSquaresQtyX * config.SQUARE_SIZE / this.competitorSquaresQtyX;
        }

        this.screenContainer = document.createElement('div');
        this.screenContainer.classList.add('competitor-screen');
        this.app.appendChild(this.screenContainer);

        // append canvas with corresponding styles 
        this.screen = new GameScreen({ 
            squaresQtyHorizontal: this.competitorSquaresQtyX,
            squaresQtyVertical: this.competitorSquaresQtyY,
            squareSize: this.squareSize,
            container: this.screenContainer
        });

        this._horizontalMiddle = Math.round(this.competitorSquaresQtyX / 2);
        this._verticalMiddle = Math.round(this.competitorSquaresQtyY / 2);

        this._earthCoordinates = {
            xStart: this._horizontalMiddle - config.EARTH_SIZE / 2,
            yStart: this._verticalMiddle - config.EARTH_SIZE / 2,
            xEnd: this._horizontalMiddle + config.EARTH_SIZE / 2,
            yEnd: this._verticalMiddle + config.EARTH_SIZE / 2
          };
      
        this.screen.drowEarth(this._earthCoordinates, config.EARTH_SIZE);
        this.screen.drowNickname(options.nickname);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.figuresCount) {
                this.screen.figuresCount(data.figuresCount)
            } else if (data.points){
                data.points.forEach(point => {
                    if (point.engaged) {
                        this.screen.fillSquare({col: point.col, row: point.row});
                    } else {
                        this.screen.cleanSquare({col: point.col, row: point.row});
                    }
                });
            }
        };
    }
}