import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import type { Character } from '../../types/game';
import { Box, Button, VStack, Heading, Text } from '@chakra-ui/react';

export const CharacterSelection = () => {
  const { characters, setCharacter, isLoading } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    // This component no longer fetches data.
    // It relies on the App component to load characters into the store.
  }, []);

  const handleSelectCharacter = (character: Character) => {
    setCharacter(character);
    navigate('/game');
  };

  const renderContent = () => {
    if (isLoading) {
      // Note: The main loading screen is in App.tsx, but this can be a fallback.
      return <Text>Loading...</Text>;
    }

    if (characters.length === 0) {
      return <Text>No characters found. Please create one!</Text>;
    }

    return (
      <VStack spacing={4} width="full">
        {characters.map((char) => (
          <Button
            key={char.id}
            onClick={() => handleSelectCharacter(char)}
            width="full"
            justifyContent="space-between"
          >
            <Text>{char.name}</Text>
            <Text>Level: {char.combatLevel}</Text>
          </Button>
        ))}
      </VStack>
    );
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh" 
      bg="gray.800"
      backgroundImage="url('/assets/BG/character_select.webp')"
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="gray.700" color="white" width="md">
        <VStack spacing={6}>
          <Heading as="h2" size="lg">Select a Character</Heading>
          {renderContent()}
          <Button colorScheme="green" onClick={() => navigate('/create')} width="full">
            Create New Character
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}; 