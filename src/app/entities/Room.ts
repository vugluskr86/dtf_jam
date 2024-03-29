import { Loader, Sprite, Texture } from 'pixi.js';
// import { GlowFilter } from "pixi-filters";
import { RoomModel } from '@models/Room';
import { Actor, eActorTypes } from './Actor';
import { arrayRand, weightedRand, randomInt } from '@app/Utils';
import { ResourcesShared } from '@app/ResourcesShared';
import { Level } from '@models/Level';

export enum eRoomAlign {
  LEFT,
  // MIDDLE,
  RIGHT,
}

/* tslint:indian-style-disable */
export class Room extends Sprite {
  public static SPRITE_WIDTH: number = 256;
  public static SPRITE_HIGHT: number = 128;

  private actors: Actor[] = [];

  constructor(public texture: Texture, public model: RoomModel, public level: Level) {
    super(texture);
    this.interactive = true;
    this.on('click', (e: any) => {
      const target = e.target;
      if (target instanceof Actor) {
        const actor: Actor = target as Actor;
        if (actor.room.model === level.current) {
          model.onInteractActor(actor, this);
        } else {
          model.onIntreact();
        }
      } else {
        model.onIntreact();
      }
    });

    this.placeDecor();

    const placeObject: eActorTypes = weightedRand({
      [eActorTypes.ALTAR_ALL]: 0.08,
      [eActorTypes.ALTAR_HP]: 0.08,
      [eActorTypes.ALTAR_MIND]: 0.08,

      [eActorTypes.FOUNTAIN_ALL]: 0.08,
      [eActorTypes.FOUNTAIN_HP]: 0.08,
      [eActorTypes.FOUNTAIN_MIND]: 0.08,

      [eActorTypes.TRAP_GAS]: 0.08,
      [eActorTypes.TRAP_MAGIC]: 0.08,
      [eActorTypes.TRAP_SPEAR]: 0.08,

      [eActorTypes.MONSTER]: 0.25,

      [eActorTypes.NONE]: 0.25,
    });

    const placeAlign: eRoomAlign = arrayRand([eRoomAlign.LEFT, eRoomAlign.RIGHT]);

    switch (placeObject) {
      case eActorTypes.ALTAR_MIND:
      case eActorTypes.ALTAR_HP:
      case eActorTypes.ALTAR_MIND:
        this.addAltar(placeObject, placeAlign);
        break;
      case eActorTypes.FOUNTAIN_ALL:
      case eActorTypes.FOUNTAIN_HP:
      case eActorTypes.FOUNTAIN_MIND:
        this.addFountain(placeObject, placeAlign);
        break;
      case eActorTypes.MONSTER:
        this.addMonster(placeAlign);
        break;
      case eActorTypes.TRAP_GAS:
      case eActorTypes.TRAP_MAGIC:
      case eActorTypes.TRAP_SPEAR:
        this.addTrap(placeObject, placeAlign);
        break;
    }

    const placeTreasure: eActorTypes = weightedRand({
      [eActorTypes.TREASURE_SMALL]: 0.08,
      [eActorTypes.TREASURE_MIDDLE]: 0.08,
      [eActorTypes.TREASURE_LARGE]: 0.08,
      [eActorTypes.NONE]: 0.25,
    });

    switch (placeTreasure) {
      case eActorTypes.TREASURE_SMALL:
      case eActorTypes.TREASURE_MIDDLE:
      case eActorTypes.TREASURE_LARGE:
        this.addTreasure(
          placeTreasure,
          placeAlign === eRoomAlign.LEFT ? eRoomAlign.RIGHT : eRoomAlign.LEFT,
        );
        break;
    }
  }

  public removeActor(actor: Actor): void {
    const actorIndex: number = this.actors.findIndex((actorFind: Actor) => {
      return actorFind === actor;
    });
    if (actorIndex !== -1) {
      this.actors.splice(actorIndex, 1);
      this.removeChild(actor);
    }
  }

  private placeDecor(): void {
    const wall: number = weightedRand({ 1: 0.5, 2: 0.1, 3: 0.1, 4: 0.1, 5: 0.1, 6: 0.1 });
    for (let i = 0; i < wall; i++) {
      const key: string = arrayRand([
        'actors_wall_mold_glowing_1',
        'actors_wall_mold_glowing_2',
        'actors_wall_mold_glowing_3',
        'actors_wall_mold_glowing_4',
      ]);
      this.addWallDecor(
        key,
        randomInt(40, Room.SPRITE_WIDTH - 40),
        randomInt(40, Room.SPRITE_HIGHT - 40),
      );
    }

    const ceils: number = weightedRand({ 1: 0.8, 2: 0.1, 3: 0.1 });
    for (let i = 0; i < ceils; i++) {
      const key: string = arrayRand(ResourcesShared.list('actors', 'ceil')).key;
      const ceilIndex: number = ceils + 1;
      this.addCeildDecor(key, (i + 1) * (Room.SPRITE_WIDTH / ceilIndex));
    }
  }

  private addCeildDecor(key: string, x: number): void {
    const texture: Texture = Loader.shared.resources[key].texture;
    if (texture) {
      const actors: Actor = new Actor(texture, this, eActorTypes.DECOR_CEIL);
      // actors.filters = [
      //   new GlowFilter(50, 0.6, 0.2, eGameColors.YELLOW, 0.5),
      // ];
      this.addChild(actors);
      actors.x = x;
      actors.y = 20;
      this.actors.push(actors);
    }
  }

  private addWallDecor(key: string, x: number, y: number): void {
    const texture: Texture = Loader.shared.resources[key].texture;
    if (texture) {
      const actors: Actor = new Actor(texture, this, eActorTypes.DECOR_WALL);
      this.addChild(actors);
      actors.x = x;
      actors.y = y;
      this.actors.push(actors);
    }
  }

  private getAlignX(align: eRoomAlign): number {
    switch (align) {
      case eRoomAlign.LEFT:
        return 32 + 20;
      case eRoomAlign.RIGHT:
        return Room.SPRITE_WIDTH - 32 - 20;
    }
    return Room.SPRITE_WIDTH / 2;
  }

  private addRandomActiveObject(type: eActorTypes, align: eRoomAlign, list: string[]): void {
    const key: string = arrayRand(list);

    const texture: Texture = Loader.shared.resources[key].texture;
    const actors: Actor = new Actor(texture, this, type);
    actors.x = this.getAlignX(align);
    actors.y = Room.SPRITE_HIGHT - 32;
    this.actors.push(actors);
    this.model.addActor(type); // ВНИМАНИЕ ГВНОКОД!
    this.addChild(actors);
  }

  private addFountain(type: eActorTypes, align: eRoomAlign): void {
    switch (type) {
      case eActorTypes.FOUNTAIN_ALL: {
        this.addRandomActiveObject(type, align, ['actors_wall_dry_fountain']);
        break;
      }
      case eActorTypes.FOUNTAIN_HP: {
        this.addRandomActiveObject(type, align, ['actors_wall_blood_fountain']);
        break;
      }
      case eActorTypes.FOUNTAIN_MIND: {
        this.addRandomActiveObject(type, align, ['actors_wall_blue_fountain']);
        break;
      }
    }
  }

  private addTrap(type: eActorTypes, align: eRoomAlign): void {
    switch (type) {
      case eActorTypes.TRAP_GAS: {
        this.addRandomActiveObject(type, align, ['actors_floor_trap_gas']);
        break;
      }
      case eActorTypes.TRAP_MAGIC: {
        this.addRandomActiveObject(type, align, ['actors_floor_trap_magical']);
        break;
      }
      case eActorTypes.TRAP_SPEAR: {
        this.addRandomActiveObject(type, align, ['actors_floor_trap_spear']);
        break;
      }
    }
  }

  private addTreasure(type: eActorTypes, align: eRoomAlign): void {
    switch (type) {
      case eActorTypes.TREASURE_SMALL: {
        this.addRandomActiveObject(type, align, ['items_treasures_chest']);
        break;
      }
      case eActorTypes.TREASURE_MIDDLE: {
        this.addRandomActiveObject(type, align, ['items_treasures_chest_2_closed']);
        break;
      }
      case eActorTypes.TREASURE_LARGE: {
        this.addRandomActiveObject(type, align, ['items_treasures_large_box']);
        break;
      }
    }
  }

  private addMonster(align: eRoomAlign): void {
    this.addRandomActiveObject(eActorTypes.MONSTER, align, [
      'actors_monsters_anubis_guard',
      'actors_monsters_big_kobold_new',
      'actors_monsters_cyclops_new',
      'actors_monsters_deep_troll',
      'actors_monsters_formicid',
      'actors_monsters_giant_orange_brain',
      'actors_monsters_orb_guardian_old',
      'actors_monsters_tengu',
    ]);
  }

  private addAltar(type: eActorTypes, align: eRoomAlign): void {
    switch (type) {
      case eActorTypes.ALTAR_ALL: {
        this.addRandomActiveObject(type, align, ['actors_floor_ru_altar']);
        break;
      }
      case eActorTypes.ALTAR_HP: {
        this.addRandomActiveObject(type, align, ['actors_floor_gozag_altar']);
        break;
      }
      case eActorTypes.ALTAR_MIND: {
        this.addRandomActiveObject(type, align, ['actors_floor_misc_altar']);
        break;
      }
    }
  }
}

export interface IRoomViewSettings {
  paddingWidth: number;
  paddngHeight: number;
}
/* tslint:indian-style-enable */
