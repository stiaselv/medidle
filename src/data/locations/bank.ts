import type { Location } from '../../types/game';

export const bankLocation: Location = {
  id: 'bank',
  name: 'Bank',
  description: 'A secure bank where you can store and manage your items.',
  type: 'resource',
  levelRequired: 1,
  resources: [],
  category: 'bank',
  icon: '/assets/locations/bank.png',
  availableSkills: [],
  actions: []
}; 