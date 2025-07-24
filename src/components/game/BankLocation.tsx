import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Grid,
  Flex,
  Image,
  useColorModeValue,
  Tooltip,
  Badge,
  Button,
  IconButton,
  useToast,
  Tab,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
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
import { FaPlus, FaTimes, FaArrowUp, FaHeart, FaShieldAlt, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import type { ItemReward, BankTab } from '../../types/game';
import { getItemById, isEquippable } from '../../data/items';
import { ItemIcon } from '../ui/ItemIcon';
import bankBg from '../../assets/BG/bank.webp';

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
        size={56}
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

interface ItemDetailsPanelProps {
  item: ItemReward | null;
  onClose: () => void;
  onSell: (quantity: number) => void;
  onEat?: () => void;
  onUpgrade?: () => void;
  onEquip?: () => void;
}

const ItemDetailsPanel: React.FC<ItemDetailsPanelProps> = ({ item, onClose, onSell, onEat, onUpgrade, onEquip }) => {
  const [sellQuantity, setSellQuantity] = useState(1);
  const toast = useToast();

  if (!item) return null;

  const itemData = getItemById(item.id);
  if (!itemData) return null;

  const maxQuantity = item.quantity;

  // Reset sell quantity when item changes or when max quantity changes
  React.useEffect(() => {
    setSellQuantity(Math.min(sellQuantity, maxQuantity));
  }, [item.id, maxQuantity, sellQuantity]);
  const isFood = itemData.type === 'consumable' && itemData.healing;
  const canEquip = isEquippable(itemData);
  const canUpgrade = false; // TODO: Implement upgrade logic later
  const sellPrice = itemData.sellPrice || 0;
  const totalSellValue = sellPrice * sellQuantity;

  const handleSell = () => {
    if (sellQuantity > 0 && sellQuantity <= maxQuantity) {
      onSell(sellQuantity);
      setSellQuantity(Math.min(sellQuantity, maxQuantity - sellQuantity));
      toast({
        title: 'Item sold',
        description: `Sold ${sellQuantity}x ${itemData.name} for ${totalSellValue.toLocaleString()} coins`,
        status: 'success',
        duration: 2000,
      });
    }
  };

  const handleEat = () => {
    if (onEat && isFood) {
      onEat();
      toast({
        title: 'Food consumed',
        description: `Ate ${itemData.name} and restored ${itemData.healing} HP`,
        status: 'success',
        duration: 2000,
      });
    }
  };

  const handleEquip = () => {
    if (onEquip && canEquip) {
      onEquip();
      toast({
        title: 'Item equipped',
        description: `Equipped ${itemData.name}`,
        status: 'success',
        duration: 2000,
      });
    }
  };

  return (
    <Box
      position="fixed"
      right={4}
      top="50%"
      transform="translateY(-50%)"
      w="320px"
      bg={useColorModeValue('white', 'gray.800')}
      border="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
      borderRadius="lg"
      p={4}
      shadow="xl"
      zIndex={1000}
    >
      <VStack spacing={4} align="stretch">
        {/* Header with close button */}
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="bold">
            Item Details
          </Text>
          <IconButton
            aria-label="Close panel"
            icon={<FaTimes />}
            size="sm"
            variant="ghost"
            onClick={onClose}
          />
        </HStack>

        {/* Item Icon and Name */}
        <VStack spacing={2}>
          <ItemIcon
            item={item}
            size={80}
            showQuantity={false}
            disableHover={true}
          />
          <Text fontSize="xl" fontWeight="bold" textAlign="center">
            {itemData.name}
          </Text>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Quantity: {item.quantity.toLocaleString()}
          </Text>
        </VStack>

        <Divider />

        {/* Upgrade Section */}
        {canUpgrade && (
          <>
            <VStack spacing={2} align="stretch">
              <Text fontSize="md" fontWeight="semibold">
                Upgrade Item
              </Text>
              <Button
                leftIcon={<FaArrowUp />}
                colorScheme="blue"
                onClick={onUpgrade}
              >
                Upgrade
              </Button>
            </VStack>
            <Divider />
          </>
        )}

        {/* Eat Section for Food */}
        {isFood && (
          <>
            <VStack spacing={2} align="stretch">
              <Text fontSize="md" fontWeight="semibold">
                Consume
              </Text>
              <Text fontSize="sm" color="gray.500">
                Heals {itemData.healing} HP
              </Text>
              <Button
                leftIcon={<FaHeart />}
                colorScheme="green"
                onClick={handleEat}
              >
                Eat
              </Button>
            </VStack>
            <Divider />
          </>
        )}

        {/* Equip Section for Equipment */}
        {canEquip && (
          <>
            <VStack spacing={2} align="stretch">
              <Text fontSize="md" fontWeight="semibold">
                Equipment
              </Text>
              <Text fontSize="sm" color="gray.500">
                Equip this item
              </Text>
              <Button
                leftIcon={<FaShieldAlt />}
                colorScheme="purple"
                onClick={handleEquip}
              >
                Equip
              </Button>
            </VStack>
            <Divider />
          </>
        )}

        {/* Sell Section */}
        {sellPrice > 0 && (
          <VStack spacing={3} align="stretch">
            <Text fontSize="md" fontWeight="semibold">
              Sell Items
            </Text>
            
            <VStack spacing={2}>
              <HStack justify="space-between" w="100%">
                <Text fontSize="sm">Quantity:</Text>
                <NumberInput
                  value={sellQuantity}
                  onChange={(_, value) => setSellQuantity(isNaN(value) ? 1 : Math.max(1, Math.min(value, maxQuantity)))}
                  min={1}
                  max={maxQuantity}
                  w="80px"
                  size="sm"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </HStack>

              <Box w="100%">
                <Slider
                  value={sellQuantity}
                  onChange={(value) => setSellQuantity(value)}
                  min={1}
                  max={maxQuantity}
                  step={1}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Box>

              <HStack justify="space-between" w="100%">
                <Text fontSize="sm" color="gray.500">
                  Unit price: {sellPrice.toLocaleString()} coins
                </Text>
                <Text fontSize="sm" fontWeight="bold">
                  Total: {totalSellValue.toLocaleString()} coins
                </Text>
              </HStack>

              <Button
                colorScheme="yellow"
                onClick={handleSell}
                isDisabled={sellQuantity <= 0 || sellQuantity > maxQuantity}
                w="100%"
              >
                Sell {sellQuantity}x {itemData.name}
              </Button>
            </VStack>
          </VStack>
        )}
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
        // Handle both new tab creation and moving to existing tabs
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
        w="56px"
        h="56px"
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
        <FaPlus size={16} color={useColorModeValue('gray.600', 'gray.300')} />
      </Box>
    );
  }

  const firstItem = tab.items[0];
  const firstItemData = firstItem ? getItemById(firstItem.id) : null;

  return (
    <VStack spacing={1}>
      <Box
        ref={drop}
        w="56px"
        h="56px"
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
            size={44}
            showQuantity={false}
            disableHover={true}
          />
        ) : (
          <Text fontSize="xs" color="gray.500" textAlign="center">
            Empty
          </Text>
        )}
      </Box>
      <Text fontSize="xs" textAlign="center" maxW="56px" noOfLines={1}>
        {tab.name}
      </Text>
    </VStack>
  );
};

export const BankLocation: React.FC = () => {
  const {
    character,
    bankTabs,
    activeBankTab,
    createBankTab,
    deleteBankTab,
    setBankTab,
    moveBankItem,
    sellItem,
    equipItem
  } = useGameStore();
  const toast = useToast();
  
  const [selectedItem, setSelectedItem] = useState<ItemReward | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const moveItem = useCallback((fromTabId: string, fromIndex: number, toTabId: string, toIndex: number) => {
    moveBankItem(fromTabId, fromIndex, toTabId, toIndex);
    
    // Auto-delete empty tabs when moving between different tabs
    if (fromTabId !== toTabId) {
      setTimeout(() => {
        const updatedState = useGameStore.getState();
        const sourceTab = updatedState.bankTabs.find(tab => tab.id === fromTabId);
        if (sourceTab && sourceTab.items.length === 0 && sourceTab.id !== 'main') {
          deleteBankTab(sourceTab.id);
          toast({
            title: 'Empty tab removed',
            description: `${sourceTab.name} was automatically deleted`,
            status: 'info',
            duration: 1500,
          });
        }
      }, 50);
    }
  }, [moveBankItem, deleteBankTab, toast]);

  const createNewTab = useCallback((draggedItem?: { item: ItemReward; tabId: string; index: number }) => {
    const name = `Tab ${bankTabs.length}`;
    
    if (draggedItem) {
      // Store the current bankTabs length to access the new tab after creation
      const currentTabCount = bankTabs.length;
      
      // Create empty tab first
      createBankTab(name);
      
      // Move the item to the new tab after a brief delay
      setTimeout(() => {
        // Get the updated tabs from the store and find the new tab (last one)
        const storeState = useGameStore.getState();
        const newTab = storeState.bankTabs[currentTabCount]; // The new tab should be at this index
        
        if (newTab) {
          moveBankItem(draggedItem.tabId, draggedItem.index, newTab.id, 0);
          
          // Check if source tab is now empty and should be deleted (except main tab)
          setTimeout(() => {
            const updatedState = useGameStore.getState();
            const sourceTab = updatedState.bankTabs.find(tab => tab.id === draggedItem.tabId);
            if (sourceTab && sourceTab.items.length === 0 && sourceTab.id !== 'main') {
              deleteBankTab(sourceTab.id);
              toast({
                title: 'Empty tab removed',
                description: `${sourceTab.name} was automatically deleted`,
                status: 'info',
                duration: 1500,
              });
            }
          }, 50);
        }
      }, 10);
      
      toast({
        title: 'New tab created',
        description: `Created new tab with ${draggedItem.item.name}`,
        status: 'success',
        duration: 2000,
      });
    } else {
      // Just create an empty tab when clicked
      createBankTab(name);
    }
  }, [bankTabs.length, createBankTab, moveBankItem, toast]);

  const moveToExistingTab = useCallback((tabId: string, draggedItem: { item: ItemReward; tabId: string; index: number }) => {
    // Don't move if it's the same tab
    if (draggedItem.tabId === tabId) {
      return;
    }

    // Move item to the end of the target tab
    const targetTab = bankTabs.find(tab => tab.id === tabId);
    if (targetTab) {
      moveBankItem(draggedItem.tabId, draggedItem.index, tabId, targetTab.items.length);
      
      // Check if source tab is now empty and should be deleted (except main tab)
      setTimeout(() => {
        const sourceTab = bankTabs.find(tab => tab.id === draggedItem.tabId);
        if (sourceTab && sourceTab.items.length === 0 && sourceTab.id !== 'main') {
          deleteBankTab(sourceTab.id);
          toast({
            title: 'Empty tab removed',
            description: `${sourceTab.name} was automatically deleted`,
            status: 'info',
            duration: 1500,
          });
        }
      }, 100);
      
      toast({
        title: 'Item moved',
        description: `Moved ${draggedItem.item.name} to ${targetTab.name}`,
        status: 'info',
        duration: 1500,
      });
    }
  }, [bankTabs, moveBankItem, deleteBankTab, toast]);

  const handleTabDrop = useCallback((tab: BankTab, draggedItem: { item: ItemReward; tabId: string; index: number }) => {
    if (tab.id === 'new_tab') {
      createNewTab(draggedItem);
    } else {
      moveToExistingTab(tab.id, draggedItem);
    }
  }, [createNewTab, moveToExistingTab]);



  const handleItemClick = useCallback((item: ItemReward) => {
    setSelectedItem(item);
  }, []);

  const handleSellItem = useCallback((quantity: number) => {
    if (selectedItem) {
      sellItem(selectedItem.id, quantity);
      // Update selected item quantity or close panel if all sold
      if (quantity >= selectedItem.quantity) {
        setSelectedItem(null);
      } else {
        setSelectedItem(prev => prev ? { ...prev, quantity: prev.quantity - quantity } : null);
      }
    }
  }, [selectedItem, sellItem]);

  const handleEatItem = useCallback(() => {
    if (selectedItem && character) {
      // TODO: Implement eat functionality in gameStore
      const itemData = getItemById(selectedItem.id);
      if (itemData?.healing) {
        // For now, just remove one item and show feedback
        sellItem(selectedItem.id, 1);
        if (selectedItem.quantity <= 1) {
          setSelectedItem(null);
        } else {
          setSelectedItem(prev => prev ? { ...prev, quantity: prev.quantity - 1 } : null);
        }
      }
    }
  }, [selectedItem, character, sellItem]);

  const handleUpgradeItem = useCallback(() => {
    // TODO: Implement upgrade functionality
    console.log('Upgrade item:', selectedItem);
  }, [selectedItem]);

  const handleEquipItem = useCallback(() => {
    if (selectedItem && character) {
      const itemData = getItemById(selectedItem.id);
      if (itemData && isEquippable(itemData)) {
        equipItem(itemData);
        // Close the panel after equipping
        setSelectedItem(null);
      }
    }
  }, [selectedItem, character, equipItem]);

  const closeItemPanel = useCallback(() => {
    setSelectedItem(null);
  }, []);

  if (!character) return null;

  // Create grid of empty slots (8x6 = 48 slots per tab) 
  const totalSlots = 48;
  const emptySlots = Array.from({ length: totalSlots - activeTab.items.length }, (_, i) => i);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box position="relative" width="100%" minH="100vh" p={0}>
        {/* Bank background */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgImage={`url(${bankBg})`}
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
            bg: 'rgba(0,0,0,0.7)',
            zIndex: 1
          }}
        />

        {/* Content */}
        <Box position="relative" zIndex={2} p={6}>
          <VStack spacing={6} align="center">
            <Text fontSize="3xl" fontWeight="bold" color="white">
              Bank
            </Text>

            {/* Bank Interface */}
            <Box
              bg="rgba(24,24,24,0.95)"
              p={6}
              borderRadius="2xl"
              boxShadow="2xl"
              backdropFilter="blur(10px)"
              borderWidth={2}
              borderColor="rgba(255,255,255,0.2)"
              maxW="900px"
              w="100%"
            >
              {/* Search Bar */}
              <InputGroup size="md" mb={6}>
                <InputLeftElement pointerEvents="none">
                  <FaSearch color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg="rgba(255,255,255,0.1)"
                  color="white"
                  borderColor="rgba(255,255,255,0.3)"
                  _placeholder={{ color: 'gray.400' }}
                  _hover={{
                    borderColor: 'rgba(255,255,255,0.5)',
                  }}
                  _focus={{
                    borderColor: 'blue.400',
                    boxShadow: '0 0 0 1px blue.400',
                  }}
                />
              </InputGroup>
              {/* Bank Tabs */}
              <HStack spacing={2} mb={4} justify="flex-start" wrap="wrap">
                {displayTabs.map(tab => (
                  <BankTabButton
                    key={tab.id}
                    tab={tab}
                    isActive={activeBankTab === tab.id}
                    onSelect={() => setBankTab(tab.id)}
                    onDrop={(draggedItem) => handleTabDrop(tab, draggedItem)}
                  />
                ))}
                {!searchTerm && (
                  <BankTabButton
                    tab={{ id: 'new_tab', name: '+', items: [] }}
                    isActive={false}
                    onSelect={() => createNewTab()}
                    onDrop={(draggedItem) => handleTabDrop({ id: 'new_tab', name: '+', items: [] }, draggedItem)}
                  />
                )}
              </HStack>

              <Divider borderColor="rgba(255,255,255,0.2)" mb={4} />

              {/* Bank Grid */}
              {activeTab ? (
                <SimpleGrid columns={8} spacingX={0.5} spacingY={2} maxH="450px" overflowY="auto">
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
                <Flex justify="center" align="center" minH="200px">
                  <Text color="gray.400" fontSize="lg">
                    No items found matching "{searchTerm}"
                  </Text>
                </Flex>
              )}

              {/* Tab Info */}
              <HStack justify="space-between" mt={4} color="gray.300" fontSize="sm">
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
            </Box>
          </VStack>
        </Box>

        {/* Item Details Panel */}
        {selectedItem && (
          <ItemDetailsPanel
            item={selectedItem}
            onClose={closeItemPanel}
            onSell={handleSellItem}
            onEat={handleEatItem}
            onUpgrade={handleUpgradeItem}
            onEquip={handleEquipItem}
          />
        )}
      </Box>
    </DndProvider>
  );
}; 