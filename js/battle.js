import Game from './game';
import CompetitorScreen from './competitor-screen';
import Calculator from './calculator';

export default class Battle {
    constructor(startScreen) {
        this._startScreen = startScreen;
        this.sendRequest = this.sendRequest.bind(this);
        this.messageHandler = this.messageHandler.bind(this);
        this.render();
    }

    render() {
        this.welcomeScreenInner = document.querySelector('.welcome-screen__inner');
        this.welcomeScreenInner.innerHTML = 
        `<h2>Enter your nickname</h2>
        <form class="nickname-form">
            <input name="nickname" class="nickname-form__input" required>
            <button>Submit</button> 
        </form>`;
        this.welcomeScreenInner.querySelector('.nickname-form').addEventListener('submit', this.sendRequest);
    }

    sendRequest() {
        this.playerNickname = this.welcomeScreenInner.querySelector('.nickname-form__input').value;
        // TODO: add back button
        this.welcomeScreenInner.innerHTML = `
        <p class="welcome-screen__back"><a href="#" class="back-to-home link"><< Back</a></p>
        <h2>Please, whait while we find a competitor for you</h2>
        <img src="/img/loader.gif">`;

        this.welcomeScreenInner.querySelector('.back-to-home').addEventListener('click', (e) => {
            e.preventDefault();
            // TODO: close socket
            this._startScreen.render();
        });
        
        this.calculator = new Calculator({single: false});

        const initializationSocket = new WebSocket('ws://localhost:8888');
        initializationSocket.onopen = () => {
            initializationSocket.send(JSON.stringify({
                newPlayer: {
                    squaresQtyVertical: this.calculator.squaresQtyVertical,
                    squaresQtyHorizontal: this.calculator.squaresQtyHorizontal,
                    nickname: this.playerNickname,
                }
            }));
        };

        initializationSocket.onmessage = this.messageHandler;
    }

    messageHandler(event) {
        const data = JSON.parse(event.data);
        this.roomSocket = new WebSocket(data.server);
        this.roomSocket.onopen = () => {
            this.roomSocket.send(JSON.stringify({ newPlayer: { roomId: data.roomId }}));
        };
        if (data.competitor) {
            this.initCompetitor(data.competitor);
        }
    }

    initCompetitor(competitorData) {
        document.getElementById('app').innerHTML = '';
        new Game({
            single: false,
            squaresQtyVertical: this.calculator.squaresQtyVertical,
            squaresQtyHorizontal: this.calculator.squaresQtyHorizontal,
            nickname: this.playerNickname,
            socket: this.roomSocket
        });
        const competitorScreen = new CompetitorScreen(competitorData, this.roomSocket);
    }
}