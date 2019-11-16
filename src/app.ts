import { Application, Loader } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Character } from '@app/Character';
import { IRoomViewSettings, Room } from '@app/Room';

class Game {
  private app: Application;
  private loader: Loader;
  private viewport: Viewport;

  constructor() {
    this.app = new Application({
      backgroundColor: 0x1099bb,
      height: 720,
      width: 1280,
    });
    document.body.appendChild(this.app.view);

    this.loader = new Loader();

    this.viewport = new Viewport({
      interaction: this.app.renderer.plugins.interaction,
      screenHeight: 720,
      screenWidth: 1280,
      worldHeight: 2000,
      worldWidth: 2000,
    });

    this.app.stage.addChild(this.viewport);

    this.viewport
      .drag()
      .pinch()
      .wheel()
      .decelerate();

    // preload needed assets
    this.loader.add('hero', '/assets/img/hero.png');
    this.loader.add('room', '/assets/img/room_empty.png');

    // then launch app
    this.loader.load(this.setup.bind(this));
  }

  private setup(): void {

    this.setupRooms({
      paddingWidth: 10,
      paddngHeight: 10,
    });

    // append hero
    const hero = new Character(this.loader.resources['hero'].texture);
    const heroSprite = hero.sprite;
    this.viewport.addChild(heroSprite);
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

  private setupRooms(settings: IRoomViewSettings): void {
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        if (Math.random() < 0.5) {
          const room = new Room(this.loader.resources['room'].texture);
          const roomSprite = room.sprite;
          this.viewport.addChild(roomSprite);
          roomSprite.x = x * (roomSprite.width + settings.paddingWidth);
          roomSprite.y = y * (roomSprite.height + settings.paddngHeight);
        }
      }
    }
  }
}

/* tslint:disable */
new Game();
/* tslint:enable */
