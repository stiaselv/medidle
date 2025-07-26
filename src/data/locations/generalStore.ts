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
      storeItems: [
        // Woodcutting Tools
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
        },

        // Mining Tools
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
        },

        // Fishing Tools
        {
          id: 'small_net',
          name: 'Small Fishing Net',
          buyPrice: 50,
          sellPrice: 20,
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
          id: 'harpoon',
          name: 'Harpoon',
          buyPrice: 200,
          sellPrice: 80,
          levelRequired: 1,
          quantity: 999
        }
      ]
    }
  ]
}; 