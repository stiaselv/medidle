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
} from '@chakra-ui/react';
import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { ItemReward } from '../../types/game';
import { ITEM_CATEGORIES } from '../../data/items';
import { getItemById, isEquippable, getEquipmentSlot, meetsLevelRequirement } from '../../data/items';
import type { KeyboardEvent } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';

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
}

const BankItem = ({ item, isEquipped, onClick, index }: BankItemProps) => {
  const { character } = useGameStore();
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.200', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const shouldReduceMotion = useReducedMotion();

  // Get full item data
  const itemData = getItemById(item.id);
  if (!itemData) return null;

  // Check if item can be equipped
  const canEquip = isEquippable(itemData) && character?.skills?.['woodcutting']?.level;
  const meetsLevel = canEquip && character ? meetsLevelRequirement(itemData, character.skills['woodcutting'].level) : false;

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
  }`;

  return (
    <Tooltip
      label={
        <VStack spacing={1} align="start">
          <Text fontWeight="bold">{item.name}</Text>
          <Text>Quantity: {item.quantity.toLocaleString()}</Text>
          {itemData.level && (
            <Text color={meetsLevel ? 'green.200' : 'red.200'}>
              Required Level: {itemData.level}
            </Text>
          )}
          {itemData.stats && (
            <Text>
              Stats: {Object.entries(itemData.stats)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ')}
            </Text>
          )}
          {canEquip && !isEquipped && (
            <Text color={meetsLevel ? 'green.200' : 'red.200'}>
              {meetsLevel ? 'Click to equip' : 'Level too low to equip'}
            </Text>
          )}
          {isEquipped && (
            <Text color="blue.200">Currently equipped</Text>
          )}
        </VStack>
      }
      hasArrow
      placement="top"
    >
      <MotionBox
        bg={bgColor}
        borderRadius="md"
        border="1px"
        borderColor={borderColor}
        p={2}
        cursor={canEquip && meetsLevel && !isEquipped ? 'pointer' : 'default'}
        position="relative"
        opacity={canEquip && !meetsLevel ? 0.6 : 1}
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
          canEquip && meetsLevel && !isEquipped 
            ? { scale: 1.05, backgroundColor: hoverBgColor }
            : {}
        }
        whileTap={
          canEquip && meetsLevel && !isEquipped
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
  const { character, equipItem, addItemToBank } = useGameStore();
  const [selectedItem, setSelectedItem] = useState<BankItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!character) return null;

  const handleItemClick = (item: ItemReward) => {
    const itemData = getItemById(item.id);
    if (!itemData) return;

    const canEquip = isEquippable(itemData) && character.skills?.['woodcutting']?.level;
    const meetsLevel = canEquip && meetsLevelRequirement(itemData, character.skills['woodcutting'].level);

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