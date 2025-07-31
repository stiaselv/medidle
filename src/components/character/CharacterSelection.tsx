import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import type { Character } from '../../types/game';
import { Box, Button, VStack, Heading, Text, SimpleGrid, HStack, Badge } from '@chakra-ui/react';
import { DeleteCharacterModal } from './DeleteCharacterModal';

export const CharacterSelection = () => {
  const { characters, setCharacter, deleteCharacter, isLoading } = useGameStore();
  const navigate = useNavigate();
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    // This component no longer fetches data.
    // It relies on the App component to load characters into the store.
  }, []);

  const handleSelectCharacter = (character: Character) => {
    setCharacter(character);
    navigate('/game');
  };

  const handleDeleteCharacter = (character: Character) => {
    setCharacterToDelete(character);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!characterToDelete) return;
    
    try {
      await deleteCharacter(characterToDelete.id);
      setCharacterToDelete(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete character:', error);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      // Note: The main loading screen is in App.tsx, but this can be a fallback.
      return <Text>Loading...</Text>;
    }

    if (characters.length === 0) {
      return (
        <VStack spacing={4} width="full">
          <Text>No characters found. Please create one!</Text>
          <Button colorScheme="green" onClick={() => navigate('/create')} width="full">
            Create New Character
          </Button>
        </VStack>
      );
    }

    // Helper to get top 3 skills by level
    const getTopSkills = (skillsObj: Character['skills']) => {
      const entries = Object.entries(skillsObj).filter(([k]) => k !== 'none');
      return entries
        .sort((a, b) => b[1].level - a[1].level)
        .slice(0, 3);
    };

    return (
      <VStack spacing={4} width="full">
        <Box 
          maxH="60vh" 
          overflowY="auto" 
          width="full"
          css={{
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#2D3748',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#4A5568',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#718096',
            },
          }}
        >
          <SimpleGrid columns={{ base: 1, sm: 1, md: 1 }} spacing={4} width="full">
            {characters.map((char) => {
              const topSkills = getTopSkills(char.skills);
              return (
                <Box
                  key={char.id}
                  borderWidth={1}
                  borderRadius="lg"
                  boxShadow="md"
                  bg="gray.600"
                  color="white"
                  p={4}
                  _hover={{ boxShadow: 'xl', bg: 'gray.500' }}
                  transition="all 0.2s"
                >
                <HStack justify="space-between" mb={2}>
                  <Heading as="h3" size="md">{char.name}</Heading>
                  <Badge colorScheme="purple">Lvl {char.combatLevel}</Badge>
                </HStack>
                <Text fontSize="sm" color="gray.200" mb={1}>
                  Last login: {new Date(char.lastLogin).toLocaleString()}
                </Text>
                <Text fontSize="sm" color="gray.200" mb={1}>
                  Hitpoints: {char.hitpoints} / {char.maxHitpoints}
                </Text>
                <Text fontSize="sm" color="gray.200" mb={1}>
                  Slayer Points: {char.slayerPoints}
                </Text>
                <Text fontSize="sm" color="gray.200" mb={1}>
                  Top Skills:
                </Text>
                <HStack spacing={2} mb={2}>
                  {topSkills.map(([skill, data]: [string, any]) => (
                    <Badge key={skill} colorScheme="blue" fontSize="0.8em">
                      {skill.charAt(0).toUpperCase() + skill.slice(1)}: {data.level}
                    </Badge>
                  ))}
                </HStack>
                <HStack spacing={2} mt={2}>
                  <Button colorScheme="blue" flex={1} onClick={() => handleSelectCharacter(char)}>
                    Select
                  </Button>
                  <Button 
                    bg="red.500" 
                    color="white" 
                    _hover={{ bg: "red.600" }}
                    _active={{ bg: "red.700" }}
                    size="sm" 
                    onClick={() => handleDeleteCharacter(char)}
                  >
                    Delete
                  </Button>
                </HStack>
              </Box>
            );
          })}
                    </SimpleGrid>
          </Box>
        <Button colorScheme="green" onClick={() => navigate('/create')} width="full">
          Create New Character
        </Button>
      </VStack>
    );
  };

  return (
    <>
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        w="100vw"
        height="100vh" 
        bg="gray.800"
        backgroundImage="url('/assets/BG/character_select.webp')"
        backgroundSize="cover"
        backgroundPosition="center"
      >
        <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="gray.700" color="white" width="100%" maxW="400px">
          <VStack spacing={6}>
            <Heading as="h2" size="lg">Select a Character</Heading>
            {renderContent()}
          </VStack>
        </Box>
      </Box>
      
      <DeleteCharacterModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCharacterToDelete(null);
        }}
        character={characterToDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}; 