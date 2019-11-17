import { IRoomPrototype, RoomModel, eRoomColor, eRoomType } from './Room';
import { /*ITreeNode, createTree,*/ getRandomElementOfEnum } from '@app/Utils';
import { EventEmitter } from 'events';

// type RoomNode = ITreeNode<RoomModel>;

export class Level extends EventEmitter {
  public static MAX_ROOMS: number = 50;
  // private root: RoomNode;

  private rooms: RoomModel[] = [];
  private currentRoom: RoomModel = null;

  /*
  public get rootRoom(): RoomNode {
    return this.root;
  }
  */

  public get roomsList(): RoomModel[] {
    return this.rooms;
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

    this.rooms.push(new RoomModel(this, this.buildRoomPrototype(eRoomColor.YELLOW), 0, -1));

    this.rooms.push(new RoomModel(this, this.buildRoomPrototype(eRoomColor.RED), 0, 1));

    this.rooms.push(new RoomModel(this, this.buildRoomPrototype(eRoomColor.BLACK), -1, 0));

    /*
    this.root = createTree<RoomModel>(
      {
        data: () => {
          return this.buildRoom();
        },
        depth: 2,
      },
      null,
      0,
    );
    */
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

  /*
  private buildRoom(): RoomModel {
    return new RoomModel(this.buildRoomPrototype(), 0, 0);
  }
  */

  private buildRoomPrototype(color?: eRoomColor, type?: eRoomType): IRoomPrototype {
    return {
      color: color ? color : getRandomElementOfEnum(eRoomColor),
      type: type ? type : getRandomElementOfEnum(eRoomType),
    };
  }
}
