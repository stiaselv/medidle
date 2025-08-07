import React, { useState, useRef, useCallback } from 'react';
import { Box, Button, VStack, Text, HStack, useToast, Alert, AlertIcon } from '@chakra-ui/react';
import { useGameStore } from '../../store/gameStore';
import { mockLocations } from '../../data/mockData';

export const OfflineTestHelper: React.FC = () => {
  const { character, setCharacter, processOfflineProgress, canPerformAction } = useGameStore();
  const toast = useToast();

  // Dragging state
  const [position, setPosition] = useState({ x: 16, y: 16 }); // top-4, right-4 in pixels
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  if (!character) return null;

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (dragRef.current) {
      setIsDragging(true);
      const rect = dragRef.current.getBoundingClientRect();
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && dragRef.current) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - dragRef.current.offsetWidth;
      const maxY = window.innerHeight - dragRef.current.offsetHeight;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const simulateOfflineTime = (minutes: number) => {
    if (!character) return;

    const pastTime = new Date(Date.now() - (minutes * 60 * 1000));
    const updatedCharacter = {
      ...character,
      lastLogin: pastTime
    };
    
    setCharacter(updatedCharacter);
    
    toast({
      title: 'Offline Time Simulated',
      description: `Set lastLogin to ${minutes} minutes ago. Refresh or re-select character to see offline progress.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const testOfflineProgress = () => {
    const rewards = processOfflineProgress();
    if (rewards) {
      toast({
        title: 'Offline Progress Calculated',
        description: `${rewards.actionsCompleted} actions completed, ${rewards.xp} XP gained!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else {
      // Check why no progress was made
      let reason = 'Unknown reason';
      
      if (!character.lastAction || character.lastAction.type === 'none') {
        reason = 'No last action recorded';
      } else if (character.lastAction.type === 'combat') {
        reason = 'Combat actions don\'t continue offline';
      } else {
        // Try to find the last action and check requirements
        const location = mockLocations.find((loc: any) => loc.id === character.lastAction?.location);
        if (location) {
          const lastAction = location.actions.find((action: any) => action.id === character.lastAction?.id);
          if (lastAction && 'skill' in lastAction && !canPerformAction(lastAction as any)) {
            reason = 'Missing requirements (items, levels, or equipment)';
          } else {
            reason = 'Not enough time passed (minimum 1 minute)';
          }
        }
      }
      
      toast({
        title: 'No Offline Progress',
        description: `Reason: ${reason}`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getLastActionInfo = () => {
    if (!character.lastAction || character.lastAction.type === 'none') {
      return 'No action recorded';
    }
    
    const location = mockLocations.find((loc: any) => loc.id === character.lastAction?.location);
    if (!location) return 'Unknown location';
    
    const lastAction = location.actions.find((action: any) => action.id === character.lastAction?.id);
    if (!lastAction) return 'Unknown action';
    
    const canPerform = 'skill' in lastAction ? canPerformAction(lastAction as any) : false;
    return `${lastAction.name} (${canPerform ? '✅ Can perform' : '❌ Missing requirements'})`;
  };

  return (
    <Box 
      ref={dragRef}
      position="fixed" 
      left={`${position.x}px`}
      top={`${position.y}px`}
      bg="gray.800" 
      p="4" 
      borderRadius="lg" 
      border="1px solid" 
      borderColor="gray.600"
      zIndex="1000"
      cursor={isDragging ? 'grabbing' : 'grab'}
      userSelect="none"
      onMouseDown={handleMouseDown}
      _hover={{
        borderColor: 'gray.500',
        boxShadow: 'lg'
      }}
      transition="border-color 0.2s, box-shadow 0.2s"
    >
      <VStack spacing={3} align="stretch" minW="250px">
        <HStack justify="space-between" align="center">
          <Text fontSize="sm" fontWeight="bold" color="yellow.400">
            🧪 Offline Testing
          </Text>
          <Text 
            fontSize="xs" 
            color="gray.500" 
            cursor="grab"
            _active={{ cursor: 'grabbing' }}
            userSelect="none"
          >
            ⋮⋮
          </Text>
        </HStack>
        
        <Text fontSize="xs" color="gray.400">
          Last Action: {getLastActionInfo()}
        </Text>
        
        <Text fontSize="xs" color="gray.400">
          Location: {character.lastAction?.location || 'none'}
        </Text>
        
        <Alert status="info" size="sm" borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontSize="xs" fontWeight="bold">Requirements Check:</Text>
            <Text fontSize="xs">• Items in bank</Text>
            <Text fontSize="xs">• Level requirements</Text>
            <Text fontSize="xs">• Equipment equipped</Text>
          </VStack>
        </Alert>
        
        <VStack spacing={2}>
          <Text fontSize="xs" color="gray.300">Simulate Offline Time:</Text>
          <HStack spacing={1}>
            <Button size="xs" onClick={() => simulateOfflineTime(2)}>
              2m
            </Button>
            <Button size="xs" onClick={() => simulateOfflineTime(30)}>
              30m
            </Button>
            <Button size="xs" onClick={() => simulateOfflineTime(120)}>
              2h
            </Button>
          </HStack>
        </VStack>
        
        <Button 
          size="sm" 
          colorScheme="blue" 
          onClick={testOfflineProgress}
        >
          Test Offline Progress
        </Button>
        
        <Text fontSize="xs" color="gray.500" textAlign="center">
          Start an action first!
        </Text>
      </VStack>
    </Box>
  );
}; 