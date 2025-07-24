import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, useToast, Text, Divider, HStack } from '@chakra-ui/react';
import type { Character } from '../../types/game';
import { ITEMS } from '../../data/items';

const CharacterCreation = () => {
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createCharacter = useGameStore((state) => state.createCharacter);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName || trimmedName.length < 3) {
      setError('Character name must be at least 3 characters long.');
      return;
    }
    
    setIsCreating(true);
    setError(null);
    
    try {
      // The store's createCharacter function now handles setting the character state internally.
      // It will throw an error if the creation fails on the backend.
      await createCharacter(trimmedName);

      toast({
        title: 'Character Created',
        description: `Welcome, ${trimmedName}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/game'); // Navigate to the game screen after success
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during character creation.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const createTestCharacter = async () => {
    const testName = name.trim() || 'TestCharacter';
    
    setIsCreating(true);
    setError(null);
    
    try {
      // Create character on backend first with normal stats
      await createCharacter(testName);
      
      // Then modify the character with maxed stats and all items
      const character = useGameStore.getState().character;
      if (character) {
        // Create maxed skills (level 99)
        const maxedSkills: any = {};
        const allSkills = [
          'attack', 'strength', 'defence', 'hitpoints', 'ranged', 'magic', 'prayer', 
          'slayer', 'mining', 'smithing', 'fishing', 'cooking', 'firemaking', 
          'woodcutting', 'crafting', 'fletching', 'thieving', 'farming', 
          'runecrafting', 'construction', 'hunter'
        ];
        
        allSkills.forEach(skill => {
          // Level 99 experience calculation: Math.floor(level * level * 83)
          const experience = Math.floor(99 * 99 * 83); // 813,801 XP for level 99
          maxedSkills[skill] = {
            level: 99,
            experience: experience,
            nextLevelExperience: Math.floor(100 * 100 * 83) // Level 100 would be 830,000 XP
          };
        });

        // Get all items with useful quantities for testing
        const allItems = Object.keys(ITEMS).map(itemId => {
          const item = ITEMS[itemId];
          let quantity = 1;
          
          // Give useful quantities for testing
          if (itemId === 'coins') quantity = 1000000; // 1 million coins
          else if (item.type === 'consumable') quantity = 100; // 100 food items
          else if (item.category === 'Resources') quantity = 1000; // 1000 resources
          else if (item.category === 'Runes') quantity = 10000; // 10k runes
          else if (itemId.includes('_ore') || itemId.includes('_log')) quantity = 1000; // Raw materials
          else if (itemId.includes('arrow') || itemId.includes('bolt')) quantity = 10000; // Ammo
          
          return {
            id: itemId,
            name: item.name,
            quantity: quantity
          };
        });

        // Update character with maxed stats and all items
        const updatedCharacter = {
          ...character,
          skills: maxedSkills,
          bank: allItems,
          hitpoints: 99,
          maxHitpoints: 99,
          prayer: 99,
          maxPrayer: 99,
          combatLevel: 99,
          specialEnergy: 100,
          maxSpecialEnergy: 100
        };

        useGameStore.getState().setCharacter(updatedCharacter);
        
        // Update bank tabs to sync with new items
        const gameStore = useGameStore.getState();
        if (gameStore.bankTabs && gameStore.bankTabs.length > 0) {
          const mainTab = { ...gameStore.bankTabs[0] };
          mainTab.items = allItems;
          gameStore.createBankTab = gameStore.createBankTab || (() => {});
          gameStore.setBankTab = gameStore.setBankTab || (() => {});
        }
      }

      toast({
        title: 'Test Character Created',
        description: `${testName} created with maxed stats and all items!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/game');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during test character creation.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" w="100vw" height="100vh" bg="gray.800">
      <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="gray.700" color="white" width="100%" maxW="400px">
        <Heading as="h2" size="lg" textAlign="center" mb={6}>Create Your Character</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="character-name" isRequired>
              <FormLabel>Character Name</FormLabel>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name"
                bg="gray.600"
                borderColor="gray.500"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isCreating}
              loadingText="Creating..."
            >
              Create Character
            </Button>
            
            <Divider />
            
            <VStack spacing={2}>
              <Text fontSize="sm" color="gray.400" textAlign="center">
                Development Mode
              </Text>
              <Button
                colorScheme="purple"
                variant="outline"
                width="full"
                isLoading={isCreating}
                loadingText="Creating Test Character..."
                onClick={createTestCharacter}
              >
                Create Test Character (99 All Skills + All Items)
              </Button>
            </VStack>
            
            {error && <Text color="red.400" mt={4} textAlign="center">{error}</Text>}
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default CharacterCreation; 