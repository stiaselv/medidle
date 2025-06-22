import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, useToast, Text } from '@chakra-ui/react';
import type { Character } from '../../types/game';

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

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bg="gray.800">
      <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="gray.700" color="white" width="md">
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
            {error && <Text color="red.400" mt={4} textAlign="center">{error}</Text>}
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default CharacterCreation; 