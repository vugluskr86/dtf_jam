import { Sprite, Texture } from 'pixi.js';

export enum eActorTypes {
  DECOR,
  ACTIVE,
}

export class Actor extends Sprite {
  constructor(public texture: Texture, public readonly type: eActorTypes) {
    super(texture);
    this.anchor.y = 0.5;
    this.anchor.x = 0.5;
    this.interactive = true;
  }
}
