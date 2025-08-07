import type { Quest } from '../types/game';

export const QUESTS: Record<string, Quest> = {
  squires_journey: {
    id: 'squires_journey',
    title: "Squire's Journey",
    description: "A noble knight has lost his armor in battle and needs your help. Sir Roderick, once a proud protector of the realm, now stands defenseless against the dangers that lurk in the shadows. As his squire, you must gather a complete set of steel armor to restore his honor and prepare him for the challenges ahead. Gather steel full helm, steel longsword, steel platebody, steel platelegs, and steel kiteshield to complete his arsenal.",
    requirements: [
      {
        id: 'steel_full_helm',
        type: 'item',
        itemId: 'steel_full_helm',
        itemName: 'Steel Full Helm',
        quantity: 1,
        currentQuantity: 0
      },
      {
        id: 'steel_longsword',
        type: 'item',
        itemId: 'steel_longsword',
        itemName: 'Steel Longsword',
        quantity: 1,
        currentQuantity: 0
      },
      {
        id: 'steel_platebody',
        type: 'item',
        itemId: 'steel_platebody',
        itemName: 'Steel Platebody',
        quantity: 1,
        currentQuantity: 0
      },
      {
        id: 'steel_platelegs',
        type: 'item',
        itemId: 'steel_platelegs',
        itemName: 'Steel Platelegs',
        quantity: 1,
        currentQuantity: 0
      },
      {
        id: 'steel_kiteshield',
        type: 'item',
        itemId: 'steel_kiteshield',
        itemName: 'Steel Kiteshield',
        quantity: 1,
        currentQuantity: 0
      }
    ],
    rewards: [
      {
        id: 'smithing_xp',
        type: 'experience',
        skillName: 'smithing',
        quantity: 2500
      },
      {
        id: 'gold_reward',
        type: 'gold',
        quantity: 2000
      }
    ],
    isActive: false,
    isCompleted: false
  },

  goblin_troubles: {
    id: 'goblin_troubles',
    title: "Goblin Troubles",
    description: "The peaceful village of Millhaven is under constant threat from savage goblin raids. These vile creatures emerge from the dark forests at night, stealing crops, frightening livestock, and terrorizing the innocent villagers. The village elder has posted a bounty for any brave warrior willing to venture into goblin territory and cull their numbers. Slay 100 goblins to bring peace back to the village and earn the gratitude of its people.",
    requirements: [
      {
        id: 'goblin_kills',
        type: 'kill',
        monsterId: 'goblin',
        monsterName: 'Goblin',
        quantity: 100,
        currentQuantity: 0
      }
    ],
    rewards: [
      {
        id: 'gold_reward',
        type: 'gold',
        quantity: 5000
      },
      {
        id: 'trout_reward',
        type: 'item',
        itemId: 'trout',
        itemName: 'Trout',
        quantity: 100
      }
    ],
    isActive: false,
    isCompleted: false
  },

  dragon_disciples: {
    id: 'dragon_disciples',
    title: "Dragon Disciples",
    description: "The Circle of Mystic Scholars has discovered ancient texts revealing that dragon teeth contain potent magical energy. These wise wizards seek to harness this power for their arcane research, but dragon teeth are exceedingly rare and can only be obtained from freshly slain dragons while under their mystical guidance. The magical resonance required for the teeth to maintain their power only occurs when this quest is active. Collect 10 dragon teeth to aid their groundbreaking magical research.",
    requirements: [
      {
        id: 'dragon_teeth',
        type: 'item',
        itemId: 'dragon_teeth',
        itemName: 'Dragon Teeth',
        quantity: 10,
        currentQuantity: 0
      }
    ],
    rewards: [
      {
        id: 'gold_reward',
        type: 'gold',
        quantity: 25000
      },
      {
        id: 'diamond_reward',
        type: 'item',
        itemId: 'diamond',
        itemName: 'Diamond',
        quantity: 50
      },
      {
        id: 'ruby_reward',
        type: 'item',
        itemId: 'ruby',
        itemName: 'Ruby',
        quantity: 50
      },
      {
        id: 'emerald_reward',
        type: 'item',
        itemId: 'emerald',
        itemName: 'Emerald',
        quantity: 50
      },
      {
        id: 'sapphire_reward',
        type: 'item',
        itemId: 'sapphire',
        itemName: 'Sapphire',
        quantity: 50
      }
    ],
    isActive: false,
    isCompleted: false
  }
};

// Helper function to get all available quests
export const getAllQuests = (): Quest[] => {
  return Object.values(QUESTS);
};

// Helper function to get a quest by ID
export const getQuestById = (questId: string): Quest | undefined => {
  return QUESTS[questId];
};

// Helper function to get active quests
export const getActiveQuests = (): Quest[] => {
  return Object.values(QUESTS).filter(quest => quest.isActive);
};

// Helper function to get completed quests
export const getCompletedQuests = (): Quest[] => {
  return Object.values(QUESTS).filter(quest => quest.isCompleted);
}; 