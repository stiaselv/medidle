import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  SimpleGrid,
  Button,
  Progress,
  Badge,
  Icon,
  Flex,
  Heading,
  useDisclosure,
  Tooltip,
  Divider,
  useBreakpointValue
} from '@chakra-ui/react';
import { FaSeedling, FaLeaf, FaTree, FaClock, FaHammer, FaLock } from 'react-icons/fa';
import { useGameStore, calculateLevel } from '../../store/gameStore';
import { PlantingModal } from './PlantingModal';
import type { FarmingPatch, PatchType } from '../../types/game';

export const FieldsLocation = () => {
  const { 
    character, 
    farmingPatches, 
    initializeFarmingPatches, 
    plantCrop, 
    harvestPatch, 
    updatePatchStatuses 
  } = useGameStore();
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPatch, setSelectedPatch] = useState<{ id: string; type: PatchType } | null>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Initialize patches if they don't exist
  useEffect(() => {
    if (farmingPatches.length === 0) {
      initializeFarmingPatches();
    }
  }, [farmingPatches.length, initializeFarmingPatches]);

  // Update patch statuses periodically
  useEffect(() => {
    const interval = setInterval(() => {
      updatePatchStatuses();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [updatePatchStatuses]);

  if (!character) return null;

  const farmingLevel = calculateLevel(character.skills.farming.experience);
  const farmingSkill = character.skills.farming;
  const nextLevelExp = farmingLevel * farmingLevel * 83;
  const prevLevelExp = (farmingLevel - 1) * (farmingLevel - 1) * 83;
  const expProgress = ((farmingSkill.experience - prevLevelExp) / (nextLevelExp - prevLevelExp)) * 100;

  const handlePlantClick = (patch: FarmingPatch) => {
    if (patch.status === 'empty' && farmingLevel >= patch.levelRequired) {
      setSelectedPatch({ id: patch.id, type: patch.type });
      onOpen();
    }
  };

  const handlePlant = (cropId: string) => {
    if (selectedPatch) {
      const success = plantCrop(selectedPatch.id, cropId);
      if (success) {
        console.log(`Successfully planted ${cropId} in patch ${selectedPatch.id}`);
      }
    }
  };

  const handleHarvest = (patch: FarmingPatch) => {
    if (patch.status === 'ready') {
      harvestPatch(patch.id);
    }
  };

  const getTimeRemaining = (patch: FarmingPatch): string => {
    if (patch.status !== 'growing' || !patch.plantedCrop) return '';
    
    const currentTime = Date.now();
    const growthTime = patch.plantedCrop.harvestTime * 60 * 1000; // Convert to milliseconds
    const elapsedTime = currentTime - patch.plantedCrop.plantedAt;
    const remainingTime = growthTime - elapsedTime;
    
    if (remainingTime <= 0) return 'Ready!';
    
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getGrowthProgress = (patch: FarmingPatch): number => {
    if (patch.status !== 'growing' || !patch.plantedCrop) return 0;
    
    const currentTime = Date.now();
    const growthTime = patch.plantedCrop.harvestTime * 60 * 1000;
    const elapsedTime = currentTime - patch.plantedCrop.plantedAt;
    
    return Math.min((elapsedTime / growthTime) * 100, 100);
  };

  const getPatchIcon = (type: PatchType) => {
    switch (type) {
      case 'allotment': return FaSeedling;
      case 'herbs': return FaLeaf;
      case 'trees': return FaTree;
      default: return FaSeedling;
    }
  };

  const getPatchColor = (type: PatchType) => {
    switch (type) {
      case 'allotment': return 'green';
      case 'herbs': return 'purple';
      case 'trees': return 'brown';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: FarmingPatch['status']) => {
    switch (status) {
      case 'empty': return 'gray';
      case 'growing': return 'yellow';
      case 'ready': return 'green';
      case 'diseased': return 'red';
      default: return 'gray';
    }
  };

  const renderPatch = (patch: FarmingPatch) => {
    const isUnlocked = farmingLevel >= patch.levelRequired;
    const patchColor = getPatchColor(patch.type);
    const statusColor = getStatusColor(patch.status);

    return (
      <Box
        key={patch.id}
        p={4}
        border="2px solid"
        borderColor={
          !isUnlocked 
            ? "gray.600" 
            : patch.status === 'ready' 
            ? "green.500" 
            : patch.status === 'growing'
            ? "yellow.500"
            : "gray.500"
        }
        borderRadius="lg"
        bg={!isUnlocked ? "gray.700" : `${patchColor}.900`}
        opacity={!isUnlocked ? 0.6 : 1}
        position="relative"
        minH="200px"
        cursor={isUnlocked && patch.status === 'empty' ? 'pointer' : 'default'}
        onClick={() => isUnlocked && handlePlantClick(patch)}
        _hover={
          isUnlocked && patch.status === 'empty'
            ? { borderColor: `${patchColor}.400`, transform: 'scale(1.02)' }
            : {}
        }
        transition="all 0.2s"
      >
        {!isUnlocked && (
          <Icon
            as={FaLock}
            position="absolute"
            top={2}
            right={2}
            color="gray.400"
            boxSize={4}
          />
        )}

        <VStack spacing={3} align="stretch" height="100%">
          {/* Header */}
          <HStack justify="space-between" align="start">
            <HStack spacing={2}>
              <Icon as={getPatchIcon(patch.type)} color={`${patchColor}.400`} boxSize={5} />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" color="white" fontSize="sm">
                  {patch.type.charAt(0).toUpperCase() + patch.type.slice(1)} Patch
                </Text>
                <Text fontSize="xs" color="gray.400">
                  #{patch.id.split('_')[1]}
                </Text>
              </VStack>
            </HStack>
            <Badge colorScheme={statusColor} variant="solid" fontSize="xs">
              {patch.status.charAt(0).toUpperCase() + patch.status.slice(1)}
            </Badge>
          </HStack>

          {/* Level requirement */}
          {!isUnlocked && (
            <Box>
              <Text fontSize="xs" color="gray.400" textAlign="center">
                Requires Level {patch.levelRequired} Farming
              </Text>
            </Box>
          )}

          {/* Patch content */}
          <Box flex={1}>
            {patch.status === 'empty' && isUnlocked && (
              <VStack spacing={3} justify="center" minH="80px">
                <Icon as={FaSeedling} color="gray.500" boxSize={8} />
                <Text fontSize="sm" color="gray.400" textAlign="center">
                  Click to plant
                </Text>
              </VStack>
            )}

            {patch.status === 'growing' && patch.plantedCrop && (
              <VStack spacing={3} justify="center">
                <Text fontWeight="medium" color="white" fontSize="sm" textAlign="center">
                  {patch.plantedCrop.cropName}
                </Text>
                <Progress
                  value={getGrowthProgress(patch)}
                  colorScheme="yellow"
                  size="md"
                  borderRadius="md"
                  w="100%"
                />
                <HStack spacing={1}>
                  <Icon as={FaClock} color="yellow.400" boxSize={3} />
                  <Text fontSize="xs" color="yellow.300">
                    {getTimeRemaining(patch)}
                  </Text>
                </HStack>
              </VStack>
            )}

            {patch.status === 'ready' && patch.plantedCrop && (
              <VStack spacing={3} justify="center">
                <Text fontWeight="medium" color="white" fontSize="sm" textAlign="center">
                  {patch.plantedCrop.cropName}
                </Text>
                <Badge colorScheme="green" variant="solid">
                  Ready to Harvest!
                </Badge>
                <Button
                  size="sm"
                  colorScheme="green"
                  leftIcon={<FaHammer />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHarvest(patch);
                  }}
                  w="100%"
                >
                  Harvest
                </Button>
              </VStack>
            )}
          </Box>

          {/* Plant button for empty patches */}
          {patch.status === 'empty' && isUnlocked && (
            <Button
              size="sm"
              colorScheme={patchColor}
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handlePlantClick(patch);
              }}
              w="100%"
            >
              Plant
            </Button>
          )}
        </VStack>
      </Box>
    );
  };

  const allotmentPatches = farmingPatches.filter(p => p.type === 'allotment');
  const herbPatches = farmingPatches.filter(p => p.type === 'herbs');
  const treePatches = farmingPatches.filter(p => p.type === 'trees');

  return (
    <Flex
      position="relative"
      width="100%"
      height="100vh"
      direction="column"
      overflow="auto"
      bgImage="/assets/BG/fields.webp"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      {/* Dark overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.700"
        zIndex={1}
      />

      {/* Content */}
      <Box position="relative" zIndex={2} p={6} overflow="auto" flex={1}>
        <VStack spacing={8} align="stretch" w="100%" maxW="1400px" mx="auto">
          {/* Header */}
          <VStack spacing={4} align="center">
            <Heading color="white" size="xl" textAlign="center">
              🌱 Farming Fields
            </Heading>
            <Text color="gray.300" textAlign="center" fontSize="lg">
              Plant and harvest crops in your farming patches
            </Text>

            {/* Farming skill progress */}
            <VStack spacing={2} w="100%" maxW="400px">
              <HStack justify="space-between" w="100%">
                <Text color="white" fontWeight="medium">
                  Farming Level {farmingLevel}
                </Text>
                <Text color="gray.400" fontSize="sm">
                  {farmingSkill.experience.toLocaleString()} XP
                </Text>
              </HStack>
              <Progress
                value={expProgress}
                colorScheme="green"
                size="md"
                borderRadius="md"
                w="100%"
              />
            </VStack>
          </VStack>

          {/* Allotment Patches */}
          <VStack spacing={4} align="stretch">
            <HStack spacing={3}>
              <Icon as={FaSeedling} color="green.400" boxSize={6} />
              <Heading color="white" size="lg">
                Allotment Patches
              </Heading>
              <Badge colorScheme="green" variant="outline">
                {allotmentPatches.filter(p => farmingLevel >= p.levelRequired).length} / {allotmentPatches.length} Unlocked
              </Badge>
            </HStack>
            <SimpleGrid columns={{ base: 2, md: 3, lg: 4, xl: 6 }} spacing={4}>
              {allotmentPatches.map(renderPatch)}
            </SimpleGrid>
          </VStack>

          <Divider borderColor="gray.600" />

          {/* Herb Patches */}
          <VStack spacing={4} align="stretch">
            <HStack spacing={3}>
              <Icon as={FaLeaf} color="purple.400" boxSize={6} />
              <Heading color="white" size="lg">
                Herb Patches
              </Heading>
              <Badge colorScheme="purple" variant="outline">
                {herbPatches.filter(p => farmingLevel >= p.levelRequired).length} / {herbPatches.length} Unlocked
              </Badge>
            </HStack>
            <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
              {herbPatches.map(renderPatch)}
            </SimpleGrid>
          </VStack>

          <Divider borderColor="gray.600" />

          {/* Tree Patches */}
          <VStack spacing={4} align="stretch">
            <HStack spacing={3}>
              <Icon as={FaTree} color="brown.400" boxSize={6} />
              <Heading color="white" size="lg">
                Tree Patches
              </Heading>
              <Badge colorScheme="orange" variant="outline">
                {treePatches.filter(p => farmingLevel >= p.levelRequired).length} / {treePatches.length} Unlocked
              </Badge>
            </HStack>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              {treePatches.map(renderPatch)}
            </SimpleGrid>
          </VStack>
        </VStack>
      </Box>

      {/* Planting Modal */}
      {selectedPatch && (
        <PlantingModal
          isOpen={isOpen}
          onClose={onClose}
          patchType={selectedPatch.type}
          patchId={selectedPatch.id}
          onPlant={handlePlant}
        />
      )}
    </Flex>
  );
}; 