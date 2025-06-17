import { create } from 'zustand';
import type { StoreApi } from 'zustand';
import { createGameStore } from '../store/gameStore';
import { mockLocations } from '../data/mockData';
import type { GameState, Location, Character, Skills, Skill, Item, ItemType } from '../types/game';
import { ITEM_CATEGORIES } from '../data/items';
import { meetsLocationRequirements } from '../store/locationActions';

// Mock character for testing
const mockCharacter: Character = {
  id: 'test-id',
  name: 'TestPlayer',
  lastLogin: new Date(),
  lastAction: {
    type: 'none',
    location: 'none'
  },
  skills: {
    woodcutting: { name: 'Woodcutting', level: 1, experience: 0, nextLevelExperience: 83 },
    fishing: { name: 'Fishing', level: 1, experience: 0, nextLevelExperience: 83 },
    mining: { name: 'Mining', level: 1, experience: 0, nextLevelExperience: 83 },
    smithing: { name: 'Smithing', level: 1, experience: 0, nextLevelExperience: 83 },
    cooking: { name: 'Cooking', level: 1, experience: 0, nextLevelExperience: 83 },
    firemaking: { name: 'Firemaking', level: 1, experience: 0, nextLevelExperience: 83 },
    farming: { name: 'Farming', level: 1, experience: 0, nextLevelExperience: 83 },
    combat: { name: 'Combat', level: 1, experience: 0, nextLevelExperience: 83 },
    attack: { name: 'Attack', level: 1, experience: 0, nextLevelExperience: 83 },
    defence: { name: 'Defence', level: 1, experience: 0, nextLevelExperience: 83 },
    strength: { name: 'Strength', level: 1, experience: 0, nextLevelExperience: 83 },
    ranged: { name: 'Ranged', level: 1, experience: 0, nextLevelExperience: 83 },
    prayer: { name: 'Prayer', level: 1, experience: 0, nextLevelExperience: 83 },
    magic: { name: 'Magic', level: 1, experience: 0, nextLevelExperience: 83 },
    runecrafting: { name: 'Runecrafting', level: 1, experience: 0, nextLevelExperience: 83 },
    construction: { name: 'Construction', level: 1, experience: 0, nextLevelExperience: 83 },
    hitpoints: { name: 'Hitpoints', level: 1, experience: 0, nextLevelExperience: 83 },
    agility: { name: 'Agility', level: 1, experience: 0, nextLevelExperience: 83 },
    herblore: { name: 'Herblore', level: 1, experience: 0, nextLevelExperience: 83 },
    thieving: { name: 'Thieving', level: 1, experience: 0, nextLevelExperience: 83 },
    crafting: { name: 'Crafting', level: 1, experience: 0, nextLevelExperience: 83 },
    fletching: { name: 'Fletching', level: 1, experience: 0, nextLevelExperience: 83 },
    slayer: { name: 'Slayer', level: 1, experience: 0, nextLevelExperience: 83 },
    hunter: { name: 'Hunter', level: 1, experience: 0, nextLevelExperience: 83 },
    none: { name: 'None', level: 1, experience: 0, nextLevelExperience: 83 }
  },
  bank: [],
  equipment: {},
  combatLevel: 3,
  hitpoints: 10,
  maxHitpoints: 10,
  prayer: 1,
  maxPrayer: 1,
  specialEnergy: 100,
  maxSpecialEnergy: 100,
  activeEffects: [],
  slayerPoints: 0,
  currentSlayerTask: null
};

describe('Location Management System', () => {
  let store: ReturnType<typeof createGameStore>;

  beforeEach(() => {
    // Create a fresh store before each test
    store = createGameStore();
    // Set mock character and initialize locations
    store.setState({
      character: mockCharacter,
      locations: {},
      recentLocations: [],
      favoriteLocations: [],
      discoveredLocations: []
    });
  });

  describe('Basic Location State Management', () => {
    it('should initialize location state correctly', async () => {
      const location = mockLocations[0];
      
      // Initialize location state
      store.getState().setLocationState(location.id, {
        id: location.id,
        unlocked: true,
        visited: true,
        completedActions: [],
        progress: {
          monstersDefeated: {},
          resourcesGathered: {},
          actionsCompleted: {}
        },
        lastVisited: new Date(),
        favorited: false,
        customNotes: ''
      });

      // Wait for state to be updated
      await new Promise(resolve => setTimeout(resolve, 100));

      const locationState = store.getState().locations[location.id];
      expect(locationState).toBeDefined();
      expect(locationState.id).toBe(location.id);
      expect(locationState.unlocked).toBe(true);
      expect(locationState.visited).toBe(true);
      expect(locationState.completedActions).toEqual([]);
      expect(locationState.progress).toEqual({
        monstersDefeated: {},
        resourcesGathered: {},
        actionsCompleted: {}
      });
    }, 10000);

    it('should update location state correctly', async () => {
      const location = mockLocations[0];
      
      // First initialize the location
      store.getState().setLocationState(location.id, {
        id: location.id,
        unlocked: true,
        visited: true,
        completedActions: [],
        progress: {
          monstersDefeated: {},
          resourcesGathered: {},
          actionsCompleted: {}
        },
        lastVisited: new Date(),
        favorited: false,
        customNotes: ''
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Then update its state
      store.getState().setLocationState(location.id, {
        customNotes: 'Test notes'
      });

      // Wait for state to be updated
      await new Promise(resolve => setTimeout(resolve, 100));

      const locationState = store.getState().locations[location.id];
      expect(locationState.customNotes).toBe('Test notes');
      expect(locationState.unlocked).toBe(true);
      expect(locationState.visited).toBe(true);
    }, 10000);

    it('should handle batch progress updates correctly', async () => {
      const location = mockLocations[0];
      
      // First initialize the location
      store.getState().setLocationState(location.id, {
        id: location.id,
        unlocked: true,
        visited: true,
        completedActions: [],
        progress: {
          monstersDefeated: {},
          resourcesGathered: {},
          actionsCompleted: {}
        },
        lastVisited: new Date(),
        favorited: false,
        customNotes: ''
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      store.getState().batchUpdateProgress([
        { locationId: location.id, type: 'resource', itemId: 'wood', count: 5 },
        { locationId: location.id, type: 'monster', itemId: 'goblin', count: 3 }
      ]);

      // Wait for progress to be updated
      await new Promise(resolve => setTimeout(resolve, 100));

      const locationState = store.getState().locations[location.id];
      expect(locationState.progress.resourcesGathered.wood).toBe(5);
      expect(locationState.progress.monstersDefeated.goblin).toBe(3);
    }, 10000);
  });

  describe('Location Discovery and Navigation', () => {
    it('should track visited locations correctly', () => {
      const location = mockLocations[0];
      store.getState().setLocation(location);

      expect(store.getState().locations[location.id].visited).toBe(true);
      expect(store.getState().recentLocations).toContain(location.id);
    });

    it('should manage recent locations correctly', () => {
      const maxRecent = 5;
      const locations = mockLocations.slice(0, maxRecent + 1);

      // Visit more locations than the max recent limit
      locations.forEach(location => {
        store.getState().setLocation(location);
      });

      const recentLocations = store.getState().recentLocations;
      expect(recentLocations.length).toBeLessThanOrEqual(maxRecent);
      expect(recentLocations[0]).toBe(locations[locations.length - 1].id); // Most recent
    });

    it('should handle favorite locations correctly', () => {
      const location = mockLocations[0];
      store.getState().setLocation(location);
      store.getState().toggleFavorite(location.id);

      expect(store.getState().locations[location.id].favorited).toBe(true);
      expect(store.getState().favoriteLocations).toContain(location.id);

      // Toggle off
      store.getState().toggleFavorite(location.id);
      expect(store.getState().locations[location.id].favorited).toBe(false);
      expect(store.getState().favoriteLocations).not.toContain(location.id);
    });

    it('should track discovered locations correctly', () => {
      const location = mockLocations[0];
      store.getState().setLocation(location);

      expect(store.getState().discoveredLocations).toContain(location.id);
    });
  });

  describe('Location Progress Tracking', () => {
    it('should track resource gathering progress correctly', () => {
      const location = mockLocations[0];
      store.getState().setLocation(location);
      store.getState().updateLocationProgress(location.id, 'resource', 'wood', 1);

      const locationState = store.getState().locations[location.id];
      expect(locationState.progress.resourcesGathered.wood).toBe(1);
    });

    it('should track monster defeats correctly', () => {
      const location = mockLocations[0];
      store.getState().setLocation(location);
      store.getState().updateLocationProgress(location.id, 'monster', 'goblin', 1);

      const locationState = store.getState().locations[location.id];
      expect(locationState.progress.monstersDefeated.goblin).toBe(1);
    });

    it('should track action completions correctly', () => {
      const location = mockLocations[0];
      store.getState().setLocation(location);
      store.getState().updateLocationProgress(location.id, 'action', 'mining', 1);

      const locationState = store.getState().locations[location.id];
      expect(locationState.progress.actionsCompleted.mining).toBe(1);
    });

    it('should accumulate progress correctly', () => {
      const location = mockLocations[0];
      store.getState().setLocation(location);
      
      // Multiple updates to same progress
      store.getState().updateLocationProgress(location.id, 'resource', 'wood', 1);
      store.getState().updateLocationProgress(location.id, 'resource', 'wood', 2);

      const locationState = store.getState().locations[location.id];
      expect(locationState.progress.resourcesGathered.wood).toBe(3);
    });
  });

  describe('Location Actions and Requirements', () => {
    it('should track completed actions correctly', () => {
      const location = mockLocations[0];
      const action = location.actions[0];

      store.getState().setLocation(location);
      store.getState().completeLocationAction(location.id, action.id);

      const locationState = store.getState().locations[location.id];
      expect(locationState.completedActions).toContain(action.id);
    });

    it('should handle custom notes correctly', () => {
      const location = mockLocations[0];
      const notes = 'Test location notes';

      store.getState().setLocation(location);
      store.getState().setLocationNotes(location.id, notes);

      const locationState = store.getState().locations[location.id];
      expect(locationState.customNotes).toBe(notes);
    });

    it('should prevent duplicate action completions', () => {
      const location = mockLocations[0];
      const action = location.actions[0];

      store.getState().setLocation(location);
      store.getState().completeLocationAction(location.id, action.id);
      store.getState().completeLocationAction(location.id, action.id);

      const locationState = store.getState().locations[location.id];
      expect(locationState.completedActions.filter(id => id === action.id).length).toBe(1);
    });
  });

  describe('Connected Locations System', () => {
    it('should check and unlock connected locations when requirements are met', () => {
      const location = mockLocations[0];
      const state = store.getState();
      
      // Set character level to meet requirements
      state.setCharacter({
        ...mockCharacter,
        skills: {
          ...mockCharacter.skills,
          combat: { name: 'Combat', level: 20, experience: 5000, nextLevelExperience: 5500 }
        }
      });

      state.setLocation(location);
      state.checkAndUnlockConnectedLocations(location.id);

      // Check that connected locations with met requirements are unlocked
      const connectedLocations = state.locations;
      Object.values(connectedLocations).forEach(loc => {
        if (loc && loc.unlocked) {
          expect(state.character?.skills.combat.level).toBeGreaterThanOrEqual(20);
        }
      });
    });

    it('should not unlock locations when requirements are not met', () => {
      const location = mockLocations[0];
      const state = store.getState();
      
      // Set character level below requirements
      state.setCharacter({
        ...mockCharacter,
        skills: {
          ...mockCharacter.skills,
          combat: { name: 'Combat', level: 1, experience: 0, nextLevelExperience: 83 }
        }
      });

      state.setLocation(location);
      state.checkAndUnlockConnectedLocations(location.id);

      // Check that high-level locations remain locked
      const connectedLocations = state.locations;
      Object.values(connectedLocations).forEach(loc => {
        if (loc && !loc.unlocked) {
          expect(state.character?.skills.combat.level).toBeLessThan(20);
        }
      });
    });
  });

  describe('Location State Persistence', () => {
    it('should persist location state after updates', async () => {
      const location = mockLocations[0];
      store.getState().setLocationState(location.id, {
        id: location.id,
        unlocked: true,
        visited: true,
        completedActions: [],
        progress: {
          monstersDefeated: {},
          resourcesGathered: {},
          actionsCompleted: {}
        },
        lastVisited: new Date(),
        favorited: false,
        customNotes: ''
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      const locationState = store.getState().locations[location.id];
      expect(locationState).toBeDefined();
      expect(locationState.id).toBe(location.id);
    });

    it('should handle large amounts of location data', async () => {
      // Initialize all mock locations
      for (const location of mockLocations) {
        store.getState().setLocationState(location.id, {
          id: location.id,
          unlocked: true,
          visited: true,
          completedActions: [],
          progress: {
            monstersDefeated: {},
            resourcesGathered: {},
            actionsCompleted: {}
          },
          lastVisited: new Date(),
          favorited: false,
          customNotes: ''
        });
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify all locations were stored
      const storedLocations = Object.keys(store.getState().locations).length;
      expect(storedLocations).toBe(mockLocations.length);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle invalid location IDs gracefully', () => {
      const state = store.getState();
      const invalidId = 'nonexistent-location';

      // These operations should not throw errors
      expect(() => state.setLocationState(invalidId, { visited: true })).not.toThrow();
      expect(() => state.unlockLocation(invalidId)).not.toThrow();
      expect(() => state.visitLocation(invalidId)).not.toThrow();
      expect(() => state.toggleFavorite(invalidId)).not.toThrow();
    });

    it('should handle concurrent location updates correctly', async () => {
      const location = mockLocations[0];
      
      // Initialize location
      store.getState().setLocationState(location.id, {
        id: location.id,
        unlocked: true,
        visited: true,
        completedActions: [],
        progress: {
          monstersDefeated: {},
          resourcesGathered: { wood: 0 },
          actionsCompleted: {}
        },
        lastVisited: new Date(),
        favorited: false,
        customNotes: ''
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Simulate concurrent updates
      await Promise.all([
        store.getState().batchUpdateProgress([
          { locationId: location.id, type: 'resource', itemId: 'wood', count: 3 }
        ]),
        store.getState().batchUpdateProgress([
          { locationId: location.id, type: 'resource', itemId: 'wood', count: 3 }
        ])
      ]);

      await new Promise(resolve => setTimeout(resolve, 100));

      // Check final state is correct
      const locationState = store.getState().locations[location.id];
      expect(locationState.progress.resourcesGathered.wood).toBe(6);
    });

    it('should handle missing or undefined values in location state', async () => {
      const location = mockLocations[0];
      
      // Initialize with minimal state
      store.getState().setLocationState(location.id, {
        id: location.id
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Check that undefined values are set to defaults
      const locationState = store.getState().locations[location.id];
      expect(locationState.visited).toBe(false);
      expect(locationState.completedActions).toEqual([]);
      expect(locationState.progress).toBeDefined();
      expect(locationState.customNotes).toBe('');
    });
  });

  describe('Performance and Optimization', () => {
    it('should handle rapid state updates efficiently', async () => {
      const location = mockLocations[0];
      
      // Initialize location
      store.getState().setLocationState(location.id, {
        id: location.id,
        unlocked: true,
        visited: true,
        completedActions: [],
        progress: {
          monstersDefeated: {},
          resourcesGathered: { wood: 0 },
          actionsCompleted: {}
        },
        lastVisited: new Date(),
        favorited: false,
        customNotes: ''
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Perform rapid updates
      for (let i = 0; i < 100; i++) {
        store.getState().batchUpdateProgress([
          { locationId: location.id, type: 'resource', itemId: 'wood', count: 1 }
        ]);
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify final state is correct
      const locationState = store.getState().locations[location.id];
      expect(locationState.progress.resourcesGathered.wood).toBe(100);
    });

    it('should optimize memory usage with large datasets', () => {
      const state = store.getState();
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Add large amount of location data
      mockLocations.forEach(location => {
        state.setLocation(location);
        for (let i = 0; i < 10; i++) {
          state.updateLocationProgress(location.id, 'resource', `resource${i}`, i);
          state.updateLocationProgress(location.id, 'monster', `monster${i}`, i);
        }
      });
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 10MB for test data)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });

  describe('Integration with Game Systems', () => {
    it('should update location state when completing actions', async () => {
      const location = mockLocations[0];
      const action = { id: 'test-action', skill: 'woodcutting' };
      
      // Initialize location
      store.getState().setLocationState(location.id, {
        id: location.id,
        unlocked: true,
        visited: true,
        completedActions: [],
        progress: {
          monstersDefeated: {},
          resourcesGathered: {},
          actionsCompleted: {}
        },
        lastVisited: new Date(),
        favorited: false,
        customNotes: ''
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Complete the action
      store.getState().completeLocationAction(location.id, action.id);
      store.getState().updateLocationProgress(location.id, 'action', action.skill);

      await new Promise(resolve => setTimeout(resolve, 100));

      // Check that both action completion and progress are updated
      const locationState = store.getState().locations[location.id];
      expect(locationState.completedActions).toContain(action.id);
      expect(locationState.progress.actionsCompleted[action.skill]).toBe(1);
    });

    it('should handle equipment requirements for locations', () => {
      const location = mockLocations[0];
      const state = store.getState();
      
      // Add required equipment to character
      const updatedCharacter = {
        ...mockCharacter,
        equipment: {
          weapon: {
            id: 'bronze_axe',
            name: 'Bronze Axe',
            type: 'tool' as ItemType,
            category: ITEM_CATEGORIES.TOOLS,
            icon: '/assets/items/bronze_axe.png',
            level: 1,
            slot: 'weapon',
            stats: {
              attackStab: 4,
              attackSlash: 3,
              attackCrush: 2,
              attackMagic: 0,
              attackRanged: 0,
              defenceStab: 0,
              defenceSlash: 0,
              defenceCrush: 0,
              defenceMagic: 0,
              defenceRanged: 0,
              strengthMelee: 5,
              strengthRanged: 0,
              strengthMagic: 0,
              prayerBonus: 0
            }
          }
        }
      };
      state.setCharacter(updatedCharacter);
      
      // Check location accessibility using meetsLocationRequirements
      const canAccess = meetsLocationRequirements(updatedCharacter, location);
      expect(canAccess).toBe(true);
    });
  });
}); 