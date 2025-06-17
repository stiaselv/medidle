import {
  Box,
  Button,
  Flex,
  Grid,
  Image,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
  Badge,
  VisuallyHidden,
  keyframes,
  HStack,
} from '@chakra-ui/react';
import { useState, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { ItemReward, CombatStats, SkillName } from '../../types/game';
import { ITEM_CATEGORIES } from '../../data/items';
import { getItemById, isEquippable, getEquipmentSlot, meetsLevelRequirement, getEquipmentLevelRequirement } from '../../data/items';
import type { KeyboardEvent } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);

const equipAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(0.9); }
  100% { transform: scale(0); }
`;

// Convert ITEM_CATEGORIES object values to array for tabs
const TAB_CATEGORIES = ['All', ...Object.values(ITEM_CATEGORIES)];

interface BankItemProps {
  item: ItemReward;
  isEquipped: boolean;
  onClick?: () => void;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
}

const BankItem = ({ item, isEquipped, onClick, index, moveItem }: BankItemProps) => {
  const { character } = useGameStore();
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.200', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const shouldReduceMotion = useReducedMotion();

  const [{ isDragging }, drag] = useDrag({
    type: 'BANK_ITEM',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<{ index: number }, void, {}>({
    accept: 'BANK_ITEM',
    hover(item: { index: number }) {
      if (item.index === index) {
        return;
      }
      moveItem(item.index, index);
      item.index = index;
    },
  });

  // Get full item data
  const itemData = getItemById(item.id);
  if (!itemData) return null;

  // Check if item can be equipped
  const canEquip = isEquippable(itemData);
  let meetsLevel = true;
  let equipReq: { skill: SkillName, level: number } | null = null;
  if (canEquip && character) {
    equipReq = getEquipmentLevelRequirement(itemData);
    if (equipReq) {
      const charLevel = character.skills?.[equipReq.skill as SkillName]?.level ?? 0;
      meetsLevel = charLevel >= equipReq.level;
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isEquipped && canEquip && meetsLevel) {
      e.preventDefault();
      onClick?.();
    }
  };

  const ariaLabel = `${item.name}, quantity: ${item.quantity}${
    itemData.level ? `, requires level ${itemData.level}` : ''
  }${isEquipped ? ', currently equipped' : ''}${
    canEquip && !isEquipped && meetsLevel ? ', click to equip' : ''
  }. Drag to reorder.`;

  return (
    <Tooltip
      label={
        <VStack spacing={2} align="start" minW="200px">
          <Text fontWeight="bold" fontSize="lg">{item.name}</Text>
          
          <HStack spacing={2}>
            <Text fontWeight="semibold">Quantity:</Text>
            <Text>{item.quantity.toLocaleString()}</Text>
          </HStack>

          {equipReq && (
            <HStack spacing={2} color={meetsLevel ? 'green.200' : 'red.200'}>
              <Text fontWeight="semibold">Required:</Text>
              <Text>{equipReq.skill.charAt(0).toUpperCase() + equipReq.skill.slice(1)} lvl {equipReq.level}</Text>
              <Text>({meetsLevel ? 'Met' : 'Not met'})</Text>
            </HStack>
          )}

          {itemData?.stats && Object.entries(itemData.stats).length > 0 && (
            <Box w="100%">
              <Text fontWeight="semibold" mb={1} color="blue.200">Item Stats</Text>
              {/* Grouped stats */}
              {/* Attack Stats */}
              {['attackStab','attackSlash','attackCrush','attackMagic','attackRanged'].some(stat => stat in itemData.stats!) && (
                <Box mb={1}>
                  <Text fontSize="xs" color="blue.100" fontWeight="bold">Attack</Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                    {['attackStab','attackSlash','attackCrush','attackMagic','attackRanged'].map(stat =>
                      stat in itemData.stats! ? (
                        <HStack key={stat} bg="whiteAlpha.100" p={1} borderRadius="md" justify="space-between">
                          <Text fontSize="sm">{stat.replace('attack','Atk ').replace('Stab','Stb').replace('Slash','Slh').replace('Crush','Crh').replace('Magic','Mag').replace('Ranged','Rng')}</Text>
                          <Text fontSize="sm" color="green.200">+{itemData.stats![stat as keyof typeof itemData.stats]}</Text>
                        </HStack>
                      ) : null
                    )}
                  </Grid>
                </Box>
              )}
              {/* Defence Stats */}
              {['defenceStab','defenceSlash','defenceCrush','defenceMagic','defenceRanged'].some(stat => stat in itemData.stats!) && (
                <Box mb={1}>
                  <Text fontSize="xs" color="blue.100" fontWeight="bold">Defence</Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                    {['defenceStab','defenceSlash','defenceCrush','defenceMagic','defenceRanged'].map(stat =>
                      stat in itemData.stats! ? (
                        <HStack key={stat} bg="whiteAlpha.100" p={1} borderRadius="md" justify="space-between">
                          <Text fontSize="sm">{stat.replace('defence','Def ').replace('Stab','Stb').replace('Slash','Slh').replace('Crush','Crh').replace('Magic','Mag').replace('Ranged','Rng')}</Text>
                          <Text fontSize="sm" color="green.200">+{itemData.stats![stat as keyof typeof itemData.stats]}</Text>
                        </HStack>
                      ) : null
                    )}
                  </Grid>
                </Box>
              )}
              {/* Other Stats */}
              {Object.keys(itemData.stats).some(stat => !['attackStab','attackSlash','attackCrush','attackMagic','attackRanged','defenceStab','defenceSlash','defenceCrush','defenceMagic','defenceRanged'].includes(stat)) && (
                <Box>
                  <Text fontSize="xs" color="blue.100" fontWeight="bold">Other</Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                    {Object.entries(itemData.stats).map(([stat, value]) =>
                      !['attackStab','attackSlash','attackCrush','attackMagic','attackRanged','defenceStab','defenceSlash','defenceCrush','defenceMagic','defenceRanged'].includes(stat) ? (
                        <HStack key={stat} bg="whiteAlpha.100" p={1} borderRadius="md" justify="space-between">
                          <Text fontSize="sm">{stat.charAt(0).toUpperCase() + stat.slice(1)}</Text>
                          <Text fontSize="sm" color="green.200">+{value}</Text>
                        </HStack>
                      ) : null
                    )}
                  </Grid>
                </Box>
              )}
            </Box>
          )}

          {itemData.slot && (
            <HStack spacing={2} color="purple.200">
              <Text fontWeight="semibold">Slot:</Text>
              <Text>{itemData.slot}</Text>
            </HStack>
          )}

          {canEquip && !isEquipped && (
            <Text 
              color={meetsLevel ? 'green.200' : 'red.200'} 
              fontSize="sm" 
              fontStyle="italic"
            >
              {meetsLevel ? 'Click to equip' : 'Level too low to equip'}
            </Text>
          )}
          
          {isEquipped && (
            <Text color="blue.200" fontSize="sm" fontStyle="italic">
              Currently equipped
            </Text>
          )}
        </VStack>
      }
      hasArrow
      placement="top"
      bg="gray.800"
      color="white"
    >
      <MotionBox
        ref={(node: HTMLDivElement | null) => drag(drop(node))}
        bg={bgColor}
        borderRadius="md"
        border="1px"
        borderColor={borderColor}
        p={2}
        cursor={isDragging ? 'grabbing' : 'grab'}
        position="relative"
        opacity={isDragging ? 0.5 : canEquip && !meetsLevel ? 0.6 : 1}
        role={canEquip ? 'button' : 'listitem'}
        tabIndex={canEquip ? 0 : -1}
        aria-label={ariaLabel}
        data-item-id={item.id}
        onClick={!isEquipped ? onClick : undefined}
        onKeyDown={handleKeyDown}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          backgroundColor: bgColor,
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={
          !isDragging && canEquip && meetsLevel && !isEquipped 
            ? { scale: 1.05, backgroundColor: hoverBgColor }
            : {}
        }
        whileTap={
          !isDragging && canEquip && meetsLevel && !isEquipped
            ? { scale: 0.95 }
            : {}
        }
        transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 25 }}
        layout
      >
        {isEquipped && (
          <Badge
            position="absolute"
            top={1}
            right={1}
            colorScheme="blue"
            fontSize="xs"
            borderRadius="full"
            px={2}
            aria-hidden="true"
          >
            Equipped
          </Badge>
        )}
        <Flex direction="column" align="center" gap={1}>
          <Image
            src={itemData.icon}
            alt={`${item.name} icon`}
            boxSize="48px"
            objectFit="contain"
            fallbackSrc="/assets/items/placeholder.png"
            aria-hidden="true"
            style={{
              animation: shouldReduceMotion ? 'none' : isEquipped ? `${equipAnimation} 0.3s ease-out` : undefined
            }}
          />
          <Text fontSize="sm" fontWeight="medium" textAlign="center" noOfLines={2} aria-hidden="true">
            {item.name}
          </Text>
          <Text fontSize="xs" color="gray.500" aria-hidden="true">
            x{item.quantity.toLocaleString()}
          </Text>
        </Flex>
        <VisuallyHidden>
          {`${item.name}, quantity: ${item.quantity.toLocaleString()}${
            isEquipped ? ', currently equipped' : ''
          }${canEquip && !isEquipped && meetsLevel ? '. Press Enter to equip' : ''}`}
        </VisuallyHidden>
      </MotionBox>
    </Tooltip>
  );
};

export const BankPanel = () => {
  const { character, equipItem, addItemToBank, updateBankOrder } = useGameStore() as any;
  const [selectedItem, setSelectedItem] = useState<ItemReward | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    if (!character?.bank) return;
    const dragItem: ItemReward = character.bank[dragIndex];
    const newBank: ItemReward[] = [...character.bank];
    newBank.splice(dragIndex, 1);
    newBank.splice(hoverIndex, 0, dragItem);
    updateBankOrder(newBank);
  }, [character?.bank, updateBankOrder]);

  if (!character) return null;

  const handleItemClick = (item: ItemReward) => {
    if (!item || typeof item !== 'object' || !('id' in item)) return;
    const itemData = getItemById(item.id);
    if (!itemData) return;

    const canEquip = isEquippable(itemData);
    let meetsLevel = true;
    let equipReq: { skill: SkillName, level: number } | null = null;
    if (canEquip && character) {
      equipReq = getEquipmentLevelRequirement(itemData);
      if (equipReq) {
        const charLevel = character.skills?.[equipReq.skill as SkillName]?.level ?? 0;
        meetsLevel = charLevel >= equipReq.level;
      }
    }

    if (canEquip && meetsLevel) {
      equipItem(itemData);
    }
  };

  // Check if an item is currently equipped
  const isItemEquipped = (itemId: string) => {
    return Object.values(character.equipment).some(equippedItem => equippedItem?.id === itemId);
  };

  const filteredItems = (character?.bank ?? []).filter(item => {
    const itemData = getItemById(item.id);
    if (!itemData) return false;

    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || itemData.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
      <Flex direction="column" h="100%" gap={4} p={4} role="region" aria-label="Bank inventory">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="bold" as="h2">
            Bank
          </Text>
          <Text color="gray.500" aria-live="polite">
            {character.bank.length} items
          </Text>
        </Flex>

        {/* Search bar */}
        <Input
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          bg="whiteAlpha.100"
          _hover={{ bg: 'whiteAlpha.200' }}
          _focus={{ bg: 'whiteAlpha.200', borderColor: 'blue.500' }}
          borderRadius="md"
          aria-label="Search bank items"
        />

        {/* Bank content */}
        <Tabs variant="soft-rounded" colorScheme="blue" flex={1}>
          <TabList overflowX="auto" overflowY="hidden" py={2} role="tablist" aria-label="Item categories">
            {TAB_CATEGORIES.map(category => (
              <Tab
                key={category}
                onClick={() => setSelectedCategory(category)}
                _selected={{ bg: 'blue.500', color: 'white' }}
                whiteSpace="nowrap"
                minW="auto"
                role="tab"
                aria-selected={selectedCategory === category}
              >
                {category}
              </Tab>
            ))}
          </TabList>

          <TabPanels flex={1} overflow="auto">
            <TabPanel p={0} role="tabpanel">
              <AnimatePresence mode="popLayout">
                {filteredItems.length === 0 ? (
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    h="100%"
                    minH="200px"
                    color="gray.500"
                    bg="whiteAlpha.50"
                    borderRadius="md"
                    p={8}
                    role="status"
                    aria-live="polite"
                  >
                    <Text fontSize="lg">
                      {searchTerm
                        ? 'No items match your search'
                        : character.bank.length === 0
                        ? 'Your bank is empty'
                        : 'No items in this category'}
                    </Text>
                    {searchTerm && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSearchTerm('')}
                        mt={2}
                        aria-label="Clear search"
                      >
                        Clear Search
                      </Button>
                    )}
                  </Flex>
                ) : (
                  <MotionGrid
                    templateColumns="repeat(auto-fill, minmax(100px, 1fr))"
                    gap={3}
                    p={2}
                    role="list"
                    aria-label="Bank items"
                    layout
                  >
                    {filteredItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <BankItem
                          item={item}
                          isEquipped={isItemEquipped(item.id)}
                          onClick={() => handleItemClick(item)}
                          index={index}
                          moveItem={moveItem}
                        />
                      </motion.div>
                    ))}
                  </MotionGrid>
                )}
              </AnimatePresence>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
  );
}; 