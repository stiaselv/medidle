import type { Dungeon } from '../types/game';

export const DUNGEONS: Record<string, Dungeon> = {
  dragons_den: {
    id: 'dragons_den',
    name: "Dragon's Den",
    description: "A treacherous lair housing dragons of increasing power. Defeat all four dragons to claim the ultimate treasure.",
    levelRequired: 75,
    monsters: ['green_dragon', 'blue_dragon', 'red_dragon', 'black_dragon'],
    completionReward: {
      itemId: 'dragon_chest',
      quantity: 1
    },
    thumbnail: '/assets/ItemThumbnail/Combat/dragons_den.png',
    background: '/assets/BG/dragons_den.webp'
  }
};

export const getDungeon = (dungeonId: string): Dungeon | undefined => {
  return DUNGEONS[dungeonId];
};

export const getAllDungeons = (): Dungeon[] => {
  return Object.values(DUNGEONS);
}; 