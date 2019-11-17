import { Level } from './Level';
import { eActorTypes } from '@app/entities/Actor';
import { randomInt } from '@app/Utils';

export enum eRoomColor {
  RED = 'red',
  GREEN = 'green',
  GRAY = 'gray',
  BLACK = 'black',
  YELLOW = 'yellow',
}

export enum eRoomType {
  SANCTUARY,
  TREASURE,
  REGULAR,
  HARD,
}

export interface IRoomPrototype {
  color: eRoomColor;
  type: eRoomType;
}

export enum eRoomJoin {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
}

export class RoomModel {
  public static MAX_ROOM_WIDTH: number = 10;
  private flatIndex: number;

  private actors: eActorTypes[] = [];

  constructor(
    public readonly level: Level,
    public readonly prototype: IRoomPrototype,
    public readonly x: number,
    public readonly y: number,
  ) {
    this.flatIndex = this.x + RoomModel.MAX_ROOM_WIDTH * this.y;
  }

  get index(): number {
    return this.flatIndex;
  }

  get color(): eRoomColor {
    return this.prototype.color;
  }

  get type(): eRoomType {
    return this.prototype.type;
  }

  public addActor(type: eActorTypes): void {
    this.actors.push(type);
  }

  public onIntreact(): void {
    if (this.level.isPass(this)) {
      this.level.moveCharacter(this);

      this.level.character.mind -= randomInt(1, 3);
      this.level.character.hunger -= randomInt(1, 3);

      if (this.level.character.hunger <= 0) {
        this.level.character.hunger = 0;
        this.level.character.hp--;
      }

      const trap: eActorTypes = this.actors.find((type: eActorTypes) => {
        return [eActorTypes.TRAP_GAS, eActorTypes.TRAP_MAGIC, eActorTypes.TRAP_SPEAR].includes(
          type,
        );
      });

      if (trap) {
        this.level.character.hp -= randomInt(5, 10);
      }

      const monster: eActorTypes = this.actors.find((type: eActorTypes) => {
        return type === eActorTypes.MONSTER;
      });

      if (monster) {
        this.level.character.mind -= randomInt(3, 7);
      }

      if (this.level.character.mind <= 0) {
        this.level.character.mind = 0;
      }

      if (this.level.character.hp <= 0) {
        this.level.character.hp = 0;
        // DIE
        window.location.reload();
      }

      this.normalizeUserParams();
      this.level.forceUpdate();
    }
  }

  public onInteractActor(actor: eActorTypes): void {
    this.level.character.mind--;
    switch (actor) {
      case eActorTypes.ALTAR_ALL: {
        this.level.character.mind += randomInt(3, 7);
        this.level.character.hp += randomInt(3, 7);
        break;
      }
      case eActorTypes.ALTAR_MIND: {
        this.level.character.mind += randomInt(3, 7);
        break;
      }
      case eActorTypes.ALTAR_HP: {
        this.level.character.hp += randomInt(3, 7);
        break;
      }
      case eActorTypes.FOUNTAIN_ALL: {
        this.level.character.mind += randomInt(1, 5);
        this.level.character.hp += randomInt(1, 5);
        break;
      }
      case eActorTypes.FOUNTAIN_HP: {
        this.level.character.hp += randomInt(1, 5);
        break;
      }
      case eActorTypes.FOUNTAIN_MIND: {
        this.level.character.mind += randomInt(1, 5);
        break;
      }
      case eActorTypes.TRAP_GAS: {
        break;
      }
      case eActorTypes.TRAP_MAGIC: {
        break;
      }
      case eActorTypes.TRAP_SPEAR: {
        break;
      }
      case eActorTypes.MONSTER: {
        break;
      }
    }
    this.normalizeUserParams();
    this.level.forceUpdate();
  }

  private normalizeUserParams(): void {
    if (this.level.character.mind > this.level.character.maxMind) {
      this.level.character.mind = this.level.character.maxMind;
    }

    if (this.level.character.hunger > this.level.character.maxHunger) {
      this.level.character.hunger = this.level.character.maxHunger;
    }

    if (this.level.character.hp > this.level.character.maxHp) {
      this.level.character.hp = this.level.character.maxHp;
    }
  }
}
