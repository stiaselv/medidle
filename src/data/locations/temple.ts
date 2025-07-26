import type { Location } from '../../types/game';
import { ITEM_CATEGORIES } from '../../constants/items';

export const templeLocation: Location = {
  id: 'temple',
  name: 'Temple',
  description: 'A sacred temple where you can train your prayer skill by burying bones and craft runes for magic.',
  type: 'resource',
  levelRequired: 1,
  monsters: [],
  resources: ['bones'],
  category: ITEM_CATEGORIES.MISC,
  icon: '/assets/BG/temple.webp',
  availableSkills: ['prayer', 'runecrafting'],
  actions: [
    // Prayer actions
    {
      id: 'bury_bones',
      name: 'Bury Bones',
      type: 'prayer',
      skill: 'prayer',
      levelRequired: 1,
      experience: 4.5,
      baseTime: 2000,
      itemReward: { id: 'none', name: 'None', quantity: 0 },
      requirements: [
        { type: 'item', itemId: 'bones', quantity: 1, description: '1 Bones' }
      ]
    },
    {
      id: 'bury_big_bones',
      name: 'Bury Big Bones',
      type: 'prayer',
      skill: 'prayer',
      levelRequired: 1,
      experience: 15,
      baseTime: 2000,
      itemReward: { id: 'none', name: 'None', quantity: 0 },
      requirements: [
        { type: 'item', itemId: 'big_bones', quantity: 1, description: '1 Big Bones' }
      ]
    },
    {
      id: 'bury_baby_dragon_bones',
      name: 'Bury Baby Dragon Bones',
      type: 'prayer',
      skill: 'prayer',
      levelRequired: 1,
      experience: 30,
      baseTime: 2000,
      itemReward: { id: 'none', name: 'None', quantity: 0 },
      requirements: [
        { type: 'item', itemId: 'baby_dragon_bones', quantity: 1, description: '1 Baby Dragon Bones' }
      ]
    },
    {
      id: 'bury_dragon_bones',
      name: 'Bury Dragon Bones',
      type: 'prayer',
      skill: 'prayer',
      levelRequired: 1,
      experience: 72,
      baseTime: 2000,
      itemReward: { id: 'none', name: 'None', quantity: 0 },
      requirements: [
        { type: 'item', itemId: 'dragon_bones', quantity: 1, description: '1 Dragon Bones' }
      ]
    },
    {
      id: 'bury_superior_dragon_bones',
      name: 'Bury Superior Dragon Bones',
      type: 'prayer',
      skill: 'prayer',
      levelRequired: 1,
      experience: 150,
      baseTime: 2000,
      itemReward: { id: 'none', name: 'None', quantity: 0 },
      requirements: [
        { type: 'item', itemId: 'superior_dragon_bones', quantity: 1, description: '1 Superior Dragon Bones' }
      ]
    },

    // Runecrafting actions
    {
      id: 'craft_air_rune',
      name: 'Craft Air Rune',
      type: 'runecrafting',
      skill: 'runecrafting',
      levelRequired: 1,
      experience: 5,
      baseTime: 3000,
      itemReward: { id: 'air_rune', name: 'Air Rune', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'pure_essence', quantity: 1, description: '1 Pure Essence' }
      ]
    },
    {
      id: 'craft_mind_rune',
      name: 'Craft Mind Rune',
      type: 'runecrafting',
      skill: 'runecrafting',
      levelRequired: 2,
      experience: 5.5,
      baseTime: 3000,
      itemReward: { id: 'mind_rune', name: 'Mind Rune', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'pure_essence', quantity: 1, description: '1 Pure Essence' }
      ]
    },
    {
      id: 'craft_water_rune',
      name: 'Craft Water Rune',
      type: 'runecrafting',
      skill: 'runecrafting',
      levelRequired: 5,
      experience: 6,
      baseTime: 3000,
      itemReward: { id: 'water_rune', name: 'Water Rune', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'pure_essence', quantity: 1, description: '1 Pure Essence' }
      ]
    },
    {
      id: 'craft_earth_rune',
      name: 'Craft Earth Rune',
      type: 'runecrafting',
      skill: 'runecrafting',
      levelRequired: 9,
      experience: 6.5,
      baseTime: 3000,
      itemReward: { id: 'earth_rune', name: 'Earth Rune', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'pure_essence', quantity: 1, description: '1 Pure Essence' }
      ]
    },
    {
      id: 'craft_fire_rune',
      name: 'Craft Fire Rune',
      type: 'runecrafting',
      skill: 'runecrafting',
      levelRequired: 14,
      experience: 7,
      baseTime: 3000,
      itemReward: { id: 'fire_rune', name: 'Fire Rune', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'pure_essence', quantity: 1, description: '1 Pure Essence' }
      ]
    },
    {
      id: 'craft_body_rune',
      name: 'Craft Body Rune',
      type: 'runecrafting',
      skill: 'runecrafting',
      levelRequired: 20,
      experience: 7.5,
      baseTime: 3000,
      itemReward: { id: 'body_rune', name: 'Body Rune', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'pure_essence', quantity: 1, description: '1 Pure Essence' }
      ]
    },
    {
      id: 'craft_cosmic_rune',
      name: 'Craft Cosmic Rune',
      type: 'runecrafting',
      skill: 'runecrafting',
      levelRequired: 27,
      experience: 8,
      baseTime: 3000,
      itemReward: { id: 'cosmic_rune', name: 'Cosmic Rune', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'pure_essence', quantity: 1, description: '1 Pure Essence' }
      ]
    },
    {
      id: 'craft_chaos_rune',
      name: 'Craft Chaos Rune',
      type: 'runecrafting',
      skill: 'runecrafting',
      levelRequired: 35,
      experience: 8.5,
      baseTime: 3000,
      itemReward: { id: 'chaos_rune', name: 'Chaos Rune', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'pure_essence', quantity: 1, description: '1 Pure Essence' }
      ]
    },
    {
      id: 'craft_astral_rune',
      name: 'Craft Astral Rune',
      type: 'runecrafting',
      skill: 'runecrafting',
      levelRequired: 40,
      experience: 9,
      baseTime: 3000,
      itemReward: { id: 'astral_rune', name: 'Astral Rune', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'pure_essence', quantity: 1, description: '1 Pure Essence' }
      ]
    },
    {
      id: 'craft_nature_rune',
      name: 'Craft Nature Rune',
      type: 'runecrafting',
      skill: 'runecrafting',
      levelRequired: 44,
      experience: 9.5,
      baseTime: 3000,
      itemReward: { id: 'nature_rune', name: 'Nature Rune', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'pure_essence', quantity: 1, description: '1 Pure Essence' }
      ]
    },
    {
      id: 'craft_law_rune',
      name: 'Craft Law Rune',
      type: 'runecrafting',
      skill: 'runecrafting',
      levelRequired: 54,
      experience: 10,
      baseTime: 3000,
      itemReward: { id: 'law_rune', name: 'Law Rune', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'pure_essence', quantity: 1, description: '1 Pure Essence' }
      ]
    },
    {
      id: 'craft_death_rune',
      name: 'Craft Death Rune',
      type: 'runecrafting',
      skill: 'runecrafting',
      levelRequired: 65,
      experience: 10.5,
      baseTime: 3000,
      itemReward: { id: 'death_rune', name: 'Death Rune', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'pure_essence', quantity: 1, description: '1 Pure Essence' }
      ]
    },
    {
      id: 'craft_blood_rune',
      name: 'Craft Blood Rune',
      type: 'runecrafting',
      skill: 'runecrafting',
      levelRequired: 77,
      experience: 11,
      baseTime: 3000,
      itemReward: { id: 'blood_rune', name: 'Blood Rune', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'pure_essence', quantity: 1, description: '1 Pure Essence' }
      ]
    },
    {
      id: 'craft_soul_rune',
      name: 'Craft Soul Rune',
      type: 'runecrafting',
      skill: 'runecrafting',
      levelRequired: 90,
      experience: 11.5,
      baseTime: 3000,
      itemReward: { id: 'soul_rune', name: 'Soul Rune', quantity: 1 },
      requirements: [
        { type: 'item', itemId: 'pure_essence', quantity: 1, description: '1 Pure Essence' }
      ]
    }
  ]
}; 