import type { Location } from '../../types/game';
import { ITEM_CATEGORIES } from '../../constants/items';

export const rooftopThievingLocation: Location = {
  id: 'rooftop_thieving',
  name: 'Outer City',
  description: 'A series of rooftops perfect for training thieving and agility skills across various courses and pickpocketing opportunities.',
  type: 'resource',
  levelRequired: 1,
  monsters: [],
  resources: ['pickpocket_targets'],
  category: ITEM_CATEGORIES.MISC,
  icon: '/assets/BG/rooftop_thieving.webp',
  availableSkills: ['thieving', 'agility'],
  actions: [
    // Agility Rooftop Courses - ordered by level required
    {
      id: 'draynor_rooftop_course',
      name: 'Draynor Village Rooftop Course',
      type: 'agility',
      skill: 'agility',
      levelRequired: 1,
      experience: 12,
      baseTime: 6000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 5 },
      requirements: [
        { type: 'level', skill: 'agility', level: 1 }
      ]
    },
    {
      id: 'al_kharid_rooftop_course',
      name: 'Al Kharid Rooftop Course',
      type: 'agility',
      skill: 'agility',
      levelRequired: 10,
      experience: 25,
      baseTime: 7000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 10 },
      requirements: [
        { type: 'level', skill: 'agility', level: 10 }
      ]
    },
    {
      id: 'varrock_rooftop_course',
      name: 'Varrock Rooftop Course',
      type: 'agility',
      skill: 'agility',
      levelRequired: 20,
      experience: 45,
      baseTime: 8000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 18 },
      requirements: [
        { type: 'level', skill: 'agility', level: 20 }
      ]
    },
    {
      id: 'canifis_rooftop_course',
      name: 'Canifis Rooftop Course',
      type: 'agility',
      skill: 'agility',
      levelRequired: 30,
      experience: 70,
      baseTime: 9000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 28 },
      requirements: [
        { type: 'level', skill: 'agility', level: 30 }
      ]
    },
    {
      id: 'falador_rooftop_course',
      name: 'Falador Rooftop Course',
      type: 'agility',
      skill: 'agility',
      levelRequired: 40,
      experience: 105,
      baseTime: 9500,
      itemReward: { id: 'coins', name: 'Coins', quantity: 42 },
      requirements: [
        { type: 'level', skill: 'agility', level: 40 }
      ]
    },
    {
      id: 'seers_village_rooftop_course',
      name: 'Seers\' Village Rooftop Course',
      type: 'agility',
      skill: 'agility',
      levelRequired: 50,
      experience: 150,
      baseTime: 10000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 60 },
      requirements: [
        { type: 'level', skill: 'agility', level: 50 }
      ]
    },
    {
      id: 'pollnivneach_rooftop_course',
      name: 'Pollnivneach Rooftop Course',
      type: 'agility',
      skill: 'agility',
      levelRequired: 60,
      experience: 200,
      baseTime: 10500,
      itemReward: { id: 'coins', name: 'Coins', quantity: 85 },
      requirements: [
        { type: 'level', skill: 'agility', level: 60 }
      ]
    },
    {
      id: 'rellekka_rooftop_course',
      name: 'Rellekka Rooftop Course',
      type: 'agility',
      skill: 'agility',
      levelRequired: 70,
      experience: 260,
      baseTime: 11000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 115 },
      requirements: [
        { type: 'level', skill: 'agility', level: 70 }
      ]
    },
    {
      id: 'ardougne_rooftop_course',
      name: 'Ardougne Rooftop Course',
      type: 'agility',
      skill: 'agility',
      levelRequired: 80,
      experience: 330,
      baseTime: 11500,
      itemReward: { id: 'coins', name: 'Coins', quantity: 150 },
      requirements: [
        { type: 'level', skill: 'agility', level: 80 }
      ]
    },
    {
      id: 'prifddinas_rooftop_course',
      name: 'Prifddinas Rooftop Course',
      type: 'agility',
      skill: 'agility',
      levelRequired: 90,
      experience: 420,
      baseTime: 12000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 200 },
      requirements: [
        { type: 'level', skill: 'agility', level: 90 }
      ]
    },

    // Thieving Pickpocketing Targets - ordered by level required
    {
      id: 'pickpocket_man',
      name: 'Pickpocket Man',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 1,
      experience: 8,
      baseTime: 2000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 3 },
      possibleLoot: [
        { id: 'coins', quantity: 3, chance: 1.0 },
        { id: 'bread', quantity: 1, chance: 0.1 },
        { id: 'feathers', quantity: 1, chance: 0.1 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 1 }
      ]
    },
    {
      id: 'pickpocket_dwarf',
      name: 'Pickpocket Dwarf',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 5,
      experience: 12,
      baseTime: 2200,
      itemReward: { id: 'coins', name: 'Coins', quantity: 5 },
      possibleLoot: [
        { id: 'coins', quantity: 5, chance: 1.0 },
        { id: 'tin_ore', quantity: 1, chance: 0.1 },
        { id: 'copper_ore', quantity: 1, chance: 0.1 },
        { id: 'iron_pickaxe', quantity: 1, chance: 0.05 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 5 }
      ]
    },
    {
      id: 'pickpocket_farmer',
      name: 'Pickpocket Farmer',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 12,
      experience: 18,
      baseTime: 2500,
      itemReward: { id: 'coins', name: 'Coins', quantity: 10 },
      possibleLoot: [
        { id: 'coins', quantity: 10, chance: 1.0 },
        { id: 'potato_seeds', quantity: 1, chance: 0.1 },
        { id: 'onion_seed', quantity: 1, chance: 0.1 },
        { id: 'cabbage_seed', quantity: 1, chance: 0.1 },
        { id: 'arrow_shafts', quantity: 1, chance: 0.05 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 12 }
      ]
    },
    {
      id: 'pickpocket_thug',
      name: 'Pickpocket Thug',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 18,
      experience: 25,
      baseTime: 2800,
      itemReward: { id: 'coins', name: 'Coins', quantity: 15 },
      possibleLoot: [
        { id: 'coins', quantity: 15, chance: 1.0 },
        { id: 'steel_dagger', quantity: 1, chance: 0.05 },
        { id: 'cowhide', quantity: 1, chance: 0.05 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 18 }
      ]
    },
    {
      id: 'pickpocket_guard',
      name: 'Pickpocket Guard',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 27,
      experience: 35,
      baseTime: 3200,
      itemReward: { id: 'coins', name: 'Coins', quantity: 25 },
      possibleLoot: [
        { id: 'coins', quantity: 25, chance: 1.0 },
        { id: 'steel_platebody', quantity: 1, chance: 0.01 },
        { id: 'steel_platelegs', quantity: 1, chance: 0.01 },
        { id: 'steel_helmet', quantity: 1, chance: 0.01 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 27 }
      ]
    },
    {
      id: 'pickpocket_master_farmer',
      name: 'Pickpocket Master Farmer',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 38,
      experience: 50,
      baseTime: 3600,
      itemReward: { id: 'coins', name: 'Coins', quantity: 40 },
      possibleLoot: [
        { id: 'coins', quantity: 40, chance: 1.0 },
        { id: 'guam_seed', quantity: 1, chance: 0.05 },
        { id: 'marentill_seed', quantity: 1, chance: 0.05 },
        { id: 'tarromin_seed', quantity: 1, chance: 0.05 },
        { id: 'harralander_seed', quantity: 1, chance: 0.05 },
        { id: 'ranarr_seed', quantity: 1, chance: 0.02 },
        { id: 'toadflax_seed', quantity: 1, chance: 0.02 },
        { id: 'irit_seed', quantity: 1, chance: 0.02 },
        { id: 'avantoe_seed', quantity: 1, chance: 0.01 },
        { id: 'kwuarm_seed', quantity: 1, chance: 0.01 },
        { id: 'snapdragon_seed', quantity: 1, chance: 0.01 },
        { id: 'cadantine_seed', quantity: 1, chance: 0.01 },
        { id: 'lantadyme_seed', quantity: 1, chance: 0.01 },
        { id: 'dwarf_weed_seed', quantity: 1, chance: 0.01 },
        { id: 'torstol_seed', quantity: 1, chance: 0.005 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 38 }
      ]
    },
    {
      id: 'pickpocket_wizard',
      name: 'Pickpocket Wizard',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 47,
      experience: 65,
      baseTime: 4000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 50 },
      possibleLoot: [
        { id: 'coins', quantity: 50, chance: 1.0 },
        { id: 'fire_rune', quantity: 1, chance: 0.1 },
        { id: 'air_rune', quantity: 1, chance: 0.1 },
        { id: 'water_rune', quantity: 1, chance: 0.1 },
        { id: 'earth_rune', quantity: 1, chance: 0.1 },
        { id: 'staff_of_air', quantity: 1, chance: 0.005 },
        { id: 'staff_of_fire', quantity: 1, chance: 0.005 },
        { id: 'staff_of_earth', quantity: 1, chance: 0.005 },
        { id: 'staff_of_water', quantity: 1, chance: 0.005 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 47 }
      ]
    },
    {
      id: 'pickpocket_guard_advanced',
      name: 'Pickpocket Guard (Advanced)',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 55,
      experience: 85,
      baseTime: 4200,
      itemReward: { id: 'coins', name: 'Coins', quantity: 80 },
      possibleLoot: [
        { id: 'coins', quantity: 80, chance: 1.0 },
        { id: 'mithril_scimitar', quantity: 1, chance: 0.01 },
        { id: 'mithril_arrow', quantity: 1, chance: 0.1 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 55 }
      ]
    },
    {
      id: 'pickpocket_miner',
      name: 'Pickpocket Miner',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 63,
      experience: 100,
      baseTime: 4500,
      itemReward: { id: 'coins', name: 'Coins', quantity: 30 },
      possibleLoot: [
        { id: 'coins', quantity: 30, chance: 1.0 },
        { id: 'coal_ore', quantity: 1, chance: 0.25 },
        { id: 'gold_ore', quantity: 1, chance: 0.1 },
        { id: 'mithril_ore', quantity: 1, chance: 0.01 },
        { id: 'uncut_sapphire', quantity: 1, chance: 0.01 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 63 }
      ]
    },
    {
      id: 'pickpocket_alchemist',
      name: 'Pickpocket Alchemist',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 70,
      experience: 125,
      baseTime: 4800,
      itemReward: { id: 'coins', name: 'Coins', quantity: 100 },
      possibleLoot: [
        { id: 'coins', quantity: 100, chance: 1.0 },
        { id: 'attack_potion', quantity: 1, chance: 0.1 },
        { id: 'strength_potion', quantity: 1, chance: 0.1 },
        { id: 'defence_potion', quantity: 1, chance: 0.1 },
        { id: 'ranging_potion', quantity: 1, chance: 0.1 },
        { id: 'magic_potion', quantity: 1, chance: 0.1 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 70 }
      ]
    },
    {
      id: 'pickpocket_knight',
      name: 'Pickpocket Knight',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 80,
      experience: 150,
      baseTime: 5000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 140 },
      possibleLoot: [
        { id: 'coins', quantity: 140, chance: 1.0 },
        { id: 'mithril_platebody', quantity: 1, chance: 0.01 },
        { id: 'mithril_platelegs', quantity: 1, chance: 0.01 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 80 }
      ]
    },
    {
      id: 'pickpocket_vampire',
      name: 'Pickpocket Vampire',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 86,
      experience: 180,
      baseTime: 5200,
      itemReward: { id: 'coins', name: 'Coins', quantity: 180 },
      possibleLoot: [
        { id: 'coins', quantity: 180, chance: 1.0 },
        { id: 'chaos_rune', quantity: 1, chance: 0.1 },
        { id: 'blood_rune', quantity: 1, chance: 0.05 },
        { id: 'death_rune', quantity: 1, chance: 0.05 },
        { id: 'adamantite_ore', quantity: 1, chance: 0.01 },
        { id: 'uncut_ruby', quantity: 1, chance: 0.01 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 86 }
      ]
    },
    {
      id: 'pickpocket_elf',
      name: 'Pickpocket Elf',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 90,
      experience: 220,
      baseTime: 5500,
      itemReward: { id: 'coins', name: 'Coins', quantity: 240 },
      possibleLoot: [
        { id: 'coins', quantity: 240, chance: 1.0 },
        { id: 'nature_rune', quantity: 1, chance: 0.1 },
        { id: 'rune_scimitar', quantity: 1, chance: 0.01 },
        { id: 'rune_full_helm', quantity: 1, chance: 0.01 },
        { id: 'adamant_kiteshield', quantity: 1, chance: 0.01 },
        { id: 'uncut_diamond', quantity: 1, chance: 0.01 },
        { id: 'runite_ore', quantity: 1, chance: 0.005 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 90 }
      ]
    },
    {
      id: 'pickpocket_tzhaar',
      name: 'Pickpocket TzHaar',
      type: 'thieving',
      skill: 'thieving',
      levelRequired: 95,
      experience: 280,
      baseTime: 6000,
      itemReward: { id: 'coins', name: 'Coins', quantity: 280 },
      possibleLoot: [
        { id: 'coins', quantity: 280, chance: 1.0 },
        { id: 'silver_ore', quantity: 1, chance: 0.2 },
        { id: 'gold_ore', quantity: 1, chance: 0.2 },
        { id: 'uncut_sapphire', quantity: 1, chance: 0.1 },
        { id: 'uncut_emerald', quantity: 1, chance: 0.1 },
        { id: 'uncut_ruby', quantity: 1, chance: 0.1 },
        { id: 'uncut_diamond', quantity: 1, chance: 0.05 },
        { id: 'uncut_onyx', quantity: 1, chance: 0.00001 }
      ],
      requirements: [
        { type: 'level', skill: 'thieving', level: 95 }
      ]
    }
  ]
};