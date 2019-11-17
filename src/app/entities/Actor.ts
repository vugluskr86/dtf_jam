import { Sprite, Texture } from 'pixi.js';
import { Room } from './Room';

export enum eActorTypes {
  DECOR_CEIL,
  DECOR_WALL,

  ALTAR_MIND,
  ALTAR_HP,
  ALTAR_ALL,

  FOUNTAIN_MIND,
  FOUNTAIN_HP,
  FOUNTAIN_ALL,

  TRAP_MAGIC,
  TRAP_GAS,
  TRAP_SPEAR,

  MONSTER,
}

export class Actor extends Sprite {
  constructor(
    public texture: Texture,
    public readonly room: Room,
    public readonly type: eActorTypes,
  ) {
    super(texture);
    this.anchor.y = 0.5;
    this.anchor.x = 0.5;
    this.interactive = true;
  }
}
