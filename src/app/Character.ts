import { Sprite, Texture } from 'pixi.js';

export class Character {
  public sprite: Sprite;

  constructor(public texture: Texture) {
    this.sprite = new Sprite(texture);
    this.sprite.anchor.y = 0.5;
    this.sprite.anchor.x = 0.5;
  }
}
