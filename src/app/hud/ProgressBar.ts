import { Container, Graphics, Text, TextStyle } from 'pixi.js';

export class ProgressBar extends Container {
  private ctx: Graphics;
  private text: Text;

  constructor(
    text: string,
    font: TextStyle,
    public pgColor: number,
    public w: number,
    public h: number,
  ) {
    super();
    this.text = new Text(text, font);
    this.text.x = 0;
    this.text.y = -4;
    this.addChild(this.text);
    this.ctx = new Graphics();
    this.ctx.x = this.width + 3;
    this.addChild(this.ctx);
  }

  public draw(value: number): void {
    this.ctx.clear();

    this.ctx.beginFill(0x000000);
    this.ctx.drawRect(0, 0, this.w, this.h);
    this.ctx.endFill();

    this.ctx.beginFill(this.pgColor);
    this.ctx.drawRect(0, 0, this.w * value, this.h);
    this.ctx.endFill();
  }
}
