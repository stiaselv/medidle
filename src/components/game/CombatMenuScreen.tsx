import React from 'react';
import { 
  Box, 
  Button, 
  Grid, 
  Text, 
  VStack, 
  HStack, 
  Badge,
  Image,
  useToast,
  Flex,
  Icon
} from '@chakra-ui/react';
import { FaFistRaised, FaDungeon, FaLock, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { mockLocations } from '../../data/mockData';
import { DUNGEONS, getAllDungeons } from '../../data/dungeons';
import { SimpleCombatLocationCard } from '../locations/SimpleCombatLocationCard';
import { useGameStore } from '../../store/gameStore';
import type { Dungeon } from '../../types/game';
import { getLevelFromExperience } from '../../utils/experience';

interface DungeonCardProps {
  dungeon: Dungeon;
  isUnlocked: boolean;
  isCompleted: boolean;
  onSelect: (dungeon: Dungeon) => void;
}

const DungeonCard: React.FC<DungeonCardProps> = ({ dungeon, isUnlocked, isCompleted, onSelect }) => {
  return (
    <Box
      bg="gray.700"
      borderRadius="lg"
      p={4}
      cursor={isUnlocked ? "pointer" : "not-allowed"}
      opacity={isUnlocked ? 1 : 0.6}
      onClick={() => isUnlocked && onSelect(dungeon)}
      _hover={isUnlocked ? { transform: 'scale(1.02)', bg: 'gray.600' } : {}}
      transition="all 0.2s"
      border="2px solid"
      borderColor={isCompleted ? 'green.500' : isUnlocked ? 'purple.500' : 'gray.600'}
      position="relative"
    >
      {isCompleted && (
        <Box position="absolute" top={2} right={2}>
          <Icon as={FaCheck} color="green.500" boxSize={5} />
        </Box>
      )}
      
      <VStack spacing={3} align="stretch">
        <HStack justify="space-between">
          <HStack>
            <Icon as={FaDungeon} color="purple.400" boxSize={6} />
            <Text fontWeight="bold" color="white">{dungeon.name}</Text>
          </HStack>
          {!isUnlocked && <Icon as={FaLock} color="gray.400" />}
        </HStack>
        
        <Image
          src={dungeon.thumbnail}
          alt={dungeon.name}
          boxSize="80px"
          objectFit="cover"
          borderRadius="md"
          mx="auto"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/items/placeholder.png';
          }}
        />
        
        <Text fontSize="sm" color="gray.300" textAlign="center">
          {dungeon.description}
        </Text>
        
        <VStack spacing={2}>
          <Badge colorScheme={isUnlocked ? 'purple' : 'gray'} variant="solid">
            Level {dungeon.levelRequired} Required
          </Badge>
          
          <HStack>
            <Text fontSize="xs" color="gray.400">Monsters:</Text>
            <Text fontSize="xs" color="gray.300">{dungeon.monsters.length}</Text>
          </HStack>
          
          <HStack>
            <Text fontSize="xs" color="gray.400">Reward:</Text>
            <Text fontSize="xs" color="yellow.300">
              {dungeon.completionReward.quantity}x {dungeon.completionReward.itemId.replace('_', ' ')}
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export const CombatMenuScreen: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { character, currentLocation, setLocation, setView } = useGameStore();

  if (!character) return null;

  // Add safety checks and error handling
  let worldLocations = [];
  let dungeons = [];
  
  try {
    console.log('mockLocations:', mockLocations);
    
    // Get world combat locations (existing combat areas)
    worldLocations = mockLocations.filter(l => {
      console.log('Location:', l.id, 'type:', l.type, 'group:', l.group);
      return l.type === 'combat' &&
        l.group === 'World' &&
        !['easy_cave', 'medium_cave', 'hard_cave', 'nightmare_cave', 'slayer_cave'].includes(l.id);
    });
    
    console.log('Filtered worldLocations:', worldLocations);
    
    // Get all dungeons
    dungeons = getAllDungeons();
    console.log('dungeons:', dungeons);
  } catch (error) {
    console.error('Error filtering locations or getting dungeons:', error);
    
    toast({
      title: 'Error Loading Combat Areas',
      description: 'There was an error loading the combat areas. Please try again.',
      status: 'error',
      duration: 3000,
    });
    
    // Return early with error state
    return (
      <Box p={8} textAlign="center">
        <Text color="red.400" fontSize="xl">Error Loading Combat Menu</Text>
        <Button mt={4} onClick={() => navigate('/game')}>
          Return to Game
        </Button>
      </Box>
    );
  }

  const handleDungeonSelect = (dungeon: Dungeon) => {
    try {
      const isUnlocked = getLevelFromExperience(character.skills.attack.experience) >= dungeon.levelRequired;
      
      if (!isUnlocked) {
        toast({
          title: 'Dungeon Locked',
          description: `You need level ${dungeon.levelRequired} Attack to enter this dungeon.`,
          status: 'warning',
          duration: 3000,
        });
        return;
      }

      // Navigate to dungeon - we'll create this later
      // For now, show a message
      toast({
        title: 'Entering Dungeon',
        description: `Preparing to enter ${dungeon.name}...`,
        status: 'info',
        duration: 2000,
      });
    } catch (error) {
      console.error('Error handling dungeon select:', error);
      toast({
        title: 'Error',
        description: 'Failed to select dungeon.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const getDungeonProgress = (dungeonId: string) => {
    try {
      return character.dungeonProgress?.[dungeonId] || {
        currentMonsterIndex: 0,
        completed: false,
        monstersDefeated: [],
        completedAt: undefined
      };
    } catch (error) {
      console.error('Error getting dungeon progress:', error);
      return {
        currentMonsterIndex: 0,
        completed: false,
        monstersDefeated: [],
        completedAt: undefined
      };
    }
  };

  return (
    <Box p={8} bg="gray.900" minH="100vh" color="white">
      {/* Back Button */}
      <Button
        onClick={() => navigate('/game')}
        mb={6}
        bg="gray.700"
        color="white"
        _hover={{ bg: 'gray.600' }}
      >
        ← Back to Game
      </Button>

      {/* Combat Menu Title */}
      <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={8} color="orange.300">
        Combat Menu
      </Text>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
        {/* World Locations Section */}
        <Box>
          <HStack mb={6} justify="center">
            <Icon as={FaFistRaised} color="orange.400" boxSize={6} />
            <Text fontSize="2xl" fontWeight="semibold" color="orange.300">
              World Locations
            </Text>
          </HStack>
          
          <VStack spacing={4}>
            {worldLocations.length > 0 ? worldLocations.map((location) => (
              <Box key={location.id} w="full" display="flex" justifyContent="center">
                <SimpleCombatLocationCard
                  location={location}
                  onClick={() => {
                    try {
                      const fullLocation = mockLocations.find(l2 => l2.id === location.id);
                      if (fullLocation) {
                        setLocation(fullLocation);
                        navigate('/game');
                      }
                    } catch (error) {
                      console.error('Error selecting location:', error);
                      toast({
                        title: 'Error',
                        description: 'Failed to select location.',
                        status: 'error',
                        duration: 3000,
                      });
                    }
                  }}
                />
              </Box>
            )) : (
              <Text color="gray.400">No world locations available</Text>
            )}
          </VStack>
        </Box>

        {/* Dungeons Section */}
        <Box>
          <HStack mb={6} justify="center">
            <Icon as={FaDungeon} color="purple.400" boxSize={6} />
            <Text fontSize="2xl" fontWeight="semibold" color="purple.300">
              Dungeons
            </Text>
          </HStack>
          
          <VStack spacing={4}>
            {dungeons.length > 0 ? dungeons.map((dungeon) => {
              try {
                const isUnlocked = getLevelFromExperience(character.skills.attack.experience) >= dungeon.levelRequired;
                const progress = getDungeonProgress(dungeon.id);
                const isCompleted = progress.completed;

                return (
                  <DungeonCard
                    key={dungeon.id}
                    dungeon={dungeon}
                    isUnlocked={isUnlocked}
                    isCompleted={isCompleted}
                    onSelect={handleDungeonSelect}
                  />
                );
              } catch (error) {
                console.error('Error rendering dungeon:', dungeon.id, error);
                return (
                  <Box key={dungeon.id} p={4} bg="red.900" borderRadius="lg">
                    <Text color="red.200">Error loading dungeon: {dungeon.name}</Text>
                  </Box>
                );
              }
            }) : (
              <Text color="gray.400">No dungeons available</Text>
            )}
          </VStack>
        </Box>
      </Grid>
    </Box>
  );
}; 