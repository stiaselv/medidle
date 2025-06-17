import React from 'react';
import { Box, Button, Grid, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { mockLocations } from '../../data/mockData';
import { LocationCard } from '../locations/LocationCard';
import { useGameStore } from '../../store/gameStore';

export const CombatLocationsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentLocation, setLocation } = useGameStore();

  return (
    <Box minH="100vh" w="100%" bg="gray.900" p={6}>
      <Button mb={6} colorScheme="blue" onClick={() => navigate(-1)}>
        Back
      </Button>
      <Text fontSize="3xl" fontWeight="bold" color="white" mb={8} textAlign="center">
        Combat Locations
      </Text>
      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={8} maxW="1200px" mx="auto">
        <Box>
          <Text fontSize="2xl" fontWeight="semibold" color="red.300" mb={4}>World</Text>
          <VStack spacing={4} align="stretch">
            {mockLocations.filter(l =>
              l.type === 'combat' &&
              l.group === 'World' &&
              !['easy_cave', 'medium_cave', 'hard_cave', 'nightmare_cave', 'slayer_cave'].includes(l.id)
            ).map(location => (
              <LocationCard
                key={location.id}
                location={location}
                onClick={() => {
                  const fullLocation = mockLocations.find(l2 => l2.id === location.id);
                  if (fullLocation) {
                    setLocation(fullLocation);
                    navigate('/game');
                  }
                }}
              />
            ))}
          </VStack>
        </Box>
        <Box>
          <Text fontSize="2xl" fontWeight="semibold" color="orange.300" mb={4}>Dungeons</Text>
          <VStack spacing={4} align="stretch">
            {mockLocations.filter(l =>
              l.type === 'combat' &&
              l.group === 'Dungeons' &&
              !['easy_cave', 'medium_cave', 'hard_cave', 'nightmare_cave', 'slayer_cave'].includes(l.id)
            ).map(location => (
              <LocationCard
                key={location.id}
                location={location}
                onClick={() => {
                  const fullLocation = mockLocations.find(l2 => l2.id === location.id);
                  if (fullLocation) {
                    setLocation(fullLocation);
                    navigate('/game');
                  }
                }}
              />
            ))}
          </VStack>
        </Box>
        <Box>
          <Text fontSize="2xl" fontWeight="semibold" color="purple.300" mb={4}>Raids</Text>
          <VStack spacing={4} align="stretch">
            {mockLocations.filter(l =>
              l.type === 'combat' &&
              l.group === 'Raids' &&
              !['easy_cave', 'medium_cave', 'hard_cave', 'nightmare_cave', 'slayer_cave'].includes(l.id)
            ).map(location => (
              <LocationCard
                key={location.id}
                location={location}
                onClick={() => {
                  const fullLocation = mockLocations.find(l2 => l2.id === location.id);
                  if (fullLocation) {
                    setLocation(fullLocation);
                    navigate('/game');
                  }
                }}
              />
            ))}
          </VStack>
        </Box>
      </Grid>
    </Box>
  );
}; 