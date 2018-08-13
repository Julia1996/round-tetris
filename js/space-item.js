import { getRandomElem, getRandom } from './utils';

class SpaceItem {
    constructor(context, { width, height }) {
        this._context = context;
        this.height = getRandom(40, 100);
        this.width = getRandom(40, 100);

        this.x = getRandom(0, width)
        this.y = getRandom(0, height);

        this.image = new Image();
        this.image.src = getRandomElem([
            'https://cdn.bulbagarden.net/upload/thumb/e/e2/568Trubbish.png/250px-568Trubbish.png',
            'https://assets.pokemon.com/assets/cms2/img/pokedex/full/211.png',
            'http://icons.iconarchive.com/icons/goodstuff-no-nonsense/free-space/1024/alien-ship-icon.png',
            'https://cdn.iconscout.com/public/images/icon/premium/png-512/meteorite-fireball-exploration-science-globe-space-nature-35afd7f7bb7925ba-512x512.png',
            'https://png.icons8.com/color/1600/paper-waste.png'
        ]);

        this.image.onload = () => {
            this.render();

            const random = Math.random();
            const random2 = Math.random();

            const speed = getRandom(1, 3);
            const xVal = random > 0.5 ? speed : -speed;
            const yVal = random2 > 0.5 ? speed : -speed;

            this.interval = setInterval(() => {

                this.x += xVal;
                this.y += yVal;
    
                this.render();
            }, 10);
        }
    }

    render() {
        const { x, y, width, height, image } = this;
        this._context.clearRect(x - width / 2, y - height / 2, width * 2, height * 2);
        this._context.drawImage(image, x, y, width, height);
    }


}


export default SpaceItem;
