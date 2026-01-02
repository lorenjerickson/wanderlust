export enum AbilityType {
  Perception = 'perception',
  Stealth = 'stealth',
  Athletics = 'athletics',
  Arcana = 'arcana',
  History = 'history',
  Investigation = 'investigation',
  Nature = 'nature',
  Religion = 'religion',
  AnimalHandling = 'animalHandling',
  Insight = 'insight',
  Medicine = 'medicine',
  Survival = 'survival',
  Deception = 'deception',
  Intimidation = 'intimidation',
  Performance = 'performance',
  Persuasion = 'persuasion',
}

export type Abiltiies = {
  [key in AbilityType]?: number // e.g, 0, -1, +2
}
