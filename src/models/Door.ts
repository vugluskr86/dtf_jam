import { RoomModel } from './Room';

export interface IDoorModel {
  left?: RoomModel;
  right?: RoomModel;
  top?: RoomModel;
  bottom?: RoomModel;
  open: boolean;
}
