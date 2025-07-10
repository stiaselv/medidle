import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Character, Item, Location, SkillAction, SkillName, ItemReward, StoreItem, StoreAction, CombatSelectionAction, CombatAction, SlayerTask, Monster, CombatStats, LocationState, GameState, ItemType } from '../types/game';
import { getCombatTriangleMultiplier, getCombatStyle } from '../combat/combatTriangle';
import { mockCharacter, mockLocations, mockMonsters } from '../data/mockData';
import { getItemById } from '../data/items';
import { ITEM_CATEGORIES } from '../data/items';
import { capLevelRequirement } from '../types/game';
import { EASY_MONSTERS, MEDIUM_MONSTERS, HARD_MONSTERS, NIGHTMARE_MONSTERS } from '../data/monsters';
import { calculateDamage } from '../combat/combatCalculations';
import { locationSlice } from './locationActions';
import { createSkill } from '../types/game';
import { CombatCalculator } from '../combat/CombatCalculator';
import { CombatManager } from '../combat/CombatManager';
import type { CombatRoundResult } from '../combat/CombatManager';
import { getEquipmentLevelRequirement } from '../data/items';
import { createApiUrl, API_ENDPOINTS } from '../config/api';

// Helper functions for experience and level calculations
export const calculateLevel = (experience: number): number => {
  // Find the highest level where the experience requirement is met
  let level = 1;
  while (experience >= Math.floor(level * level * 83)) {
    level++;
    if (level > 99) return 99; // Cap level at 99
  }
  return level;
};

export const getNextLevelExperience = (level: number): number => {
  // Cap level at 99 for next level experience calculation
  const cappedLevel = Math.min(level, 99);
  return cappedLevel * cappedLevel * 83;
};

// Helper function to calculate max hitpoints based on hitpoints skill level
export const calculateMaxHitpoints = (hitpointsLevel: number): number => {
  // Max hitpoints equals the hitpoints skill level
  return hitpointsLevel;
};

type SetState = (
  partial: GameState | Partial<GameState> | ((state: GameState) => GameState | Partial<GameState>),
  replace?: boolean
) => void;

type GetState = () => GameState;

// Helper function to get weapon speed in milliseconds
const getWeaponSpeed = (weaponId: string | undefined): number => {
  if (!weaponId) return 2500; // Default/unarmed attack speed (2.5 seconds)
  
  // Weapon speeds in milliseconds
  const weaponSpeeds: Record<string, number> = {
    dagger: 2000,      // 2.0 seconds
    sword: 2500,       // 2.5 seconds
    scimitar: 2400,    // 2.4 seconds
    mace: 2600,        // 2.6 seconds
    longsword: 3000,   // 3.0 seconds
    battleaxe: 3500,   // 3.5 seconds
    warhammer: 3800,   // 3.8 seconds
    two_handed_sword: 4200,  // 4.2 seconds
  };

  // Extract the weapon type from the ID (e.g., 'bronze_dagger' -> 'dagger')
  const weaponType = weaponId.split('_').slice(1).join('_');
  return weaponSpeeds[weaponType] || 2500; // Default to sword speed if weapon type not found
};

// Create the store with all its state and actions (persist disabled for debugging)
const createStore = () => create<GameState>()(
  (set, get) => ({
    // Initial state
    character: null,
    user: null,
    characters: [],
    selectedMonster: null,
    currentLocation: undefined,
    currentAction: null,
    actionProgress: 0,
    isActionInProgress: false,
    actionInterval: null,
    lastActionTime: 0,
    characterState: 'idle' as const,
    lastActionReward: null,
    lastCombatRound: null,
    isLoading: false,
    activeView: 'location',

    // Function to set the active view
    setView: (view) => set({ activeView: view }),

    // Function to load characters for the logged-in user
    loadCharacters: async () => {
      try {
        const response = await fetch(createApiUrl(API_ENDPOINTS.characters), {
          credentials: 'include', // Important: sends cookies
        });
        if (!response.ok) {
          throw new Error('Failed to fetch characters.');
        }
        const characters = await response.json();
        const charactersWithDates = characters.map((char: any) => {
          const id = char._id || char.id;
          const { _id, ...rest } = char;
          
          // Calculate max hitpoints based on hitpoints skill level
          const hitpointsLevel = calculateLevel(rest.skills.hitpoints.experience);
          const maxHitpoints = calculateMaxHitpoints(hitpointsLevel);
          
          return {
            ...rest,
            id,
            lastLogin: new Date(char.lastLogin),
            maxHitpoints,
          };
        });
        set({ characters: charactersWithDates });
      } catch (error) {
        console.error('Error loading characters:', error);
        // If characters fail to load (e.g., unauthorized), log out the user
        get().logout();
      }
    },
    
    // Function to save character progress to the backend
    saveCharacter: async (character: Character) => {
      if (!character) {
        console.warn('saveCharacter: No character provided');
        return;
      }
      if (!character.id) {
        console.warn('saveCharacter: Character missing id', character);
        console.trace('saveCharacter: Stack trace for missing ID');
        return;
      }
      try {
        console.log('saveCharacter: Sending PUT to', createApiUrl(`${API_ENDPOINTS.characters}/${character.id}`), 'with data:', character);
        await fetch(createApiUrl(`${API_ENDPOINTS.characters}/${character.id}`), {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(character),
        });
      } catch (error) {
        console.error('Failed to save character progress:', error);
      }
    },

    // Character actions
    selectCharacter: (character: Character) => {
      const id = (character as any)._id || character.id;
      const { _id, ...rest } = character as any;
      
      // Calculate max hitpoints based on hitpoints skill level
      const hitpointsLevel = calculateLevel(rest.skills.hitpoints.experience);
      const maxHitpoints = calculateMaxHitpoints(hitpointsLevel);
      
      set({ character: { ...rest, id, maxHitpoints } });
      // Here you might want to save the ID of the last selected character
      // to local storage or the user's profile on the server, so you can
      // auto-select it on next login.
    },
    setCharacter: (character: Character | null) => {
      if (!character) {
        set({ character: null });
        return;
      }
      const id = (character as any)._id || character.id;
      const { _id, ...rest } = character as any;
      
      // Debug logging
      if (!id) {
        console.warn('setCharacter: Character missing ID', character);
        console.trace('setCharacter: Stack trace for missing ID');
      }
      
      // Calculate max hitpoints based on hitpoints skill level
      const hitpointsLevel = calculateLevel(rest.skills.hitpoints.experience);
      const maxHitpoints = calculateMaxHitpoints(hitpointsLevel);
      
      const updatedCharacter = { ...rest, id, maxHitpoints };
      console.log('setCharacter: Setting character with ID:', id);
      set({ character: updatedCharacter });
      if (id) {
        get().saveCharacter(updatedCharacter);
      } else {
        console.warn('setCharacter: Skipping save due to missing ID');
      }
    },
    createCharacter: async (name: string): Promise<Character | null> => {
      try {
        const response = await fetch(createApiUrl(API_ENDPOINTS.characters), {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        });

        if (!response.ok) {
          // You can handle different statuses here, e.g., 409 for duplicate name
          const errorData = await response.json();
          console.error('Failed to create character:', errorData.message);
          // Optionally, you can throw an error or return a specific message
          // to be displayed in the UI.
          throw new Error(errorData.message || 'Failed to create character');
        }

        const newCharacter = await response.json();
        console.log('Created character response from server:', newCharacter);
        
        // Ensure we have the proper ID
        const characterId = newCharacter._id || newCharacter.id;
        if (!characterId) {
          throw new Error('Server did not return a valid character ID');
        }
        
        // The server now provides the full character object.
        // We need to convert the lastLogin string back to a Date object.
        const characterWithDate = {
          ...newCharacter,
          id: characterId, // Ensure ID is set correctly
          lastLogin: new Date(newCharacter.lastLogin),
        };
        
        // Remove _id to avoid confusion
        if (characterWithDate._id) {
          delete characterWithDate._id;
        }

        console.log('Character with proper ID:', characterWithDate);

        // Refresh the characters list first
        await get().loadCharacters();
        
        // Find the newly created character in the refreshed list
        const newList = get().characters;
        const newCharFromServer = newList.find(c => c.id === characterId);
        
        if (newCharFromServer) {
          // Set the character from the server list (ensures consistency)
          get().selectCharacter(newCharFromServer);
          return newCharFromServer;
        } else {
          // Fallback: use the character we processed locally
          get().selectCharacter(characterWithDate as Character);
          return characterWithDate as Character;
        }

      } catch (e) {
        console.error('An error occurred during character creation:', e);
        // We can re-throw the error to be caught by the UI component
        // that called this function, allowing it to display a message.
        if (e instanceof Error) {
            throw e;
        }
        throw new Error('An unknown error occurred.');
      }
    },
    startAction: (action) => {
      // Always stop any previous action before starting a new one
      get().stopAction();
      // Handle combat_selection actions by navigating to the target cave
      if (action.type === 'combat_selection') {
        const targetLocation = mockLocations.find(loc => loc.id === action.targetLocation);
        if (targetLocation) {
          get().setLocation(targetLocation);
          // Optionally clear currentAction and progress
          set({ currentAction: null, isActionInProgress: false, actionProgress: 0 });
        }
        return;
      }
      // Clear any existing interval
      const state = get();
      if (state.actionInterval !== null) {
        clearInterval(state.actionInterval as unknown as number);
      }
      // Set up new action
      set({ currentAction: action, isActionInProgress: true, actionProgress: 0 });
      let startTime = Date.now();
      const duration = action.baseTime;
      const interval = setInterval(() => {
        const state = get();
        if (!state.isActionInProgress || !state.currentAction || state.currentAction.id !== action.id) {
          clearInterval(interval);
          set({ actionInterval: null, actionProgress: 0 });
          return;
        }
        // Check requirements before completing action
        if (!get().canPerformAction(action)) {
          clearInterval(interval);
          set({ isActionInProgress: false, currentAction: null, actionProgress: 0, actionInterval: null });
          return;
        }
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        set({ actionProgress: progress });
        if (progress >= 100) {
          get().completeAction();
          // Reset for next loop
          startTime = Date.now();
          set({ actionProgress: 0 });
        }
      }, 100);
      set({ actionInterval: interval });
    },
    stopAction: () => {
      const state = get();
      if (state.actionInterval !== null) {
        clearInterval(state.actionInterval as unknown as number);
      }
      set({ isActionInProgress: false, currentAction: null, actionProgress: 0, actionInterval: null });
    },
    completeAction: () => {
      const state = get();
      if (!state.currentAction || !state.currentLocation) return;

      // --- Combat system integration ---
      if (state.currentAction.type === 'combat') {
        // Type guard for CombatAction
        const currentAction = state.currentAction as CombatAction;
        const { character } = state;
        if (!character) return;
        const monster = currentAction.monster;
        // Use helper to get main combat style
        const playerStyle = getCombatStyleFromAction(character, currentAction);
        // For now, monster always uses melee (can be extended later)
        const monsterStyle: 'melee' | 'ranged' | 'magic' = 'melee';

        // Run a full combat round
        const roundResult: CombatRoundResult = CombatManager.runCombatRound(
          character,
          monster,
          playerStyle,
          monsterStyle
        );

        // Update hitpoints
        const newMonsterHp = Math.max(0, monster.hitpoints - roundResult.playerDamage);
        const newPlayerHp = Math.max(0, character.hitpoints - roundResult.monsterDamage);

        // Track combat stats
        get().incrementStat('damageDone', roundResult.playerDamage);
        get().incrementStat('damageTaken', roundResult.monsterDamage);
        get().incrementStat('totalDamageDealt', roundResult.playerDamage);
        get().incrementStat('totalDamageTaken', roundResult.monsterDamage);

        // Award XP for every hit
        const xpGained = roundResult.playerDamage * 4;
        const hitpointsXpGained = Math.round(roundResult.playerDamage * 1.33);
        let skill: SkillName = 'attack';
        // Determine skill based on attackStyle for melee
        const attackStyle = (currentAction as any).attackStyle || 'accurate';
        if (playerStyle === 'melee') {
          if (attackStyle === 'aggressive') skill = 'strength';
          else if (attackStyle === 'defensive') skill = 'defence';
          else skill = 'attack';
        } else if (playerStyle === 'ranged') skill = 'ranged';
        else if (playerStyle === 'magic') skill = 'magic';
        if (xpGained > 0) state.gainExperience(skill, xpGained);
        if (hitpointsXpGained > 0) state.gainExperience('hitpoints', hitpointsXpGained);

        // Always get the latest character after XP gain
        const latestCharacter = get().character;
        if (!latestCharacter) return;

        // Handle victory/defeat and rewards
        if (roundResult.monsterDefeated) {
          // Grant loot (if any)
          let rewardItem: ItemReward | null = null;
          if (roundResult.loot && roundResult.loot.length > 0) {
            roundResult.loot.forEach(itemId => {
              const item = getItemById(itemId);
              if (item) {
                // Find the drop quantity from the monster's drops array
                const drop = monster.drops?.find(d => d.itemId === itemId);
                const quantity = drop?.quantity || 1;
                state.addItemToBank(item, quantity);
                rewardItem = { id: item.id, name: item.name, quantity };
              }
            });
          } else {
            // No loot, but still show monster killed
            rewardItem = { id: monster.id, name: `Defeated ${monster.name}`, quantity: 1 };
          }
          // Track per-monster stats
          const monsterId = monster.id;
          const updatedStats = {
            ...latestCharacter!.stats,
            monstersKilledByType: {
              ...latestCharacter!.stats.monstersKilledByType,
              [monsterId]: (latestCharacter!.stats.monstersKilledByType[monsterId] || 0) + 1
            }
          };
          set({
            character: { ...latestCharacter!, stats: updatedStats, hitpoints: newPlayerHp },
            currentAction: null,
            isActionInProgress: false,
            lastCombatRound: {
              playerDamage: roundResult.playerDamage,
              monsterDamage: roundResult.monsterDamage,
              result: 'victory',
              loot: roundResult.loot || []
            },
            lastActionReward: {
              xp: xpGained,
              item: rewardItem,
              skill,
              hitpointsXp: hitpointsXpGained > 0 ? hitpointsXpGained : undefined
            }
          });
          const updatedCharacter = get().character;
          if (updatedCharacter) get().saveCharacter(updatedCharacter);
          get().incrementStat('monstersKilled', 1);
          get().incrementStat('totalKills', 1);
          return;
        } else if (roundResult.playerDefeated) {
          // Track death
          get().incrementStat('deaths');
          // Player loses: end combat, optionally show defeat UI
          set({
            character: { ...latestCharacter, hitpoints: 0 },
            currentAction: null,
            isActionInProgress: false,
            lastCombatRound: {
              playerDamage: roundResult.playerDamage,
              monsterDamage: roundResult.monsterDamage,
              result: 'defeat',
              loot: []
            }
          });
          const finalCharacterDefeat = get().character;
          if (finalCharacterDefeat) get().saveCharacter(finalCharacterDefeat);
          return;
        }

        // Continue combat: update state
        set({
          character: { ...latestCharacter, hitpoints: newPlayerHp },
          currentAction: {
            ...currentAction,
            monster: { ...monster, hitpoints: newMonsterHp }
          },
          lastCombatRound: {
            playerDamage: roundResult.playerDamage,
            monsterDamage: roundResult.monsterDamage,
            result: 'continue',
            loot: []
          }
        });
        const finalCharacterContinue = get().character;
        if (finalCharacterContinue) get().saveCharacter(finalCharacterContinue);
        return;
      }

      // Non-combat actions (track all except combat_selection)
      if (state.currentAction.type !== 'combat_selection') {
        // Consume required items (not tools)
        if ('requirements' in state.currentAction && state.currentAction.requirements) {
          for (const req of state.currentAction.requirements) {
            if (req.type === 'item' && req.itemId && req.quantity) {
              const reqItem = getItemById(req.itemId);
              if (!reqItem || reqItem.type === 'tool') continue; // Do not consume tools
              get().removeItemFromBank(req.itemId, req.quantity);
            }
          }
        }
        state.batchUpdateProgress([{
          locationId: state.currentLocation.id,
          type: 'resource',
          itemId: state.currentAction.itemReward.id,
          count: 1
        }]);

        // Track per-action and per-resource stats
        const actionId = state.currentAction.id;
        const resourceId = state.currentAction.itemReward?.id;
        const character = get().character;
        if (character) {
          // Ensure stats object exists with all required fields
          if (!character.stats) {
            character.stats = {
              // General
              deaths: 0,
              foodEaten: 0,
              hitpointsGained: 0,
              damageDone: 0,
              damageTaken: 0,
              coinsSpent: 0,
              coinsEarned: 0,
              slayerPointsSpent: 0,
              slayerPointsEarned: 0,
              totalActiveTime: 0,
              totalOfflineTime: 0,

              // Gathering
              logsChopped: 0,
              oresMined: 0,
              fishCaught: 0,
              itemsPickpocketed: 0,
              creaturesHunted: 0,
              cropsHarvested: 0,

              // Processing
              itemsCrafted: 0,
              arrowsFletched: 0,
              barsSmelted: 0,
              foodCooked: 0,
              logsBurned: 0,
              bonesBuried: 0,
              runesCrafted: 0,

              // Combat
              monstersKilled: 0,
              totalKills: 0,
              totalDamageDealt: 0,
              totalDamageTaken: 0,
              favouriteFoodEaten: 0,
              totalHealthHealed: 0,

              // Detailed tracking
              resourcesGathered: {} as import('../types/game').StrictResourceMap,
              actionsPerformed: {} as Record<string, number>,
              monstersKilledByType: {} as Record<string, number>
            };
          }

          // Ensure nested objects exist with proper types
          if (!character.stats.resourcesGathered) {
            character.stats.resourcesGathered = {} as import('../types/game').StrictResourceMap;
          }
          if (!character.stats.actionsPerformed) {
            character.stats.actionsPerformed = {} as Record<string, number>;
          }
          if (!character.stats.monstersKilledByType) {
            character.stats.monstersKilledByType = {} as Record<string, number>;
          }

          // Update action count
          const actionsPerformed = character.stats.actionsPerformed as Record<string, number>;
          actionsPerformed[actionId] = (actionsPerformed[actionId] || 0) + 1;
          character.stats.actionsPerformed = actionsPerformed;

          // Update resource count if there's a resource reward
          if (resourceId) {
            const resourcesGathered = character.stats.resourcesGathered as import('../types/game').StrictResourceMap;
            const currentCount = Number(resourcesGathered[resourceId]) || 0;
            resourcesGathered[resourceId] = (currentCount + 1) as import('../types/game').ResourceCount;
            character.stats.resourcesGathered = resourcesGathered;
          }

          // Save the updated character
          get().saveCharacter(character);
        }

        // --- Stat tracking for gathering/processing actions ---
        switch (state.currentAction.type) {
          case 'woodcutting':
            get().incrementStat('logsChopped', 1);
            break;
          case 'mining':
            get().incrementStat('oresMined', 1);
            break;
          case 'fishing':
            get().incrementStat('fishCaught', 1);
            break;
          case 'farming':
            get().incrementStat('cropsHarvested', 1);
            break;
          // TODO: Add stat tracking for thieving, hunter when those action types are implemented
          case 'crafting':
            get().incrementStat('itemsCrafted', 1);
            break;
          case 'fletching':
            get().incrementStat('arrowsFletched', 1);
            break;
          case 'smithing':
            get().incrementStat('barsSmelted', 1);
            break;
          case 'cooking':
            get().incrementStat('foodCooked', 1);
            break;
          case 'firemaking':
            get().incrementStat('logsBurned', 1);
            break;
          case 'prayer':
            get().incrementStat('bonesBuried', 1);
            break;
          case 'runecrafting':
            get().incrementStat('runesCrafted', 1);
            break;
          default:
            // For any other or unknown action types, do nothing or add future tracking here
            break;
        }
      }

      // Mark action as completed
      state.completeLocationAction(state.currentLocation.id, state.currentAction.id);

      // Handle rewards
      if ('itemReward' in state.currentAction && state.currentAction.itemReward) {
        // Get the full item data
        const item = getItemById(state.currentAction.itemReward.id);
        if (item) {
          // Add item to bank
          state.addItemToBank(item, state.currentAction.itemReward.quantity || 1);
        }
      }

      let levelUp: { skill: string; level: number } | undefined;
      let xpGained = 0;
      const hitpointsXpGained = 0;
      let skillAwarded: SkillName | undefined = undefined;

      if ('experience' in state.currentAction && state.currentAction.experience) {
        // Non-combat actions: keep existing logic
        const result = state.gainExperience(state.currentAction.skill, state.currentAction.experience);
        if (result) {
          levelUp = result;
        }
        xpGained = state.currentAction.experience;
        skillAwarded = state.currentAction.skill;
      }

      // Set last action reward (only for non-combat actions)
      const hasXp = xpGained > 0;
      const hasItem = !!(state.currentAction.itemReward && state.currentAction.itemReward.quantity);
      const hasLevelUp = !!levelUp;
      if (hasXp || hasItem || hasLevelUp) {
                set({
          lastActionReward: {
            xp: xpGained,
            item: state.currentAction.itemReward,
            levelUp,
            skill: skillAwarded,
            hitpointsXp: hitpointsXpGained > 0 ? hitpointsXpGained : undefined
          }
        });
      }

      // After ALL local state has been updated, save the progress.
      const updatedCharacter = get().character;
      if (updatedCharacter) {
        get().saveCharacter(updatedCharacter);
      }
    },
    addItemToBank: (item: Item, quantity: number) => {
      set((state) => {
        if (!state.character) return {};
        const bank = [...state.character.bank];
        const existing = bank.find(i => i.id === item.id);
        if (existing) {
          existing.quantity += quantity;
        } else {
          bank.push({ id: item.id, name: item.name, quantity });
        }
        // Track coins earned
        if (item.id === 'coins') {
          get().incrementStat('coinsEarned', quantity);
        }
        const updatedCharacter = { ...state.character, bank };
        if (updatedCharacter) get().saveCharacter(updatedCharacter);
        return {
          character: updatedCharacter
        };
      });
    },
    removeItemFromBank: (itemId: string, quantity: number) => {
      set((state) => {
        if (!state.character) return {};
        const bank = [...state.character.bank];
        const index = bank.findIndex(i => i.id === itemId);
        if (index === -1 || bank[index].quantity < quantity) return {};
        bank[index].quantity -= quantity;
        if (bank[index].quantity <= 0) {
          bank.splice(index, 1);
        }
        // Track coins spent
        if (itemId === 'coins') {
          get().incrementStat('coinsSpent', quantity);
        }
        const updatedCharacter = { ...state.character, bank };
        if (updatedCharacter) get().saveCharacter(updatedCharacter);
        return {
          character: updatedCharacter
        };
      });
    },
    sellItem: (itemId: string, quantity: number) => {
      const { character } = get();
      if (!character) return;

      const item = getItemById(itemId);
      if (!item || !item.sellPrice) return; // Item not sellable

      const bank = [...character.bank];
      const itemIndex = bank.findIndex(i => i.id === itemId);

      if (itemIndex === -1) return; // Item not found

      const bankItem = bank[itemIndex];
      if (bankItem.quantity < quantity) return; // Not enough items

      // Remove the items
      if (bankItem.quantity === quantity) {
        bank.splice(itemIndex, 1);
      } else {
        bank[itemIndex].quantity -= quantity;
      }

      // Add coins
      const coinsIndex = bank.findIndex(i => i.id === 'coins');
      const coinsToAdd = item.sellPrice * quantity;
      if (coinsIndex !== -1) {
        bank[coinsIndex].quantity += coinsToAdd;
      } else {
        bank.push({ id: 'coins', name: 'Coins', quantity: coinsToAdd });
      }

      const updatedCharacter = { ...character, bank };
      get().setCharacter(updatedCharacter);
    },
    updateBankOrder: (newBank: ItemReward[]) => {
      // Implementation needed
    },
    canPerformAction: (action: SkillAction | CombatAction | CombatSelectionAction) => {
      const state = get();
      if (!state.character) return false;

      // Check requirements array if it exists
      if ('requirements' in action && action.requirements) {
        for (const requirement of action.requirements) {
          if (requirement.type === 'level' && requirement.skill && requirement.level) {
            const characterSkill = state.character.skills[requirement.skill as SkillName];
            if (!characterSkill || calculateLevel(characterSkill.experience) < requirement.level) {
              return false;
            }
          } else if (requirement.type === 'equipment') {
            if (requirement.itemId) {
              // Check if the required equipment is equipped (by itemId)
              const equipped = Object.values(state.character.equipment).find(
                (item) => item && item.id === requirement.itemId
              );
              if (!equipped) {
                return false;
              }
            } else if (requirement.category) {
              // Check if any equipped item matches the required category (e.g., any axe)
              const equipped = Object.values(state.character.equipment).find(
                (item) => item && (
                  item.category === requirement.category ||
                  (requirement.category === 'axe' && item.id.endsWith('_axe'))
                )
              );
            if (!equipped) {
                return false;
              }
            }
          } else if (requirement.type === 'item') {
            // Check if the required item is in the bank with enough quantity
            if (!requirement.itemId || !requirement.quantity) return false;
            const bankItem = state.character.bank.find(i => i.id === requirement.itemId);
            if (!bankItem || bankItem.quantity < requirement.quantity) {
              return false;
            }
          }
        }
      }

      return true;
    },
    gainExperience: (skill: SkillName, amount: number) => {
      const state = get();
      if (!state.character) return null;
      const oldSkill = state.character.skills[skill];
      if (!oldSkill) return null;
      const oldLevel = calculateLevel(oldSkill.experience);
      const newExp = oldSkill.experience + amount;
      const newLevel = calculateLevel(newExp);
      const skills = {
        ...state.character.skills,
        [skill]: {
          ...oldSkill,
          experience: newExp,
          level: newLevel,
          nextLevelExperience: getNextLevelExperience(newLevel)
        }
      };
      
      // Calculate new max hitpoints if hitpoints skill was leveled
      let maxHitpoints = state.character.maxHitpoints;
      let hitpoints = state.character.hitpoints;
      if (skill === 'hitpoints') {
        maxHitpoints = calculateMaxHitpoints(newLevel);
        // If we gained hitpoints levels, heal the player proportionally
        if (newLevel > oldLevel) {
          const hitpointsGained = maxHitpoints - state.character.maxHitpoints;
          hitpoints = Math.min(hitpoints + hitpointsGained, maxHitpoints);
        }
      }
      
      const updatedCharacter = { ...state.character, skills, maxHitpoints, hitpoints };
      get().setCharacter(updatedCharacter);
      if (newLevel > oldLevel) {
        return { skill, level: newLevel };
      }
      return null;
    },

    // Slayer actions
    getNewSlayerTask: (difficulty) => {
      const state = get();
      if (!state.character) return;
      // Pick monster pool by difficulty
      let monsterPool: Monster[] = [];
      if (difficulty === 'Easy') monsterPool = EASY_MONSTERS;
      else if (difficulty === 'Medium') monsterPool = MEDIUM_MONSTERS;
      else if (difficulty === 'Hard') monsterPool = HARD_MONSTERS;
      else if (difficulty === 'Nightmare') monsterPool = NIGHTMARE_MONSTERS;
      if (monsterPool.length === 0) return;
      // Pick a random monster
      const monster = monsterPool[Math.floor(Math.random() * monsterPool.length)];
      // Pick a random amount (10-30)
      const amount = Math.floor(Math.random() * 21) + 10;
      const newTask = {
        monsterId: monster.id,
        monsterName: monster.name,
        amount,
        remaining: amount,
        difficulty
      };
      get().setCharacter({ ...state.character, currentSlayerTask: newTask });
    },
    completeSlayerTask: () => {
      const state = get();
      if (!state.character || !state.character.currentSlayerTask) return;
      // Increment streak
      const prevStreak = state.character.slayerTaskStreak || 0;
      const newStreak = prevStreak + 1;
      // Calculate points
      const points = getSlayerPointsForStreak(newStreak);
      get().setCharacter({
        ...state.character,
        slayerPoints: (state.character.slayerPoints || 0) + points,
        currentSlayerTask: null,
        slayerTaskStreak: newStreak
      });
      // Award slayer points (example: 10 points)
      get().incrementStat('slayerPointsEarned', 10); // Replace 10 with actual awarded amount
    },

    // Cancel the current slayer task for 30 slayer points
    cancelSlayerTask: () => {
      const state = get();
      if (!state.character || !state.character.currentSlayerTask) return;
      if ((state.character.slayerPoints || 0) < 30) return;
      get().setCharacter({
        ...state.character,
        slayerPoints: state.character.slayerPoints - 30,
        currentSlayerTask: null
      });
      // Spend slayer points (example: 30 points)
      get().incrementStat('slayerPointsSpent', 30); // Replace 30 with actual spent amount
    },

    // Offline progress
    processOfflineProgress: () => {
      // Implementation needed
      return null;
    },
    clearActionReward: () => set({ lastActionReward: null }),

    // Auth
    signOut: () => set({ character: null }),
    updateCharacter: (character: Character) => {
      // Calculate max hitpoints based on hitpoints skill level
      const hitpointsLevel = calculateLevel(character.skills.hitpoints.experience);
      const maxHitpoints = calculateMaxHitpoints(hitpointsLevel);
      
      const updatedCharacter = { ...character, maxHitpoints };
      get().setCharacter(updatedCharacter);
    },

    // Add location slice (includes state and actions)
    ...locationSlice(set, get),

    buyItem: (itemId: string, quantity: number) => {
      const { character } = get();
      if (!character) return;

      const item = getItemById(itemId);
      if (!item || !item.buyPrice) return; // Item not buyable

      const totalCost = item.buyPrice * quantity;
      const bank = [...character.bank];
      const coinsIndex = bank.findIndex(i => i.id === 'coins');

      if (coinsIndex === -1 || bank[coinsIndex].quantity < totalCost) return; // Not enough coins

      // Subtract coins
      bank[coinsIndex].quantity -= totalCost;
      if (bank[coinsIndex].quantity === 0) {
        bank.splice(coinsIndex, 1);
      }

      // Add item
      const itemIndex = bank.findIndex(i => i.id === itemId);
      if (itemIndex !== -1) {
        bank[itemIndex].quantity += quantity;
      } else {
        bank.push({ id: item.id, name: item.name, quantity });
      }

      const updatedCharacter = { ...character, bank };
      get().setCharacter(updatedCharacter);
    },
    equipItem: (item: Item) => {
      const { character } = get();
      if (!character || !item.slot) return; // Item must have a slot to be equippable

      const requirement = getEquipmentLevelRequirement(item);
      if (requirement) {
        const skillLevel = character.skills[requirement.skill]?.level || 1;
        if (skillLevel < requirement.level) {
          console.log(`Level not high enough to equip ${item.name}. Required: ${requirement.skill} ${requirement.level}, You have: ${skillLevel}`);
          // Here you might want to add a user-facing notification
          return;
        }
      }

      const currentEquippedItem = character.equipment[item.slot];
      const newBank = [...character.bank];
      const itemIndexInBank = newBank.findIndex(i => i.id === item.id);

      if (itemIndexInBank === -1) return; // Item not in bank

      // Remove from bank
      const [itemToEquip] = newBank.splice(itemIndexInBank, 1);

      // Add previously equipped item back to bank, if there was one
      if (currentEquippedItem) {
        newBank.push({
          id: currentEquippedItem.id,
          name: currentEquippedItem.name,
          quantity: currentEquippedItem.quantity || 1,
        });
      }

      // Update character
      const updatedCharacter = {
        ...character,
        bank: newBank,
        equipment: {
          ...character.equipment,
          [item.slot]: { ...item, quantity: 1 },
        },
      };

      get().setCharacter(updatedCharacter);
    },
    unequipItem: (slot: string) => {
      const { character } = get();
      if (!character) return;
      const equipment = { ...character.equipment };
      const bank = [...character.bank];
      const equipped = equipment[slot];
      if (!equipped) return;
      // Add back to bank
      const bankIndex = bank.findIndex(i => i.id === equipped.id);
      if (bankIndex !== -1) {
        bank[bankIndex].quantity += 1;
      } else {
        bank.push({ id: equipped.id, name: equipped.name, quantity: 1 });
      }
      equipment[slot] = undefined;
      const updatedCharacter = { ...character, equipment, bank };
      get().setCharacter(updatedCharacter);
    },
    useConsumable: (itemId: string, quantity: number = 1) => {
      set((state) => {
        if (!state.character) return {};
        const item = getItemById(itemId);
        if (!item || item.type !== 'consumable') return {};
        const bankIndex = state.character.bank.findIndex(i => i.id === itemId);
        if (bankIndex === -1 || state.character.bank[bankIndex].quantity < quantity) return {};
        let healed = false;
        let boosted = false;
        let newHitpoints = state.character.hitpoints;
        const newActiveEffects = [...(state.character.activeEffects || [])];
        // Heal if healing property exists
        if (item.healing && state.character.hitpoints < state.character.maxHitpoints) {
          newHitpoints = Math.min(state.character.hitpoints + item.healing * quantity, state.character.maxHitpoints);
          healed = true;
          // Track food eaten and hitpoints gained
          get().incrementStat('foodEaten', quantity);
          get().incrementStat('hitpointsGained', (newHitpoints - state.character.hitpoints));
        }
        // Boost if boost property exists (future: implement boost logic)
        if (item.boost) {
          // Example: boost = { stat: 'strength', amount: 2, duration: 5 }
          newActiveEffects.push({
            type: 'boost',
            remainingDuration: item.boost.duration || 5,
            value: item.boost.amount || 1,
            affectedStats: [item.boost.stat]
          });
          boosted = true;
        }
        // Remove from bank
        const newBank = [...state.character.bank];
        newBank[bankIndex].quantity -= quantity;
        if (newBank[bankIndex].quantity <= 0) newBank.splice(bankIndex, 1);
        // Only update if something happened
        if (!healed && !boosted) return {};
        const updatedCharacter = {
          ...state.character,
          hitpoints: newHitpoints,
          activeEffects: newActiveEffects,
          bank: newBank
        };
        
        // Save the character after using consumable
        get().saveCharacter(updatedCharacter);
        
        return {
          character: updatedCharacter
        };
      });
    },
    resetLastCombatRound: () => set({ lastCombatRound: null }),

    // --- Stat update helpers ---
    incrementStat: (stat: keyof Character["stats"], amount = 1) => {
      set((state) => {
        if (!state.character || !state.character.stats) return {};
        if (!(stat in state.character.stats)) return {}; // Prevent undefined stat error
        const currentValue = state.character.stats[stat];
        if (typeof currentValue !== 'number') return {}; // Only increment numeric stats
        const updatedCharacter = {
          ...state.character,
          stats: {
            ...state.character.stats,
            [stat]: currentValue + amount
          }
        };
        if (updatedCharacter) get().saveCharacter(updatedCharacter);
        return {
          character: updatedCharacter
        };
      });
    },

    // Helper to update active/offline time (call from timer or login/logout logic)
    updateActiveTime: (ms: number) => get().incrementStat('totalActiveTime', ms),
    updateOfflineTime: (ms: number) => get().incrementStat('totalOfflineTime', ms),

    register: async (username: string, password: string) => {
      const response = await fetch(createApiUrl(API_ENDPOINTS.auth.register), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
    },
    login: async (username: string, password: string) => {
      const response = await fetch(createApiUrl(API_ENDPOINTS.auth.login), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Important for cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      set({ user: data.user }); // Store user info
      await get().loadCharacters(); // Fetch characters for this user
    },
    logout: async () => {
      try {
        await fetch(createApiUrl(API_ENDPOINTS.auth.logout), {
          method: 'POST',
          credentials: 'include',
        });
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        // Clear all user and character state regardless of server response
        set({ user: null, character: null, characters: [] });
      }
    },
  })
);

// Export the store creator for testing
export const createGameStore = () => createStore();

// Export the store instance for components to use
const useGameStore = createStore();
export { useGameStore };

const calculateMaxHit = (
  attackerStats: CombatStats,
  strengthLevel: number,
  combatTriangleModifier: number
) => {
  const effectiveStrengthLevel = Math.floor(strengthLevel * combatTriangleModifier);
  const strengthBonus = attackerStats.strengthMelee;
  
  return Math.floor(0.5 + (effectiveStrengthLevel * (strengthBonus + 64)) / 640);
};

// Helper function to get total attack stats from equipped items
const getCharacterAttackStats = (character: Character): CombatStats => {
  const baseStats: CombatStats = {
    attackStab: 0,
    attackSlash: 0,
    attackCrush: 0,
    attackMagic: 0,
    attackRanged: 0,
    defenceStab: 0,
    defenceSlash: 0,
    defenceCrush: 0,
    defenceMagic: 0,
    defenceRanged: 0,
    strengthMelee: 0,
    strengthRanged: 0,
    strengthMagic: 0,
    prayerBonus: 0
  };

  // Combine stats from all equipped items
  Object.entries(character.equipment).forEach(([slot, equippedItem]) => {
    if (equippedItem) {
      const item = getItemById(equippedItem.id);
      if (item?.stats) {
        Object.entries(item.stats).forEach(([key, value]) => {
          baseStats[key as keyof CombatStats] += value as number;
        });
      }
    }
  });

  return baseStats;
};

// Helper function to get total defence stats from equipped items
const getCharacterDefenceStats = (character: Character): CombatStats => {
  const baseStats: CombatStats = {
    attackStab: 0,
    attackSlash: 0,
    attackCrush: 0,
    attackMagic: 0,
    attackRanged: 0,
    defenceStab: 0,
    defenceSlash: 0,
    defenceCrush: 0,
    defenceMagic: 0,
    defenceRanged: 0,
    strengthMelee: 0,
    strengthRanged: 0,
    strengthMagic: 0,
    prayerBonus: 0
  };

  // Combine stats from all equipped items
  Object.entries(character.equipment).forEach(([slot, equippedItem]) => {
    if (equippedItem) {
      const item = getItemById(equippedItem.id);
      if (item?.stats) {
        Object.entries(item.stats).forEach(([key, value]) => {
          baseStats[key as keyof CombatStats] += value as number;
        });
      }
    }
  });

  return baseStats;
};

const DEFAULT_UNARMED_STATS: CombatStats = {
  attackStab: 0,
  attackSlash: 0,
  attackCrush: 1, // Small bonus for punching
  attackMagic: 0,
  attackRanged: 0,
  defenceStab: 0,
  defenceSlash: 0,
  defenceCrush: 0,
  defenceMagic: 0,
  defenceRanged: 0,
  strengthMelee: 1, // Small bonus for punching
  strengthRanged: 0,
  strengthMagic: 0,
  prayerBonus: 0
};

// Export other helper functions and types
export { calculateMaxHit };

// Helper to map UI attackStyle to main combat style
function getCombatStyleFromAction(character: Character, action: CombatAction): 'melee' | 'ranged' | 'magic' {
  // If the action has a combatStyle property, use it
  if ('combatStyle' in action && action.combatStyle) return action.combatStyle as 'melee' | 'ranged' | 'magic';
  // Otherwise, infer from weapon
  const weapon = character.equipment.weapon;
  if (weapon) {
    if (weapon.id.includes('bow') || weapon.id.includes('crossbow') || weapon.id.includes('dart') || weapon.id.includes('knife')) {
      return 'ranged';
    } else if (weapon.id.includes('staff') || weapon.id.includes('wand')) {
      return 'magic';
    }
  }
  return 'melee';
}

// Helper: Calculate slayer XP for a monster
function calculateSlayerXP(monster: Monster): number {
  return Math.round(monster.hitpoints * 1.1);
}

// Helper: Calculate slayer points for a completed task streak
function getSlayerPointsForStreak(streak: number): number {
  if (streak % 1000 === 0) return 500;
  if (streak % 250 === 0) return 350;
  if (streak % 100 === 0) return 250;
  if (streak % 50 === 0) return 150;
  if (streak % 10 === 0) return 50;
  return 10;
}

// Helper to safely get a resource count as a number
function getResourceCount(obj: Record<string, number>, key: string): number {
  const val = obj[key];
  if (typeof val === 'number') return val;
  if (val !== undefined && typeof val !== 'number') console.warn('Non-number value in resourcesGathered:', val);
  return 0;
}
