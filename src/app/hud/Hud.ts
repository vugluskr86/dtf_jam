import { Container, TextStyle, Text } from 'pixi.js';
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

  private text: Text;

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

    this.itemSlot0 = this.addInventorySlot(0, INVENTORY_START_X, INVENTORY_Y);
    this.itemSlot1 = this.addInventorySlot(1, INVENTORY_START_X + 32 + 8, INVENTORY_Y);
    this.itemSlot2 = this.addInventorySlot(2, INVENTORY_START_X + 64 + 16, INVENTORY_Y);
    this.itemSlot3 = this.addInventorySlot(3, INVENTORY_START_X + 96 + 24, INVENTORY_Y);

    this.itemSlot0.on('click', () => {
      if (!this.itemSlot0.isEmpty()) {
        this.emit('use', this.itemSlot0);
      }
    });

    this.itemSlot1.on('click', () => {
      if (!this.itemSlot1.isEmpty()) {
        this.emit('use', this.itemSlot1);
      }
    });

    this.itemSlot2.on('click', () => {
      if (!this.itemSlot2.isEmpty()) {
        this.emit('use', this.itemSlot2);
      }
    });

    this.itemSlot3.on('click', () => {
      if (!this.itemSlot3.isEmpty()) {
        this.emit('use', this.itemSlot3);
      }
    });

    this.text = new Text('Монеты: 0. Пройдено комнат: 0', Fonts.SMALL_AQUAMARINE);
    this.text.x = 20;
    this.text.y = 20;
    this.addChild(this.text);
  }

  public update(character: ICharacterModel): void {
    this.progrssHP.draw(character.hp / character.maxHp);
    this.progrssMind.draw(character.mind / character.maxMind);
    this.progrssHunger.draw(character.hunger / character.maxHunger);

    this.itemSlot0.setItem(character.inventoty[0]);
    this.itemSlot1.setItem(character.inventoty[1]);
    this.itemSlot2.setItem(character.inventoty[2]);
    this.itemSlot3.setItem(character.inventoty[3]);

    this.text.text = `Монеты: ${character.coins}. Пройдено комнат: ${character.moveCount}`;
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

  private addInventorySlot(index: number, x: number, y: number): InventorySlot {
    const item: InventorySlot = new InventorySlot(index);
    this.addChild(item);
    item.x = x;
    item.y = y;
    return item;
  }
}
