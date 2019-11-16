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

  constructor(
    private readonly prototype: IRoomPrototype,
    private readonly x: number,
    private readonly y: number,
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
}
