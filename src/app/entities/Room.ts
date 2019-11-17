import { Loader, Sprite, Texture } from 'pixi.js';
import { RoomModel } from '@models/Room';
import { Actor, eActorTypes } from './Actor';
import { arrayRand, weightedRand } from '@app/Utils';
import { ResourcesShared } from '@app/ResourcesShared';

export enum eRoomAlign {
  LEFT,
  MIDDLE,
  RIGHT,
}

export class Room extends Sprite {
  public static SPRITE_WIDTH: number = 256;
  public static SPRITE_HIGHT: number = 128;

  private actors: Actor[] = [];

  constructor(public texture: Texture, public model: RoomModel) {
    super(texture);
    this.interactive = true;
    this.on('click', () => {
      model.onIntreact();
    });

    const ceils: number = weightedRand({ 1: 0.8, 2: 0.1, 3: 0.1 });
    for (let i = 0; i < ceils; i++) {
      const name: string = arrayRand(ResourcesShared.actorsCeil);
      const ceilIndex: number = ceils + 1;
      this.addCeild(name, (i + 1) * (Room.SPRITE_WIDTH / ceilIndex));
    }
  }

  private addCeild(name: string, x: number): void {
    const texture: Texture = Loader.shared.resources[name].texture;
    if (texture) {
      const actors: Actor = new Actor(texture, eActorTypes.DECOR);
      this.addChild(actors);
      actors.x = x;
      actors.y = 20;
      this.actors.push(actors);
    }
  }
}

export interface IRoomViewSettings {
  paddingWidth: number;
  paddngHeight: number;
}
