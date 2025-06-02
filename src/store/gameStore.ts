import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Character, Item, Location, SkillAction, SkillName, ItemReward, StoreItem, StoreAction } from '../types/game';
import { mockCharacter, mockLocations } from '../data/mockData';
import { getItemById } from '../data/items';

// Helper functions for experience and level calculations
const calculateLevel = (experience: number): number => {
  // Find the highest level where the experience requirement is met
  let level = 1;
  while (experience >= Math.floor(level * level * 83)) {
    level++;
  }
  return level;
};

const getNextLevelExperience = (level: number): number => {
  return level * level * 83;
};

export interface GameState {
  // State
  character: Character | null;
  currentLocation: Location | null;
  activeAction: SkillAction | null;
  lastActionTime: number | null;
  isFooterExpanded: boolean;
  characterState: string;
  currentAction: SkillAction | null;
  actionProgress: number;
  actionInterval: ReturnType<typeof setInterval> | null;
  lastActionReward: {
    xp: number;
    item: ItemReward | null;
    levelUp?: {
      skill: string;
      level: number;
    };
  } | null;
  
  // Actions
  setCharacter: (character: Character | null) => void;
  createCharacter: (name: string) => void;
  setLocation: (location: Location) => void;
  startAction: (action: SkillAction) => void;
  stopAction: () => void;
  completeAction: () => void;
  addItemToBank: (item: Item, quantity: number) => void;
  gainExperience: (skill: SkillName, amount: number) => { skill: string; level: number } | null;
  toggleFooter: () => void;
  processOfflineProgress: () => OfflineRewards | null;
  setCharacterState: (state: string) => void;
  saveCharacter: () => void;
  clearActionReward: () => void;
  signOut: () => void;
  
  // Equipment management
  equipItem: (item: Item) => void;
  unequipItem: (slot: string) => void;
  canEquipItem: (itemId: string, slot: string) => boolean;
  hasRequiredEquipment: (itemId: string) => boolean;
  canPerformAction: (action: SkillAction) => boolean;
  
  // Store actions
  buyItem: (itemId: string, quantity: number) => void;
  sellItem: (itemId: string, quantity: number) => void;
}

interface OfflineRewards {
  xp: number;
  item: {
    id: string;
    name: string;
    quantity: number;
  };
  skill: string;
  timePassed: number;
  actionsCompleted: number;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      character: (() => {
        try {
          // Start with mock character as base
          const baseChar = { ...mockCharacter };
          
          // Ensure equipment is properly set
          if (!baseChar.equipment.bronze_axe) {
            baseChar.equipment.bronze_axe = { id: 'bronze_axe', name: 'Bronze Axe', quantity: 1 };
          }
          if (!baseChar.equipment.small_net) {
            baseChar.equipment.small_net = { id: 'small_net', name: 'Small Fishing Net', quantity: 1 };
          }
          
          // Convert dates to proper Date objects
          baseChar.lastLogin = new Date(baseChar.lastLogin);
          
          console.log('Initializing character data:', JSON.stringify(baseChar, null, 2));
          return baseChar;
        } catch (error) {
          console.error('Error initializing character:', error);
          return null;
        }
      })(),
      currentLocation: mockLocations[0],
      activeAction: null,
      lastActionTime: null,
      isFooterExpanded: false,
      characterState: 'idle',
      currentAction: null,
      actionProgress: 0,
      actionInterval: null,
      lastActionReward: null,

      setCharacter: (character: Character | null) => {
        try {
          if (!character) {
            set({ character: null });
            return;
          }

          // Ensure dates are proper Date objects
          const updatedCharacter: Character = {
            ...character,
            lastLogin: new Date(character.lastLogin),
            equipment: character.equipment || {},
            bank: character.bank || [],
          };

          set({ character: updatedCharacter });
          localStorage.setItem(`character_${updatedCharacter.id}`, JSON.stringify(updatedCharacter));
        } catch (error) {
          console.error('Error in setCharacter:', error);
          throw error;
        }
      },
      
      createCharacter: (name: string) => {
        const newCharacter: Character = {
          id: crypto.randomUUID(),
          name,
          lastLogin: new Date(),
          lastAction: {
            type: 'none',
            location: 'forest'
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
            none: { name: 'None', level: 1, experience: 0, nextLevelExperience: 83 },
          },
          combatLevel: 3,
          hitpoints: 10,
          maxHitpoints: 10,
          prayer: 1,
          maxPrayer: 1,
          equipment: {
            bronze_axe: { id: 'bronze_axe', name: 'Bronze Axe', quantity: 1 },
            small_net: { id: 'small_net', name: 'Small Fishing Net', quantity: 1 },
            bronze_pickaxe: { id: 'bronze_pickaxe', name: 'Bronze Pickaxe', quantity: 1 }
          },
          bank: [],
        };

        // Save to localStorage first
        localStorage.setItem(`character_${newCharacter.id}`, JSON.stringify(newCharacter));

        // Update state
        set((state) => ({
          ...state,
          character: newCharacter,
          characterState: 'idle',
          currentLocation: mockLocations[0], // Set initial location to Forest
          currentAction: null,
          actionProgress: 0,
          lastActionTime: Date.now(),
        }));
      },

      setLocation: (location) => set({ currentLocation: location }),
      
      startAction: (action: SkillAction) => {
        const state = get();
        if (!state.character) return;

        console.log('Starting action:', action.name);
        
        // Check requirements
        if (!get().canPerformAction(action)) {
          console.log('Cannot perform action - requirements not met');
          return;
        }

        // Clear any existing interval
        if (state.actionInterval) {
          clearInterval(state.actionInterval);
        }

        console.log('Setting initial state for action');
        set({
          currentAction: action,
          actionProgress: 0,
          characterState: 'busy',
          lastActionReward: null // Clear any existing rewards
        });

        // Start progress interval
        const interval = setInterval(() => {
          const state = get();
          if (!state.currentAction) {
            clearInterval(interval);
            return;
          }

          set((state) => {
            if (!state.currentAction) return state;

            const newProgress = state.actionProgress + (100 * 100 / state.currentAction.baseTime); // 100ms updates
            
            if (newProgress >= 100) {
              console.log('Action completed at 100%:', state.currentAction.name);
              
              // Complete action
              const updatedCharacter = { ...state.character! };
              const currentAction = state.currentAction;

              // Remove required items from bank for any action that has item requirements
              if (currentAction.requirements) {
                const itemRequirements = currentAction.requirements.filter(req => req.type === 'item');
                
                // Remove required items from bank
                itemRequirements.forEach(req => {
                  if (!req.itemId || !req.quantity) return;
                  
                  const bankItemIndex = updatedCharacter.bank.findIndex(item => item.id === req.itemId);
                  if (bankItemIndex === -1) {
                    console.log(`Required item ${req.itemId} not found in bank`);
                    return;
                  }
                  
                  const bankItem = updatedCharacter.bank[bankItemIndex];
                  bankItem.quantity -= req.quantity;
                  
                  // Remove item from bank if quantity is 0
                  if (bankItem.quantity <= 0) {
                    updatedCharacter.bank.splice(bankItemIndex, 1);
                  }
                });
              }
              
              // Gain experience and check for level up
              const levelUp = get().gainExperience(currentAction.skill, currentAction.experience);
              console.log('Level up result:', levelUp);

              // Add reward item to bank
              if (currentAction.itemReward) {
                console.log('Adding reward item to bank:', currentAction.itemReward);
                const existingItemIndex = updatedCharacter.bank.findIndex(
                  item => item.id === currentAction.itemReward.id
                );

                if (existingItemIndex !== -1) {
                  // Update existing item quantity
                  updatedCharacter.bank[existingItemIndex].quantity += currentAction.itemReward.quantity;
                } else {
                  // Add new item
                  updatedCharacter.bank.push({ ...currentAction.itemReward });
                }
              }

              const reward = {
                xp: currentAction.experience,
                item: currentAction.itemReward,
                levelUp: levelUp ? {
                  skill: levelUp.skill,
                  level: levelUp.level,
                } : undefined,
              };
              
              console.log('Setting reward in interval:', reward);
              
              // First update character and clear any existing reward
              set({ 
                character: updatedCharacter,
                lastActionReward: null 
              });
              
              // Then set the reward in a separate update to ensure state change is detected
              setTimeout(() => {
                console.log('Setting delayed reward:', reward);
                set({ lastActionReward: reward });
              }, 50);
              
              // Finally reset progress
              set({ actionProgress: 0 });

              // Check if we can still perform the action
              if (get().canPerformAction(currentAction)) {
                console.log('Restarting action:', currentAction.name);
                // Action can continue, just reset progress
                return {
                  ...state,
                  actionProgress: 0,
                };
              } else {
                console.log('Cannot continue action - requirements no longer met');
                // Stop the action
                clearInterval(interval);
                return {
                  ...state,
                  currentAction: null,
                  actionProgress: 0,
                  characterState: 'idle',
                  actionInterval: null,
                };
              }
            }
            
            return {
              ...state,
              actionProgress: newProgress,
            };
          });
        }, 100);

        set({ actionInterval: interval });
      },
      
      stopAction: () => {
        console.log('Stopping action');
        const { actionInterval } = get();
        if (actionInterval) {
          clearInterval(actionInterval);
        }
        
        // Save the current progress for potential rewards
        const state = get();
        if (state.currentAction && state.actionProgress > 0) {
          console.log('Calculating partial rewards for stopped action');
          const progressPercent = state.actionProgress / 100;
          
          // Only give rewards if progress was at least 50%
          if (progressPercent >= 0.5) {
            const updatedCharacter = { ...state.character! };
            const currentAction = state.currentAction;
            
            // Calculate partial rewards
            const partialXP = Math.floor(currentAction.experience * progressPercent);
            const partialQuantity = Math.floor(currentAction.itemReward.quantity * progressPercent);
            
            // Update character stats
            const skill = updatedCharacter.skills[currentAction.skill];
            skill.experience += partialXP;
            
            // Level up check
            while (skill.experience >= getNextLevelExperience(skill.level)) {
              skill.level += 1;
              console.log('Level up!', skill.level);
            }
            
            // Add partial items if any
            if (partialQuantity > 0) {
              const existingItemIndex = updatedCharacter.bank.findIndex(
                item => item.id === currentAction.itemReward.id
              );
              
              if (existingItemIndex !== -1) {
                updatedCharacter.bank[existingItemIndex].quantity += partialQuantity;
              } else {
                updatedCharacter.bank.push({
                  ...currentAction.itemReward,
                  quantity: partialQuantity
                });
              }
            }
            
            // Apply rewards silently without showing popup
            set({
              character: updatedCharacter,
              currentAction: null,
              actionProgress: 0,
              lastActionTime: Date.now(),
              actionInterval: null,
              lastActionReward: null, // Don't show popup for partial rewards
            });
          } else {
            // If progress was less than 50%, just reset everything without rewards
            set({
              currentAction: null,
              actionProgress: 0,
              lastActionTime: Date.now(),
              actionInterval: null,
              lastActionReward: null,
            });
          }
        } else {
          // If no action or no progress, just reset everything
          set({
            currentAction: null,
            actionProgress: 0,
            lastActionTime: Date.now(),
            actionInterval: null,
            lastActionReward: null,
          });
        }
      },
      
      completeAction: () => {
        const state = get();
        if (!state.currentAction || !state.character) return;

        // Complete action
        const updatedCharacter = { ...state.character };
        const currentAction = state.currentAction;

        // Remove required items from bank for any action that has item requirements
        if (currentAction.requirements) {
          const itemRequirements = currentAction.requirements.filter(req => req.type === 'item');
          
          // Remove required items from bank
          itemRequirements.forEach(req => {
            if (!req.itemId || !req.quantity) return;
            
            const bankItemIndex = updatedCharacter.bank.findIndex(item => item.id === req.itemId);
            if (bankItemIndex === -1) {
              console.log(`Required item ${req.itemId} not found in bank`);
              return;
            }
            
            const bankItem = updatedCharacter.bank[bankItemIndex];
            bankItem.quantity -= req.quantity;
            
            // Remove item from bank if quantity is 0
            if (bankItem.quantity <= 0) {
              updatedCharacter.bank.splice(bankItemIndex, 1);
            }
          });
        }
        
        // Gain experience and check for level up
        const levelUp = get().gainExperience(currentAction.skill, currentAction.experience);

        // Add or update item in bank
        const existingItemIndex = updatedCharacter.bank.findIndex(
          item => item.id === currentAction.itemReward.id
        );

        if (existingItemIndex !== -1) {
          updatedCharacter.bank[existingItemIndex].quantity += currentAction.itemReward.quantity;
        } else {
          updatedCharacter.bank.push({ ...currentAction.itemReward });
        }

        const reward = {
          xp: currentAction.experience,
          item: currentAction.itemReward,
          levelUp: levelUp ? {
            skill: levelUp.skill,
            level: levelUp.level,
          } : undefined,
        };
        
        // Update character and show reward
        set({
          character: updatedCharacter,
          actionProgress: 0,
          lastActionReward: reward,
        });
      },
      
      addItemToBank: (item: Item, quantity: number) => {
        const { character } = get();
        if (!character) return;

        const itemReward: ItemReward = {
          id: item.id,
          name: item.name,
          quantity,
        };

        set((state) => {
          const updatedCharacter = { ...state.character! };
          const existingItemIndex = updatedCharacter.bank.findIndex(
            bankItem => bankItem.id === item.id
          );

          if (existingItemIndex !== -1) {
            // Update existing item quantity
            updatedCharacter.bank[existingItemIndex].quantity += quantity;
          } else {
            // Add new item
            updatedCharacter.bank.push(itemReward);
          }

          return { character: updatedCharacter };
        });
      },
      
      gainExperience: (skill: SkillName, amount: number) => {
        const { character } = get();
        if (!character) return null;

        const updatedCharacter = { ...character };
        const skillData = updatedCharacter.skills[skill];
        
        // Add experience
        skillData.experience += amount;
        
        // Calculate new level
        const newLevel = calculateLevel(skillData.experience);
        const leveledUp = newLevel > skillData.level;
        
        if (leveledUp) {
          skillData.level = newLevel;
          skillData.nextLevelExperience = getNextLevelExperience(newLevel);
          
          // Update character in store
          set({ character: updatedCharacter });
          
          // Return level up info
          return { skill, level: newLevel };
        }
        
        // Update character in store
        set({ character: updatedCharacter });
        
        // Return null if no level up occurred
        return null;
      },
      
      toggleFooter: () => set((state) => ({
        isFooterExpanded: !state.isFooterExpanded,
      })),
      
      processOfflineProgress: () => {
        const { character, lastActionTime, currentLocation } = get();
        if (!character || !lastActionTime) return null;

        const now = Date.now();
        const timeDiff = now - lastActionTime;
        
        // Only process if more than 1 minute has passed
        if (timeDiff < 60000) {
          console.log('Less than 1 minute passed, skipping offline progress');
          set({ lastActionTime: now });
          return null;
        }

        console.log('Processing offline progress:', timeDiff / 1000, 'seconds');

        // Find the last action the player was doing
        const lastActionType = character.lastAction;
        if (!lastActionType || !currentLocation) {
          console.log('No last action or location found');
          set({ lastActionTime: now });
          return null;
        }

        // Find the specific action in the location
        const action = currentLocation.actions.find(a => a.id === lastActionType.target);
        if (!action) {
          console.log('Last action not found in current location');
          set({ lastActionTime: now });
          return null;
        }

        // Calculate number of actions completed
        const actionTime = action.baseTime * 1000; // Convert to milliseconds
        const actionsCompleted = Math.floor(timeDiff / actionTime);

        if (actionsCompleted === 0) {
          console.log('No actions completed while offline');
          set({ lastActionTime: now });
          return null;
        }

        // Calculate rewards
        const xpPerAction = action.experience;
        const totalXp = xpPerAction * actionsCompleted;

        // Get item rewards
        const itemReward = action.itemReward;
        const totalItems = actionsCompleted * itemReward.quantity;

        // Create rewards object
        const rewards = {
          xp: totalXp,
          skill: action.skill,
          item: {
            id: itemReward.id,
            name: itemReward.name,
            quantity: totalItems,
          },
          timePassed: timeDiff,
          actionsCompleted,
        };

        // Apply rewards
        if (totalXp > 0) {
          get().gainExperience(action.skill, totalXp);
        }

        if (totalItems > 0) {
          get().addItemToBank({
            id: itemReward.id,
            name: itemReward.name,
            type: 'resource',
            category: action.skill,
            icon: `/assets/items/${itemReward.id}.png`,
          }, totalItems);
        }

        // Update last action time
        set({ lastActionTime: now });

        return rewards;
      },

      setCharacterState: (state: string) => set({ characterState: state }),

      saveCharacter: () => {
        const { character } = get();
        if (!character) return;
        localStorage.setItem(`character_${character.id}`, JSON.stringify(character));
      },

      clearActionReward: () => {
        console.log('Clearing action reward');
        set({ lastActionReward: null });
      },

      equipItem: (item: Item) => {
        const { character } = get();
        if (!character || !item.slot) return;

        // Create a copy of the character
        const updatedCharacter = { ...character };

        // Find the item in the bank
        const bankItemIndex = character.bank.findIndex(i => i.id === item.id);

        // If there's already an item in the slot, move it to the bank
        const currentEquipped = updatedCharacter.equipment[item.slot];
        if (currentEquipped) {
          const existingItemIndex = updatedCharacter.bank.findIndex(
            i => i.id === currentEquipped.id
          );

          if (existingItemIndex !== -1) {
            // Item already exists in bank, increase quantity
            updatedCharacter.bank[existingItemIndex].quantity += 1;
          } else {
            // Add item to bank
            updatedCharacter.bank.push({
              id: currentEquipped.id,
              name: currentEquipped.name,
              quantity: 1,
            });
          }
        }

        // If the item is in the bank, remove it from there
        if (bankItemIndex !== -1) {
          const itemToEquip = updatedCharacter.bank[bankItemIndex];
          // Remove the item from the bank
          if (itemToEquip.quantity > 1) {
            updatedCharacter.bank[bankItemIndex].quantity -= 1;
          } else {
            updatedCharacter.bank.splice(bankItemIndex, 1);
          }
        }

        // Equip the item
        updatedCharacter.equipment[item.slot] = {
          id: item.id,
          name: item.name,
          quantity: 1,
        };

        // Update state
        set({ character: updatedCharacter });

        // Save to localStorage
        localStorage.setItem(`character_${updatedCharacter.id}`, JSON.stringify(updatedCharacter));
      },

      unequipItem: (slot: string) => {
        const { character } = get();
        if (!character) return;

        // Create a copy of the character
        const updatedCharacter = { ...character };

        // Find the item in the equipment slot
        const equippedItem = Object.entries(updatedCharacter.equipment).find(([_, item]) => {
          const itemData = getItemById(item.id);
          return itemData?.slot === slot;
        });

        if (!equippedItem) return;

        // Remove the item from equipment
        delete updatedCharacter.equipment[equippedItem[0]];

        // Add the item to bank
        const existingItemIndex = updatedCharacter.bank.findIndex(
          item => item.id === equippedItem[1].id
        );

        if (existingItemIndex !== -1) {
          // Item already exists in bank, increase quantity
          updatedCharacter.bank[existingItemIndex].quantity += 1;
        } else {
          // Add item to bank
          updatedCharacter.bank.push({
            id: equippedItem[1].id,
            name: equippedItem[1].name,
            quantity: 1,
          });
        }

        // Update state
        set({ character: updatedCharacter });

        // Save to localStorage
        localStorage.setItem(`character_${updatedCharacter.id}`, JSON.stringify(updatedCharacter));
      },

      canEquipItem: (itemId: string, slot: string) => {
        const { character } = get();
        if (!character) return false;

        // For now, just check if the item exists in the bank
        // Later we can add level requirements, item type checks, etc.
        return character.bank.some(item => item.id === itemId);
      },

      // Helper function to check if player has required equipment
      hasRequiredEquipment: (itemId: string): boolean => {
        const { character } = get();
        if (!character) {
          console.log('Cannot check equipment - no character');
          return false;
        }

        console.log('Checking equipment for:', itemId);
        console.log('Character equipment:', JSON.stringify(character.equipment, null, 2));

        // Check if the item is equipped
        const hasExactItem = Object.values(character.equipment).some(item => item?.id === itemId);
        if (hasExactItem) {
          console.log(`Found exact equipment match: ${itemId}`);
          return true;
        }

        // Tool tiers (higher number = better tier)
        const toolTiers: { [key: string]: number } = {
          // Axes
          'bronze_axe': 1,
          'iron_axe': 2,
          'steel_axe': 3,
          'mithril_axe': 4,
          'adamant_axe': 5,
          'rune_axe': 6,
          'dragon_axe': 7,

          // Fishing equipment
          'small_net': 1,
          'fly_fishing_rod': 2,
          'fishing_rod': 3,
          'harpoon': 4,
          'dragon_harpoon': 5,

          // Mining equipment
          'bronze_pickaxe': 1,
          'iron_pickaxe': 2,
          'steel_pickaxe': 3,
          'mithril_pickaxe': 4,
          'adamant_pickaxe': 5,
          'rune_pickaxe': 6,
          'dragon_pickaxe': 7,
        };

        // Get the required tool's tier
        const requiredTier = toolTiers[itemId] || 0;
        console.log(`Required tool tier for ${itemId}: ${requiredTier}`);

        // Get the tool type (axe, fishing, or mining)
        const isAxe = itemId.includes('axe') && !itemId.includes('pickaxe');
        const isFishing = itemId.includes('net') || itemId.includes('fishing') || itemId.includes('harpoon');
        const isMining = itemId.includes('pickaxe');

        // Check if player has any equipment of equal or higher tier
        const hasHigherTier = Object.values(character.equipment).some(equippedItem => {
          if (!equippedItem) return false;

          // Check if it's the same tool type
          const isEquippedAxe = equippedItem.id.includes('axe') && !equippedItem.id.includes('pickaxe');
          const isEquippedFishing = equippedItem.id.includes('net') || equippedItem.id.includes('fishing') || equippedItem.id.includes('harpoon');
          const isEquippedMining = equippedItem.id.includes('pickaxe');
          
          const isSameType = 
            (isAxe && isEquippedAxe) || 
            (isFishing && isEquippedFishing) ||
            (isMining && isEquippedMining);

          if (!isSameType) return false;

          const equippedTier = toolTiers[equippedItem.id] || 0;
          console.log(`Checking equipped item ${equippedItem.id}:`, {
            tier: equippedTier,
            sameType: isSameType,
            meetsRequirement: equippedTier >= requiredTier
          });

          return equippedTier >= requiredTier;
        });

        console.log(`Has required tier equipment: ${hasHigherTier}`);
        return hasHigherTier;
      },

      canPerformAction: (action: SkillAction): boolean => {
        const { character } = get();
        if (!character) {
          console.log('Cannot perform action - no character');
          return false;
        }

        console.log('Checking requirements for action:', action.name);
        console.log('Action requirements:', action.requirements);
        console.log('Character skills:', JSON.stringify(character.skills, null, 2));

        // If there are no requirements, the action can be performed
        if (!action.requirements || action.requirements.length === 0) {
          return true;
        }

        const meetsRequirements = action.requirements.every(req => {
          switch (req.type) {
            case 'level':
              if (!req.skill) {
                console.log('Invalid requirement - no skill specified');
                return false;
              }
              const hasSkill = req.skill in character.skills;
              if (!hasSkill) {
                console.log(`Missing skill ${req.skill} in character skills`);
                return false;
              }
              const skill = character.skills[req.skill];
              console.log(`Level check for ${req.skill}:`, {
                required: req.level,
                current: skill.level,
                experience: skill.experience,
                nextLevel: skill.nextLevelExperience
              });
              const meetsLevel = skill.level >= (req.level || 0);
              console.log(`Meets level requirement: ${meetsLevel}`);
              return meetsLevel;
            case 'equipment':
              if (!req.itemId) {
                console.log('Invalid requirement - no itemId specified');
                return false;
              }
              const hasEquipment = get().hasRequiredEquipment(req.itemId);
              console.log(`Equipment check for ${req.itemId}: ${hasEquipment}`);
              return hasEquipment;
            case 'item':
              if (!req.itemId || !req.quantity) {
                console.log('Invalid requirement - missing itemId or quantity');
                return false;
              }
              const bankItem = character.bank.find(item => item.id === req.itemId);
              const hasItem = bankItem && bankItem.quantity >= req.quantity;
              console.log(`Item check for ${req.itemId} (need ${req.quantity}):`, {
                found: !!bankItem,
                quantity: bankItem?.quantity || 0,
                hasEnough: hasItem
              });
              return hasItem;
            default:
              console.log('Invalid requirement type:', req.type);
              return false;
          }
        });

        console.log(`All requirements met: ${meetsRequirements}`);
        return meetsRequirements;
      },

      signOut: () => {
        // Stop any ongoing action
        const state = get();
        if (state.actionInterval) {
          clearInterval(state.actionInterval);
        }
        
        // Save character data before signing out
        if (state.character) {
          localStorage.setItem(`character_${state.character.id}`, JSON.stringify({
            ...state.character,
            lastLogin: new Date().toISOString(),
            lastAction: {
              type: state.currentAction?.type || 'none',
              location: state.currentLocation?.name || 'none'
            }
          }));
        }
        
        // Clear the store state
        set({
          character: null,
          currentLocation: null,
          activeAction: null,
          lastActionTime: null,
          currentAction: null,
          actionProgress: 0,
          actionInterval: null,
          lastActionReward: null
        });
      },

      buyItem: (itemId: string, quantity: number) => {
        const state = get();
        if (!state.character) return;

        const updatedCharacter = { ...state.character };
        const coinsInBank = updatedCharacter.bank.find(item => item.id === 'coins')?.quantity || 0;

        // Get the store item to determine price
        const currentAction = state.currentLocation?.actions[0];
        if (currentAction?.type !== 'store') return;
        
        const storeAction = currentAction as StoreAction;
        const storeItem = storeAction.storeItems.find((item: StoreItem) => item.id === itemId);
        if (!storeItem) return;
        
        const totalCost = storeItem.buyPrice * quantity;

        // Check if player has enough coins
        if (coinsInBank < totalCost) {
          console.log('Not enough coins');
          return;
        }

        // Remove coins
        const coinsIndex = updatedCharacter.bank.findIndex(item => item.id === 'coins');
        if (coinsIndex >= 0) {
          updatedCharacter.bank[coinsIndex].quantity -= totalCost;
          if (updatedCharacter.bank[coinsIndex].quantity <= 0) {
            updatedCharacter.bank.splice(coinsIndex, 1);
          }
        }

        // Add items to bank
        const existingItem = updatedCharacter.bank.find(item => item.id === itemId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          const itemData = getItemById(itemId);
          if (!itemData) return;
          updatedCharacter.bank.push({
            id: itemId,
            name: itemData.name,
            quantity: quantity
          });
        }

        set({ character: updatedCharacter });
        localStorage.setItem(`character_${updatedCharacter.id}`, JSON.stringify(updatedCharacter));
      },

      sellItem: (itemId: string, quantity: number) => {
        const state = get();
        if (!state.character) return;

        const updatedCharacter = { ...state.character };
        const itemInBank = updatedCharacter.bank.find(item => item.id === itemId);

        // Check if player has the item
        if (!itemInBank || itemInBank.quantity < quantity) {
          console.log('Not enough items in bank');
          return;
        }

        // Get the store item to determine sell price
        const currentAction = state.currentLocation?.actions[0];
        if (currentAction?.type !== 'store') return;
        
        const storeAction = currentAction as StoreAction;
        const storeItem = storeAction.storeItems.find((item: StoreItem) => item.id === itemId);
        let sellPrice = 0;
        
        if (storeItem) {
          sellPrice = storeItem.sellPrice;
        } else {
          // If not in store, get from items database
          const itemDetails = getItemById(itemId);
          if (itemDetails) {
            sellPrice = itemDetails.sellPrice || 0;
          }
        }
        
        // Calculate total price
        const totalPrice = sellPrice * quantity;
        console.log('Selling items:', { quantity, sellPrice, totalPrice });

        // Remove items from bank
        const itemIndex = updatedCharacter.bank.findIndex(item => item.id === itemId);
        if (itemIndex >= 0) {
          updatedCharacter.bank[itemIndex].quantity -= quantity;
          if (updatedCharacter.bank[itemIndex].quantity <= 0) {
            updatedCharacter.bank.splice(itemIndex, 1);
          }
        }

        // Add coins to bank
        const coinsIndex = updatedCharacter.bank.findIndex(item => item.id === 'coins');
        if (coinsIndex >= 0) {
          updatedCharacter.bank[coinsIndex].quantity += totalPrice;
        } else {
          updatedCharacter.bank.push({
            id: 'coins',
            name: 'Coins',
            quantity: totalPrice
          });
        }

        set({ character: updatedCharacter });
        localStorage.setItem(`character_${updatedCharacter.id}`, JSON.stringify(updatedCharacter));
      },
    }),
    {
      name: 'game-storage',
    }
  )
);
