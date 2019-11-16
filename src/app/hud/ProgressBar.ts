import { Container, Graphics } from 'pixi.js';

export class ProgressBar extends Container {
  private ctx: Graphics;

  constructor(public pgColor: number, public w: number, public h: number) {
    super();
    this.ctx = new Graphics();
    this.addChild(this.ctx);
    this.width = 100;
    this.height = 10;
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
