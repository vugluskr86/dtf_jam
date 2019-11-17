import { Sprite, Texture } from 'pixi.js';
import { RoomModel } from '@models/Room';

export enum eRoomAlign {
  LEFT,
  MIDDLE,
  RIGHT,
}

export class Room extends Sprite {
  public static SPRITE_WIDTH: number = 256;
  public static SPRITE_HIGHT: number = 128;

  constructor(public texture: Texture, public model: RoomModel) {
    super(texture);
    this.interactive = true;
    this.on('click', () => {
      model.onIntreact();
    });
  }
}

export interface IRoomViewSettings {
  paddingWidth: number;
  paddngHeight: number;
}
