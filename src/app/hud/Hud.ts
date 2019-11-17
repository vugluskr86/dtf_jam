import { Container, Sprite, TextStyle } from 'pixi.js';
import { ProgressBar } from './ProgressBar';
import { ICharacterModel } from '@models/Character';
import { Fonts } from './Fonts';

export class Hud extends Container {
  private progrssHP: ProgressBar;
  private progrssMind: ProgressBar;
  private progrssHunger: ProgressBar;

  private itemCell0: Sprite;
  private itemCell1: Sprite;
  private itemCell2: Sprite;
  private itemCell3: Sprite;

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
  }

  public update(character: ICharacterModel): void {
    this.progrssHP.draw(character.hp);
    this.progrssMind.draw(character.mind);
    this.progrssHunger.draw(character.hunger);
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

  /*
  public drawText(x: number, y: number, text: string, textSize: number, color: number): void {
    const style = new TextStyle({
      dropShadow: true,
      dropShadowDistance: 1,
      fill: color,
      fontFamily: 'Futura',
      fontSize: textSize,
    });
    const message = new Text(text, style);
    message.x = x;
    message.y = y;
    this.object.addChild(message);
  }
  */
}
