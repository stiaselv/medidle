import { Box, Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import type { Character } from '../../types/game';

export const CharacterCreation = () => {
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { createCharacter, character } = useGameStore();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Form submitted with name:', name);
    
    if (name.trim().length < 2) {
      console.log('Name too short');
      toast({
        title: 'Invalid name',
        description: 'Character name must be at least 2 characters long',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      console.log('Starting character creation...');
      setIsCreating(true);
      
      const trimmedName = name.trim();
      console.log('Creating character with name:', trimmedName);
      
      const newCharacter = createCharacter(trimmedName);
      console.log('Character creation result:', newCharacter);
      
      const storeState = useGameStore.getState();
      console.log('Store state after creation:', storeState);
      
      if (!storeState.character) {
        throw new Error('Character creation failed - character is null in store');
      }

      toast({
        title: 'Character created!',
        description: `Welcome, ${trimmedName}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      console.log('Navigating to game screen...');
      navigate('/game', { replace: true });
    } catch (error) {
      console.error('Character creation error:', error);
      toast({
        title: 'Creation failed',
        description: error instanceof Error ? error.message : 'Failed to create character. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/select', { replace: true });
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-b, gray.900, gray.800)"
    >
      <Box
        bg="gray.700"
        p={8}
        borderRadius="lg"
        boxShadow="xl"
        w={{ base: '90%', md: '400px' }}
      >
        <form onSubmit={handleSubmit} noValidate>
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel color="gray.200">Character Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name..."
                bg="gray.600"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                _hover={{ bg: 'gray.500' }}
                _focus={{ bg: 'gray.500', borderColor: 'blue.300' }}
                disabled={isCreating}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              w="full"
              isDisabled={name.trim().length < 2 || isCreating}
              isLoading={isCreating}
              loadingText="Creating..."
            >
              Create Character
            </Button>
            <Button
              variant="ghost"
              w="full"
              onClick={handleBackClick}
              color="gray.400"
              _hover={{ bg: 'gray.600' }}
              isDisabled={isCreating}
            >
              Back to Selection
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}; 