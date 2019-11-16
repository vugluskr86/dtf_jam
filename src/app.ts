import { Application, Loader } from 'pixi.js';
import { Character } from '@app/character.class';
class Game {
  private app: Application;
  private loader: Loader;

  constructor() {
    // instantiate app
    this.app = new Application({
      backgroundColor: 0x1099bb, // light blue
      height: 600,
      width: 800
    });

    this.loader = new Loader();

    // create view in DOM
    document.body.appendChild(this.app.view);

    // preload needed assets
    this.loader.add('samir', '/assets/img/hero.png');

    // then launch app
    this.loader.load(this.setup.bind(this));
  }

  private setup(): void {
    // append hero
    const hero = new Character(this.loader.resources['samir'].texture);
    const heroSprite = hero.sprite;
    this.app.stage.addChild(heroSprite);
    heroSprite.y = 300;

    //  animate hero
    let moveLeft = true;
    this.app.ticker.add(() => {
      const speed = 2;
      if (heroSprite.x < this.app.view.width && moveLeft) {
        heroSprite.x += speed;
      } else {
        heroSprite.x -= speed;
        moveLeft = heroSprite.x <= 0;
      }
    });
  }
}

/* tslint:disable */
new Game();
/* tslint:enable */
