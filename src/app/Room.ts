import { Sprite, Texture } from 'pixi.js';

export class Room extends Sprite {
  constructor(public texture: Texture) {
    super(texture);
    this.interactive = true;

    this.on('click', (e: any) => {
      this.onClick(e);
    });
  }

  private onClick(e: any): void {
    console.log('Room click', e);
  }
}

export interface IRoomViewSettings {
  paddingWidth: number;
  paddngHeight: number;
}
