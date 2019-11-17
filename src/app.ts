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
import { IDoorModel } from '@models/Door';
import { Door } from '@app/entities/Door';

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
    this.loader.add('hero', 'assets/img/hero.png');
    this.loader.add('slot_vehumet', 'assets/img/slot_vehumet.png');
    this.loader.add('closed_door', 'assets/img/closed_door.png');
    this.loader.add('open_door', 'assets/img/open_door.png');
    this.loader.add('stone_stairs_down', 'assets/img/stone_stairs_down.png');
    this.loader.add('items', 'assets/data/items.json');
    this.loader.add('actors', 'assets/data/actors.json');

    const roomColors = Object.values(eRoomColor);
    for (const colorIndex in roomColors) {
      if (roomColors[colorIndex]) {
        const colorName = roomColors[colorIndex];
        this.loader.add(`room_${colorName}`, `assets/img/rooms/${colorName}.png`);
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
      this.loader.add(key, `assets/img/${assetKey}/${assetSubKey}/${res.name}.png`);
    });
  }

  private setup(): void {
    this.setupHUD();
    this.setupCharacter();
    this.setupRooms();
  }

  private setupHUD(): void {
    this.hud = new Hud();
    this.app.stage.addChild(this.hud);
  }

  private setupCharacter(): void {
    this.character = new Character(this.loader.resources['hero'].texture);

    this.characterModel = {
      hp: 100,
      hunger: 100,
      maxHunger: 100,
      inventoty: [eItemTypes.POTION_ANTI_STRESS, null, null, null],
      maxHp: 100,
      mind: 200,
      maxMind: 200,
      moveCount: 0,
      coins: 0,
    };

    this.level = new Level(this.characterModel);
    this.level.build();

    this.level.on('move', (model: RoomModel) => {
      this.moveCharaterToRoom(model);
      this.hud.update(this.characterModel);
    });

    this.level.on('forceUpdate', () => {
      this.hud.update(this.characterModel);
    });

    this.level.moveCharacter(this.level.roomsList[0]);
    this.hud.update(this.characterModel);
  }

  private setupRooms(): void {
    this.level.roomsList.forEach((room: RoomModel) => {
      this.spawnRoom(room);
    });

    this.level.doorsList.forEach((door: IDoorModel) => {
      this.spawnDoor(door);
    });

    // FIXME: Zorder
    this.viewport.addChild(this.character);
  }

  private spawnRoom(model: RoomModel): Room {
    const resourceName: string = model.prototype.color;
    const texture: Texture = this.loader.resources[`room_${resourceName}`].texture;
    const room = new Room(texture, model, this.level);
    this.viewport.addChild(room);
    room.x = model.x * (Room.SPRITE_WIDTH + this.roomViewSettings.paddingWidth);
    room.y = model.y * (Room.SPRITE_HIGHT + this.roomViewSettings.paddngHeight);
    return room;
  }

  private spawnDoor(model: IDoorModel): Door {
    let door: Door = new Door(model);

    if (model.left && model.right) {
      door = new Door(model);
      door.x = model.right.x * (Room.SPRITE_WIDTH + this.roomViewSettings.paddingWidth) - 4;
      door.y =
        model.right.y * (Room.SPRITE_HIGHT + this.roomViewSettings.paddngHeight) +
        Room.SPRITE_HIGHT / 2 +
        door.height / 2;
    } else if (model.top && model.bottom) {
      door = new Door(model);
      door.x =
        model.bottom.x * (Room.SPRITE_WIDTH + this.roomViewSettings.paddingWidth) +
        Room.SPRITE_WIDTH / 2;
      door.y = model.bottom.y * (Room.SPRITE_HIGHT + this.roomViewSettings.paddngHeight) - 8;
    }

    if (door) {
      this.viewport.addChild(door);
      return door;
    }
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
