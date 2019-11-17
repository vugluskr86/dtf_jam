import { eItemTypes } from './Item';

export interface ICharacterModel {
  hp: number;
  maxHp: number;
  maxMind: number;
  maxHunger: number;
  mind: number;
  hunger: number;
  inventoty: [eItemTypes, eItemTypes, eItemTypes, eItemTypes];

  moveCount: number;
}
