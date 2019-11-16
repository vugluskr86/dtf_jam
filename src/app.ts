import { Application, Loader } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Character } from './app/Character';
import { IRoomViewSettings, Room } from './app/Room';
import { IRoomPrototype, eRoomColor, eRoomType } from '@models/Room';
import { getRandomElementOfEnum } from '@app/Utils';
import { Hud } from '@app/hud/Hud';
import { Level } from '@models/Level';

class Game {
  private app: Application;
  private loader: Loader;
  private viewport: Viewport;
  private hud: Hud;
  private roomViewSettings: IRoomViewSettings;

  private level: Level;

  constructor() {
    this.level = new Level();
    this.level.build();

    console.log(this.level);

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

    const roomColors = Object.values(eRoomColor);
    for (const colorIndex in roomColors) {
      if (roomColors[colorIndex]) {
        const colorName = roomColors[colorIndex];
        this.loader.add(`room_${colorName}`, `/assets/img/rooms/${colorName}.png`);
      }
    }

    // then launch app
    this.loader.load(this.setup.bind(this));

    this.roomViewSettings = {
      paddingWidth: 10,
      paddngHeight: 10,
    };
  }

  private setup(): void {
    this.setupRooms();

    // append hero
    const hero = new Character(this.loader.resources['hero'].texture);
    const heroSprite = hero.sprite;
    this.viewport.addChild(heroSprite);
    heroSprite.y = 300;

    // add HUD
    this.hud = new Hud();
    this.app.stage.addChild(this.hud);

    this.hud.update({
      hp: 0.2,
      hunger: 0,
      maxHp: 0,
      mind: 0.5,
    });

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

  private setupRooms(): void {
    this.spawnRoom(
      {
        color: getRandomElementOfEnum(eRoomColor),
        type: eRoomType.REGULAR,
      },
      0,
      0,
    );
  }

  private spawnRoom(prot: IRoomPrototype, x: number, y: number): Room {
    const resourceName: string = prot.color;
    const room = new Room(this.loader.resources[`room_${resourceName}`].texture);
    this.viewport.addChild(room);
    room.x = x * (room.width + this.roomViewSettings.paddingWidth);
    room.y = y * (room.height + this.roomViewSettings.paddngHeight);
    return room;
  }
}

/* tslint:disable */
new Game();
/* tslint:enable */
