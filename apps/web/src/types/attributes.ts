export enum AttributeType {
  Strength = 'strength',
  Dexterity = 'dexterity',
  Constitution = 'constitution',
  Intelligence = 'intelligence',
  Wisdom = 'wisdom',
  Charisma = 'charisma',
}

export type Attributes = {
  [key in AttributeType]?: number
}

