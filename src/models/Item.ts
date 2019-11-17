// ${assetKey}_${assetSubKey}_${res.name}

export enum eItemTypes {
  POTION_ANTI_STRESS = 'items_potions_anti_stress',
  POTION_HEALTH = 'items_potions_heal',

  REWARD_GOLD_ONE = 'items_rewards_coin',
  REWARD_GOLD_MANY = 'items_rewards_coins',
  REWARD_GOLD_MAX = 'items_rewards_gold_pile',

  REWARD_DECK_LEGEND = 'items_rewards_misc_deck_legendary_new',
  REWARD_FAN = 'items_rewards_misc_fan_new',
  REWARD_FANTOM_MIRROR = 'items_rewards_misc_phantom_mirror',

  TREASURE_CHEST_SMALL = 'items_treasures_chest',
  TREASURE_CHEST_MEDIUM = 'items_treasures_chest_2_closed',
  TREASURE_CHEST_LARGE = 'items_treasures_large_box',
}

export interface IItemModel {
  type: eItemTypes;

  hp?: number;
  price?: number;
  mind?: number;
  maxHp?: number;
  maxMind?: number;
}
