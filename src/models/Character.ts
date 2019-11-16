
export type HpValue = number;
export type MaxHpValue = number;
export type MindValue = number;
export type HungerValue = number;

export interface ICharacterModel {
    hp: HpValue;
    maxHp: MaxHpValue;
    mind: MindValue;
    hunger: HungerValue;
}
