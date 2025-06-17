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
import slayerCaveBg from '../../assets/BG/slayer_cave.webp';
import { EASY_MONSTERS, MEDIUM_MONSTERS, HARD_MONSTERS, NIGHTMARE_MONSTERS } from '../../data/monsters';

export const SlayerCaveLocation = () => {
  const { 
    character, 
    currentLocation,
    setLocation,
    startAction,
    currentAction,
    getNewSlayerTask,
    completeSlayerTask,
    cancelSlayerTask,
  } = useGameStore();
  const toast = useToast();

  if (!character || !currentLocation) return null;

  const [selectedDifficulty, setSelectedDifficulty] = React.useState<'Easy' | 'Medium' | 'Hard' | 'Nightmare'>('Easy');
  const handleDifficultySelect = (action: CombatSelectionAction) => {
    setSelectedDifficulty((action.difficulty as 'Easy' | 'Medium' | 'Hard' | 'Nightmare') || 'Easy');
    startAction(action);
  };

  const handleNewTask = () => {
    getNewSlayerTask(selectedDifficulty);
    toast({
      title: "New Slayer Task Assigned!",
      description: `You have been assigned a new ${selectedDifficulty} task.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCompleteTask = () => {
    completeSlayerTask();
    // Calculate points for this streak
    const streak = (character.slayerTaskStreak || 0) + 1;
    let points = 10;
    if (streak % 1000 === 0) points = 500;
    else if (streak % 250 === 0) points = 350;
    else if (streak % 100 === 0) points = 250;
    else if (streak % 50 === 0) points = 150;
    else if (streak % 10 === 0) points = 50;
    toast({
      title: "Slayer Task Complete!",
      description: `You earned ${points} Slayer Points!`,
      status: "success",
      duration: 3500,
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
    // Find the monster data for the current task
    let monster = EASY_MONSTERS.find(m => m.id === task.monsterId)
      || MEDIUM_MONSTERS.find(m => m.id === task.monsterId)
      || HARD_MONSTERS.find(m => m.id === task.monsterId)
      || NIGHTMARE_MONSTERS.find(m => m.id === task.monsterId);
    const monsterImg = monster?.thumbnail || '/assets/items/placeholder.png';

    return (
      <VStack spacing={4} align="stretch">
        <Heading size="md">Current Task</Heading>
        <Box borderWidth={1} borderRadius="lg" p={4}>
          <HStack spacing={4} align="center">
            <Box boxSize="64px" borderRadius="md" overflow="hidden" bg="gray.800" borderWidth={1} borderColor="gray.700">
              <img src={monsterImg} alt={task.monsterName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </Box>
            <VStack align="start" spacing={1}>
              <Text mb={2}>Target: {task.monsterName}</Text>
              <Text mb={2}>Difficulty: {task.difficulty}</Text>
              <Text mb={3}>Progress: {task.amount - task.remaining}/{task.amount}</Text>
            </VStack>
          </HStack>
          <Progress value={progress} colorScheme="blue" borderRadius="full" />
        </Box>
        <HStack justify="space-between" spacing={4}>
          <Text fontSize="sm" color="gray.300">Task Streak: <b>{character.slayerTaskStreak || 0}</b></Text>
          <Text fontSize="sm" color="gray.300">Slayer Level: <b>{character.skills.slayer.level}</b></Text>
          <Text fontSize="sm" color="gray.300">Slayer Points: <b>{character.slayerPoints || 0}</b></Text>
        </HStack>
        <HStack spacing={4}>
          <Button 
            colorScheme="blue" 
            isDisabled={task.remaining > 0}
            onClick={handleCompleteTask}
          >
            {task.remaining > 0 ? 'Task in Progress' : 'Complete Task'}
          </Button>
          <Button
            colorScheme="red"
            variant="outline"
            isDisabled={(character.slayerPoints || 0) < 30}
            onClick={() => {
              if ((character.slayerPoints || 0) < 30) {
                toast({
                  title: 'Not enough Slayer Points',
                  description: 'You need at least 30 Slayer Points to cancel a task.',
                  status: 'error',
                  duration: 3000,
                  isClosable: true,
                });
                return;
              }
              cancelSlayerTask();
              toast({
                title: 'Slayer Task Cancelled',
                description: 'Your current Slayer task has been cancelled for 30 Slayer Points.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
              });
            }}
          >
            Cancel Task (-30 pts)
          </Button>
        </HStack>
      </VStack>
    );
  };

  return (
    <Box position="relative" width="100%" minH="100vh" p={0}>
      {/* Slayer Cave background image */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage={`url(${slayerCaveBg})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        zIndex={0}
        _after={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: 'rgba(0,0,0,0.55)',
          zIndex: 1
        }}
      />
      {/* Content */}
      <Box position="relative" zIndex={2} p={6}>
        <HStack align="flex-start" spacing={8}>
          {/* Left side - Difficulty selection */}
          <Box
            w="300px"
            borderWidth={2}
            borderColor="rgba(120,120,120,0.32)"
            borderRadius="2xl"
            p={4}
            bg="rgba(24,24,24,0.85)"
            boxShadow="xl"
            backdropFilter="blur(8px)"
            transition="box-shadow 0.2s, background 0.2s"
          >
            <Heading size="md" mb={4}>Select Difficulty</Heading>
            <VStack spacing={3}>
              {currentLocation.actions
                .filter(action => action.type === 'combat_selection')
                .map((action) => (
                  <Button
                    key={action.id}
                    w="full"
                    bg="rgba(40,40,40,0.92)"
                    color="white"
                    borderWidth={2}
                    borderColor="rgba(255,255,255,0.12)"
                    boxShadow="0 2px 12px 0 rgba(0,0,0,0.18)"
                    _hover={{
                      bg: 'rgba(60,60,60,0.98)',
                      boxShadow: '0 4px 24px 0 rgba(0,0,0,0.28)',
                      borderColor: 'rgba(255,255,255,0.22)'
                    }}
                    _active={{
                      bg: 'rgba(255,255,255,0.24)',
                    }}
                    variant="solid"
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
          <Box
            flex={1}
            borderWidth={2}
            borderColor="rgba(120,120,120,0.32)"
            borderRadius="2xl"
            p={4}
            bg="rgba(24,24,24,0.85)"
            boxShadow="xl"
            backdropFilter="blur(8px)"
            transition="box-shadow 0.2s, background 0.2s"
            position="relative"
          >
            {/* Slayer Shop Button */}
            <Button
              size="sm"
              colorScheme="yellow"
              position="absolute"
              top={4}
              right={4}
              onClick={() => toast({ title: 'Slayer Shop', description: 'Coming soon!', status: 'info', duration: 2500, isClosable: true })}
              zIndex={2}
            >
              Slayer Shop
            </Button>
            <VStack spacing={6} align="stretch">
              <Box>
                <Heading size="md">Slayer Master</Heading>
                <Text color="gray.400">
                  Complete slayer tasks to earn points and unlock rewards
                </Text>
              </Box>
              <Divider />
              {/* Task Info Card */}
              <Box>
                {renderTaskInfo()}
              </Box>
            </VStack>
          </Box>
        </HStack>
      </Box>
    </Box>
  );
}; 