import { Loader, Sprite, Texture } from 'pixi.js';
import { IDoorModel } from '@models/Door';

export class Door extends Sprite {
  private openTexture: Texture;
  private closeTexture: Texture;

  constructor(private model: IDoorModel) {
    super(Loader.shared.resources[model.open ? 'open_door' : 'closed_door'].texture);
    this.anchor.y = 0.5;
    this.anchor.x = 0.5;
    this.openTexture = Loader.shared.resources['open_door'].texture;
    this.closeTexture = Loader.shared.resources['closed_door'].texture;
  }

  public update(model: IDoorModel): void {
    this.model = model;
    this.texture = this.model.open ? this.openTexture : this.closeTexture;
  }
}
