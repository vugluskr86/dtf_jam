import { Container, TextStyle } from 'pixi.js';
import { ProgressBar } from './ProgressBar';
import { ICharacterModel } from '@models/Character';
import { Fonts } from './Fonts';
import { InventorySlot } from './InventorySlot';

export class Hud extends Container {
  private progrssHP: ProgressBar;
  private progrssMind: ProgressBar;
  private progrssHunger: ProgressBar;

  private itemSlot0: InventorySlot;
  private itemSlot1: InventorySlot;
  private itemSlot2: InventorySlot;
  private itemSlot3: InventorySlot;

  constructor() {
    super();
    this.progrssHP = this.addProgressBar('HP', Fonts.SMALL_RED, 20, 700, 128, 8, 0xff0000);
    this.progrssMind = this.addProgressBar('Mind', Fonts.SMALL_GREEN, 180, 700, 128, 8, 0x00ff00);
    this.progrssHunger = this.addProgressBar(
      'Hunger',
      Fonts.SMALL_AQUAMARINE,
      350,
      700,
      128,
      8,
      0x7fffd4,
    );

    const INVENTORY_Y: number = 680;
    const INVENTORY_START_X: number = 1120;

    this.itemSlot0 = this.addInventorySlot(INVENTORY_START_X, INVENTORY_Y);
    this.itemSlot1 = this.addInventorySlot(INVENTORY_START_X + 32 + 8, INVENTORY_Y);
    this.itemSlot2 = this.addInventorySlot(INVENTORY_START_X + 64 + 16, INVENTORY_Y);
    this.itemSlot3 = this.addInventorySlot(INVENTORY_START_X + 96 + 24, INVENTORY_Y);
  }

  public update(character: ICharacterModel): void {
    this.progrssHP.draw(character.hp / character.maxHp);
    this.progrssMind.draw(character.mind / character.maxMind);
    this.progrssHunger.draw(character.hunger / character.maxHunger);

    this.itemSlot0.setItem(character.inventoty[0]);
    this.itemSlot1.setItem(character.inventoty[1]);
    this.itemSlot2.setItem(character.inventoty[2]);
    this.itemSlot3.setItem(character.inventoty[3]);
  }

  private addProgressBar(
    text: string,
    font: TextStyle,
    x: number,
    y: number,
    w: number,
    h: number,
    color: number,
  ): ProgressBar {
    const progrss: ProgressBar = new ProgressBar(text, font, color, w, h);
    progrss.x = x;
    progrss.y = y;
    this.addChild(progrss);
    return progrss;
  }

  private addInventorySlot(x: number, y: number): InventorySlot {
    const item: InventorySlot = new InventorySlot();
    this.addChild(item);
    item.x = x;
    item.y = y;
    return item;
  }
}
