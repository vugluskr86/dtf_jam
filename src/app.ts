import { Application, Loader, Texture } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Character } from './app/entities/Character';
import { IRoomViewSettings, Room } from './app/entities/Room';
import { RoomModel, eRoomColor } from '@models/Room';
import { Hud } from '@app/hud/Hud';
import { Level } from '@models/Level';
import './app/styles';

class Game {
  private app: Application;
  private loader: Loader;
  private viewport: Viewport;
  private hud: Hud;
  private roomViewSettings: IRoomViewSettings;
  private character: Character;
  private level: Level;

  constructor() {
    this.level = new Level();
    this.level.build();

    this.app = new Application({
      backgroundColor: 0x0d0d0d,
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
    this.loader.add('data_items', '/assets/data/items.json');
    this.loader.add('data_actors', '/assets/data/actors.json');
    // this.loader.add('data_rooms', '/assets/data/rooms.json');

    const roomColors = Object.values(eRoomColor);
    for (const colorIndex in roomColors) {
      if (roomColors[colorIndex]) {
        const colorName = roomColors[colorIndex];
        this.loader.add(`room_${colorName}`, `/assets/img/rooms/${colorName}.png`);
      }
    }

    this.loader.once('complete', () => {
      this.setup();
    });

    // then launch app
    this.loader.load(this.setup.bind(this));

    this.roomViewSettings = {
      paddingWidth: 10,
      paddngHeight: 10,
    };
  }

  private setup(): void {
    this.setupRooms();
    this.setupCharacter();
    this.setupHUD();

    console.log(this.loader.resources['data_items'].data);

    /*
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
    */
  }

  private setupHUD(): void {
    // add HUD
    this.hud = new Hud();
    this.app.stage.addChild(this.hud);

    this.hud.update({
      hp: 0.2,
      hunger: 0,
      maxHp: 0,
      mind: 0.5,
    });
  }

  private setupCharacter(): void {
    // append hero
    this.character = new Character(this.loader.resources['hero'].texture);
    this.viewport.addChild(this.character);

    this.level.on('move', (model: RoomModel) => {
      this.moveCharaterToRoom(model);
    });

    this.level.moveCharacter(this.level.roomsList[0]);
  }

  private setupRooms(): void {
    this.level.roomsList.forEach((room: RoomModel) => {
      this.spawnRoom(room);
    });
  }

  private spawnRoom(model: RoomModel): Room {
    const resourceName: string = model.prototype.color;
    const texture: Texture = this.loader.resources[`room_${resourceName}`].texture;
    const room = new Room(texture, model);
    this.viewport.addChild(room);
    room.x = model.x * (Room.SPRITE_WIDTH + this.roomViewSettings.paddingWidth);
    room.y = model.y * (Room.SPRITE_HIGHT + this.roomViewSettings.paddngHeight);
    return room;
  }

  private moveCharaterToRoom(model: RoomModel): void {
    this.character.x =
      model.x * (Room.SPRITE_WIDTH + this.roomViewSettings.paddingWidth) + Room.SPRITE_WIDTH / 2;
    this.character.y =
      model.y * (Room.SPRITE_HIGHT + this.roomViewSettings.paddngHeight) + Room.SPRITE_HIGHT / 1.2;
  }
}

/* tslint:disable */
new Game();
/* tslint:enable */
