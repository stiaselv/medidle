import type { SetState, GetState } from 'zustand';
import type { GameState, Location, LocationState, Character } from '../types/game';
import { mockLocations } from '../data/mockData';

// Helper function to check if a character meets location requirements
export const meetsLocationRequirements = (character: Character, location: Location): boolean => {
  if (!character || !location) return false;
  
  // Check level requirement
  if (location.levelRequired > character.combatLevel) {
    return false;
  }

  // Check if any actions are available
  const hasAvailableActions = location.actions.some(action => {
    // Check action level requirement
    if (action.levelRequired > character.skills[action.skill].level) {
      return false;
    }

    // Check equipment requirements
    if (action.requirements?.some(req => {
      if (req.type === 'equipment' && req.itemId) {
        return !character.equipment[req.itemId];
      }
      return false;
    })) {
      return false;
    }

    return true;
  });

  return hasAvailableActions;
};

// Helper function to get connected locations
const getConnectedLocations = (locationId: string): Location[] => {
  const location = mockLocations.find(loc => loc.id === locationId);
  if (!location) return [];

  // Get locations that share resources or have related actions
  return mockLocations.filter(loc => {
    // Skip self
    if (loc.id === locationId) return false;

    // Check for shared resources
    const hasSharedResources = location.resources.some(resource => 
      loc.resources.includes(resource)
    );

    // Check for related actions (e.g., cooking requires fishing products)
    const hasRelatedActions = location.actions.some(action => 
      loc.actions.some(locAction => {
        // Check if action requires items from this location
        return locAction.requirements?.some(req =>
          req.type === 'item' && action.itemReward?.id === req.itemId
        );
      })
    );

    return hasSharedResources || hasRelatedActions;
  });
};

// Location slice for game store integration
export const locationSlice = (set: SetState<GameState>, get: GetState<GameState>) => {
  // Return actions and state getters
  return {
    // Initial state
    locations: {} as Record<string, LocationState>,
    recentLocations: [] as string[],
    favoriteLocations: [] as string[],
    discoveredLocations: [] as string[],

    // Add all location actions
    ...locationActions(set, get)
  };
};

// Location actions for state management
export const locationActions = (set: SetState<GameState>, get: GetState<GameState>) => ({
  // Location State Management
  setLocationState: (locationId: string, state: Partial<LocationState>) => {
    set((currentState) => {
      // Get current location state or use default
      const currentLocationState = currentState.locations[locationId] || {
        id: locationId,
        unlocked: false,
        visited: false,
        completedActions: [],
        progress: {
          monstersDefeated: {},
          resourcesGathered: {},
          actionsCompleted: {}
        },
        lastVisited: new Date(),
        favorited: false,
        customNotes: ''
      };

      // Create a new locations object with the updated state
      return {
        ...currentState,
        locations: {
          ...currentState.locations,
          [locationId]: {
            ...currentLocationState,
            ...state
          }
        }
      };
    });
  },

  // Location Discovery and Navigation
  setLocation: (location: Location | undefined) => {
    if (!location) {
      set({ currentLocation: undefined });
      return;
    }

    const state = get();
    
    // Initialize location state if it doesn't exist
    if (!state.locations[location.id]) {
      set((currentState) => ({
        ...currentState,
        locations: {
          ...currentState.locations,
          [location.id]: {
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
          }
        }
      }));
    } else {
      // Update visited state and last visited time
      set((currentState) => ({
        ...currentState,
        locations: {
          ...currentState.locations,
          [location.id]: {
            ...currentState.locations[location.id],
            visited: true,
            lastVisited: new Date()
          }
        }
      }));
    }

    // Update current location
    set((currentState) => ({
      ...currentState,
      currentLocation: location
    }));

    // Update recent locations
    state.addToRecentLocations(location.id);

    // Add to discovered locations if not already discovered
    if (!state.discoveredLocations.includes(location.id)) {
      set((currentState) => ({
        ...currentState,
        discoveredLocations: [...currentState.discoveredLocations, location.id]
      }));
    }
  },

  // Location Progress Tracking
  updateLocationProgress: (locationId: string, type: 'monster' | 'resource' | 'action', itemId: string, count = 1) => {
    const state = get();
    const locationState = state.locations[locationId];
    if (!locationState) return;

    const progress = { ...locationState.progress };
    if (type === 'resource') {
      progress.resourcesGathered = {
        ...progress.resourcesGathered,
        [itemId]: (progress.resourcesGathered[itemId] || 0) + count
      };
    } else if (type === 'monster') {
      progress.monstersDefeated = {
        ...progress.monstersDefeated,
        [itemId]: (progress.monstersDefeated[itemId] || 0) + count
      };
    } else if (type === 'action') {
      progress.actionsCompleted = {
        ...progress.actionsCompleted,
        [itemId]: (progress.actionsCompleted[itemId] || 0) + count
      };
    }

    state.setLocationState(locationId, { progress });
  },

  batchUpdateProgress: (updates: Array<{ locationId: string; type: 'resource' | 'monster' | 'action'; itemId: string; count: number }>) => {
    const state = get();
    
    updates.forEach(update => {
      state.updateLocationProgress(update.locationId, update.type, update.itemId, update.count);
    });
  },

  // Location Discovery and Navigation
  addToRecentLocations: (locationId: string) => {
    set((state) => {
      const recentLocations = [
        locationId,
        ...state.recentLocations.filter(id => id !== locationId)
      ].slice(0, 5);

      return {
        ...state,
        recentLocations
      };
    });
  },

  toggleFavorite: (locationId: string) => {
    const state = get();
    const locationState = state.locations[locationId];
    if (!locationState) return;

    const isFavorited = !locationState.favorited;
    state.setLocationState(locationId, { favorited: isFavorited });

    set((currentState) => {
      const favoriteLocations = isFavorited
        ? [...currentState.favoriteLocations, locationId]
        : currentState.favoriteLocations.filter(id => id !== locationId);

      return {
        ...currentState,
        favoriteLocations
      };
    });
  },

  setLocationNotes: (locationId: string, notes: string) => {
    const state = get();
    state.setLocationState(locationId, { customNotes: notes });
  },

  // Location Actions and Requirements
  completeLocationAction: (locationId: string, actionId: string) => {
    const state = get();
    const locationState = state.locations[locationId];
    if (!locationState) return;

    // Update completed actions
    const completedActions = [...locationState.completedActions];
    if (!completedActions.includes(actionId)) {
      completedActions.push(actionId);
    }

    // Update action completion progress
    const progress = { ...locationState.progress };
    progress.actionsCompleted = {
      ...progress.actionsCompleted,
      [actionId]: (progress.actionsCompleted[actionId] || 0) + 1
    };

    state.setLocationState(locationId, {
      completedActions,
      progress
    });
  },

  unlockLocation: (locationId: string) => {
    const { setLocationState } = get();
    setLocationState(locationId, { unlocked: true });
  },

  visitLocation: (locationId: string) => {
    const { setLocationState, addToRecentLocations } = get();
    setLocationState(locationId, {
      visited: true,
      lastVisited: new Date()
    });
    addToRecentLocations(locationId);
  },

  discoverLocation: (locationId: string) => {
    const { discoveredLocations } = get();
    if (!discoveredLocations.includes(locationId)) {
      set({
        discoveredLocations: [...discoveredLocations, locationId]
      });
    }
  },

  // Add new actions
  checkAndUnlockConnectedLocations: (locationId: string) => {
    const { character, locations, unlockLocation } = get();
    if (!character) return;

    // Get connected locations
    const connectedLocations = getConnectedLocations(locationId);

    // Check and unlock each connected location
    connectedLocations.forEach(location => {
      const locationState = locations[location.id];
      
      // Skip if already unlocked
      if (locationState?.unlocked) return;

      // Check if requirements are met
      if (meetsLocationRequirements(character, location)) {
        unlockLocation(location.id);
      }
    });
  }
}); 