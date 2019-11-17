export enum eItemTypes {
  POTION_ANTI_STRESS,
  POTION_HRALTH,

  REWARD_GOLD_ONE,
  REWARD_GOLD_MANY,
  REWARD_GOLD_MAX,

  REWARD_DECK_LEGEND,
  REWARD_FAN,
  REWARD_FANTOM_MIRROR,

  TREASURE_CHEST_SMALL,
  TREASURE_CHEST_MEDIUM,
  TREASURE_CHEST_LARGE,
}

export interface ItemModel {
  hp: number;
  price: number;
  mind: number;
  maxHp: number;
  maxMind: number;
}
