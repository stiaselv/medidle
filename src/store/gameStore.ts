import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Character, Item, Location, SkillAction, SkillName, ItemReward, StoreItem, StoreAction, CombatSelectionAction, CombatAction, SlayerTask, Monster, CombatStats, LocationState, GameState, ItemType, Achievement } from '../types/game';
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
import { getCropById } from '../data/farmingCrops';
import { getLevelFromExperience, getExperienceForNextLevel, getProgressToNextLevel, EXPERIENCE_TABLE } from '../utils/experience';
import { getAllQuests } from '../data/quests';
import { getAllAchievements } from '../data/achievements';
import { ITEMS } from '../data/items';

// Helper functions for experience and level calculations
export const calculateLevel = (experience: number): number => {
  return getLevelFromExperience(experience);
};

// Calculate combat level using the correct formula
export const calculateCombatLevel = (character: Character): number => {
  const defence = calculateLevel(character.skills.defence.experience);
  const hitpoints = calculateLevel(character.skills.hitpoints.experience);
  const prayer = calculateLevel(character.skills.prayer.experience);
  const attack = calculateLevel(character.skills.attack.experience);
  const strength = calculateLevel(character.skills.strength.experience);
  const ranged = calculateLevel(character.skills.ranged.experience);
  const magic = calculateLevel(character.skills.magic.experience);

  // Base = (1/4) × (Defence + Hitpoints + floor(Prayer × 1/2))
  const base = (1/4) * (defence + hitpoints + Math.floor(prayer * 0.5));

  // Melee = (13/40) × (Attack + Strength)
  const melee = (13/40) * (attack + strength);

  // Range = (13/40) × floor(Ranged × 3/2)
  const range = (13/40) * Math.floor(ranged * 1.5);

  // Mage = (13/40) × floor(Magic × 3/2)
  const mage = (13/40) * Math.floor(magic * 1.5);

  // Final = floor(Base + max(Melee, Range, Mage))
  const combatLevel = Math.floor(base + Math.max(melee, range, mage));

  return combatLevel;
};

export const getNextLevelExperience = (level: number): number => {
  // Cap level at 99 for next level experience calculation
  const cappedLevel = Math.min(level, 99);
  return EXPERIENCE_TABLE[cappedLevel + 1] || EXPERIENCE_TABLE[99];
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
  
  // Try to get speed from the item definition first
  const weaponItem = getItemById(weaponId);
  if (weaponItem?.speed) {
    return weaponItem.speed * 1000; // Convert seconds to milliseconds
  }
  
  // Fallback to legacy weapon type mapping
  const weaponSpeeds: Record<string, number> = {
    dagger: 2000,      // 2.0 seconds - fastest
    scimitar: 2400,    // 2.4 seconds - fast
    sword: 2500,       // 2.5 seconds - normal
    mace: 2600,        // 2.6 seconds - normal
    longsword: 3000,   // 3.0 seconds - slow
    axe: 3000,         // 3.0 seconds - slow
    battleaxe: 3500,   // 3.5 seconds - slower
    warhammer: 3800,   // 3.8 seconds - very slow
    two_handed_sword: 4200,  // 4.2 seconds - very slow
  };

  // Extract the weapon type from the ID (e.g., 'bronze_dagger' -> 'dagger')
  const weaponType = weaponId.split('_').slice(1).join('_');
  return weaponSpeeds[weaponType] || 2500; // Default to sword speed if weapon type not found
};

// Helper function to get monster attack speed in milliseconds
const getMonsterAttackSpeed = (monster: Monster): number => {
  if (monster.attackSpeed) {
    return monster.attackSpeed * 1000; // Convert seconds to milliseconds
  }
  
  // Default attack speeds based on creature type/level
  if (monster.level <= 10) return 2200; // Small creatures are fast
  if (monster.level <= 30) return 2800; // Medium creatures are normal
  if (monster.level <= 60) return 3200; // Large creatures are slow
  return 3800; // Very high level creatures are very slow
};

// Helper function to calculate modified action time based on equipped tools
const getModifiedActionTime = (action: SkillAction, character: Character): number => {
  const baseTime = action.baseTime;
  
  // Only apply tool modifications for woodcutting and mining
  if (action.type !== 'woodcutting' && action.type !== 'mining') {
    return baseTime;
  }
  
  // Find the equipped tool for this skill
  const equippedWeapon = character.equipment.weapon;
  if (!equippedWeapon) {
    return baseTime; // No tool equipped, use base time
  }
  
  const toolData = getItemById(equippedWeapon.id);
  if (!toolData || !toolData.stats) {
    return baseTime; // Invalid tool or no stats
  }
  
  // Get the tool's skill stat (woodcutting stat for axes, mining stat for pickaxes)
  let toolStat = 0;
  if (action.type === 'woodcutting' && 'woodcutting' in toolData.stats && toolData.stats.woodcutting) {
    toolStat = toolData.stats.woodcutting;
  } else if (action.type === 'mining' && 'mining' in toolData.stats && toolData.stats.mining) {
    toolStat = toolData.stats.mining;
  }
  
  if (toolStat <= 0) {
    return baseTime; // No relevant tool stat
  }
  
  // Apply time reduction based on tool tier
  // Higher tier tools (higher stat values) reduce time more
  // Formula: baseTime * (1 - (toolStat - 1) * 0.1)
  // Bronze (stat 1): 0% reduction
  // Iron (stat 2): 10% reduction  
  // Steel (stat 3): 20% reduction
  // Mithril (stat 4): 30% reduction
  // Adamant (stat 5): 40% reduction
  // Rune (stat 6): 50% reduction
  const timeReduction = (toolStat - 1) * 0.1;
  const modifiedTime = Math.round(baseTime * (1 - timeReduction));
  
  // Ensure minimum time of 500ms
  return Math.max(modifiedTime, 500);
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

    // Bank state
    bankTabs: [{
      id: 'main',
      name: 'Main',
      items: []
    }],
    activeBankTab: 'main',

    // Farming state
    farmingPatches: [],

    activeView: 'location',

    // Function to set the active view
    setView: (view) => set({ activeView: view }),

    // Function to check authentication status and load user data
    checkAuth: async () => {
      try {
        console.log('🔍 Starting authentication check...');
        set({ isLoading: true });
        
        // First, try to get current user info
        console.log('📡 Fetching /api/auth/me...');
        const userResponse = await fetch(createApiUrl('/api/auth/me'), {
          credentials: 'include', // Important: sends cookies
        });
        
        console.log('📊 User response status:', userResponse.status);
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('✅ User authenticated:', userData);
          
          // User is authenticated, now fetch their characters
          console.log('📡 Fetching characters...');
          const charactersResponse = await fetch(createApiUrl(API_ENDPOINTS.characters), {
            credentials: 'include',
          });
          
          console.log('📊 Characters response status:', charactersResponse.status);
          
          if (charactersResponse.ok) {
            const characters = await charactersResponse.json();
            console.log('📋 Characters loaded:', characters.length);
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
            
            console.log('✅ Setting authenticated state with user and characters');
            set({ 
              characters: charactersWithDates, 
              user: userData.user,
              isLoading: false 
            });
          } else {
            // User authenticated but no characters (shouldn't happen)
            console.log('⚠️ User authenticated but no characters');
            set({ 
              characters: [], 
              user: userData.user,
              isLoading: false 
            });
          }
        } else {
          // User is not authenticated
          console.log('❌ User not authenticated, status:', userResponse.status);
          const errorText = await userResponse.text();
          console.log('❌ Error response:', errorText);
          set({ user: null, characters: [], isLoading: false });
        }
      } catch (error) {
        console.error('💥 Error checking authentication:', error);
        set({ user: null, characters: [], isLoading: false });
      }
    },

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
            // Ensure quest properties are initialized for existing characters
            activeQuests: rest.activeQuests || [],
            questProgress: rest.questProgress || {},
                              // Ensure achievement properties are initialized for existing characters
        achievements: rest.achievements || [],
        achievementProgress: rest.achievementProgress || {},
        // Ensure auto-eating properties are initialized for existing characters  
        autoEating: rest.autoEating || {
          enabled: false,
          tier: 0,
          selectedFood: null
        },
        // Ensure farming patches are initialized for existing characters
        farmingPatches: rest.farmingPatches || []
          };
        });
        set({ characters: charactersWithDates });
      } catch (error) {
        console.error('Error loading characters:', error);
        // If characters fail to load (e.g., unauthorized), log out the user
        get().logout();
      }
    },

    // Function to delete a character
    deleteCharacter: async (characterId: string) => {
      try {
        const response = await fetch(createApiUrl(`${API_ENDPOINTS.characters}/${characterId}`), {
          method: 'DELETE',
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete character.');
        }
        
        // Remove the character from the local state
        const updatedCharacters = get().characters.filter(char => char.id !== characterId);
        set({ characters: updatedCharacters });
        
        // If the deleted character was the currently selected one, clear it
        const currentCharacter = get().character;
        if (currentCharacter && currentCharacter.id === characterId) {
          set({ character: null });
        }
        
      } catch (error) {
        console.error('Error deleting character:', error);
        throw error;
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
      
      // Update lastLogin to current time when selecting character
      const updatedCharacter = { 
        ...rest, 
        id, 
        maxHitpoints,
        lastLogin: new Date(),
        // Ensure quest properties are initialized
        activeQuests: rest.activeQuests || [],
        questProgress: rest.questProgress || {},
        achievements: rest.achievements || [],
        achievementProgress: rest.achievementProgress || {},
        // Ensure auto-eating properties are initialized
        autoEating: rest.autoEating || {
          enabled: false,
          tier: 0,
          selectedFood: null
        },
        // Ensure farming patches are initialized
        farmingPatches: rest.farmingPatches || []
      };
      
      // Sync farming patches from character to game state
      const farmingPatches = updatedCharacter.farmingPatches || [];
      
      set({ 
        character: updatedCharacter,
        farmingPatches: farmingPatches
      });
      
      // Save the updated character with new login time
      if (id) {
        get().saveCharacter(updatedCharacter);
      }
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
      
      // Recalculate combat level for existing characters (in case they were created with old formula)
      const combatLevel = calculateCombatLevel({ ...rest, maxHitpoints });
      
      // Ensure character has all required skills, including agility
      let needsSkillUpdate = false;
      const updatedSkills = { ...rest.skills };
      const requiredSkills = ['attack', 'strength', 'defence', 'hitpoints', 'ranged', 'magic', 'prayer', 'slayer', 'mining', 'smithing', 'fishing', 'cooking', 'firemaking', 'woodcutting', 'crafting', 'fletching', 'thieving', 'farming', 'runecrafting', 'agility'];
      
              for (const skillName of requiredSkills) {
          if (!updatedSkills[skillName]) {
            updatedSkills[skillName] = {
            name: skillName.charAt(0).toUpperCase() + skillName.slice(1),
            level: skillName === 'hitpoints' ? 10 : 1,
            experience: skillName === 'hitpoints' ? EXPERIENCE_TABLE[10] : 0, // Level 10 hitpoints experience
            nextLevelExperience: skillName === 'hitpoints' ? EXPERIENCE_TABLE[11] : EXPERIENCE_TABLE[2] // Next level exp
          };
          needsSkillUpdate = true;
        }
      }
      
      const updatedCharacter = { 
        ...rest, 
        id, 
        maxHitpoints, 
        combatLevel,
        skills: needsSkillUpdate ? updatedSkills : rest.skills
      };
      
              console.log('setCharacter: Setting character with ID:', id);
      
      // Sync bank tabs with character bank
      set((state) => {
        // Use character's bankTabs if available, otherwise initialize with main tab
        const characterBankTabs = updatedCharacter.bankTabs || [{
          id: 'main',
          name: 'Main',
          items: updatedCharacter.bank || []
        }];
        
        // If character doesn't have bankTabs, add them and save
        if (!updatedCharacter.bankTabs) {
          const characterWithBankTabs = {
            ...updatedCharacter,
            bankTabs: characterBankTabs
          };
          
          // Save the character with bankTabs to migrate existing characters
          get().saveCharacter(characterWithBankTabs);
          
          return { 
            character: characterWithBankTabs,
            bankTabs: characterBankTabs
          };
        }
        
        return { 
          character: updatedCharacter,
          bankTabs: characterBankTabs
        };
      });
      
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
          // Ensure quest properties are initialized for new characters
          activeQuests: newCharacter.activeQuests || [],
          questProgress: newCharacter.questProgress || {},
          // Ensure achievement properties are initialized for new characters
          achievements: newCharacter.achievements || [],
          achievementProgress: newCharacter.achievementProgress || {},
          // Ensure auto-eating properties are initialized for new characters
          autoEating: newCharacter.autoEating || {
            enabled: false,
            tier: 0,
            selectedFood: null
          }
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
      // Update character's last action for offline tracking (only for skill actions)
      if (state.character && 'skill' in action && action.type !== 'combat') {
        const updatedCharacter = {
          ...state.character,
          lastAction: {
            type: action.type as any,
            location: state.currentLocation?.id || '',
            id: action.id
          },
          lastActionTime: Date.now()
        };
        get().setCharacter(updatedCharacter);
      }

      // Set up new action
      set({ currentAction: action, isActionInProgress: true, actionProgress: 0 });
      let startTime = Date.now();
      
      // Calculate duration based on action type
      let duration: number;
      if (action.type === 'combat') {
        // For combat, use the player's weapon speed
        const combatAction = action as CombatAction;
        const weaponId = state.character?.equipment?.weapon?.id;
        duration = getWeaponSpeed(weaponId);
      } else if (state.character) {
        // For skill actions, use modified action time
        duration = getModifiedActionTime(action as SkillAction, state.character);
      } else {
        // Fallback to base time
        duration = action.baseTime;
      }
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
          const allLootItems: Array<{id: string, name: string, quantity: number}> = [];
          
          // Process normal loot
          if (roundResult.loot && roundResult.loot.length > 0) {
            roundResult.loot.forEach(itemId => {
              const item = getItemById(itemId);
              if (item) {
                // Find the drop quantity from the monster's drops array
                const drop = monster.drops?.find(d => d.itemId === itemId);
                const quantity = drop?.quantity || 1;
                state.addItemToBank(item, quantity);
                allLootItems.push({ id: item.id, name: item.name, quantity });
              }
            });
          }
          
          // Check for quest-specific loot
          if (latestCharacter) {
            latestCharacter.activeQuests.forEach(quest => {
              if (quest.id === 'dragon_disciples') {
                // Dragon teeth drop at 1% rate from dragons when quest is active
                const isDragon = monster.name.toLowerCase().includes('dragon');
                if (isDragon && Math.random() < 0.01) {
                  const dragonTeethItem = getItemById('dragon_teeth');
                  if (dragonTeethItem) {
                    state.addItemToBank(dragonTeethItem, 1);
                    allLootItems.push({ id: 'dragon_teeth', name: 'Dragon Teeth', quantity: 1 });
                  }
                }
              }
            });
          }
          
          if (allLootItems.length > 0) {
            const lootItems = allLootItems;

            // Create a combined reward item for display
            if (lootItems.length === 1) {
              // Single item - show normally
              rewardItem = lootItems[0];
            } else if (lootItems.length > 1) {
              // Multiple items - create a summary
              const summary = lootItems.map(item => `${item.name} x${item.quantity}`).join(', ');
              rewardItem = { 
                id: 'multiple_loot', 
                name: summary, 
                quantity: lootItems.reduce((total, item) => total + item.quantity, 0) 
              };
            }
          } else {
            // No loot, but still show monster killed
            rewardItem = { id: monster.id, name: `Defeated ${monster.name}`, quantity: 1 };
          }
          // Track per-monster stats
          const monsterId = monster.id;
          // Get fresh character state after bank items have been added
          const characterWithLoot = get().character;
          if (!characterWithLoot) return;
          
          const updatedStats = {
            ...characterWithLoot.stats,
            monstersKilledByType: {
              ...characterWithLoot.stats.monstersKilledByType,
              [monsterId]: (characterWithLoot.stats.monstersKilledByType[monsterId] || 0) + 1
            }
          };
          set({
            character: { ...characterWithLoot, stats: updatedStats, hitpoints: newPlayerHp },
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
          
          // Update quest progress for monster kills
          if (state.selectedMonster && updatedCharacter) {
            updatedCharacter.activeQuests.forEach(quest => {
              quest.requirements.forEach(req => {
                if (req.type === 'kill' && req.monsterId === state.selectedMonster?.id) {
                  const currentProgress = updatedCharacter.questProgress[quest.id]?.requirements[req.id] || 0;
                  get().updateQuestProgress(quest.id, req.id, currentProgress + 1);
                }
              });
            });
          }
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
              combatLevel: character.combatLevel,
              favouriteAction: '',
              topSkills: [],

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
              slayerTasksCompleted: 0,

              // Detailed tracking
              resourcesGathered: {} as import('../types/game').StrictResourceMap,
              actionsPerformed: {} as Record<string, number>,
              monstersKilledByType: {} as Record<string, number>,
              
              // Farming tracking
              farmingPatchesPlanted: {},
              farmingCropsPlanted: {},
              farmingHarvests: {},
              
              // Thieving tracking
              thievingActions: {},
              
              // Agility tracking
              agilityLaps: {},
              
              // Processing detailed tracking
              smithingActions: {},
              cookingActions: {},
              firemakingLogs: {},
              fletchingArrows: {},
              fletchingBows: {},
              fletchingBowsStrung: {},
              fletchingJavelins: {},
              craftingArmor: {},
              craftingJewelry: {},
              craftingStaves: {},
              craftingGems: {},
              herblorePotions: {},
              prayerBones: {},
              runecraftingRunes: {}
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
          
          // Initialize new tracking objects
          if (!character.stats.farmingPatchesPlanted) {
            character.stats.farmingPatchesPlanted = {};
          }
          if (!character.stats.farmingCropsPlanted) {
            character.stats.farmingCropsPlanted = {};
          }
          if (!character.stats.farmingHarvests) {
            character.stats.farmingHarvests = {};
          }
          if (!character.stats.thievingActions) {
            character.stats.thievingActions = {};
          }
          if (!character.stats.agilityLaps) {
            character.stats.agilityLaps = {};
          }
          if (!character.stats.smithingActions) {
            character.stats.smithingActions = {};
          }
          if (!character.stats.cookingActions) {
            character.stats.cookingActions = {};
          }
          if (!character.stats.firemakingLogs) {
            character.stats.firemakingLogs = {};
          }
          if (!character.stats.fletchingArrows) {
            character.stats.fletchingArrows = {};
          }
          if (!character.stats.fletchingBows) {
            character.stats.fletchingBows = {};
          }
          if (!character.stats.fletchingBowsStrung) {
            character.stats.fletchingBowsStrung = {};
          }
          if (!character.stats.fletchingJavelins) {
            character.stats.fletchingJavelins = {};
          }
          if (!character.stats.craftingArmor) {
            character.stats.craftingArmor = {};
          }
          if (!character.stats.craftingJewelry) {
            character.stats.craftingJewelry = {};
          }
          if (!character.stats.craftingStaves) {
            character.stats.craftingStaves = {};
          }
          if (!character.stats.craftingGems) {
            character.stats.craftingGems = {};
          }
          if (!character.stats.herblorePotions) {
            character.stats.herblorePotions = {};
          }
          if (!character.stats.prayerBones) {
            character.stats.prayerBones = {};
          }
          if (!character.stats.runecraftingRunes) {
            character.stats.runecraftingRunes = {};
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
          
          // Check achievements after action completion
          setTimeout(() => get().checkAchievements(), 100);
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

              // --- Detailed tracking for specific action types ---
        const character = get().character;
        if (character) {
        const actionId = state.currentAction.id;
        const itemRewardId = state.currentAction.itemReward?.id;
        
        // Track specific action types
        switch (state.currentAction.type) {
          case 'thieving':
            if (!character.stats.thievingActions[actionId]) {
              character.stats.thievingActions[actionId] = 0;
            }
            character.stats.thievingActions[actionId]++;
            break;
            
          case 'agility':
            if (!character.stats.agilityLaps[actionId]) {
              character.stats.agilityLaps[actionId] = 0;
            }
            character.stats.agilityLaps[actionId]++;
            break;
            
          case 'smithing':
            if (!character.stats.smithingActions[actionId]) {
              character.stats.smithingActions[actionId] = 0;
            }
            character.stats.smithingActions[actionId]++;
            break;
            
          case 'cooking':
            if (itemRewardId && !character.stats.cookingActions[itemRewardId]) {
              character.stats.cookingActions[itemRewardId] = 0;
            }
            if (itemRewardId) {
              character.stats.cookingActions[itemRewardId]++;
            }
            break;
            
          case 'firemaking':
            // Track which type of log was burned
            const logRequirement = state.currentAction.requirements?.find(req => req.itemId?.includes('log'));
            if (logRequirement?.itemId && !character.stats.firemakingLogs[logRequirement.itemId]) {
              character.stats.firemakingLogs[logRequirement.itemId] = 0;
            }
            if (logRequirement?.itemId) {
              character.stats.firemakingLogs[logRequirement.itemId]++;
            }
            break;
            
          case 'fletching':
            if (itemRewardId) {
              if (itemRewardId.includes('arrow')) {
                if (!character.stats.fletchingArrows[itemRewardId]) {
                  character.stats.fletchingArrows[itemRewardId] = 0;
                }
                character.stats.fletchingArrows[itemRewardId]++;
              } else if (itemRewardId.includes('javelin')) {
                if (!character.stats.fletchingJavelins[itemRewardId]) {
                  character.stats.fletchingJavelins[itemRewardId] = 0;
                }
                character.stats.fletchingJavelins[itemRewardId]++;
              } else if (itemRewardId.includes('unstrung')) {
                if (!character.stats.fletchingBows[itemRewardId]) {
                  character.stats.fletchingBows[itemRewardId] = 0;
                }
                character.stats.fletchingBows[itemRewardId]++;
              } else if (itemRewardId.includes('bow') && !itemRewardId.includes('unstrung')) {
                if (!character.stats.fletchingBowsStrung[itemRewardId]) {
                  character.stats.fletchingBowsStrung[itemRewardId] = 0;
                }
                character.stats.fletchingBowsStrung[itemRewardId]++;
              }
            }
            break;
            
          case 'crafting':
            if (itemRewardId) {
              if (itemRewardId.includes('leather') || itemRewardId.includes('dragonhide')) {
                if (!character.stats.craftingArmor[itemRewardId]) {
                  character.stats.craftingArmor[itemRewardId] = 0;
                }
                character.stats.craftingArmor[itemRewardId]++;
              } else if (itemRewardId.includes('ring') || itemRewardId.includes('amulet')) {
                if (!character.stats.craftingJewelry[itemRewardId]) {
                  character.stats.craftingJewelry[itemRewardId] = 0;
                }
                character.stats.craftingJewelry[itemRewardId]++;
              } else if (itemRewardId.includes('battlestaff')) {
                if (!character.stats.craftingStaves[itemRewardId]) {
                  character.stats.craftingStaves[itemRewardId] = 0;
                }
                character.stats.craftingStaves[itemRewardId]++;
              } else if (['sapphire', 'emerald', 'ruby', 'diamond', 'dragonstone', 'onyx', 'zenyte'].some(gem => itemRewardId.includes(gem))) {
                if (!character.stats.craftingGems[itemRewardId]) {
                  character.stats.craftingGems[itemRewardId] = 0;
                }
                character.stats.craftingGems[itemRewardId]++;
              }
            }
            break;
            
          case 'herblore':
            if (itemRewardId && !character.stats.herblorePotions[itemRewardId]) {
              character.stats.herblorePotions[itemRewardId] = 0;
            }
            if (itemRewardId) {
              character.stats.herblorePotions[itemRewardId]++;
            }
            break;
            
          case 'prayer':
            // Track which type of bone was buried
            const boneRequirement = state.currentAction.requirements?.find(req => req.itemId?.includes('bone'));
            if (boneRequirement?.itemId && !character.stats.prayerBones[boneRequirement.itemId]) {
              character.stats.prayerBones[boneRequirement.itemId] = 0;
            }
            if (boneRequirement?.itemId) {
              character.stats.prayerBones[boneRequirement.itemId]++;
            }
            break;
            
          case 'runecrafting':
            if (itemRewardId && !character.stats.runecraftingRunes[itemRewardId]) {
              character.stats.runecraftingRunes[itemRewardId] = 0;
            }
            if (itemRewardId) {
              character.stats.runecraftingRunes[itemRewardId]++;
            }
            break;
        }
        
        // Update favourite action
        const allActions = character.stats.actionsPerformed;
        let maxCount = 0;
        let favouriteAction = '';
        for (const [action, count] of Object.entries(allActions)) {
          if (count > maxCount) {
            maxCount = count;
            favouriteAction = action;
          }
        }
        character.stats.favouriteAction = favouriteAction;
        
        // Update top 5 skills
        const skillEntries = Object.entries(character.skills)
          .filter(([skillName]) => skillName !== 'none')
          .map(([skillName, skill]) => ({
            skill: skillName,
            level: skill.level,
            experience: skill.experience
          }))
          .sort((a, b) => b.level - a.level || b.experience - a.experience)
          .slice(0, 5);
        character.stats.topSkills = skillEntries;
        
        // Update combat level
        character.stats.combatLevel = character.combatLevel;
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

      // Handle thieving possible loot
      let thievingLootItems: Array<{id: string, name: string, quantity: number}> = [];
      if (state.currentAction.type === 'thieving' && 'possibleLoot' in state.currentAction && state.currentAction.possibleLoot) {
        state.currentAction.possibleLoot.forEach(lootEntry => {
          if (Math.random() < lootEntry.chance) {
            const item = getItemById(lootEntry.id);
            if (item) {
              const quantity = lootEntry.quantity || 1;
              state.addItemToBank(item, quantity);
              thievingLootItems.push({ id: item.id, name: item.name, quantity });
            }
          }
        });
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
      const hasThievingLoot = thievingLootItems.length > 0;
      
      // For thieving actions with loot, combine the guaranteed reward with the stolen items
      let rewardItem = state.currentAction.itemReward;
      if (state.currentAction.type === 'thieving' && hasThievingLoot) {
        if (thievingLootItems.length === 1) {
          // Single loot item - show it
          rewardItem = { 
            id: thievingLootItems[0].id, 
            name: thievingLootItems[0].name, 
            quantity: thievingLootItems[0].quantity 
          };
        } else {
          // Multiple loot items - create a summary
          const summary = thievingLootItems.map(item => `${item.name} x${item.quantity}`).join(', ');
          rewardItem = { 
            id: 'thieving_loot', 
            name: summary, 
            quantity: thievingLootItems.length 
          };
        }
      }
      
      if (hasXp || hasItem || hasLevelUp || hasThievingLoot) {
        set({
          lastActionReward: {
            xp: xpGained,
            item: rewardItem,
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
        
        // Find if the item already exists in any tab
        let existingItemTabId = '';
        let existingItemTabIndex = -1;
        let existingItemIndex = -1;
        
        for (let tabIndex = 0; tabIndex < state.bankTabs.length; tabIndex++) {
          const tab = state.bankTabs[tabIndex];
          const itemIndex = tab.items.findIndex(i => i.id === item.id);
          if (itemIndex !== -1) {
            existingItemTabId = tab.id;
            existingItemTabIndex = tabIndex;
            existingItemIndex = itemIndex;
            break;
          }
        }

        // Update bank tabs
        const updatedBankTabs = state.bankTabs.map(tab => {
          const newItems = [...tab.items];
          
          // Add or update the item
          if (existingItemTabId && tab.id === existingItemTabId) {
            // Item exists in this tab, increase quantity
            newItems[existingItemIndex].quantity += quantity;
          } else if (!existingItemTabId && tab.id === 'main') {
            // Item doesn't exist anywhere, add to main tab
            const itemIndex = newItems.findIndex(i => i.id === item.id);
            if (itemIndex !== -1) {
              newItems[itemIndex].quantity += quantity;
            } else {
              newItems.push({ id: item.id, name: item.name, quantity });
            }
          }
          
          return { ...tab, items: newItems };
        });

        // Track coins earned
        if (item.id === 'coins') {
          get().incrementStat('coinsEarned', quantity);
        }

        const updatedCharacter = { 
          ...state.character, 
          bank: updatedBankTabs.find(tab => tab.id === 'main')?.items || [], // Keep the old bank for backward compatibility
          bankTabs: updatedBankTabs 
        };
        
        // Check quest progress for item-based quests
        if (updatedCharacter.activeQuests) {
          updatedCharacter.activeQuests.forEach(quest => {
            quest.requirements.forEach(req => {
              if (req.type === 'item' && req.itemId === item.id) {
                // Check quest completion after item is added
                setTimeout(() => {
                  const latestState = get();
                  if (latestState.character && latestState.checkQuestRequirements(quest.id)) {
                    latestState.completeQuest(quest.id);
                  }
                }, 100);
              }
            });
          });
        }
        
        // Save the character to persist changes
        get().saveCharacter(updatedCharacter);
        
        // Check achievements after adding items (for gold achievements)
        setTimeout(() => get().checkAchievements(), 100);
        
        return {
          character: updatedCharacter,
          bankTabs: updatedBankTabs
        };
      });
    },
    removeItemFromBank: (itemId: string, quantity: number) => {
      set((state) => {
        if (!state.character) return {};
        
        // Find the item in any tab
        let itemFound = false;
        let itemTabId = '';
        let itemTabIndex = -1;
        let itemIndex = -1;
        let itemQuantity = 0;
        
        for (let tabIndex = 0; tabIndex < state.bankTabs.length; tabIndex++) {
          const tab = state.bankTabs[tabIndex];
          const foundItemIndex = tab.items.findIndex(i => i.id === itemId);
          if (foundItemIndex !== -1) {
            itemFound = true;
            itemTabId = tab.id;
            itemTabIndex = tabIndex;
            itemIndex = foundItemIndex;
            itemQuantity = tab.items[foundItemIndex].quantity;
            break;
          }
        }

        if (!itemFound || itemQuantity < quantity) return {};

        // Update bank tabs
        const updatedBankTabs = state.bankTabs.map(tab => {
          const newItems = [...tab.items];
          
          // Remove items from the tab that has them
          if (tab.id === itemTabId) {
            if (itemQuantity === quantity) {
              newItems.splice(itemIndex, 1);
            } else {
              newItems[itemIndex].quantity -= quantity;
            }
          }
          
          return { ...tab, items: newItems };
        });

        // Track coins spent
        if (itemId === 'coins') {
          get().incrementStat('coinsSpent', quantity);
        }

        const updatedCharacter = { 
          ...state.character, 
          bank: updatedBankTabs.find(tab => tab.id === 'main')?.items || [], // Keep the old bank for backward compatibility
          bankTabs: updatedBankTabs 
        };
        
        // Save the character to persist changes
        get().saveCharacter(updatedCharacter);
        
        return {
          character: updatedCharacter,
          bankTabs: updatedBankTabs
        };
      });
    },
    sellItem: (itemId: string, quantity: number) => {
      const { character, bankTabs } = get();
      if (!character) return;

      const item = getItemById(itemId);
      if (!item || !item.sellPrice) return; // Item not sellable

      // Find the item in any tab
      let itemFound = false;
      let itemTabId = '';
      let itemTabIndex = -1;
      let itemIndex = -1;
      let itemQuantity = 0;
      
      for (let tabIndex = 0; tabIndex < bankTabs.length; tabIndex++) {
        const tab = bankTabs[tabIndex];
        const foundItemIndex = tab.items.findIndex(i => i.id === itemId);
        if (foundItemIndex !== -1) {
          itemFound = true;
          itemTabId = tab.id;
          itemTabIndex = tabIndex;
          itemIndex = foundItemIndex;
          itemQuantity = tab.items[foundItemIndex].quantity;
          break;
        }
      }

      if (!itemFound || itemQuantity < quantity) return; // Item not found or not enough

      // Find coins in any tab
      let coinsFound = false;
      let coinsTabId = '';
      let coinsTabIndex = -1;
      let coinsIndex = -1;
      
      for (let tabIndex = 0; tabIndex < bankTabs.length; tabIndex++) {
        const tab = bankTabs[tabIndex];
        const foundCoinsIndex = tab.items.findIndex(i => i.id === 'coins');
        if (foundCoinsIndex !== -1) {
          coinsFound = true;
          coinsTabId = tab.id;
          coinsTabIndex = tabIndex;
          coinsIndex = foundCoinsIndex;
          break;
        }
      }

      const coinsToAdd = item.sellPrice * quantity;

      // Update bank tabs
      const updatedBankTabs = bankTabs.map(tab => {
        const newItems = [...tab.items];
        
        // Remove items from the tab that has them
        if (tab.id === itemTabId) {
          if (itemQuantity === quantity) {
            newItems.splice(itemIndex, 1);
          } else {
            newItems[itemIndex].quantity -= quantity;
          }
        }
        
        // Add coins to the tab that has them, or to main tab if no coins exist
        if (coinsFound && tab.id === coinsTabId) {
          newItems[coinsIndex].quantity += coinsToAdd;
        } else if (!coinsFound && tab.id === 'main') {
          // No coins exist anywhere, add to main tab
          const existingCoinsIndex = newItems.findIndex(i => i.id === 'coins');
          if (existingCoinsIndex !== -1) {
            newItems[existingCoinsIndex].quantity += coinsToAdd;
          } else {
            newItems.push({ id: 'coins', name: 'Coins', quantity: coinsToAdd });
          }
        }
        
        return { ...tab, items: newItems };
      });

      const updatedCharacter = { 
        ...character, 
        bank: updatedBankTabs.find(tab => tab.id === 'main')?.items || [], // Keep the old bank for backward compatibility
        bankTabs: updatedBankTabs 
      };
      
      get().setCharacter(updatedCharacter);
      get().saveCharacter(updatedCharacter);
    },
    updateBankOrder: (newBank: ItemReward[]) => {
      set((state) => {
        if (!state.character) return {};
        
        // Update the main bank tab and character bank
        const newBankTabs = [...state.bankTabs];
        const mainTabIndex = newBankTabs.findIndex(tab => tab.id === 'main');
        if (mainTabIndex !== -1) {
          newBankTabs[mainTabIndex] = {
            ...newBankTabs[mainTabIndex],
            items: newBank
          };
        }
        
        const updatedCharacter = { ...state.character, bank: newBank, bankTabs: newBankTabs };
        
        const newState = {
          character: updatedCharacter,
          bankTabs: newBankTabs
        };
        
        // Save the updated character to persist bank tabs
        get().saveCharacter(updatedCharacter);
        
        return newState;
      });
    },

    // Bank tab management
    createBankTab: (name: string, initialItem?: ItemReward) => {
      set((state) => {
        const newTabId = `tab_${Date.now()}`;
        const newTab = {
          id: newTabId,
          name,
          items: initialItem ? [initialItem] : []
        };
        
        const newBankTabs = [...state.bankTabs, newTab];
        
        // Update character's bankTabs
        const updatedCharacter = state.character ? {
          ...state.character,
          bankTabs: newBankTabs
        } : null;
        
        const newState = {
          bankTabs: newBankTabs,
          activeBankTab: newTabId,
          character: updatedCharacter
        };
        
        // Save the updated character to persist bank tabs
        if (updatedCharacter) {
          get().saveCharacter(updatedCharacter);
        }
        
        return newState;
      });
    },

    deleteBankTab: (tabId: string) => {
      set((state) => {
        if (tabId === 'main') return {}; // Can't delete main tab
        
        const tabToDelete = state.bankTabs.find(tab => tab.id === tabId);
        if (!tabToDelete) return {};
        
        // Move items back to main tab
        const newBankTabs = state.bankTabs.filter(tab => tab.id !== tabId);
        const mainTab = newBankTabs.find(tab => tab.id === 'main');
        if (mainTab && tabToDelete.items.length > 0) {
          mainTab.items.push(...tabToDelete.items);
          
          // Update character bank and bankTabs
          const updatedCharacter = state.character ? {
            ...state.character,
            bank: mainTab.items,
            bankTabs: newBankTabs
          } : null;
          
          const newState = {
            bankTabs: newBankTabs,
            activeBankTab: state.activeBankTab === tabId ? 'main' : state.activeBankTab,
            character: updatedCharacter
          };
          
          // Save the updated character to persist bank tabs
          if (updatedCharacter) {
            get().saveCharacter(updatedCharacter);
          }
          
          return newState;
        }
        
        // Update character bankTabs even if no items to move
        const updatedCharacter = state.character ? {
          ...state.character,
          bankTabs: newBankTabs
        } : null;
        
        const newState = {
          bankTabs: newBankTabs,
          activeBankTab: state.activeBankTab === tabId ? 'main' : state.activeBankTab,
          character: updatedCharacter
        };
        
        // Save the updated character to persist bank tabs
        if (updatedCharacter) {
          get().saveCharacter(updatedCharacter);
        }
        
        return newState;
      });
    },

    setBankTab: (tabId: string) => {
      set({ activeBankTab: tabId });
    },

    moveBankItem: (fromTabId: string, fromIndex: number, toTabId: string, toIndex: number) => {
      set((state) => {
        const newBankTabs = [...state.bankTabs];
        const fromTab = newBankTabs.find(tab => tab.id === fromTabId);
        const toTab = newBankTabs.find(tab => tab.id === toTabId);

        if (!fromTab || !toTab) return {};

        const [movedItem] = fromTab.items.splice(fromIndex, 1);
        
        if (fromTabId === toTabId) {
          // Moving within the same tab
          toTab.items.splice(toIndex, 0, movedItem);
        } else {
          // Moving to a different tab
          toTab.items.splice(toIndex, 0, movedItem);
        }

        // Update character bank and bankTabs
        const mainTab = newBankTabs.find(tab => tab.id === 'main');
        const updatedCharacter = state.character ? {
          ...state.character,
          bank: mainTab ? mainTab.items : state.character.bank,
          bankTabs: newBankTabs
        } : null;

        const newState = {
          bankTabs: newBankTabs,
          character: updatedCharacter
        };
        
        // Save the updated character to persist bank tabs
        if (updatedCharacter) {
          get().saveCharacter(updatedCharacter);
        }
        
        return newState;
      });
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
              // Check if any equipped item matches the required category (e.g., any axe, any pickaxe)
              const equipped = Object.values(state.character.equipment).find(
                (item) => item && (
                  item.category === requirement.category ||
                  (requirement.category === 'axe' && item.id.endsWith('_axe')) ||
                  (requirement.category === 'pickaxe' && item.id.endsWith('_pickaxe'))
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
      
      // Calculate new combat level (affects any combat skill)
      const combatSkills = ['attack', 'strength', 'defence', 'hitpoints', 'prayer', 'ranged', 'magic'];
      let combatLevel = state.character.combatLevel;
      if (combatSkills.includes(skill)) {
        const tempCharacter = { ...state.character, skills, maxHitpoints, hitpoints };
        combatLevel = calculateCombatLevel(tempCharacter);
      }
      
      const updatedCharacter = { ...state.character, skills, maxHitpoints, hitpoints, combatLevel };
      get().setCharacter(updatedCharacter);
      
      // Check achievements after experience gain
      setTimeout(() => get().checkAchievements(), 100);
      
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
      
      // Track slayer task completion
      if (state.character.stats) {
        state.character.stats.slayerTasksCompleted = (state.character.stats.slayerTasksCompleted || 0) + 1;
      }
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
      const state = get();
      const { character } = state;
      
      if (!character || !character.lastLogin) {
        return null;
      }

      const now = new Date();
      const lastLogin = new Date(character.lastLogin);
      const timeDifference = now.getTime() - lastLogin.getTime();
      
      // Minimum offline time: 1 minute (60,000ms)
      // Maximum offline time: 8 hours (28,800,000ms)
      const MIN_OFFLINE_TIME = 60 * 1000; // 1 minute
      const MAX_OFFLINE_TIME = 8 * 60 * 60 * 1000; // 8 hours
      
      if (timeDifference < MIN_OFFLINE_TIME) {
        return null;
      }
      
      // Cap the offline time to maximum
      const cappedTime = Math.min(timeDifference, MAX_OFFLINE_TIME);
      
      // Check if character has a last action that can be continued offline
      if (!character.lastAction || character.lastAction.type === 'none' || character.lastAction.type === 'combat') {
        return null;
      }
      
      // Find the last action from mock data
      const location = mockLocations.find(loc => loc.id === character.lastAction.location);
      if (!location) return null;
      
      const lastAction = location.actions.find(action => action.id === character.lastAction.id);
      if (!lastAction || lastAction.type === 'combat' || lastAction.type === 'combat_selection') {
        return null;
      }
      
      const skillAction = lastAction as SkillAction;
      
      // Check if character can still perform this action (includes requirements like items, levels, equipment)
      if (!get().canPerformAction(skillAction)) {
        // Character can't perform the action anymore (e.g., ran out of required items)
        // This prevents offline progression when requirements are no longer met
        return null;
      }
      
      // Calculate action time (including tool modifications)
      const actionTime = getModifiedActionTime(skillAction, character);
      
      // Calculate how many actions could be completed in the offline time
      let actionsCompleted = Math.floor(cappedTime / actionTime);
      
      if (actionsCompleted <= 0) {
        return null;
      }
      
      // Check item requirements and limit actions based on available resources
      if (skillAction.requirements) {
        for (const requirement of skillAction.requirements) {
          if (requirement.type === 'item' && requirement.itemId && requirement.quantity) {
            const bankItem = character.bank.find(item => item.id === requirement.itemId);
            if (!bankItem) {
              actionsCompleted = 0; // No items available
              break;
            }
            
            // Calculate how many actions can be performed with available items
            const maxActionsFromItem = Math.floor(bankItem.quantity / requirement.quantity);
            actionsCompleted = Math.min(actionsCompleted, maxActionsFromItem);
          }
        }
      }
      
      if (actionsCompleted <= 0) {
        return null;
      }
      
      // Calculate rewards
      const totalXp = skillAction.experience * actionsCompleted;
      const totalItems = skillAction.itemReward.quantity * actionsCompleted;
      
      // Apply rewards to character
      const updatedCharacter = { ...character };
      
      // Add XP
      const oldSkill = updatedCharacter.skills[skillAction.skill];
      if (oldSkill) {
        const newExp = oldSkill.experience + totalXp;
        const newLevel = calculateLevel(newExp);
        updatedCharacter.skills[skillAction.skill] = {
          ...oldSkill,
          experience: newExp,
          level: newLevel,
          nextLevelExperience: getNextLevelExperience(newLevel)
        };
        
        // Update max hitpoints if hitpoints skill was trained
        if (skillAction.skill === 'hitpoints') {
          const oldLevel = calculateLevel(oldSkill.experience);
          updatedCharacter.maxHitpoints = calculateMaxHitpoints(newLevel);
          // Heal proportionally if leveled up
          if (newLevel > oldLevel) {
            const hitpointsGained = updatedCharacter.maxHitpoints - character.maxHitpoints;
            updatedCharacter.hitpoints = Math.min(updatedCharacter.hitpoints + hitpointsGained, updatedCharacter.maxHitpoints);
          }
        }
        
        // Update combat level if relevant skill
        const combatSkills = ['attack', 'strength', 'defence', 'hitpoints', 'prayer', 'ranged', 'magic'];
        if (combatSkills.includes(skillAction.skill)) {
          updatedCharacter.combatLevel = calculateCombatLevel(updatedCharacter);
        }
      }
      
      // Consume required items from bank
      if (skillAction.requirements) {
        for (const requirement of skillAction.requirements) {
          if (requirement.type === 'item' && requirement.itemId && requirement.quantity) {
            const bankItem = updatedCharacter.bank.find(item => item.id === requirement.itemId);
            if (bankItem) {
              const itemsToConsume = requirement.quantity * actionsCompleted;
              bankItem.quantity -= itemsToConsume;
              
              // Remove item from bank if quantity reaches 0
              if (bankItem.quantity <= 0) {
                const itemIndex = updatedCharacter.bank.findIndex(item => item.id === requirement.itemId);
                if (itemIndex !== -1) {
                  updatedCharacter.bank.splice(itemIndex, 1);
                }
              }
            }
          }
        }
      }
      
      // Add items to bank
      const bankItem = updatedCharacter.bank.find(item => item.id === skillAction.itemReward.id);
      if (bankItem) {
        bankItem.quantity += totalItems;
      } else {
        updatedCharacter.bank.push({
          id: skillAction.itemReward.id,
          name: skillAction.itemReward.name,
          quantity: totalItems
        });
      }
      
      // Update character stats
      if (!updatedCharacter.stats.totalOfflineTime) {
        updatedCharacter.stats.totalOfflineTime = 0;
      }
      updatedCharacter.stats.totalOfflineTime += cappedTime;
      
      // Track actions performed
      if (!updatedCharacter.stats.actionsPerformed) {
        updatedCharacter.stats.actionsPerformed = {};
      }
      updatedCharacter.stats.actionsPerformed[skillAction.id] = 
        (updatedCharacter.stats.actionsPerformed[skillAction.id] || 0) + actionsCompleted;
      
      // Track resources gathered
      if (!updatedCharacter.stats.resourcesGathered) {
        updatedCharacter.stats.resourcesGathered = {};
      }
      const currentCount = Number(updatedCharacter.stats.resourcesGathered[skillAction.itemReward.id]) || 0;
      updatedCharacter.stats.resourcesGathered[skillAction.itemReward.id] = (currentCount + totalItems) as any;
      
      // Track specific stats based on action type
      switch (skillAction.type) {
        case 'woodcutting':
          updatedCharacter.stats.logsChopped = (updatedCharacter.stats.logsChopped || 0) + actionsCompleted;
          break;
        case 'mining':
          updatedCharacter.stats.oresMined = (updatedCharacter.stats.oresMined || 0) + actionsCompleted;
          break;
        case 'fishing':
          updatedCharacter.stats.fishCaught = (updatedCharacter.stats.fishCaught || 0) + actionsCompleted;
          break;
        case 'farming':
          updatedCharacter.stats.cropsHarvested = (updatedCharacter.stats.cropsHarvested || 0) + actionsCompleted;
          break;
        case 'crafting':
          updatedCharacter.stats.itemsCrafted = (updatedCharacter.stats.itemsCrafted || 0) + actionsCompleted;
          break;
        case 'fletching':
          updatedCharacter.stats.arrowsFletched = (updatedCharacter.stats.arrowsFletched || 0) + actionsCompleted;
          break;
        case 'smithing':
          updatedCharacter.stats.barsSmelted = (updatedCharacter.stats.barsSmelted || 0) + actionsCompleted;
          break;
        case 'cooking':
          updatedCharacter.stats.foodCooked = (updatedCharacter.stats.foodCooked || 0) + actionsCompleted;
          break;
        case 'firemaking':
          updatedCharacter.stats.logsBurned = (updatedCharacter.stats.logsBurned || 0) + actionsCompleted;
          break;
        case 'prayer':
          updatedCharacter.stats.bonesBuried = (updatedCharacter.stats.bonesBuried || 0) + actionsCompleted;
          break;
        case 'runecrafting':
          updatedCharacter.stats.runesCrafted = (updatedCharacter.stats.runesCrafted || 0) + actionsCompleted;
          break;
      }
      
      // Track coins earned if the reward was coins
      if (skillAction.itemReward.id === 'coins') {
        updatedCharacter.stats.coinsEarned = (updatedCharacter.stats.coinsEarned || 0) + totalItems;
      }
      
      // Update character with offline progress (but don't trigger another processOfflineProgress)
      // Use direct state update to avoid infinite loop
      set({ character: updatedCharacter });
      
      // Calculate consumed items for display
      const consumedItems: Array<{id: string, name: string, quantity: number}> = [];
      if (skillAction.requirements) {
        for (const requirement of skillAction.requirements) {
          if (requirement.type === 'item' && requirement.itemId && requirement.quantity) {
            const originalBankItem = character.bank.find(item => item.id === requirement.itemId);
            if (originalBankItem) {
              const itemsConsumed = requirement.quantity * actionsCompleted;
              consumedItems.push({
                id: requirement.itemId,
                name: originalBankItem.name,
                quantity: itemsConsumed
              });
            }
          }
        }
      }
      
      // Return the rewards for display
      return {
        xp: totalXp,
        item: {
          id: skillAction.itemReward.id,
          name: skillAction.itemReward.name,
          quantity: totalItems
        },
        skill: skillAction.skill,
        timePassed: cappedTime,
        actionsCompleted,
        consumedItems
      };
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

    buyItem: (itemId: string, quantity: number, buyPrice?: number) => {
      const { character, bankTabs } = get();
      if (!character) return;

      const item = getItemById(itemId);
      if (!item) return;

      // Use provided buyPrice or fall back to item.buyPrice
      const itemPrice = buyPrice || item.buyPrice;
      if (!itemPrice) return;

      const totalCost = itemPrice * quantity;
      
      // Find coins in any tab
      let coinsFound = false;
      let coinsQuantity = 0;
      let coinsTabId = '';
      
      for (const tab of bankTabs) {
        const coinsIndex = tab.items.findIndex(i => i.id === 'coins');
        if (coinsIndex !== -1) {
          coinsFound = true;
          coinsQuantity = tab.items[coinsIndex].quantity;
          coinsTabId = tab.id;
          break;
        }
      }

      if (!coinsFound || coinsQuantity < totalCost) return;

      // Find if the item already exists in any tab
      let existingItemTabId = '';
      let existingItemTabIndex = -1;
      let existingItemIndex = -1;
      
      for (let tabIndex = 0; tabIndex < bankTabs.length; tabIndex++) {
        const tab = bankTabs[tabIndex];
        const itemIndex = tab.items.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
          existingItemTabId = tab.id;
          existingItemTabIndex = tabIndex;
          existingItemIndex = itemIndex;
          break;
        }
      }

      // Update bank tabs
      const updatedBankTabs = bankTabs.map(tab => {
        const newItems = [...tab.items];
        
        // Subtract coins from the tab that has them
        if (tab.id === coinsTabId) {
          const coinsIndex = newItems.findIndex(i => i.id === 'coins');
          if (coinsIndex !== -1) {
            newItems[coinsIndex].quantity -= totalCost;
            if (newItems[coinsIndex].quantity === 0) {
              newItems.splice(coinsIndex, 1);
            }
          }
        }
        
        // Add or update the item
        if (existingItemTabId && tab.id === existingItemTabId) {
          // Item exists in this tab, increase quantity
          const itemIndex = newItems.findIndex(i => i.id === itemId);
          if (itemIndex !== -1) {
            newItems[itemIndex].quantity += quantity;
          }
        } else if (!existingItemTabId && tab.id === 'main') {
          // Item doesn't exist anywhere, add to main tab
          const itemIndex = newItems.findIndex(i => i.id === itemId);
          if (itemIndex !== -1) {
            newItems[itemIndex].quantity += quantity;
          } else {
            newItems.push({ id: item.id, name: item.name, quantity });
          }
        }
        
        return { ...tab, items: newItems };
      });

      const updatedCharacter = { 
        ...character, 
        bank: updatedBankTabs.find(tab => tab.id === 'main')?.items || [], // Keep the old bank for backward compatibility
        bankTabs: updatedBankTabs 
      };
      
      get().setCharacter(updatedCharacter);
      get().saveCharacter(updatedCharacter);
    },
    equipItem: (item: Item) => {
      const { character, bankTabs } = get();
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

      // Find the item in any tab
      let itemFound = false;
      let itemTabId = '';
      let itemTabIndex = -1;
      let itemIndex = -1;
      let itemQuantity = 0;
      
      for (let tabIndex = 0; tabIndex < bankTabs.length; tabIndex++) {
        const tab = bankTabs[tabIndex];
        const foundItemIndex = tab.items.findIndex(i => i.id === item.id);
        if (foundItemIndex !== -1) {
          itemFound = true;
          itemTabId = tab.id;
          itemTabIndex = tabIndex;
          itemIndex = foundItemIndex;
          itemQuantity = tab.items[foundItemIndex].quantity;
          break;
        }
      }

      if (!itemFound) return; // Item not in bank

      // Update bank tabs
      const updatedBankTabs = bankTabs.map(tab => {
        const newItems = [...tab.items];
        
        // Remove items from the tab that has them
        if (tab.id === itemTabId) {
          if (itemQuantity <= 1) {
            newItems.splice(itemIndex, 1);
          } else {
            newItems[itemIndex].quantity -= 1;
          }
        }
        
        // Add previously equipped item back to bank, if there was one
        if (currentEquippedItem && tab.id === 'main') {
          const existingItemIndex = newItems.findIndex(i => i.id === currentEquippedItem.id);
          if (existingItemIndex !== -1) {
            newItems[existingItemIndex].quantity += (currentEquippedItem.quantity || 1);
          } else {
            newItems.push({
              id: currentEquippedItem.id,
              name: currentEquippedItem.name,
              quantity: currentEquippedItem.quantity || 1,
            });
          }
        }
        
        return { ...tab, items: newItems };
      });

      // Update character
      const updatedCharacter = {
        ...character,
        bank: updatedBankTabs.find(tab => tab.id === 'main')?.items || [], // Keep the old bank for backward compatibility
        bankTabs: updatedBankTabs,
        equipment: {
          ...character.equipment,
          [item.slot]: { ...item, quantity: 1 },
        },
      };

      get().setCharacter(updatedCharacter);
      get().saveCharacter(updatedCharacter);
    },
    unequipItem: (slot: string) => {
      const { character, bankTabs } = get();
      if (!character) return;
      const equipment = { ...character.equipment };
      const equipped = equipment[slot];
      if (!equipped) return;

      // Update bank tabs - add the equipped item back to the main tab
      const updatedBankTabs = bankTabs.map(tab => {
        const newItems = [...tab.items];
        
        if (tab.id === 'main') {
          const existingItemIndex = newItems.findIndex(i => i.id === equipped.id);
          if (existingItemIndex !== -1) {
            newItems[existingItemIndex].quantity += (equipped.quantity || 1);
          } else {
            newItems.push({ 
              id: equipped.id, 
              name: equipped.name, 
              quantity: equipped.quantity || 1 
            });
          }
        }
        
        return { ...tab, items: newItems };
      });

      equipment[slot] = undefined;
      const updatedCharacter = { 
        ...character, 
        equipment, 
        bank: updatedBankTabs.find(tab => tab.id === 'main')?.items || [], // Keep the old bank for backward compatibility
        bankTabs: updatedBankTabs 
      };
      get().setCharacter(updatedCharacter);
      get().saveCharacter(updatedCharacter);
    },
    useConsumable: (itemId: string, quantity: number = 1) => {
      set((state) => {
        if (!state.character) return {};
        const item = getItemById(itemId);
        if (!item || item.type !== 'consumable') return {};
        
        // Find the item in any tab
        let itemFound = false;
        let itemTabId = '';
        let itemTabIndex = -1;
        let itemIndex = -1;
        let itemQuantity = 0;
        
        for (let tabIndex = 0; tabIndex < state.bankTabs.length; tabIndex++) {
          const tab = state.bankTabs[tabIndex];
          const foundItemIndex = tab.items.findIndex(i => i.id === itemId);
          if (foundItemIndex !== -1) {
            itemFound = true;
            itemTabId = tab.id;
            itemTabIndex = tabIndex;
            itemIndex = foundItemIndex;
            itemQuantity = tab.items[foundItemIndex].quantity;
            break;
          }
        }

        if (!itemFound || itemQuantity < quantity) return {};
        
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
        
        // Update bank tabs - remove the consumed items
        const updatedBankTabs = state.bankTabs.map(tab => {
          const newItems = [...tab.items];
          
          if (tab.id === itemTabId) {
            if (itemQuantity === quantity) {
              newItems.splice(itemIndex, 1);
            } else {
              newItems[itemIndex].quantity -= quantity;
            }
          }
          
          return { ...tab, items: newItems };
        });
        
        // Only update if something happened
        if (!healed && !boosted) return {};
        
        const updatedCharacter = {
          ...state.character,
          hitpoints: newHitpoints,
          activeEffects: newActiveEffects,
          bank: updatedBankTabs.find(tab => tab.id === 'main')?.items || [], // Keep the old bank for backward compatibility
          bankTabs: updatedBankTabs
        };
        
        // Save the character after using consumable
        get().saveCharacter(updatedCharacter);
        
        return {
          character: updatedCharacter,
          bankTabs: updatedBankTabs
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

    // Friends system
    sendFriendRequest: async (characterName: string) => {
      const { character } = get();
      if (!character) throw new Error('No character selected');

      try {
        const response = await fetch(createApiUrl('/api/friends/request'), {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            characterName: characterName.trim()
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to send friend request');
        }

        // Just log success - no character data update needed for friend requests
        const result = await response.json();
        console.log('Friend request sent:', result.message);
      } catch (error) {
        console.error('Failed to send friend request:', error);
        throw error;
      }
    },

    acceptFriendRequest: async (requestId: string) => {
      const { character } = get();
      if (!character) throw new Error('No character selected');

      try {
        const response = await fetch(createApiUrl(`/api/friends/accept/${requestId}`), {
          method: 'POST',
          credentials: 'include'
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to accept friend request');
        }

        // Just log success - friends list will be updated when refreshed
        const result = await response.json();
        console.log('Friend request accepted:', result.message);
      } catch (error) {
        console.error('Failed to accept friend request:', error);
        throw error;
      }
    },

    declineFriendRequest: async (requestId: string) => {
      const { character } = get();
      if (!character) throw new Error('No character selected');

      try {
        const response = await fetch(createApiUrl(`/api/friends/decline/${requestId}`), {
          method: 'POST',
          credentials: 'include'
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to decline friend request');
        }

        // Just log success - friend requests will be updated when refreshed
        const result = await response.json();
        console.log('Friend request declined:', result.message);
      } catch (error) {
        console.error('Failed to decline friend request:', error);
        throw error;
      }
    },

    removeFriend: async (friendId: string) => {
      const { character } = get();
      if (!character) throw new Error('No character selected');

      try {
        const response = await fetch(createApiUrl(`/api/friends/remove/${friendId}`), {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to remove friend');
        }

        // Just log success - friends list will be updated when refreshed
        const result = await response.json();
        console.log('Friend removed:', result.message);
      } catch (error) {
        console.error('Failed to remove friend:', error);
        throw error;
      }
    },

    sendMessage: async (friendId: string, content: string) => {
      const { character } = get();
      if (!character) throw new Error('No character selected');

      try {
        const response = await fetch(createApiUrl('/api/friends/message'), {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            friendId: friendId,
            message: content.trim()
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to send message');
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        throw error;
      }
    },

    markMessageAsRead: (messageId: string) => {
      set((state) => {
        if (state.character && state.character.messages) {
          const message = state.character.messages.find(msg => msg.id === messageId);
          if (message) {
            message.read = true;
          }
        }
        return state;
      });
    },

    getFriendRequests: async () => {
      const { character } = get();
      if (!character) return [];

      try {
        const response = await fetch(createApiUrl('/api/friends/requests'), {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to get friend requests');
        }

        return await response.json();
      } catch (error) {
        console.error('Failed to get friend requests:', error);
        return [];
      }
    },

    getMessages: async (friendId: string) => {
      const { character } = get();
      if (!character) return [];

      try {
        const response = await fetch(createApiUrl(`/api/friends/messages/${friendId}`), {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to get messages');
        }

        return await response.json();
      } catch (error) {
        console.error('Failed to get messages:', error);
        return [];
      }
    },

    // Quest system
    startQuest: (questId: string) => {
      set((state) => {
        if (!state.character) return state;
        
        // Get quest from quest data
        const quest = getAllQuests().find(q => q.id === questId);
        if (!quest) return state;
        
        // Clone and start the quest
        const startedQuest = {
          ...quest,
          isActive: true,
          startedAt: new Date()
        };
        
        // Initialize quest progress
        const questProgress = {
          questId,
          requirements: {} as Record<string, number>,
          isCompleted: false
        };
        
        // Initialize each requirement's progress
        quest.requirements.forEach(req => {
          questProgress.requirements[req.id] = 0;
        });
        
        return {
          ...state,
          character: {
            ...state.character,
            activeQuests: [...state.character.activeQuests, startedQuest],
            questProgress: {
              ...state.character.questProgress,
              [questId]: questProgress
            }
          }
        };
      });
    },

    completeQuest: (questId: string) => {
      set((state) => {
        if (!state.character) return state;
        
        const questIndex = state.character.activeQuests.findIndex(q => q.id === questId);
        if (questIndex === -1) return state;
        
        const quest = state.character.activeQuests[questIndex];
        const completedQuest = {
          ...quest,
          isActive: false,
          isCompleted: true,
          completedAt: new Date()
        };
        
        // Award rewards
        quest.rewards.forEach(reward => {
          if (reward.type === 'gold') {
            // Add gold to bank
            const existingGold = state.character!.bank.find(item => item.id === 'coins');
            if (existingGold) {
              existingGold.quantity += reward.quantity;
            } else {
              state.character!.bank.push({
                id: 'coins',
                name: 'Coins',
                quantity: reward.quantity
              });
            }
          } else if (reward.type === 'item' && reward.itemId) {
            // Add item to bank
            const existingItem = state.character!.bank.find(item => item.id === reward.itemId);
            if (existingItem) {
              existingItem.quantity += reward.quantity;
            } else {
              state.character!.bank.push({
                id: reward.itemId,
                name: reward.itemName || reward.itemId,
                quantity: reward.quantity
              });
            }
          } else if (reward.type === 'experience' && reward.skillName) {
            // Add experience
            get().gainExperience(reward.skillName, reward.quantity);
          }
        });
        
        // Remove from active quests and update progress
        const newActiveQuests = [...state.character.activeQuests];
        newActiveQuests.splice(questIndex, 1);
        
        return {
          ...state,
          character: {
            ...state.character,
            activeQuests: newActiveQuests,
            questProgress: {
              ...state.character.questProgress,
              [questId]: {
                ...state.character.questProgress[questId],
                isCompleted: true,
                completedAt: new Date()
              }
            }
          }
        };
      });
    },

    updateQuestProgress: (questId: string, requirementId: string, progress: number) => {
      set((state) => {
        if (!state.character) return state;
        
        const questProgress = state.character.questProgress[questId];
        if (!questProgress) return state;
        
        const updatedProgress = {
          ...questProgress,
          requirements: {
            ...questProgress.requirements,
            [requirementId]: Math.max(questProgress.requirements[requirementId] || 0, progress)
          }
        };
        
        // Check if quest is complete
        const quest = state.character.activeQuests.find(q => q.id === questId);
        if (quest && get().checkQuestRequirements(questId)) {
          // Quest is complete, trigger completion immediately
          get().completeQuest(questId);
        }
        
        return {
          ...state,
          character: {
            ...state.character,
            questProgress: {
              ...state.character.questProgress,
              [questId]: updatedProgress
            }
          }
        };
      });
    },

    checkQuestRequirements: (questId: string) => {
      const state = get();
      if (!state.character) return false;
      
      const quest = state.character.activeQuests.find(q => q.id === questId);
      const questProgress = state.character.questProgress[questId];
      
      if (!quest || !questProgress) return false;
      
      return quest.requirements.every(req => {
        const currentProgress = questProgress.requirements[req.id] || 0;
        
        if (req.type === 'item') {
          // Check if player has required items in bank
          const bankItem = state.character!.bank.find(item => item.id === req.itemId);
          return bankItem && bankItem.quantity >= req.quantity;
        } else if (req.type === 'kill') {
          // Check kill progress
          return currentProgress >= req.quantity;
        } else if (req.type === 'skill_level') {
          // Check skill level
          const skill = state.character!.skills[req.skillName!];
          return skill && getLevelFromExperience(skill.experience) >= req.quantity;
        }
        
        return false;
      });
    },

    // Farming system
    initializeFarmingPatches: () => {
      const state = get();
      
      // Don't initialize if character already has patches
      if (state.character && state.character.farmingPatches && state.character.farmingPatches.length > 0) {
        set({ farmingPatches: state.character.farmingPatches });
        return;
      }
      
      const patches: import('../types/game').FarmingPatch[] = [];
      
      // Create 10 allotment patches with random level requirements
      const allotmentLevels = [1, 3, 7, 12, 18, 25, 33, 42, 52, 63];
      for (let i = 1; i <= 10; i++) {
        patches.push({
          id: `allotment_${i}`,
          type: 'allotment',
          status: 'empty',
          levelRequired: allotmentLevels[i - 1]
        });
      }
      
      // Create 6 herb patches with random level requirements starting at 5
      const herbLevels = [5, 9, 16, 24, 35, 48];
      for (let i = 1; i <= 6; i++) {
        patches.push({
          id: `herbs_${i}`,
          type: 'herbs',
          status: 'empty',
          levelRequired: herbLevels[i - 1]
        });
      }
      
      // Create 4 tree patches with specific level requirements
      const treeLevels = [15, 30, 45, 60];
      for (let i = 1; i <= 4; i++) {
        patches.push({
          id: `trees_${i}`,
          type: 'trees',
          status: 'empty',
          levelRequired: treeLevels[i - 1]
        });
      }
      
      set({ farmingPatches: patches });
      
      // Save patches to character data
      if (state.character) {
        const updatedCharacter = { ...state.character, farmingPatches: patches };
        get().setCharacter(updatedCharacter);
        get().saveCharacter(updatedCharacter);
      }
    },

    plantCrop: (patchId: string, cropId: string): boolean => {
      const state = get();
      if (!state.character) return false;
      
      const farmingCrop = getCropById(cropId);
      if (!farmingCrop) return false;
      
      // Check if player has required farming level
      const farmingLevel = calculateLevel(state.character.skills.farming.experience);
      if (farmingLevel < farmingCrop.levelRequired) return false;
      
      // Check if player has required seeds
      const bankItem = state.character.bank.find(item => item.id === farmingCrop.seedRequirement.itemId);
      if (!bankItem || bankItem.quantity < farmingCrop.seedRequirement.quantity) return false;
      
      // Find the patch
      const patchIndex = state.farmingPatches.findIndex(p => p.id === patchId);
      if (patchIndex === -1) return false;
      
      const patch = state.farmingPatches[patchIndex];
      if (patch.status !== 'empty') return false;
      
      // Remove seeds from bank
      const newBank = [...state.character.bank];
      const seedIndex = newBank.findIndex(item => item.id === farmingCrop.seedRequirement.itemId);
      newBank[seedIndex].quantity -= farmingCrop.seedRequirement.quantity;
      if (newBank[seedIndex].quantity <= 0) {
        newBank.splice(seedIndex, 1);
      }
      
      // Update patch
      const currentTime = Date.now();
      const readyAtTime = currentTime + (farmingCrop.harvestTime * 60 * 1000); // Convert minutes to milliseconds
      
      const newPatches = [...state.farmingPatches];
      newPatches[patchIndex] = {
        ...patch,
        status: 'growing',
        plantedCrop: {
          cropId: farmingCrop.id,
          cropName: farmingCrop.name,
          plantedAt: currentTime,
          harvestTime: farmingCrop.harvestTime,
          readyAt: readyAtTime,
          experience: farmingCrop.experience,
          itemReward: farmingCrop.itemReward
        }
      };
      
      // Update character with new bank and farming patches
      const updatedCharacter = { 
        ...state.character, 
        bank: newBank,
        farmingPatches: newPatches 
      };
      get().setCharacter(updatedCharacter);
      set({ farmingPatches: newPatches });
      
      // Track farming stats
      if (updatedCharacter.stats) {
        // Track patch planted
        if (!updatedCharacter.stats.farmingPatchesPlanted[patchId]) {
          updatedCharacter.stats.farmingPatchesPlanted[patchId] = 0;
        }
        updatedCharacter.stats.farmingPatchesPlanted[patchId]++;
        
        // Track crop planted
        if (!updatedCharacter.stats.farmingCropsPlanted[cropId]) {
          updatedCharacter.stats.farmingCropsPlanted[cropId] = 0;
        }
        updatedCharacter.stats.farmingCropsPlanted[cropId]++;
      }
      
      // Save character data with updated farming patches
      get().saveCharacter(updatedCharacter);
      
      return true;
    },

    harvestPatch: (patchId: string) => {
      const state = get();
      if (!state.character) return;
      
      const patchIndex = state.farmingPatches.findIndex(p => p.id === patchId);
      if (patchIndex === -1) return;
      
      const patch = state.farmingPatches[patchIndex];
      if (patch.status !== 'ready' || !patch.plantedCrop) return;
      
      // Add experience
      state.gainExperience('farming', patch.plantedCrop.experience);
      
      // Add item to bank
      const item = getItemById(patch.plantedCrop.itemReward.id);
      if (item) {
        state.addItemToBank(item, patch.plantedCrop.itemReward.quantity || 1);
      }
      
      // Update patch to empty
      const newPatches = [...state.farmingPatches];
      newPatches[patchIndex] = {
        ...patch,
        status: 'empty',
        plantedCrop: undefined
      };
      
      // Update character with new farming patches
      const updatedCharacter = { 
        ...state.character, 
        farmingPatches: newPatches 
      };
      get().setCharacter(updatedCharacter);
      set({ farmingPatches: newPatches });
      
      // Track farming stats
      get().incrementStat('cropsHarvested', 1);
      
      // Track specific crop harvested
      if (updatedCharacter.stats && patch.plantedCrop) {
        const cropId = patch.plantedCrop.cropId;
        if (!updatedCharacter.stats.farmingHarvests[cropId]) {
          updatedCharacter.stats.farmingHarvests[cropId] = 0;
        }
        updatedCharacter.stats.farmingHarvests[cropId]++;
      }
      
      // Save character data with updated farming patches
      get().saveCharacter(updatedCharacter);
    },

    updatePatchStatuses: () => {
      const state = get();
      if (!state.character) return;
      
      const currentTime = Date.now();
      let hasChanges = false;
      
      const updatedPatches = state.farmingPatches.map(patch => {
        if (patch.status === 'growing' && patch.plantedCrop) {
          // Use readyAt timestamp if available, otherwise calculate from plantedAt
          const readyTime = patch.plantedCrop.readyAt || 
            (patch.plantedCrop.plantedAt + (patch.plantedCrop.harvestTime * 60 * 1000));
          
          if (currentTime >= readyTime) {
            hasChanges = true;
            return { ...patch, status: 'ready' as const };
          }
        }
        return patch;
      });
      
      if (hasChanges) {
        // Update character with new farming patches
        const updatedCharacter = { 
          ...state.character, 
          farmingPatches: updatedPatches 
        };
        get().setCharacter(updatedCharacter);
        set({ farmingPatches: updatedPatches });
        
        // Save character data with updated farming patches
        get().saveCharacter(updatedCharacter);
      }
    },

    register: async (username: string, password: string) => {
      try {
        set({ isLoading: true });
        
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
        
        set({ isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error; // Re-throw to let the component handle the error
      }
    },
    login: async (username: string, password: string) => {
      try {
        set({ isLoading: true });
        
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
        set({ isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error; // Re-throw to let the component handle the error
      }
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

    // Achievement system
    checkAchievements: () => {
      const state = get();
      if (!state.character) return;

      const allAchievements = getAllAchievements();
      const newCompletedAchievements: Achievement[] = [];

      allAchievements.forEach(achievement => {
        // Skip if already completed
        if (state.character?.achievements?.some(a => a.id === achievement.id && a.isCompleted)) return;

        const progress = get().getAchievementProgress(achievement.id);
        const isCompleted = progress >= achievement.requirement.target;

        if (isCompleted) {
          newCompletedAchievements.push({
            ...achievement,
            isCompleted: true,
            completedAt: new Date()
          });
        }
      });

      // Update character with new achievements
      if (newCompletedAchievements.length > 0) {
        set((state) => {
          if (!state.character) return state;
          
          const updatedAchievements = [...(state.character.achievements || [])];
          newCompletedAchievements.forEach(newAchievement => {
            const existingIndex = updatedAchievements.findIndex(a => a.id === newAchievement.id);
            if (existingIndex >= 0) {
              updatedAchievements[existingIndex] = newAchievement;
            } else {
              updatedAchievements.push(newAchievement);
            }
          });

          const updatedCharacter = {
            ...state.character,
            achievements: updatedAchievements
          };

          // Achievements completed - no rewards given

          get().saveCharacter(updatedCharacter);
          return { character: updatedCharacter };
        });
      }
    },

    completeAchievement: (achievementId: string) => {
      set((state) => {
        if (!state.character) return state;

        const achievement = getAllAchievements().find(a => a.id === achievementId);
        if (!achievement) return state;

        const updatedAchievements = [...(state.character.achievements || [])];
        const existingIndex = updatedAchievements.findIndex(a => a.id === achievementId);
        
        const completedAchievement = {
          ...achievement,
          isCompleted: true,
          completedAt: new Date()
        };

        if (existingIndex >= 0) {
          updatedAchievements[existingIndex] = completedAchievement;
        } else {
          updatedAchievements.push(completedAchievement);
        }

        const updatedCharacter = {
          ...state.character,
          achievements: updatedAchievements
        };

        get().saveCharacter(updatedCharacter);
        return { character: updatedCharacter };
      });
    },

    getAchievementProgress: (achievementId: string) => {
      const state = get();
      if (!state.character) return 0;

      const achievement = getAllAchievements().find(a => a.id === achievementId);
      if (!achievement) return 0;

      if (achievement.requirement.type === 'action_count') {
        // Sum all actions performed from the actionsPerformed object
        const actionsPerformed = state.character.stats?.actionsPerformed || {};
        return Object.values(actionsPerformed).reduce((total, count) => total + count, 0);
      } else if (achievement.requirement.type === 'gold_total') {
        const mainTab = state.character.bankTabs?.find(tab => tab.id === 'main');
        const coinsItem = mainTab?.items.find(item => item.id === 'coins');
        return coinsItem?.quantity || 0;
      } else if (achievement.requirement.type === 'skill_level' && achievement.requirement.skillName) {
        return getLevelFromExperience(state.character.skills[achievement.requirement.skillName].experience);
      }

      return 0;
    },

    // Auto-eating system
    upgradeAutoEating: (tier: number) => {
      const state = get();
      if (!state.character) return false;

      // Check if this is the next valid tier to purchase
      const currentTier = state.character.autoEating.tier;
      if (tier !== currentTier + 1) {
        console.warn(`Cannot upgrade to tier ${tier}. Current tier is ${currentTier}`);
        return false;
      }

      // Check if player has enough gold for the upgrade
      const prices = { 1: 1000000, 2: 5000000, 3: 10000000 };
      const cost = prices[tier as keyof typeof prices];
      
      const mainTab = state.character.bankTabs?.find(tab => tab.id === 'main');
      const coinsItem = mainTab?.items.find(item => item.id === 'coins');
      const currentGold = coinsItem?.quantity || 0;
      
      if (currentGold < cost) {
        console.warn(`Not enough gold. Need ${cost}, have ${currentGold}`);
        return false;
      }

      // Remove gold from bank
      get().removeItemFromBank('coins', cost);

      // Upgrade auto-eating tier (permanent unlock)
      const updatedCharacter = {
        ...state.character,
        autoEating: {
          ...state.character.autoEating,
          tier: tier
        }
      };

      get().setCharacter(updatedCharacter);
      get().saveCharacter(updatedCharacter);
      return true;
    },

    setAutoEatingFood: (foodId: string | null) => {
      const state = get();
      if (!state.character) return;

      const updatedCharacter = {
        ...state.character,
        autoEating: {
          ...state.character.autoEating,
          selectedFood: foodId
        }
      };

      get().setCharacter(updatedCharacter);
      get().saveCharacter(updatedCharacter);
    },

    toggleAutoEating: () => {
      const state = get();
      if (!state.character) return;

      const updatedCharacter = {
        ...state.character,
        autoEating: {
          ...state.character.autoEating,
          enabled: !state.character.autoEating.enabled
        }
      };

      get().setCharacter(updatedCharacter);
      get().saveCharacter(updatedCharacter);
    },

    checkAutoEating: () => {
      const state = get();
      if (!state.character) return;

      const { autoEating, hitpoints, maxHitpoints } = state.character;
      
      if (!autoEating.enabled || autoEating.tier === 0 || !autoEating.selectedFood) {
        return;
      }

      const healthPercent = (hitpoints / maxHitpoints) * 100;
      
      // Define thresholds based on tier
      const thresholds = {
        1: { triggerAt: 25, eatTo: 50 },
        2: { triggerAt: 30, eatTo: 55 },
        3: { triggerAt: 40, eatTo: 70 }
      };

      const threshold = thresholds[autoEating.tier as keyof typeof thresholds];
      if (!threshold) return;

      if (healthPercent <= threshold.triggerAt) {
        // Check if player has the selected food
        const mainTab = state.character.bankTabs?.find(tab => tab.id === 'main');
        const foodItem = mainTab?.items.find(item => item.id === autoEating.selectedFood);
        
        if (!foodItem || foodItem.quantity < 1) {
          // No food available, disable auto-eating
          get().toggleAutoEating();
          return;
        }

        // Get the actual healing value of the selected food
        const foodItemData = ITEMS[autoEating.selectedFood];
        const healingPerFood = foodItemData?.healing || 20; // Default to 20 if not found
        
        // Calculate how much food we need to reach target health percentage
        const targetHitpoints = Math.floor((threshold.eatTo / 100) * maxHitpoints);
        const healingNeeded = targetHitpoints - hitpoints;
        const foodToEat = Math.ceil(healingNeeded / healingPerFood);
        const actualFoodToEat = Math.min(foodToEat, foodItem.quantity);

        if (actualFoodToEat > 0) {
          // Remove food from bank and heal player
          get().removeItemFromBank(autoEating.selectedFood, actualFoodToEat);
          
          // Heal the player using actual food healing values
          const healAmount = actualFoodToEat * healingPerFood;
          const newHitpoints = Math.min(hitpoints + healAmount, maxHitpoints);
          
          const updatedCharacter = {
            ...state.character,
            hitpoints: newHitpoints
          };
          
          get().setCharacter(updatedCharacter);
        }
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
