import { IRoomPrototype, RoomModel, eRoomColor, eRoomType } from './Room';
import { ITreeNode, createTree, getRandomElementOfEnum } from '@app/Utils';

type RoomNode = ITreeNode<RoomModel>;

export class Level {
  public static MAX_ROOMS: number = 50;
  private root: RoomNode;

  public get rootRoom(): RoomNode {
    return this.root;
  }

  public build(): void {
    this.root = createTree<RoomModel>(
      {
        data: () => {
          return this.buildRoom();
        },
        depth: 2,
        spread: 2,
      },
      undefined,
    );
  }

  private buildRoom(): RoomModel {
    return new RoomModel(this.buildRoomPrototype(), 0, 0);
  }

  private buildRoomPrototype(): IRoomPrototype {
    return {
      color: getRandomElementOfEnum(eRoomColor),
      type: getRandomElementOfEnum(eRoomType),
    };
  }
}
