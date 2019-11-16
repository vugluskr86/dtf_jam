import { Container, Graphics, DisplayObject } from "pixi.js";

export class Hud extends DisplayObject {
  public object: Container;

  public init(): void {
    this.object = new Container();
  }

  public drawBar(
    x: number,
    y: number,
    color: number,
    width: number,
    height: number
  ): void {
    const object = new Container();
    object.position.set(x, y);
    this.object.addChild(object);
    const bar = new Graphics();
    bar.beginFill(color);
    bar.drawRect(0, 0, width, height);
    bar.endFill();
    object.addChild(bar);
  }
}
