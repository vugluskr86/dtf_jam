import { Level } from './Level';
import { eActorTypes, Actor } from '@app/entities/Actor';
import { randomInt } from '@app/Utils';
import * as toastr from 'toastr';
import { Room } from '@app/entities/Room';

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

  public getTrap(): eActorTypes {
    return this.actors.find((type: eActorTypes) => {
      return [eActorTypes.TRAP_GAS, eActorTypes.TRAP_MAGIC, eActorTypes.TRAP_SPEAR].includes(type);
    });
  }

  public getMonster(): eActorTypes {
    return this.actors.find((type: eActorTypes) => {
      return type === eActorTypes.MONSTER;
    });
  }

  public getTreasure(): eActorTypes {
    return this.actors.find((type: eActorTypes) => {
      return [
        eActorTypes.TREASURE_SMALL,
        eActorTypes.TREASURE_MIDDLE,
        eActorTypes.TREASURE_SMALL,
      ].includes(type);
    });
  }

  public onIntreact(): void {
    if (this.level.isPass(this)) {
      if (this.level.current.getMonster()) {
        const isEsacpe: boolean = Math.random() > 0.5;
        if (!isEsacpe) {
          const dMind: number = randomInt(1, 3);
          const dHp: number = randomInt(5, 10);
          this.level.character.hp -= dHp;
          this.level.character.mind -= dMind;
          toastr.warning(
            `Вам не удалось сбежать от монстра. Здоровье: -${dHp} Рассудок: -${dMind}`,
          );
          return;
        } else {
          const dMind: number = randomInt(5, 10);
          const dHp: number = randomInt(1, 3);
          this.level.character.hp -= dHp;
          this.level.character.mind -= dMind;
          toastr.warning(`Вы успещно сбежали от монстра. Здоровье: -${dHp} Рассудок: -${dMind}`);
        }
      }

      this.level.moveCharacter(this);

      const dMindNextRoom: number = randomInt(1, 3);
      const dHungerNextRoom: number = randomInt(1, 3);

      this.level.character.mind -= dMindNextRoom;
      this.level.character.hunger -= dHungerNextRoom;

      toastr.warning(
        `Вы перешли в другую комнату. Сытость: -${dHungerNextRoom} Рассудок: -${dMindNextRoom}`,
      );

      if (this.level.character.hunger <= 0) {
        this.level.character.hunger = 0;
        this.level.character.hp--;
      }

      const trap: eActorTypes = this.getTrap();

      if (trap) {
        const dtTrapHp: number = randomInt(5, 10);
        toastr.warning(`При путешествии вы попали в ловушку. Здоровье: -${dtTrapHp}`);
        this.level.character.hp -= dtTrapHp;
      }

      const monster: eActorTypes = this.getMonster();
      if (monster) {
        const dtMonsterHp: number = randomInt(3, 7);
        toastr.warning(`При путешествии монстр ударил вас. Здоровье: -${dtMonsterHp}`);
        this.level.character.mind -= dtMonsterHp;
      }

      if (this.level.character.mind <= 0) {
        this.level.character.mind = 0;
      }

      if (this.level.character.hp <= 0) {
        this.level.character.hp = 0;
        toastr.warning(`Вы умерли`);
        window.location.reload();
      }

      this.normalizeUserParams();
      this.level.forceUpdate();
    }
  }

  public onInteractActor(actor: Actor, level: Room): void {
    this.level.character.mind--;

    toastr.warning(`Вы произвели дейтсвие: Рассудок -1`);

    const rand37: number = randomInt(3, 7);
    const rand15: number = randomInt(1, 5);

    switch (actor.type) {
      case eActorTypes.ALTAR_ALL: {
        this.level.character.mind += rand37;
        this.level.character.hp += rand37;
        toastr.warning(
          `Алтарь восполняет ваше состояние: Здоровье: +${rand37} Рассудок: +${rand37}`,
        );
        break;
      }
      case eActorTypes.ALTAR_MIND: {
        this.level.character.mind += rand37;
        toastr.warning(`Алтарь восполняет ваше состояние: Рассудок: +${rand37}`);
        break;
      }
      case eActorTypes.ALTAR_HP: {
        this.level.character.hp += rand37;
        toastr.warning(`Алтарь восполняет ваше состояние: Здоровье: +${rand37}`);
        break;
      }
      case eActorTypes.FOUNTAIN_ALL: {
        this.level.character.mind += rand15;
        this.level.character.hp += rand15;
        toastr.warning(
          `Фонтан восполняет ваше состояние: Здоровье: +${rand15} Рассудок: +${rand15}`,
        );
        break;
      }
      case eActorTypes.FOUNTAIN_HP: {
        this.level.character.hp += rand15;
        toastr.warning(`Фонтан восполняет ваше состояние: Рассудок: +${rand15}`);
        break;
      }
      case eActorTypes.FOUNTAIN_MIND: {
        this.level.character.mind += rand15;
        toastr.warning(`Фонтан восполняет ваше состояние: Рассудок: +${rand15}`);
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
      case eActorTypes.TREASURE_SMALL: {
        const randCoins: number = randomInt(1, 100);
        this.level.character.coins += randCoins;
        toastr.warning(`Вы нашли ${randCoins} монет`);
        this.removeActor(actor, level);
        break;
      }
      case eActorTypes.TREASURE_MIDDLE: {
        const randCoins: number = randomInt(50, 100);
        this.level.character.coins += randCoins;
        toastr.warning(`Вы нашли ${randCoins} монет`);
        this.removeActor(actor, level);
        break;
      }
      case eActorTypes.TREASURE_LARGE: {
        const randCoins: number = randomInt(100, 200);
        this.level.character.coins += randCoins;
        toastr.warning(`Вы нашли ${randCoins} монет`);
        this.removeActor(actor, level);
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

  private removeActor(actor: Actor, level: Room): void {
    const actorIndex: number = this.actors.findIndex((actorFind: eActorTypes) => {
      return actorFind === actor.type;
    });
    if (actorIndex !== -1) {
      this.actors.splice(actorIndex, 1);
      level.removeActor(actor);
    }
  }
}
