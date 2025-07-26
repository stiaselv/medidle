import type { Location, SkillAction } from '../../types/game';

export const alchemyStationLocation: Location = {
  id: 'alchemy_station',
  name: 'Alchemy Station',
  description: 'A mystical station where you can brew potions and train Herblore.',
  type: 'resource',
  levelRequired: 1,
  resources: [],
  category: 'herblore',
  icon: '/assets/locations/alchemy_station.png',
  availableSkills: ['herblore'],
  actions: [
    {
      id: 'attack_potion',
      name: 'Attack Potion',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 1,
      experience: 25,
      baseTime: 3000,
      itemReward: { id: 'attack_potion', name: 'Attack Potion', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'eye_of_newt', quantity: 1 },
        { type: 'item', itemId: 'guam_leaf', quantity: 1 }
      ]
    },
    {
      id: 'strength_potion',
      name: 'Strength Potion',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 10,
      experience: 50,
      baseTime: 3000,
      itemReward: { id: 'strength_potion', name: 'Strength Potion', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'limpwurt_root', quantity: 1 },
        { type: 'item', itemId: 'tarromin', quantity: 1 }
      ]
    },
    {
      id: 'antipoison',
      name: 'Antipoison',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 13,
      experience: 37.5,
      baseTime: 3000,
      itemReward: { id: 'antipoison', name: 'Antipoison', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'marrentill', quantity: 1 },
        { type: 'item', itemId: 'unicorn_horn_dust', quantity: 1 }
      ]
    },
    {
      id: 'defence_potion',
      name: 'Defence Potion',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 20,
      experience: 50,
      baseTime: 3000,
      itemReward: { id: 'defence_potion', name: 'Defence Potion', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'ranarr_weed', quantity: 1 },
        { type: 'item', itemId: 'white_berries', quantity: 1 }
      ]
    },
    {
      id: 'ranging_potion',
      name: 'Ranging Potion',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 32,
      experience: 62.5,
      baseTime: 3000,
      itemReward: { id: 'ranging_potion', name: 'Ranging Potion', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'dwarf_weed', quantity: 1 },
        { type: 'item', itemId: 'ashes', quantity: 1 }
      ]
    },
    {
      id: 'magic_potion',
      name: 'Magic Potion',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 40,
      experience: 75,
      baseTime: 3000,
      itemReward: { id: 'magic_potion', name: 'Magic Potion', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'avantoe', quantity: 1 },
        { type: 'item', itemId: 'red_spiders_eggs', quantity: 1 }
      ]
    },
    {
      id: 'prayer_potion',
      name: 'Prayer Potion',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 46,
      experience: 87.5,
      baseTime: 3000,
      itemReward: { id: 'prayer_potion', name: 'Prayer Potion', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'ranarr_weed', quantity: 1 },
        { type: 'item', itemId: 'snape_grass', quantity: 1 }
      ]
    },
    {
      id: 'melee_potion',
      name: 'Melee Potion',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 50,
      experience: 100,
      baseTime: 3000,
      itemReward: { id: 'melee_potion', name: 'Melee Potion', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'attack_potion', quantity: 1 },
        { type: 'item', itemId: 'strength_potion', quantity: 1 },
        { type: 'item', itemId: 'defence_potion', quantity: 1 }
      ]
    },
    {
      id: 'bastion_potion',
      name: 'Bastion Potion',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 56,
      experience: 112.5,
      baseTime: 3000,
      itemReward: { id: 'bastion_potion', name: 'Bastion Potion', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'ranging_potion', quantity: 1 },
        { type: 'item', itemId: 'defence_potion', quantity: 1 }
      ]
    },
    {
      id: 'battlemage_potion',
      name: 'Battlemage Potion',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 61,
      experience: 125,
      baseTime: 3000,
      itemReward: { id: 'battlemage_potion', name: 'Battlemage Potion', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'magic_potion', quantity: 1 },
        { type: 'item', itemId: 'defence_potion', quantity: 1 }
      ]
    },
    {
      id: 'super_attack_potion',
      name: 'Super Attack Potion',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 70,
      experience: 150,
      baseTime: 3000,
      itemReward: { id: 'super_attack_potion', name: 'Super Attack Potion', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'irit_leaf', quantity: 1 },
        { type: 'item', itemId: 'eye_of_newt', quantity: 1 }
      ]
    },
    {
      id: 'super_strength_potion',
      name: 'Super Strength Potion',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 74,
      experience: 162.5,
      baseTime: 3000,
      itemReward: { id: 'super_strength_potion', name: 'Super Strength Potion', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'kwuarm', quantity: 1 },
        { type: 'item', itemId: 'cabbage', quantity: 1 }
      ]
    },
    {
      id: 'super_defence_potion',
      name: 'Super Defence Potion',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 79,
      experience: 175,
      baseTime: 3000,
      itemReward: { id: 'super_defence_potion', name: 'Super Defence Potion', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'toadflax', quantity: 1 },
        { type: 'item', itemId: 'white_berries', quantity: 1 }
      ]
    },
    {
      id: 'super_ranging_potion',
      name: 'Super Ranging Potion',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 81,
      experience: 187.5,
      baseTime: 3000,
      itemReward: { id: 'super_ranging_potion', name: 'Super Ranging Potion', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'cadantine', quantity: 1 },
        { type: 'item', itemId: 'snape_grass', quantity: 1 }
      ]
    },
    {
      id: 'super_magic_potion',
      name: 'Super Magic Potion',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 84,
      experience: 200,
      baseTime: 3000,
      itemReward: { id: 'super_magic_potion', name: 'Super Magic Potion', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'snapdragon', quantity: 1 },
        { type: 'item', itemId: 'blue_berries', quantity: 1 }
      ]
    },
    {
      id: 'prayer_regen_potion',
      name: 'Prayer Regen Potion',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 88,
      experience: 212.5,
      baseTime: 3000,
      itemReward: { id: 'prayer_regen_potion', name: 'Prayer Regen Potion', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'harralander', quantity: 1 },
        { type: 'item', itemId: 'silver_dust', quantity: 1 }
      ]
    },
    {
      id: 'super_melee_potion',
      name: 'Super Melee Potion',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 90,
      experience: 225,
      baseTime: 3000,
      itemReward: { id: 'super_melee_potion', name: 'Super Melee Potion', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'super_attack_potion', quantity: 1 },
        { type: 'item', itemId: 'super_strength_potion', quantity: 1 },
        { type: 'item', itemId: 'super_defence_potion', quantity: 1 },
        { type: 'item', itemId: 'torstol', quantity: 1 }
      ]
    },
    {
      id: 'super_bastion_potion',
      name: 'Super Bastion Potion',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 94,
      experience: 237.5,
      baseTime: 3000,
      itemReward: { id: 'super_bastion_potion', name: 'Super Bastion Potion', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'super_ranging_potion', quantity: 1 },
        { type: 'item', itemId: 'super_defence_potion', quantity: 1 },
        { type: 'item', itemId: 'dwarf_weed', quantity: 1 }
      ]
    },
    {
      id: 'super_battlemage_potion',
      name: 'Super Battlemage Potion',
      type: 'herblore',
      skill: 'herblore',
      levelRequired: 97,
      experience: 250,
      baseTime: 3000,
      itemReward: { id: 'super_battlemage_potion', name: 'Super Battlemage Potion', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'super_magic_potion', quantity: 1 },
        { type: 'item', itemId: 'super_defence_potion', quantity: 1 },
        { type: 'item', itemId: 'lantadyme', quantity: 1 }
      ]
    }
  ]
}; 