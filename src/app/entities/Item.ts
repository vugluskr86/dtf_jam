import { Sprite, Texture } from 'pixi.js';

export class Item extends Sprite {
  constructor(public texture: Texture) {
    super(texture);
    this.anchor.y = 0.5;
    this.anchor.x = 0.5;
  }
}
