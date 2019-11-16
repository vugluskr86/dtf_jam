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
