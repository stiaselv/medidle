import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Box,
  Image,
  Badge,
  Divider,
  SimpleGrid,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { FaClock, FaLeaf, FaLock } from 'react-icons/fa';
import type { FarmingCrop, PatchType } from '../../types/game';
import { getAvailableCrops } from '../../data/farmingCrops';
import { getItemById } from '../../data/items';
import { calculateLevel } from '../../store/gameStore';
import { useGameStore } from '../../store/gameStore';

interface PlantingModalProps {
  isOpen: boolean;
  onClose: () => void;
  patchType: PatchType;
  patchId: string;
  onPlant: (cropId: string) => void;
}

export const PlantingModal: React.FC<PlantingModalProps> = ({
  isOpen,
  onClose,
  patchType,
  patchId,
  onPlant
}) => {
  const { character } = useGameStore();

  if (!character) return null;

  const farmingLevel = calculateLevel(character.skills.farming.experience);
  const availableCrops = getAvailableCrops(patchType, farmingLevel);
  
  // Add all crops of this type (including locked ones) for display
  const allCrops = getAvailableCrops(patchType, 99);

  const canPlantCrop = (crop: FarmingCrop): boolean => {
    if (farmingLevel < crop.levelRequired) return false;
    
    const bankItem = character.bank.find(item => item.id === crop.seedRequirement.itemId);
    return bankItem ? bankItem.quantity >= crop.seedRequirement.quantity : false;
  };

  const getSeedQuantity = (crop: FarmingCrop): number => {
    const bankItem = character.bank.find(item => item.id === crop.seedRequirement.itemId);
    return bankItem ? bankItem.quantity : 0;
  };

  const formatTime = (minutes: number): string => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const getPatchTypeIcon = () => {
    switch (patchType) {
      case 'allotment': return FaLeaf;
      case 'herbs': return FaLeaf;
      case 'trees': return FaLeaf;
      default: return FaLeaf;
    }
  };

  const getPatchTypeColor = () => {
    switch (patchType) {
      case 'allotment': return 'green';
      case 'herbs': return 'purple';
      case 'trees': return 'brown';
      default: return 'gray';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg="gray.800" borderColor="gray.600" borderWidth={2}>
        <ModalHeader color="white">
          <HStack spacing={3}>
            <Icon as={getPatchTypeIcon()} color={`${getPatchTypeColor()}.400`} />
            <VStack align="start" spacing={0}>
              <Text>Plant {patchType.charAt(0).toUpperCase() + patchType.slice(1)}</Text>
              <Text fontSize="sm" color="gray.400">
                Choose a crop to plant in this patch
              </Text>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="white" />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
              {allCrops.map((crop) => {
                const canPlant = canPlantCrop(crop);
                const isLocked = farmingLevel < crop.levelRequired;
                const seedQuantity = getSeedQuantity(crop);
                const seedItem = getItemById(crop.seedRequirement.itemId);
                const rewardItem = getItemById(crop.itemReward.id);

                return (
                  <Box
                    key={crop.id}
                    p={4}
                    border="1px solid"
                    borderColor={isLocked ? "gray.600" : canPlant ? "green.500" : "red.500"}
                    borderRadius="md"
                    bg={isLocked ? "gray.700" : canPlant ? "green.900" : "red.900"}
                    opacity={isLocked ? 0.6 : 1}
                    position="relative"
                  >
                    {isLocked && (
                      <Icon
                        as={FaLock}
                        position="absolute"
                        top={2}
                        right={2}
                        color="gray.400"
                      />
                    )}
                    
                    <VStack spacing={3} align="stretch">
                      {/* Header with crop name and level */}
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold" color="white" fontSize="md">
                            {crop.name}
                          </Text>
                          <Badge
                            colorScheme={isLocked ? "gray" : "blue"}
                            variant="solid"
                            fontSize="xs"
                          >
                            Level {crop.levelRequired}
                          </Badge>
                        </VStack>

                      </HStack>

                      {/* Seed requirement */}
                      <HStack spacing={2}>
                        {seedItem && (
                          <Image
                            src={seedItem.icon}
                            alt={seedItem.name}
                            boxSize="24px"
                            fallbackSrc="/assets/items/placeholder.png"
                          />
                        )}
                        <VStack align="start" spacing={0} flex={1}>
                          <Text fontSize="sm" color="white">
                            {seedItem?.name || 'Unknown Seed'}
                          </Text>
                          <Text fontSize="xs" color={seedQuantity >= crop.seedRequirement.quantity ? "green.300" : "red.300"}>
                            {seedQuantity}/{crop.seedRequirement.quantity} required
                          </Text>
                        </VStack>
                      </HStack>

                      <Divider borderColor="gray.600" />

                      {/* Harvest info */}
                      <VStack spacing={2} align="stretch">
                        <HStack justify="space-between">
                          <HStack spacing={1}>
                            <Icon as={FaClock} color="blue.400" boxSize={3} />
                            <Text fontSize="sm" color="gray.300">
                              Growth Time
                            </Text>
                          </HStack>
                          <Text fontSize="sm" color="white" fontWeight="medium">
                            {formatTime(crop.harvestTime)}
                          </Text>
                        </HStack>

                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.300">
                            Experience
                          </Text>
                          <Text fontSize="sm" color="green.300" fontWeight="medium">
                            {crop.experience} XP
                          </Text>
                        </HStack>

                        {/* Reward item */}
                        <HStack spacing={2}>
                          {rewardItem && (
                            <Image
                              src={rewardItem.icon}
                              alt={rewardItem.name}
                              boxSize="24px"
                              fallbackSrc="/assets/items/placeholder.png"
                            />
                          )}
                          <VStack align="start" spacing={0} flex={1}>
                            <Text fontSize="sm" color="white">
                              {rewardItem?.name || 'Unknown Item'}
                            </Text>
                            <Text fontSize="xs" color="gray.400">
                              x{crop.itemReward.quantity || 1}
                            </Text>
                          </VStack>
                        </HStack>
                      </VStack>

                      {/* Plant button */}
                      <Tooltip
                        label={
                          isLocked
                            ? `Requires level ${crop.levelRequired} Farming`
                            : !canPlant
                            ? `Need ${crop.seedRequirement.quantity} ${seedItem?.name || 'seeds'}`
                            : 'Click to plant this crop'
                        }
                        placement="top"
                      >
                        <Button
                          size="sm"
                          colorScheme={canPlant && !isLocked ? "green" : "gray"}
                          isDisabled={!canPlant || isLocked}
                          onClick={() => {
                            onPlant(crop.id);
                            onClose();
                          }}
                          w="100%"
                        >
                          {isLocked ? 'Locked' : canPlant ? 'Plant' : 'Need Seeds'}
                        </Button>
                      </Tooltip>
                    </VStack>
                  </Box>
                );
              })}
            </SimpleGrid>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose} color="white">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 