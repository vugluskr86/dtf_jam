import { TextStyle } from 'pixi.js';

export class Fonts {
  public static SMALL_RED: TextStyle = new TextStyle({
    dropShadow: true,
    dropShadowDistance: 1,
    fill: 0xff0000,
    fontFamily: 'Futura',
    fontSize: 12,
  });

  public static SMALL_GREEN: TextStyle = new TextStyle({
    dropShadow: true,
    dropShadowDistance: 1,
    fill: 0x00ff00,
    fontFamily: 'Futura',
    fontSize: 12,
  });

  public static SMALL_AQUAMARINE: TextStyle = new TextStyle({
    dropShadow: true,
    dropShadowDistance: 1,
    fill: 0x7fffd4,
    fontFamily: 'Futura',
    fontSize: 12,
  });
}
