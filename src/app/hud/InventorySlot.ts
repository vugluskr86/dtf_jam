import { Container, Loader, Sprite } from 'pixi.js';
import { IItemModel, eItemTypes } from '@models/Item';

export class InventorySlot extends Container {
  public static getItemModel(type: eItemTypes): IItemModel {
    const asset: any = Loader.shared.resources[type].texture;
    return {
      hp: asset.hp,
      maxHp: asset.maxHp,
      maxMind: asset.maxMind,
      mind: asset.mind,
      price: asset.price,
      type,
    };
  }

  private bg: Sprite;
  private icon: Sprite = null;

  constructor() {
    super();
    this.bg = new Sprite(Loader.shared.resources['slot_vehumet'].texture);
    this.addChild(this.bg);

    this.bg.y = 0.5;
    this.bg.x = 0.5;
    this.interactive = true;
  }

  public setItem(type?: eItemTypes): void {
    if (this.icon) {
      this.removeChild(this.icon);
      this.icon = null;
    }

    if (type) {
      this.icon = new Sprite(Loader.shared.resources[type].texture);
      this.addChild(this.icon);
    }
  }
}
