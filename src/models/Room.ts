export enum eRoomColor {
    RED,
    GREEN,
    GRAY,
    BLACK,
    YELLOW,
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
