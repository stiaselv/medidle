import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Flex,
  useColorModeValue,
  Tooltip,
  Button,
  useToast,
  SimpleGrid,
  Divider,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaPlus, FaArrowUp, FaHeart, FaShieldAlt, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import type { ItemReward, BankTab } from '../../types/game';
import { getItemById, isEquippable } from '../../data/items';
import { ItemIcon } from '../ui/ItemIcon';

const MotionBox = motion(Box);

interface ItemSlotProps {
  item?: ItemReward;
  index: number;
  tabId: string;
  moveItem: (fromTabId: string, fromIndex: number, toTabId: string, toIndex: number) => void;
  onClick?: () => void;
}

const ItemSlot: React.FC<ItemSlotProps> = ({ item, index, tabId, moveItem, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'BANK_ITEM',
    item: item ? { item, tabId, index } : null,
    canDrag: !!item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'BANK_ITEM',
    drop: (draggedItem: { item: ItemReward; tabId: string; index: number }) => {
      if (draggedItem.tabId !== tabId || draggedItem.index !== index) {
        moveItem(draggedItem.tabId, draggedItem.index, tabId, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const borderColor = isOver ? 'blue.500' : useColorModeValue('gray.200', 'gray.600');
  const itemData = item ? getItemById(item.id) : null;

  const getItemTooltip = () => {
    if (!item || !itemData) return '';

    const sections = [
      // Item Name
      itemData.name,
      
      // Quantity
      `Quantity: ${item.quantity.toLocaleString()}`,

      // Item Type and Category
      `Type: ${itemData.type}`,
      itemData.category ? `Category: ${itemData.category}` : null,

      // Level requirement
      itemData.level ? `Level Required: ${itemData.level}` : null,

      // Equipment slot
      itemData.slot ? `Equipment Slot: ${itemData.slot}` : null,

      // Stats if they exist
      itemData.stats && Object.entries(itemData.stats).length > 0 ? 
        ['Stats:'].concat(
          Object.entries(itemData.stats)
            .map(([stat, value]) => `  ${stat.charAt(0).toUpperCase() + stat.slice(1)}: +${value}`)
        ).join('\n') : 
        null,

      // Prices
      itemData.buyPrice ? `Buy Price: ${itemData.buyPrice.toLocaleString()} coins` : null,
      itemData.sellPrice ? `Sell Price: ${itemData.sellPrice.toLocaleString()} coins` : null,

      // Healing amount for consumables
      itemData.healing ? `Heals: ${itemData.healing} HP` : null,
    ].filter(Boolean).join('\n');

    return sections;
  };

  const itemSlot = (
    <Box
      ref={(node) => drag(drop(node))}
      opacity={isDragging ? 0.5 : 1}
    >
      <ItemIcon
        item={item || ''}
        size={48}
        onClick={onClick}
        borderColor={borderColor}
        showQuantity={true}
      />
    </Box>
  );

  if (item && itemData) {
    return (
      <Tooltip
        label={getItemTooltip()}
        placement="top"
        hasArrow
        bg="gray.800"
        color="white"
        p={3}
        borderRadius="md"
        whiteSpace="pre-line"
        fontSize="sm"
      >
        {itemSlot}
      </Tooltip>
    );
  }

  return itemSlot;
};

const ItemDetailsPanel: React.FC<{
  item: ItemReward | null;
  onClose: () => void;
  onSell: (id: string, quantity: number) => void;
  onEat?: (id: string) => void;
  onEquip?: (id: string) => void;
}> = ({ item, onClose, onSell, onEat, onEquip }) => {
  const [sellQuantity, setSellQuantity] = useState(1);
  const toast = useToast();

  if (!item) return null;

  const itemData = getItemById(item.id);
  if (!itemData) return null;

  const maxQuantity = item.quantity;
  const isFood = itemData.healing && itemData.healing > 0;
  const canEquip = isEquippable(itemData);
  const canUpgrade = false; // TODO: Implement upgrade logic

  const handleSell = () => {
    if (sellQuantity > 0 && sellQuantity <= maxQuantity) {
      onSell(item.id, sellQuantity);
      toast({
        title: 'Item Sold',
        description: `Sold ${sellQuantity}x ${itemData.name}`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      onClose();
    }
  };

  const handleEat = () => {
    if (onEat && isFood) {
      onEat(item.id);
      toast({
        title: 'Food Consumed',
        description: `Ate ${itemData.name} (+${itemData.healing} HP)`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleEquip = () => {
    if (onEquip && canEquip) {
      onEquip(item.id);
      toast({
        title: 'Item Equipped',
        description: `Equipped ${itemData.name}`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      onClose();
    }
  };

  return (
    <Box
      position="fixed"
      right={4}
      top="50%"
      transform="translateY(-50%)"
      w="300px"
      bg="rgba(24,24,24,0.95)"
      backdropFilter="blur(12px)"
      borderRadius="xl"
      p={6}
      boxShadow="2xl"
      borderWidth={1}
      borderColor="rgba(255,255,255,0.1)"
      zIndex={1000}
    >
      <VStack spacing={4} align="stretch">
        {/* Item Icon */}
        <Flex justify="center">
          <ItemIcon
            item={item}
            size={64}
            showQuantity={false}
            disableHover={true}
          />
        </Flex>

        {/* Item Info */}
        <VStack spacing={2} align="stretch">
          <Text fontSize="lg" fontWeight="bold" textAlign="center" color="white">
            {itemData.name}
          </Text>
          <Text fontSize="sm" color="gray.300" textAlign="center">
            Quantity: {item.quantity.toLocaleString()}
          </Text>
        </VStack>

        <Divider borderColor="rgba(255,255,255,0.2)" />

        {/* Action Buttons */}
        <VStack spacing={3} align="stretch">
          {canUpgrade && (
            <Button
              leftIcon={<FaArrowUp />}
              colorScheme="blue"
              variant="solid"
            >
              Upgrade
            </Button>
          )}

          {isFood && onEat && (
            <Button
              leftIcon={<FaHeart />}
              colorScheme="green"
              variant="solid"
              onClick={handleEat}
            >
              Eat (+{itemData.healing} HP)
            </Button>
          )}

          {canEquip && onEquip && (
            <Button
              leftIcon={<FaShieldAlt />}
              colorScheme="purple"
              variant="solid"
              onClick={handleEquip}
            >
              Equip
            </Button>
          )}

          {/* Sell Section */}
          <VStack spacing={2} align="stretch">
            <Text fontSize="sm" color="gray.300">
              Sell for {itemData.sellPrice || 0} coins each
            </Text>
            
            <Slider
              value={sellQuantity}
              onChange={setSellQuantity}
              min={1}
              max={maxQuantity}
              step={1}
            >
              <SliderTrack bg="gray.600">
                <SliderFilledTrack bg="yellow.400" />
              </SliderTrack>
              <SliderThumb bg="yellow.400" />
            </Slider>

            <HStack spacing={2}>
              <NumberInput
                value={sellQuantity}
                onChange={(_, value) => setSellQuantity(isNaN(value) ? 1 : value)}
                min={1}
                max={maxQuantity}
                size="sm"
                flex={1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text fontSize="sm" color="gray.300" minW="60px">
                / {maxQuantity}
              </Text>
            </HStack>

            <Button
              colorScheme="yellow"
              variant="solid"
              onClick={handleSell}
              isDisabled={sellQuantity <= 0 || sellQuantity > maxQuantity}
            >
              Sell {sellQuantity}x {itemData.name}
            </Button>
          </VStack>
        </VStack>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          color="gray.400"
          _hover={{ color: 'white' }}
        >
          Close
        </Button>
      </VStack>
    </Box>
  );
};

interface BankTabButtonProps {
  tab: BankTab;
  isActive: boolean;
  onSelect: () => void;
  onDrop?: (draggedItem: { item: ItemReward; tabId: string; index: number }) => void;
}

const BankTabButton: React.FC<BankTabButtonProps> = ({ 
  tab, 
  isActive, 
  onSelect, 
  onDrop 
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'BANK_ITEM',
    drop: (item: { item: ItemReward; tabId: string; index: number }) => {
      if (onDrop) {
        onDrop(item);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  if (tab.id === 'new_tab') {
    return (
      <Box
        ref={drop}
        w="48px"
        h="48px"
        bg={isOver ? 'green.500' : useColorModeValue('gray.100', 'gray.600')}
        border="2px dashed"
        borderColor={isOver ? 'green.300' : useColorModeValue('gray.300', 'gray.500')}
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        _hover={{
          borderColor: 'green.400',
          bg: useColorModeValue('gray.200', 'gray.500'),
        }}
        onClick={onSelect}
      >
        <FaPlus size={14} color={useColorModeValue('gray.600', 'gray.300')} />
      </Box>
    );
  }

  const firstItem = tab.items[0];

  return (
    <VStack spacing={1}>
      <Box
        ref={drop}
        w="48px"
        h="48px"
        bg={isOver ? 'green.400' : isActive ? 'blue.500' : useColorModeValue('gray.100', 'gray.600')}
        border="2px solid"
        borderColor={isOver ? 'green.300' : isActive ? 'blue.400' : useColorModeValue('gray.200', 'gray.500')}
        borderRadius="md"
        position="relative"
        cursor="pointer"
        onClick={onSelect}
        _hover={{
          borderColor: isActive ? 'blue.300' : 'blue.400',
        }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {firstItem ? (
          <ItemIcon
            item={firstItem}
            size={36}
            showQuantity={false}
            disableHover={true}
          />
        ) : (
          <Text fontSize="xs" color="gray.500" textAlign="center">
            Empty
          </Text>
        )}
      </Box>
      <Text fontSize="xs" textAlign="center" maxW="48px" noOfLines={1}>
        {tab.name}
      </Text>
    </VStack>
  );
};

export const BankPanel = () => {
  const {
    character,
    bankTabs,
    activeBankTab,
    setBankTab,
    moveBankItem,
    createBankTab,
    deleteBankTab,
    sellItem,
    equipItem
  } = useGameStore();

  const [selectedItem, setSelectedItem] = useState<ItemReward | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  if (!character) return null;

  // Filter bank tabs and items based on search term
  const filteredBankData = useMemo(() => {
    if (!searchTerm.trim()) {
      return {
        tabs: bankTabs,
        activeTab: bankTabs.find(tab => tab.id === activeBankTab) || bankTabs[0]
      };
    }

    const searchLower = searchTerm.toLowerCase();
    
    // Filter items within each tab
    const filteredTabs = bankTabs.map(tab => ({
      ...tab,
      items: tab.items.filter(item => {
        const itemData = getItemById(item.id);
        return itemData?.name.toLowerCase().includes(searchLower);
      })
    })).filter(tab => tab.items.length > 0); // Only show tabs with matching items

    // Find the active tab from filtered tabs, or default to first filtered tab
    const activeTab = filteredTabs.find(tab => tab.id === activeBankTab) || filteredTabs[0];

    return {
      tabs: filteredTabs,
      activeTab
    };
  }, [bankTabs, activeBankTab, searchTerm]);

  const { tabs: displayTabs, activeTab } = filteredBankData;
  
  const totalSlots = 28;
  const emptySlots = Array(Math.max(0, totalSlots - activeTab.items.length)).fill(null);

  const moveItem = useCallback((fromTabId: string, fromIndex: number, toTabId: string, toIndex: number) => {
    moveBankItem(fromTabId, fromIndex, toTabId, toIndex);
  }, [moveBankItem]);

  const createNewTab = useCallback((draggedItem: { item: ItemReward; tabId: string; index: number }) => {
    const newTabId = `tab_${Date.now()}`;
    createBankTab(newTabId, `Tab ${bankTabs.length}`);
    
    // Move the item to the new tab after a short delay to ensure tab is created
    setTimeout(() => {
      const currentState = useGameStore.getState();
      const newTab = currentState.bankTabs.find(tab => tab.id === newTabId);
      if (newTab) {
        moveBankItem(draggedItem.tabId, draggedItem.index, newTabId, 0);
      }
    }, 10);
  }, [createBankTab, moveBankItem, bankTabs.length]);

  const moveToExistingTab = useCallback((draggedItem: { item: ItemReward; tabId: string; index: number }, targetTabId: string) => {
    const targetTab = bankTabs.find(tab => tab.id === targetTabId);
    if (targetTab) {
      const newIndex = targetTab.items.length;
      moveBankItem(draggedItem.tabId, draggedItem.index, targetTabId, newIndex);
      
      // Auto-delete source tab if it becomes empty (except main tab)
      setTimeout(() => {
        const currentState = useGameStore.getState();
        const sourceTab = currentState.bankTabs.find(tab => tab.id === draggedItem.tabId);
        if (sourceTab && sourceTab.items.length === 0 && sourceTab.id !== 'main') {
          deleteBankTab(draggedItem.tabId);
        }
      }, 10);
    }
  }, [bankTabs, moveBankItem, deleteBankTab]);

  const handleItemClick = (item: ItemReward) => {
    setSelectedItem(selectedItem?.id === item.id ? null : item);
  };

  const handleSell = (id: string, quantity: number) => {
    sellItem(id, quantity);
  };

  const handleEat = (id: string) => {
    const itemData = getItemById(id);
    if (itemData?.healing) {
      // TODO: Implement consume functionality
      toast({
        title: 'Food Consumed',
        description: `Ate ${itemData.name} (+${itemData.healing} HP)`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleEquip = (id: string) => {
    const itemData = getItemById(id);
    if (itemData && isEquippable(itemData)) {
      equipItem(itemData);
      setSelectedItem(null); // Close panel after equipping
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box position="relative" w="100%" h="450px">
        <VStack spacing={4} align="stretch" h="100%">
          {/* Search Bar */}
          <InputGroup size="sm">
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={useColorModeValue('white', 'gray.700')}
              borderColor={useColorModeValue('gray.300', 'gray.600')}
              _hover={{
                borderColor: useColorModeValue('gray.400', 'gray.500'),
              }}
              _focus={{
                borderColor: 'blue.400',
                boxShadow: '0 0 0 1px blue.400',
              }}
            />
          </InputGroup>

          {/* Bank Tabs */}
          <HStack spacing={2} justify="flex-start" wrap="wrap">
            {displayTabs.map((tab) => (
              <BankTabButton
                key={tab.id}
                tab={tab}
                isActive={tab.id === activeBankTab}
                onSelect={() => setBankTab(tab.id)}
                onDrop={(draggedItem) => moveToExistingTab(draggedItem, tab.id)}
              />
            ))}
            {!searchTerm && (
              <BankTabButton
                tab={{ id: 'new_tab', name: 'New', items: [] }}
                isActive={false}
                onSelect={() => {}}
                onDrop={createNewTab}
              />
            )}
          </HStack>

          <Divider borderColor="rgba(255,255,255,0.2)" />

          {/* Bank Grid */}
          {activeTab ? (
            <SimpleGrid columns={8} spacingX={0.5} spacingY={2} flex={1} overflow="auto">
              {activeTab.items.map((item, index) => (
                <ItemSlot
                  key={`${item.id}-${index}`}
                  item={item}
                  index={index}
                  tabId={activeBankTab}
                  moveItem={moveItem}
                  onClick={() => handleItemClick(item)}
                />
              ))}
              {!searchTerm && emptySlots.map((_, index) => (
                <ItemSlot
                  key={`empty-${index}`}
                  index={activeTab.items.length + index}
                  tabId={activeBankTab}
                  moveItem={moveItem}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Flex flex={1} align="center" justify="center">
              <Text color="gray.500" fontSize="md">
                No items found matching "{searchTerm}"
              </Text>
            </Flex>
          )}

          {/* Tab Info */}
          <HStack justify="space-between" color="gray.400" fontSize="xs">
            {activeTab ? (
              <Text>
                Tab: {activeTab.name} ({activeTab.items.length}/{searchTerm ? activeTab.items.length : totalSlots} items)
                {searchTerm && (
                  <Text as="span" color="blue.400" ml={2}>
                    (filtered)
                  </Text>
                )}
              </Text>
            ) : (
              <Text>No matching items</Text>
            )}
            <Text>
              Total items: {searchTerm ? 
                displayTabs.reduce((sum, tab) => sum + tab.items.length, 0) :
                bankTabs.reduce((sum, tab) => sum + tab.items.length, 0)
              }
            </Text>
          </HStack>
        </VStack>

        {/* Item Details Panel */}
        {selectedItem && (
          <ItemDetailsPanel
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onSell={handleSell}
            onEat={handleEat}
            onEquip={handleEquip}
          />
        )}
      </Box>
    </DndProvider>
  );
}; 