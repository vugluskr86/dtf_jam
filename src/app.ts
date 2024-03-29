import './app/styles';
import { Application, Loader, Texture } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Character } from './app/entities/Character';
import { IRoomViewSettings, Room } from './app/entities/Room';
import { RoomModel, eRoomColor } from '@models/Room';
import { Hud } from '@app/hud/Hud';
import { Level } from '@models/Level';
import { ResourcesShared } from '@app/ResourcesShared';
import { ICharacterModel } from '@models/Character';
import { eItemTypes } from '@models/Item';
import { IDoorModel } from '@models/Door';
import { Door } from '@app/entities/Door';
import { InventorySlot } from '@app/hud/InventorySlot';
import * as toastr from 'toastr';

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

    const pEl = document.createElement('p');
    pEl.className = 'readme';

    pEl.innerText =
      // tslint:disable-next-line: max-line-length
      'Пытаясь выбраться из заброшенного подземелья, вы постепенно теряете рассудок. Продержитесь как можно дольше, избегайте монстров и ловушек. Открывайте новые комнаты. Используйте алтари и фонтаны для восстановления своих характеристик. Помните что в некоторых сундука можно найти полезные предметы и даже неплохо на этом заработать. Вы неизбежно умрете. Удачи.';
    document.body.appendChild(pEl);
    document.body.appendChild(this.app.view);

    this.loader = Loader.shared;

    this.viewport = new Viewport({
      interaction: this.app.renderer.plugins.interaction,
      screenHeight: 720,
      screenWidth: 1280,
      worldHeight: 2000,
      worldWidth: 2000,
    });

    this.viewport.sortableChildren = true;

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

    this.hud.on('use', (slot: InventorySlot) => {
      if (this.characterModel.inventoty[slot.slotIndex]) {
        const type: eItemTypes = this.characterModel.inventoty[slot.slotIndex];

        switch (type) {
          case eItemTypes.REWARD_DECK_LEGEND: {
            this.characterModel.maxHp += 30;
            this.characterModel.maxMind += 30;
            this.characterModel.coins += 500;
            toastr.success(
              `Использована колода легенд. Макс. здоровье: +30 Макс. рассудок: +30 Монет +500`,
            );
            break;
          }
          case eItemTypes.REWARD_FAN: {
            this.characterModel.maxMind += 50;
            this.characterModel.coins += 500;
            toastr.success(`Использован веер. Макс. рассудок: +50 Монет +500`);
            break;
          }
          case eItemTypes.REWARD_FANTOM_MIRROR: {
            this.characterModel.maxHp += 50;
            this.characterModel.coins += 150;
            toastr.success(`Использовано фантомное зеркало. Макс. здоровье: +50 Монет +150`);
            break;
          }
          case eItemTypes.POTION_HEALTH: {
            this.characterModel.maxHp += 10;
            this.characterModel.coins += 10;
            toastr.success(`Использовано зелье лечения. Здоровье: +10 Монет +10`);
            break;
          }
          case eItemTypes.POTION_ANTI_STRESS: {
            this.characterModel.maxMind += 10;
            this.characterModel.coins += 10;
            toastr.success(`Использовано зелье релаксации. Рассудок: +10 Монет +10`);
            break;
          }
        }

        this.characterModel.inventoty[slot.slotIndex] = null;
        this.hud.update(this.characterModel);
      }
    });
  }

  private setupCharacter(): void {
    this.character = new Character(this.loader.resources['hero'].texture);
    this.character.zIndex = 10;
    this.characterModel = {
      hp: 100,
      hunger: 100,
      maxHunger: 100,
      inventoty: [null, null, null, null],
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
      this.level.generateNeighbors(model);
      this.hud.update(this.characterModel);
    });

    this.level.on('forceUpdate', () => {
      this.hud.update(this.characterModel);
    });

    this.level.on('generate', (data: any) => {
      this.spawnRoom(data.room);
      if (data.door) {
        this.spawnDoor(data.door);
      }
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
    this.viewport.follow(this.character);
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
