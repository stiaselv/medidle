import React from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Heading,
  Divider,
  useToast,
  Progress,
} from '@chakra-ui/react';
import { useGameStore } from '../../store/gameStore';
import type { CombatSelectionAction, SlayerTask } from '../../types/game';

export const SlayerCaveLocation = () => {
  const { 
    character, 
    currentLocation,
    setLocation,
    startAction,
    currentAction,
  } = useGameStore();
  const toast = useToast();

  if (!character || !currentLocation) return null;

  const handleDifficultySelect = (action: CombatSelectionAction) => {
    startAction(action);
  };

  const handleNewTask = () => {
    // This will be implemented in the game store
    // For now, show a toast
    toast({
      title: "Coming soon",
      description: "Slayer tasks will be available soon!",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const renderTaskInfo = () => {
    if (!character.currentSlayerTask) {
      return (
        <Box textAlign="center" py={8}>
          <Text fontSize="lg" mb={4}>No active slayer task</Text>
          <Button colorScheme="blue" onClick={handleNewTask}>
            Get New Task
          </Button>
        </Box>
      );
    }

    const task = character.currentSlayerTask;
    const progress = ((task.amount - task.remaining) / task.amount) * 100;

    return (
      <VStack spacing={4} align="stretch">
        <Heading size="md">Current Task</Heading>
        <Box borderWidth={1} borderRadius="lg" p={4}>
          <Text mb={2}>Target: {task.monsterName}</Text>
          <Text mb={2}>Difficulty: {task.difficulty}</Text>
          <Text mb={3}>Progress: {task.amount - task.remaining}/{task.amount}</Text>
          <Progress value={progress} colorScheme="blue" borderRadius="full" />
        </Box>
        <Button 
          colorScheme="blue" 
          isDisabled={task.remaining > 0}
          onClick={handleNewTask}
        >
          {task.remaining > 0 ? 'Task in Progress' : 'Complete Task'}
        </Button>
      </VStack>
    );
  };

  return (
    <Box p={6}>
      <HStack align="flex-start" spacing={8}>
        {/* Left side - Difficulty selection */}
        <Box w="300px" borderWidth={1} borderRadius="lg" p={4}>
          <Heading size="md" mb={4}>Select Difficulty</Heading>
          <VStack spacing={3}>
            {currentLocation.actions
              .filter(action => action.type === 'combat_selection')
              .map((action) => (
                <Button
                  key={action.id}
                  w="full"
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => handleDifficultySelect(action as CombatSelectionAction)}
                  isDisabled={action.levelRequired > character.combatLevel}
                >
                  {action.name}
                  {action.levelRequired > character.combatLevel && 
                    ` (Req. Level ${action.levelRequired})`
                  }
                </Button>
              ))}
          </VStack>
        </Box>

        {/* Right side - Slayer Master interface */}
        <Box flex={1} borderWidth={1} borderRadius="lg" p={4}>
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="md">Slayer Master</Heading>
              <Text color="gray.500">
                Complete slayer tasks to earn points and unlock rewards
              </Text>
            </Box>
            
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                Slayer Points: {character.slayerPoints || 0}
              </Text>
            </Box>

            <Divider />

            {renderTaskInfo()}
          </VStack>
        </Box>
      </HStack>
    </Box>
  );
}; 