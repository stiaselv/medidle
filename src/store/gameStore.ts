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

// Create the store with all its state and actions
const createStore = () => create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      character: null,
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

      // Character actions
      setCharacter: (character: Character | null) => set({ character }),
      createCharacter: (name: string) => {
        // Generate a unique id for the character
        const id = `char_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        // Initialize all skills
        const skills = {
          none: createSkill('None'),
          attack: createSkill('Attack'),
          strength: createSkill('Strength'),
          defence: createSkill('Defence'),
          ranged: createSkill('Ranged'),
          prayer: createSkill('Prayer'),
          magic: createSkill('Magic'),
          runecrafting: createSkill('Runecrafting'),
          construction: createSkill('Construction'),
          hitpoints: createSkill('Hitpoints', 10),
          agility: createSkill('Agility'),
          herblore: createSkill('Herblore'),
          thieving: createSkill('Thieving'),
          crafting: createSkill('Crafting'),
          fletching: createSkill('Fletching'),
          slayer: createSkill('Slayer'),
          hunter: createSkill('Hunter'),
          mining: createSkill('Mining'),
          smithing: createSkill('Smithing'),
          fishing: createSkill('Fishing'),
          cooking: createSkill('Cooking'),
          firemaking: createSkill('Firemaking'),
          woodcutting: createSkill('Woodcutting'),
          farming: createSkill('Farming')
        };
        // No default equipment
        const equipment = {};
        // Start bank: bronze axe, bronze pickaxe, small fishing net
        const bank = [
          { id: 'bronze_axe', name: 'Bronze Axe', quantity: 1 },
          { id: 'bronze_pickaxe', name: 'Bronze Pickaxe', quantity: 1 },
          { id: 'small_net', name: 'Small Fishing Net', quantity: 1 }
        ];
        // Create the character object
        const character = {
          id,
          name,
          lastLogin: new Date(),
          lastAction: { type: 'none' as const, location: 'forest' },
          skills,
          bank,
          equipment,
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
        // Save to localStorage for persistence
        try {
          localStorage.setItem(`character_${id}`, JSON.stringify({ ...character, lastLogin: new Date().toISOString() }));
        } catch (e) {
          // Ignore localStorage errors
        }
        // Set in store
        set({ character });
        return character;
      },
      startAction: (action) => {
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
          let progress = Math.min((elapsed / duration) * 100, 100);
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
            // End combat: reset currentAction, optionally show victory UI
            set({
              character: { ...character, hitpoints: newPlayerHp },
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
            return;
          } else if (roundResult.playerDefeated) {
            // Player loses: end combat, optionally show defeat UI
            set({
              character: { ...character, hitpoints: 0 },
              currentAction: null,
              isActionInProgress: false,
              lastCombatRound: {
                playerDamage: roundResult.playerDamage,
                monsterDamage: roundResult.monsterDamage,
                result: 'defeat',
                loot: []
              }
            });
            return;
          }

          // Continue combat: update state
          set({
            character: { ...character, hitpoints: newPlayerHp },
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
          return;
        }

        // Non-combat actions
        if (state.currentAction.type === 'woodcutting' || state.currentAction.type === 'mining' || state.currentAction.type === 'fishing' || state.currentAction.type === 'smithing' || state.currentAction.type === 'cooking' || state.currentAction.type === 'firemaking') {
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
        let hitpointsXpGained = 0;
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
          return {
            character: { ...state.character, bank }
          };
        });
      },
      removeItemFromBank: (itemId: string, quantity: number) => {
        set((state) => {
          if (!state.character) return {};
          const bank = [...state.character.bank];
          const itemIndex = bank.findIndex(i => i.id === itemId);
          if (itemIndex === -1) return {}; // Item not found
          const item = bank[itemIndex];
          if (item.quantity < quantity) return {}; // Not enough items
          if (item.quantity === quantity) {
            bank.splice(itemIndex, 1);
          } else {
            bank[itemIndex].quantity -= quantity;
          }
          return {
            character: { ...state.character, bank }
          };
        });
      },
      sellItem: (itemId: string, quantity: number) => {
        set((state) => {
          if (!state.character) return {};
          const item = getItemById(itemId);
          if (!item || !item.sellPrice) return {}; // Item not sellable
          const bank = [...state.character.bank];
          const itemIndex = bank.findIndex(i => i.id === itemId);
          if (itemIndex === -1) return {}; // Item not found
          const bankItem = bank[itemIndex];
          if (bankItem.quantity < quantity) return {}; // Not enough items
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
          return {
            character: { ...state.character, bank }
          };
        });
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
        set({
          character: { ...state.character, skills }
        });
        if (newLevel > oldLevel) {
          return { skill, level: newLevel };
        }
        return null;
      },

      // Slayer actions
      getNewSlayerTask: (difficulty) => {
        // Implementation needed
      },
      completeSlayerTask: () => {
        // Implementation needed
      },

      // Offline progress
      processOfflineProgress: () => {
        // Implementation needed
        return null;
      },
      clearActionReward: () => set({ lastActionReward: null }),

      // Auth
      signOut: () => set({ character: null }),
      updateCharacter: (character: Character) => set({ character }),

      // Add location slice (includes state and actions)
      ...locationSlice(set, get),

      buyItem: (itemId: string, quantity: number) => {
        set((state) => {
          if (!state.character) return {};
          const item = getItemById(itemId);
          if (!item || !item.buyPrice) return {}; // Item not buyable
          const totalCost = item.buyPrice * quantity;
          const bank = [...state.character.bank];
          const coinsIndex = bank.findIndex(i => i.id === 'coins');
          if (coinsIndex === -1 || bank[coinsIndex].quantity < totalCost) return {}; // Not enough coins
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
          return {
            character: { ...state.character, bank }
          };
        });
      },
      equipItem: (item: Item) => {
        set((state) => {
          if (!state.character) return {};
          const itemData = getItemById(item.id);
          if (!itemData || !itemData.slot) return {};
          // Use the item's defined slot (no special-casing for pickaxes)
          const slot = itemData.slot.toLowerCase();
          const equipment = { ...state.character.equipment };
          const bank = [...state.character.bank];
          // Remove one from bank
          const bankIndex = bank.findIndex(i => i.id === item.id);
          if (bankIndex === -1 || bank[bankIndex].quantity < 1) return {};
          bank[bankIndex].quantity -= 1;
          if (bank[bankIndex].quantity === 0) bank.splice(bankIndex, 1);
          // If slot is occupied, move equipped item to bank
          if (equipment[slot]) {
            const equipped = equipment[slot]!;
            const bankEquippedIndex = bank.findIndex(i => i.id === equipped.id);
            if (bankEquippedIndex !== -1) {
              bank[bankEquippedIndex].quantity += 1;
            } else {
              bank.push({ id: equipped.id, name: equipped.name, quantity: 1 });
            }
          }
          // Equip the new item
          equipment[slot] = { ...itemData, quantity: 1 };
          return {
            character: { ...state.character, equipment, bank }
          };
        });
      },
      unequipItem: (slot: string) => {
        set((state) => {
          if (!state.character) return {};
          const equipment = { ...state.character.equipment };
          const bank = [...state.character.bank];
          const equipped = equipment[slot];
          if (!equipped) return {};
          // Add back to bank
          const bankIndex = bank.findIndex(i => i.id === equipped.id);
          if (bankIndex !== -1) {
            bank[bankIndex].quantity += 1;
          } else {
            bank.push({ id: equipped.id, name: equipped.name, quantity: 1 });
          }
          equipment[slot] = undefined;
          return {
            character: { ...state.character, equipment, bank }
          };
        });
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
          let newActiveEffects = [...state.character.activeEffects];
          // Heal if healing property exists
          if (item.healing && state.character.hitpoints < state.character.maxHitpoints) {
            newHitpoints = Math.min(state.character.hitpoints + item.healing * quantity, state.character.maxHitpoints);
            healed = true;
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
          return {
            character: {
              ...state.character,
              hitpoints: newHitpoints,
              activeEffects: newActiveEffects,
              bank: newBank
            }
          };
        });
      },
      resetLastCombatRound: () => set({ lastCombatRound: null }),
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        character: state.character,
        locations: state.locations,
        recentLocations: state.recentLocations,
        favoriteLocations: state.favoriteLocations,
        discoveredLocations: state.discoveredLocations,
      }),
    }
  )
);

// Export the store creator for testing
export const createGameStore = () => createStore();

// Export the store instance for components to use
export const useGameStore = createStore();

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
