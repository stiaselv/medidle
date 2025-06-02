import { Box, Button, Grid, Heading, Text, VStack, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import type { Character } from '../../types/game';

const CharacterCard = ({ character, onSelect }: { character: Character; onSelect: () => void }) => (
  <Box
    bg="gray.700"
    p={4}
    borderRadius="lg"
    cursor="pointer"
    _hover={{ transform: 'scale(1.02)', bg: 'gray.600' }}
    transition="all 0.2s"
    onClick={onSelect}
  >
    <VStack spacing={2} align="start">
      <Heading size="md">{character.name}</Heading>
      <Text fontSize="sm" color="gray.400">
        Combat Level: {character.combatLevel}
      </Text>
      <Text fontSize="sm" color="gray.400">
        Last Action: {character.lastAction.type} at {character.lastAction.location}
      </Text>
      <Text fontSize="xs" color="gray.500">
        Last Login: {new Date(character.lastLogin).toLocaleString()}
      </Text>
    </VStack>
  </Box>
);

export const CharacterSelection = () => {
  const { setCharacter } = useGameStore();
  const navigate = useNavigate();
  const toast = useToast();

  // Load characters from local storage
  const loadCharacters = (): Character[] => {
    const characters: Character[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('character_')) {
        try {
          const character = JSON.parse(localStorage.getItem(key) || '');
          characters.push(character);
        } catch (error) {
          console.error('Error parsing character data:', error);
        }
      }
    }
    return characters.sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime());
  };

  const characters = loadCharacters();

  const handleSelectCharacter = (character: Character) => {
    setCharacter(character);
    toast({
      title: 'Welcome back!',
      description: `Logged in as ${character.name}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/game');
  };

  return (
    <Box
      minH="100vh"
      p={8}
      bgGradient="linear(to-b, gray.900, gray.800)"
    >
      <VStack spacing={8} align="stretch" maxW="1200px" mx="auto">
        <Heading color="white" textAlign="center">Select Character</Heading>
        
        {characters.length === 0 ? (
          <VStack spacing={4}>
            <Text color="gray.400">No characters found</Text>
            <Button
              colorScheme="blue"
              onClick={() => navigate('/create')}
            >
              Create New Character
            </Button>
          </VStack>
        ) : (
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={6}
          >
            {characters.map((char) => (
              <CharacterCard
                key={char.id}
                character={char}
                onSelect={() => handleSelectCharacter(char)}
              />
            ))}
            <Button
              h="100%"
              minH="150px"
              colorScheme="blue"
              variant="outline"
              onClick={() => navigate('/create')}
            >
              Create New Character
            </Button>
          </Grid>
        )}
      </VStack>
    </Box>
  );
}; 