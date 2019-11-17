import { IRoomPrototype, RoomModel, eRoomColor, eRoomType } from './Room';
import { /*ITreeNode, createTree,*/ getRandomElementOfEnum } from '@app/Utils';
import { EventEmitter } from 'events';
import { IDoorModel } from './Door';

export class Level extends EventEmitter {
  public static MAX_ROOMS: number = 50;

  private rooms: RoomModel[] = [];
  private currentRoom: RoomModel = null;
  private doors: IDoorModel[] = [];

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
    this.emit('move', model);
  }

  public build(): void {
    this.rooms.push(new RoomModel(this, this.buildRoomPrototype(eRoomColor.GREEN), 0, 0));
    this.rooms.push(new RoomModel(this, this.buildRoomPrototype(eRoomColor.GRAY), 1, 0));
    this.rooms.push(new RoomModel(this, this.buildRoomPrototype(eRoomColor.BLACK), -1, 0));
    this.rooms.push(new RoomModel(this, this.buildRoomPrototype(eRoomColor.YELLOW), 0, -1));
    this.rooms.push(new RoomModel(this, this.buildRoomPrototype(eRoomColor.RED), 0, 1));

    this.addDoorHorizontal(this.rooms[0], this.rooms[1], true);
    // this.addDoorHorizontal(this.rooms[2], this.rooms[0], true);
    this.addDoorVertical(this.rooms[3], this.rooms[0], true);
    this.addDoorVertical(this.rooms[0], this.rooms[4], false);
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

  public isNeighborsWithCurrent(a: RoomModel): boolean {
    return this.currentRoom ? this.isNeighbors(a, this.currentRoom) : false;
  }

  public isPass(a: RoomModel): boolean {
    if (!this.isNeighborsWithCurrent(a)) {
      return false;
    }

    const doorExisting: IDoorModel = this.doors.find((door: IDoorModel) => {
      return (
        (door.bottom === a || door.top === a || door.left === a || door.right === a) && door.open
      );
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
