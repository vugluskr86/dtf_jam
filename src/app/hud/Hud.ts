import { Container, TextStyle } from 'pixi.js';
import { ProgressBar } from './ProgressBar';
import { ICharacterModel } from '@models/Character';

export class Hud extends Container {
  public static FONT_SMALL: TextStyle = new TextStyle({
    dropShadow: true,
    dropShadowDistance: 1,
    fill: 0x00ff00,
    fontFamily: 'Futura',
    fontSize: 12,
  });

  private progrssHP: ProgressBar;
  private progrssMind: ProgressBar;

  constructor() {
    super();
    this.progrssHP = this.addProgressBar(20, 10, 128, 8, 0xff0000);
    this.progrssMind = this.addProgressBar(20, 25, 128, 8, 0x00ff00);
  }

  public update(character: ICharacterModel): void {
    this.progrssHP.draw(character.hp);
    this.progrssMind.draw(character.mind);
  }

  private addProgressBar(x: number, y: number, w: number, h: number, color: number): ProgressBar {
    const progrss: ProgressBar = new ProgressBar(color, w, h);
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
