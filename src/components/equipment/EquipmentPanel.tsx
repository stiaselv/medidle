import {
  Box,
  Grid,
  Text,
  Tooltip,
  useColorModeValue,
  Image,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Flex,
  GridItem,
  VisuallyHidden,
  keyframes,
  useToken,
} from '@chakra-ui/react';
import { useGameStore } from '../../store/gameStore';
import type { ItemReward, GameState, Character } from '../../types/game';
import { EQUIPMENT_SLOTS, getItemById } from '../../data/items';
import type { KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LoadingState } from '../common/LoadingState';
import { useState } from 'react';

const MotionBox = motion(Box);

const equipAnimation = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
`;

const unequipAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0; }
`;

interface EquipmentSlotProps {
  slot: keyof typeof EQUIPMENT_SLOTS;
  item: ItemReward | null;
  onUnequip?: (slot: string) => void;
  index: number;
  isLoading?: boolean;
}

const EquipmentSlot = ({ slot, item, onUnequip, index, isLoading }: EquipmentSlotProps) => {
  const { character } = useGameStore();
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.200', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const shouldReduceMotion = useReducedMotion();

  const itemData = item ? getItemById(item.id) : null;
  const slotName = EQUIPMENT_SLOTS[slot]?.toLowerCase() || slot.toLowerCase();
  const ariaLabel = itemData 
    ? `${slotName} slot - ${itemData.name} equipped. Press Enter to unequip.`
    : `${slotName} slot - empty`;

  const woodcuttingLevel = character?.skills?.['woodcutting']?.level ?? 0;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (item && onUnequip && !isLoading) {
        onUnequip(EQUIPMENT_SLOTS[slot]);
      }
    }
  };

  if (isLoading) {
    return (
      <VStack spacing={1} align="center">
        <Box
          w="50px"
          h="50px"
          bg={bgColor}
          border="1px"
          borderColor={borderColor}
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          aria-label={`${slotName} slot - loading`}
          role="status"
        >
          <LoadingState size="sm" />
        </Box>
        <Text fontSize="xs" color="gray.500" noOfLines={2} textAlign="center">
          {slot}
        </Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={0.5} align="center">
      <Tooltip 
        label={
          <VStack spacing={2} align="start" minW="200px">
            <Text fontWeight="bold" fontSize="lg">{itemData?.name || slotName}</Text>
            
            {itemData?.level && (
              <HStack spacing={2} color={woodcuttingLevel >= itemData.level ? 'green.200' : 'red.200'}>
                <Text fontWeight="semibold">Required Level:</Text>
                <Text>{itemData.level}</Text>
              </HStack>
            )}

            {itemData?.stats && Object.entries(itemData.stats).length > 0 && (
              <Box w="100%">
                <Text fontWeight="semibold" mb={1} color="blue.200">Item Stats</Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                  {Object.entries(itemData.stats).map(([stat, value]) => (
                    <HStack key={stat} bg="whiteAlpha.100" p={1} borderRadius="md" justify="space-between">
                      <Text fontSize="sm">{stat.charAt(0).toUpperCase() + stat.slice(1)}:</Text>
                      <Text fontSize="sm" color="green.200">+{value}</Text>
                    </HStack>
                  ))}
                </Grid>
              </Box>
            )}

            {itemData?.slot && (
              <HStack spacing={2} color="purple.200">
                <Text fontWeight="semibold">Slot:</Text>
                <Text>{itemData.slot}</Text>
              </HStack>
            )}

            {item && onUnequip && (
              <Text color="blue.200" fontSize="sm" fontStyle="italic">Click to unequip</Text>
            )}
          </VStack>
        }
        hasArrow
        placement="top"
        bg="gray.800"
        color="white"
      >
        <MotionBox
          w="40px"
          h="40px"
          bg={bgColor}
          border="1px"
          borderColor={borderColor}
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor={item ? 'pointer' : 'default'}
          onClick={() => {
            if (item && onUnequip && !isLoading) {
              onUnequip(EQUIPMENT_SLOTS[slot]);
            }
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label={ariaLabel}
          data-slot={slot}
          initial={false}
          animate={item ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.8 }}
          transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 25 }}
          whileHover={item ? { scale: 1.05 } : {}}
          whileTap={item ? { scale: 0.95 } : {}}
          role="button"
        >
          {itemData ? (
            <Image
              src={itemData.icon}
              alt={`${itemData.name} icon`}
              boxSize="32px"
              objectFit="contain"
              fallbackSrc="/assets/items/placeholder.png"
              aria-hidden="true"
              style={{
                animation: shouldReduceMotion ? 'none' : `${equipAnimation} 0.3s ease-out`
              }}
            />
          ) : (
            <Text fontSize="xs" color="gray.500" textAlign="center" aria-hidden="true">
              {slot}
            </Text>
          )}
          <VisuallyHidden>
            {itemData ? `${itemData.name} is equipped in ${slotName} slot` : `Empty ${slotName} slot`}
          </VisuallyHidden>
        </MotionBox>
      </Tooltip>
      <Text 
        fontSize="xs" 
        color="gray.500" 
        noOfLines={2} 
        textAlign="center"
        aria-hidden="true"
      >
        {itemData?.name || slot}
      </Text>
    </VStack>
  );
};

interface GameStoreState extends GameState {
  unequipItem: (slot: string) => Promise<void>;
}

export const EquipmentPanel = () => {
  const { character, unequipItem } = useGameStore() as unknown as GameStoreState;
  const [loadingSlot, setLoadingSlot] = useState<string | null>(null);

  const getEquippedItemForSlot = (slot: keyof typeof EQUIPMENT_SLOTS): ItemReward | null => {
    if (!character) return null;
    
    // Find the item in the equipment object that belongs to this slot
    const equippedItem = Object.entries(character.equipment).find(([_, item]) => {
      if (!item) return false;
      const itemData = getItemById(item.id);
      return itemData?.slot === EQUIPMENT_SLOTS[slot];
    });

    return equippedItem && equippedItem[1] ? {
      id: equippedItem[1].id,
      name: equippedItem[1].name,
      quantity: 1
    } : null;
  };

  const handleUnequip = async (slot: string) => {
    setLoadingSlot(slot);
    try {
      await unequipItem(slot);
    } finally {
      setLoadingSlot(null);
    }
  };

  if (!character) {
    return (
      <Box p={4}>
        <LoadingState message="Loading equipment..." />
      </Box>
    );
  }

  return (
    <Box role="region" aria-label="Equipment slots" display="flex" justifyContent="center" w="100%">
      <Grid
        templateColumns="repeat(4, 1fr)"
        gap={1}
        py={1}
        px={2}
        justifyItems="center"
        alignItems="center"
        role="grid"
        maxW="400px"
      >
        {/* Top row */}
        <GridItem role="gridcell" />
        <EquipmentSlot 
          slot="HEAD" 
          item={getEquippedItemForSlot('HEAD')} 
          onUnequip={handleUnequip} 
          index={1}
          isLoading={loadingSlot === EQUIPMENT_SLOTS.HEAD}
        />
        <GridItem role="gridcell" />
        <GridItem role="gridcell" />

        {/* Second row */}
        <EquipmentSlot 
          slot="CAPE" 
          item={getEquippedItemForSlot('CAPE')} 
          onUnequip={handleUnequip} 
          index={2}
          isLoading={loadingSlot === EQUIPMENT_SLOTS.CAPE}
        />
        <EquipmentSlot 
          slot="NECK" 
          item={getEquippedItemForSlot('NECK')} 
          onUnequip={handleUnequip} 
          index={3}
          isLoading={loadingSlot === EQUIPMENT_SLOTS.NECK}
        />
        <EquipmentSlot 
          slot="TOOL" 
          item={getEquippedItemForSlot('TOOL')} 
          onUnequip={handleUnequip} 
          index={4}
          isLoading={loadingSlot === EQUIPMENT_SLOTS.TOOL}
        />
        <GridItem role="gridcell" />

        {/* Third row */}
        <EquipmentSlot 
          slot="WEAPON" 
          item={getEquippedItemForSlot('WEAPON')} 
          onUnequip={handleUnequip} 
          index={5}
          isLoading={loadingSlot === EQUIPMENT_SLOTS.WEAPON}
        />
        <EquipmentSlot 
          slot="BODY" 
          item={getEquippedItemForSlot('BODY')} 
          onUnequip={handleUnequip} 
          index={6}
          isLoading={loadingSlot === EQUIPMENT_SLOTS.BODY}
        />
        <EquipmentSlot 
          slot="SHIELD" 
          item={getEquippedItemForSlot('SHIELD')} 
          onUnequip={handleUnequip} 
          index={7}
          isLoading={loadingSlot === EQUIPMENT_SLOTS.SHIELD}
        />
        <GridItem role="gridcell" />

        {/* Fourth row */}
        <GridItem role="gridcell" />
        <EquipmentSlot 
          slot="LEGS" 
          item={getEquippedItemForSlot('LEGS')} 
          onUnequip={handleUnequip} 
          index={8}
          isLoading={loadingSlot === EQUIPMENT_SLOTS.LEGS}
        />
        <GridItem role="gridcell" />
        <GridItem role="gridcell" />

        {/* Bottom row */}
        <EquipmentSlot 
          slot="HANDS" 
          item={getEquippedItemForSlot('HANDS')} 
          onUnequip={handleUnequip} 
          index={9}
          isLoading={loadingSlot === EQUIPMENT_SLOTS.HANDS}
        />
        <EquipmentSlot 
          slot="FEET" 
          item={getEquippedItemForSlot('FEET')} 
          onUnequip={handleUnequip} 
          index={10}
          isLoading={loadingSlot === EQUIPMENT_SLOTS.FEET}
        />
        <EquipmentSlot 
          slot="RING" 
          item={getEquippedItemForSlot('RING')} 
          onUnequip={handleUnequip} 
          index={11}
          isLoading={loadingSlot === EQUIPMENT_SLOTS.RING}
        />
        <GridItem role="gridcell" />
      </Grid>
    </Box>
  );
}; 