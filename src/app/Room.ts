import { Sprite, Texture } from 'pixi.js';

export class Room {
  public sprite: Sprite;

  constructor(public texture: Texture) {
    this.sprite = new Sprite(texture);
  }
}

export interface IRoomViewSettings {
  paddingWidth: number;
  paddngHeight: number;
}
