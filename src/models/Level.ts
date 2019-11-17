import { IRoomPrototype, RoomModel, eRoomColor, eRoomType } from './Room';
import { getRandomElementOfEnum } from '@app/Utils';
import { EventEmitter } from 'events';
import { IDoorModel } from './Door';
import { ICharacterModel } from './Character';

enum eSide {
  LEFT,
  TOP,
  RIGHT,
  BOTTOM,
}

export class Level extends EventEmitter {
  public static MAX_ROOMS: number = 50;

  private rooms: RoomModel[] = [];
  private currentRoom: RoomModel = null;
  private doors: IDoorModel[] = [];

  constructor(public character: ICharacterModel) {
    super();
  }

  public get roomsList(): RoomModel[] {
    return this.rooms;
  }

  public get doorsList(): IDoorModel[] {
    return this.doors;
  }

  public get current(): RoomModel {
    return this.currentRoom;
  }

  public moveCharacter(model: RoomModel): void {
    this.currentRoom = model;
    this.character.moveCount++;
    this.emit('move', model);
  }

  public forceUpdate(): void {
    this.emit('forceUpdate');
  }

  public build(): void {
    const ROOMS_H = 8;
    const ROOMS_V = 8;
    const roomColors = [
      eRoomColor.GREEN,
      eRoomColor.GRAY,
      eRoomColor.BLACK,
      eRoomColor.YELLOW,
      eRoomColor.RED,
    ];
    for (let i = 0; i < ROOMS_V; i++) {
      for (let j = 0; j < ROOMS_H; j++) {
        this.rooms.push(
          new RoomModel(
            this,
            this.buildRoomPrototype(roomColors[Math.floor(Math.random() * roomColors.length)]),
            j,
            i,
          ),
        );
      }
    }
    let roomCheck = false;
    for (let i = 0; i < this.rooms.length; i++) {
      if (i < this.rooms.length - 1) {
        roomCheck = this.isNeighbors(this.rooms[i], this.rooms[i + 1]);
      } else {
        roomCheck = false;
      }
      if (roomCheck) {
        this.addDoorHorizontal(
          this.rooms[i],
          this.rooms[i + 1],
          Math.random() < 0.9 ? true : false,
        );
        if (i >= ROOMS_V) {
          this.addDoorVertical(
            this.rooms[i],
            this.rooms[i + 1],
            Math.random() < 0.5 ? true : false,
          );
        }
      }
    }
    this.addDoorVertical(this.rooms[0], this.rooms[ROOMS_V], true);
  }

  public findRoom(x: number, y: number): RoomModel {
    return this.rooms.find((a: RoomModel) => {
      return a.x === x && a.y === y;
    });
  }

  public isNeighbors(a: RoomModel, b: RoomModel): boolean {
    const aX: number = a.x;
    const bX: number = b.x;
    const aY: number = a.y;
    const bY: number = b.y;

    return (
      (aX === bX && aY - 1 === bY) ||
      (aX === bX && aY + 1 === bY) ||
      (aY === bY && aX - 1 === bX) ||
      (aY === bY && aX + 1 === bX)
    );
  }

  public getNeighborsSide(a: RoomModel): eSide {
    const aX: number = a.x;
    const bX: number = this.currentRoom.x;
    const aY: number = a.y;
    const bY: number = this.currentRoom.y;

    if (aX === bX && aY - 1 === bY) {
      return eSide.BOTTOM;
    }
    if (aX === bX && aY + 1 === bY) {
      return eSide.TOP;
    }
    if (aY === bY && aX - 1 === bX) {
      return eSide.RIGHT;
    }
    if (aY === bY && aX + 1 === bX) {
      return eSide.LEFT;
    }
  }

  public isNeighborsWithCurrent(a: RoomModel): boolean {
    return this.currentRoom ? this.isNeighbors(a, this.currentRoom) : false;
  }

  public isPass(a: RoomModel): boolean {
    if (!this.isNeighborsWithCurrent(a)) {
      return false;
    }

    const side: eSide = this.getNeighborsSide(a);

    const doorExisting: IDoorModel = this.doors.find((door: IDoorModel) => {
      if (!door.open) {
        return false;
      }

      if (side === eSide.TOP && door.top === a) {
        return true;
      }
      if (side === eSide.BOTTOM && door.bottom === a) {
        return true;
      }
      if (side === eSide.LEFT && door.left === a) {
        return true;
      }
      if (side === eSide.RIGHT && door.right === a) {
        return true;
      }
    });

    return Boolean(doorExisting);
  }

  private addDoorHorizontal(left: RoomModel, right: RoomModel, open: boolean): void {
    this.doors.push({
      left,
      right,
      open,
    });
  }

  private addDoorVertical(top: RoomModel, bottom: RoomModel, open: boolean): void {
    this.doors.push({
      top,
      bottom,
      open,
    });
  }

  private buildRoomPrototype(color?: eRoomColor, type?: eRoomType): IRoomPrototype {
    return {
      color: color ? color : getRandomElementOfEnum(eRoomColor),
      type: type ? type : getRandomElementOfEnum(eRoomType),
    };
  }
}
