import type { Location } from '../../types/game';

export const fieldsLocation: Location = {
  id: 'fields',
  name: 'Fields',
  description: 'Fertile fields with multiple patches for growing crops, herbs, and trees. Interact with individual patches to plant seeds and grow crops!',
  type: 'skill',
  levelRequired: 1,
  image: '/assets/BG/fields.webp',
  background: '/assets/BG/fields.webp',
  availableSkills: ['farming'],
  actions: [] // No direct actions - farming is done through patch interaction
};
