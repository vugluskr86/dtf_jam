import { Application, Loader, Texture } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Character } from './app/entities/Character';
import { IRoomViewSettings, Room } from './app/entities/Room';
import { RoomModel, eRoomColor } from '@models/Room';
import { Hud } from '@app/hud/Hud';
import { Level } from '@models/Level';
import './app/styles';
import { ResourcesShared } from '@app/ResourcesShared';
import { ICharacterModel } from '@models/Character';
import { eItemTypes } from '@models/Item';

class Game {
  private app: Application;
  private loader: Loader;
  private viewport: Viewport;
  private hud: Hud;
  private roomViewSettings: IRoomViewSettings;
  private character: Character;
  private level: Level;
  private characterModel: ICharacterModel;

  constructor() {
    this.level = new Level();
    this.level.build();

    this.app = new Application({
      backgroundColor: 0x1d1d1d,
      height: 720,
      width: 1280,
    });
    document.body.appendChild(this.app.view);

    this.loader = Loader.shared;

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
    this.loader.add('slot_vehumet', '/assets/img/slot_vehumet.png');
    this.loader.add('items', '/assets/data/items.json');
    this.loader.add('actors', '/assets/data/actors.json');
    // this.loader.add('data_rooms', '/assets/data/rooms.json');

    const roomColors = Object.values(eRoomColor);
    for (const colorIndex in roomColors) {
      if (roomColors[colorIndex]) {
        const colorName = roomColors[colorIndex];
        this.loader.add(`room_${colorName}`, `/assets/img/rooms/${colorName}.png`);
      }
    }

    this.loader.once('complete', () => {
      this.onLoadFirstStep();
    });

    // then launch app
    this.loader.load();

    this.roomViewSettings = {
      paddingWidth: 10,
      paddngHeight: 10,
    };
  }

  private onLoadFirstStep(): void {
    this.loadAssets('actors', 'ceil');
    this.loadAssets('actors', 'floor');
    this.loadAssets('actors', 'wall');
    this.loadAssets('actors', 'monsters');

    this.loadAssets('items', 'treasures');
    this.loadAssets('items', 'potions');
    this.loadAssets('items', 'rewards');

    this.loader.once('complete', () => {
      this.setup();
    });

    this.loader.load();
  }

  private loadAssets(assetKey: string, assetSubKey: string): void {
    const actors: any = this.loader.resources[assetKey].data;
    const list: any = actors[assetSubKey];
    list.forEach((res: any) => {
      const key: string = `${assetKey}_${assetSubKey}_${res.name}`;
      ResourcesShared.add(assetKey, assetSubKey, Object.assign(res, { key }));
      this.loader.add(key, `/assets/img/${assetKey}/${assetSubKey}/${res.name}.png`);
    });
  }

  private setup(): void {
    this.setupRooms();
    this.setupCharacter();
    this.setupHUD();

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

    this.hud.update(this.characterModel);
  }

  private setupCharacter(): void {
    // append hero
    this.character = new Character(this.loader.resources['hero'].texture);
    this.viewport.addChild(this.character);

    this.characterModel = {
      hp: 0.2,
      hunger: 0.8,
      inventoty: [eItemTypes.POTION_ANTI_STRESS, null, null, null],
      maxHp: 0,
      mind: 0.5,
    };

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
