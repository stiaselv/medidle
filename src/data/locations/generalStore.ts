import type { Location, StoreAction } from '../../types/game';

export const generalStoreLocation: Location = {
  id: 'general_store',
  name: 'General Store',
  description: 'A well-stocked shop where you can buy tools and sell your items.',
  type: 'city',
  levelRequired: 1,
  resources: [],
  category: 'store',
  icon: '/assets/locations/store.png',
  actions: [
    {
      id: 'general_store',
      name: 'General Store',
      type: 'store',
      skill: 'none',
      levelRequired: 1,
      experience: 0,
      baseTime: 0,
      itemReward: { id: '', name: '', quantity: 0 },
      storeTabs: [
        {
          id: 'woodcutting',
          name: 'Woodcutting',
          items: [
            {
              id: 'bronze_axe',
              name: 'Bronze Axe',
              buyPrice: 100,
              sellPrice: 40,
              levelRequired: 1,
              quantity: 999
            },
            {
              id: 'iron_axe',
              name: 'Iron Axe',
              buyPrice: 250,
              sellPrice: 100,
              levelRequired: 5,
              quantity: 999
            },
            {
              id: 'steel_axe',
              name: 'Steel Axe',
              buyPrice: 500,
              sellPrice: 200,
              levelRequired: 20,
              quantity: 999
            },
            {
              id: 'mithril_axe',
              name: 'Mithril Axe',
              buyPrice: 1000,
              sellPrice: 400,
              levelRequired: 30,
              quantity: 999
            },
            {
              id: 'adamant_axe',
              name: 'Adamant Axe',
              buyPrice: 2000,
              sellPrice: 800,
              levelRequired: 40,
              quantity: 999
            },
            {
              id: 'rune_axe',
              name: 'Rune Axe',
              buyPrice: 4000,
              sellPrice: 1600,
              levelRequired: 50,
              quantity: 999
            }
          ]
        },
        {
          id: 'mining',
          name: 'Mining',
          items: [
            {
              id: 'bronze_pickaxe',
              name: 'Bronze Pickaxe',
              buyPrice: 100,
              sellPrice: 40,
              levelRequired: 1,
              quantity: 999
            },
            {
              id: 'iron_pickaxe',
              name: 'Iron Pickaxe',
              buyPrice: 250,
              sellPrice: 100,
              levelRequired: 5,
              quantity: 999
            },
            {
              id: 'steel_pickaxe',
              name: 'Steel Pickaxe',
              buyPrice: 500,
              sellPrice: 200,
              levelRequired: 20,
              quantity: 999
            },
            {
              id: 'mithril_pickaxe',
              name: 'Mithril Pickaxe',
              buyPrice: 1000,
              sellPrice: 400,
              levelRequired: 30,
              quantity: 999
            },
            {
              id: 'adamant_pickaxe',
              name: 'Adamant Pickaxe',
              buyPrice: 2000,
              sellPrice: 800,
              levelRequired: 40,
              quantity: 999
            },
            {
              id: 'rune_pickaxe',
              name: 'Rune Pickaxe',
              buyPrice: 4000,
              sellPrice: 1600,
              levelRequired: 50,
              quantity: 999
            }
          ]
        },
        {
          id: 'fishing',
          name: 'Fishing',
          items: [
            {
              id: 'small_fishing_net',
              name: 'Small Fishing Net',
              buyPrice: 50,
              sellPrice: 20,
              levelRequired: 1,
              quantity: 999
            },
            {
              id: 'big_fishing_net',
              name: 'Big Fishing Net',
              buyPrice: 100,
              sellPrice: 40,
              levelRequired: 1,
              quantity: 999
            },
            {
              id: 'fly_fishing_rod',
              name: 'Fly Fishing Rod',
              buyPrice: 100,
              sellPrice: 40,
              levelRequired: 1,
              quantity: 999
            },
            {
              id: 'lobster_pot',
              name: 'Lobster Pot',
              buyPrice: 200,
              sellPrice: 80,
              levelRequired: 1,
              quantity: 999
            },
            {
              id: 'harpoon',
              name: 'Harpoon',
              buyPrice: 200,
              sellPrice: 80,
              levelRequired: 1,
              quantity: 999
            }
          ]
        },
        {
          id: 'gloves',
          name: 'Gloves',
          items: [
            {
              id: 'leather_gloves',
              name: 'Leather Gloves',
              buyPrice: 50,
              sellPrice: 20,
              levelRequired: 1,
              quantity: 999
            },
            {
              id: 'iron_gloves',
              name: 'Iron Gloves',
              buyPrice: 100,
              sellPrice: 40,
              levelRequired: 1,
              quantity: 999
            },
            {
              id: 'steel_gloves',
              name: 'Steel Gloves',
              buyPrice: 200,
              sellPrice: 80,
              levelRequired: 1,
              quantity: 999
            }
          ]
        },
        {
          id: 'skillcapes',
          name: 'Skillcapes',
          items: [
            {
              id: 'attack_skillcape',
              name: 'Attack Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'strength_skillcape',
              name: 'Strength Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'defence_skillcape',
              name: 'Defence Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'hitpoints_skillcape',
              name: 'Hitpoints Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'ranged_skillcape',
              name: 'Ranged Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'prayer_skillcape',
              name: 'Prayer Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'magic_skillcape',
              name: 'Magic Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'woodcutting_skillcape',
              name: 'Woodcutting Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'fishing_skillcape',
              name: 'Fishing Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'mining_skillcape',
              name: 'Mining Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'smithing_skillcape',
              name: 'Smithing Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'cooking_skillcape',
              name: 'Cooking Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'firemaking_skillcape',
              name: 'Firemaking Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'farming_skillcape',
              name: 'Farming Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'runecrafting_skillcape',
              name: 'Runecrafting Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'agility_skillcape',
              name: 'Agility Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'herblore_skillcape',
              name: 'Herblore Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'thieving_skillcape',
              name: 'Thieving Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'crafting_skillcape',
              name: 'Crafting Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'fletching_skillcape',
              name: 'Fletching Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            },
            {
              id: 'slayer_skillcape',
              name: 'Slayer Skillcape',
              buyPrice: 100000,
              sellPrice: 50000,
              levelRequired: 99,
              quantity: 1
            }
          ]
        }
      ]
    }
  ]
}; 