import {
  Box,
  Text,
  VStack,
  Grid,
  SimpleGrid,
  Flex,
  Button,
  Image,
  useColorModeValue,
  Tooltip,
  Badge,
  Input,
  HStack,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  InputGroup,
  InputLeftElement,
  Divider,
} from '@chakra-ui/react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useGameStore } from '../../store/gameStore';
import type { StoreAction, StoreItem, SkillName, ItemReward, BankTab } from '../../types/game';
import { getItemById, meetsLevelRequirement } from '../../data/items';
import { useState, useCallback, useMemo } from 'react';
import { SearchIcon } from '@chakra-ui/icons';
// Removed direct import to prevent caching issues - using string path instead
import { ItemIcon } from '../ui/ItemIcon';

interface ItemCardProps {
  id: string;
  name: string;
  icon: string;
  quantity: number;
  isSelected?: boolean;
  onClick?: () => void;
  showPrice?: boolean;
  price?: number;
  isStore?: boolean;
  levelRequired?: number;
  playerLevel?: number;
}

const ItemCard = ({ 
  id, 
  name, 
  icon, 
  quantity, 
  isSelected, 
  onClick,
  showPrice,
  price,
  isStore,
  levelRequired,
  playerLevel,
}: ItemCardProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const selectedBorderColor = useColorModeValue('blue.500', 'blue.300');
  const meetsLevel = !levelRequired || (playerLevel && playerLevel >= levelRequired);
  const { character } = useGameStore();
  const playerCoins = character?.bank.find(item => item.id === 'coins')?.quantity || 0;
  const canAfford = !isStore || !price || playerCoins >= price;

  return (
    <Box
      bg={isSelected ? 'rgba(255,255,255,0.18)' : 'rgba(40,40,40,0.92)'}
      p={2}
      borderRadius="lg"
      borderWidth={2}
      borderColor={isSelected ? '#fbbf24' : 'rgba(255,255,255,0.12)'}
      boxShadow={isSelected ? '0 0 0 3px #fbbf24, 0 4px 24px 0 rgba(0,0,0,0.25)' : '0 2px 12px 0 rgba(0,0,0,0.18)'}
      cursor="pointer"
      onClick={onClick}
      position="relative"
      opacity={1}
      transition="box-shadow 0.2s, background 0.2s, border-color 0.2s, transform 0.2s"
      _hover={{
        transform: 'scale(1.04)',
        bg: isSelected ? 'rgba(255,255,255,0.22)' : 'rgba(60,60,60,0.98)',
        boxShadow: isSelected
          ? '0 0 0 4px #fbbf24, 0 8px 32px 0 rgba(0,0,0,0.28)'
          : '0 4px 24px 0 rgba(0,0,0,0.28)',
        borderColor: isSelected ? '#fbbf24' : 'rgba(255,255,255,0.22)'
      }}
      style={{
        backgroundColor: !canAfford ? 'rgba(255, 0, 0, 0.1)' : undefined
      }}
    >
      <VStack spacing={1}>
        <Box position="relative">
          <ItemIcon
            item={{ id, name, quantity } as ItemReward}
            size={40}
            showQuantity={!isStore}
            quantity={isStore ? undefined : quantity}
            disableHover={true}
          />
          {levelRequired && isStore && (
            <Badge
              position="absolute"
              top={-6}
              right={-6}
              colorScheme={meetsLevel ? "green" : "red"}
              fontSize="xs"
              borderRadius="full"
            >
              {levelRequired}
            </Badge>
          )}
        </Box>
        <Text fontSize="xs" fontWeight="medium" textAlign="center" noOfLines={2}>
          {name}
        </Text>
        <Text fontSize="xs" color={canAfford ? "gray.500" : "red.400"}>
          {isStore ? `${price} coins` : `x${quantity}`}
        </Text>
      </VStack>
    </Box>
  );
};

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
    ].filter(Boolean).join('\n');

    return sections;
  };

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
    >
      <Box
        ref={(node) => drag(drop(node))}
        w="48px"
        h="48px"
        bg={useColorModeValue('white', 'gray.700')}
        border="2px solid"
        borderColor={borderColor}
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor={item ? 'grab' : 'pointer'}
        onClick={onClick}
        opacity={isDragging ? 0.5 : 1}
        _hover={{
          borderColor: 'blue.400',
          transform: 'scale(1.05)',
        }}
        transition="all 0.2s"
      >
        {item ? (
          <ItemIcon
            item={item}
            size={40}
            showQuantity={true}
            disableHover={true}
          />
        ) : (
          <Text fontSize="xs" color="gray.400">
            Empty
          </Text>
        )}
      </Box>
    </Tooltip>
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

export const GeneralStoreLocation = () => {
  const { 
    currentLocation, 
    character, 
    buyItem, 
    sellItem, 
    bankTabs, 
    activeBankTab,
    setBankTab,
    moveBankItem,
    createBankTab,
    deleteBankTab,
    upgradeAutoEating
  } = useGameStore();
  const [selectedBankItem, setSelectedBankItem] = useState<string | null>(null);
  const [selectedStoreItem, setSelectedStoreItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [bankSearch, setBankSearch] = useState('');
  const [storeSearch, setStoreSearch] = useState('');
  // Initialize active store tab with the first available tab
  const [activeStoreTab, setActiveStoreTab] = useState(() => {
    const storeAction = currentLocation?.actions?.[0] as StoreAction;
    const firstTab = storeAction?.storeTabs?.[0]?.id;
    return firstTab || 'woodcutting';
  });
  
  if (!currentLocation || !character) return null;

  // Get the active bank tab items
  const activeTab = bankTabs.find(tab => tab.id === activeBankTab) || bankTabs[0];
  const bankItems = activeTab?.items || [];

  // Filter bank tabs and items based on search term
  const filteredBankData = useMemo(() => {
    if (!bankSearch.trim()) {
      return {
        tabs: bankTabs,
        activeTab: bankTabs.find(tab => tab.id === activeBankTab) || bankTabs[0]
      };
    }

    const searchLower = bankSearch.toLowerCase();
    
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
  }, [bankTabs, activeBankTab, bankSearch]);

  const { tabs: displayTabs, activeTab: displayActiveTab } = filteredBankData;
  
  const totalSlots = 56;
  const emptySlots = Array(Math.max(0, totalSlots - (displayActiveTab?.items?.length || 0))).fill(null);

  const moveItem = useCallback((fromTabId: string, fromIndex: number, toTabId: string, toIndex: number) => {
    moveBankItem(fromTabId, fromIndex, toTabId, toIndex);
  }, [moveBankItem]);

  const createNewTab = useCallback((draggedItem: { item: ItemReward; tabId: string; index: number }) => {
    const newTabId = `tab_${Date.now()}`;
    createBankTab(`Tab ${bankTabs.length}`, draggedItem.item);
    
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

  const storeAction = currentLocation.actions[0] as StoreAction;
  
  // Defensive check for store action
  if (!storeAction) {
    console.error('No store action found in location:', currentLocation);
    return <Text color="white">Error: Store not properly configured</Text>;
  }

  // Get all store items from tabs
  const getAllStoreItems = () => {
    if (storeAction.storeTabs) {
      return storeAction.storeTabs.flatMap(tab => tab.items);
    }
    return storeAction.storeItems || [];
  };

  // Get items for the active store tab
  const getActiveStoreItems = () => {
    if (storeAction.storeTabs) {
      const activeTab = storeAction.storeTabs.find(tab => tab.id === activeStoreTab);
      if (!activeTab) {
        console.warn(`Active store tab '${activeStoreTab}' not found. Available tabs:`, storeAction.storeTabs.map(t => t.id));
        return [];
      }
      
      let items = activeTab.items || [];
      
      // Filter auto-eating upgrades to show only the next purchasable tier
      if (activeTab.id === 'upgrades') {
        const currentTier = character?.autoEating?.tier || 0;
        items = items.filter(item => {
          // Show only the next tier that can be purchased
          if (item.id === 'auto_eat_tier_1') return currentTier === 0;
          if (item.id === 'auto_eat_tier_2') return currentTier === 1;
          if (item.id === 'auto_eat_tier_3') return currentTier === 2;
          return true; // Show other upgrade items normally
        });
      }
      
      return items;
    }
    return storeAction.storeItems || [];
  };

  const getStoreItemForBankItem = (bankItemId: string) => {
    // First try to find the item in the store
    const allStoreItems = getAllStoreItems();
    const storeItem = allStoreItems.find(item => item.id === bankItemId);
    if (storeItem) {
      return storeItem;
    }
    
    // If not in store, get from items database
    const itemDetails = getItemById(bankItemId);
    if (itemDetails) {
      return {
        id: bankItemId,
        name: itemDetails.name,
        sellPrice: itemDetails.sellPrice || 0,
        buyPrice: itemDetails.buyPrice || 0,
        levelRequired: itemDetails.level
      };
    }
    
    return null;
  };

  const handleTransaction = () => {
    if (selectedStoreItem) {
      // Buy operation
      const allStoreItems = getAllStoreItems();
      const item = allStoreItems.find(i => i.id === selectedStoreItem);
      if (item) {
        // Check if player has enough coins
        const totalCost = item.buyPrice * quantity;
        const playerCoins = bankItems.find(item => item.id === 'coins')?.quantity || 0;
        
        if (playerCoins >= totalCost) {
          // Handle auto-eating upgrades specially
          if (selectedStoreItem.startsWith('auto_eat_tier_')) {
            const tier = parseInt(selectedStoreItem.split('_').pop() || '1');
            const success = upgradeAutoEating(tier);
            if (success) {
              setQuantity(1);
              setSelectedStoreItem(null);
              setIsCustomAmount(false);
            }
          } else {
            // Handle regular item purchases
            buyItem(selectedStoreItem, quantity, item.buyPrice);
            setQuantity(1);
            setSelectedStoreItem(null);
            setIsCustomAmount(false);
          }
        } else {
          // Could add a toast notification here for insufficient funds
          console.log('Not enough coins');
        }
      }
    } else if (selectedBankItem) {
      // Sell operation
      const storeItem = getStoreItemForBankItem(selectedBankItem);
      const bankItem = bankItems.find(i => i.id === selectedBankItem);
      
      if (storeItem && bankItem) {
        // Check if player has enough items to sell
        if (bankItem.quantity >= quantity) {
          sellItem(selectedBankItem, quantity);
          // Keep both selection and quantity
        } else {
          // Could add a toast notification here for insufficient items
          console.log('Not enough items to sell');
        }
      }
    }
  };

  const getSkillForItem = (itemId: string): SkillName => {
    if (itemId.includes('axe') && !itemId.includes('pickaxe')) return 'woodcutting';
    if (itemId.includes('pickaxe')) return 'mining';
    
    // Handle skillcapes - return the skill they represent
    if (itemId.endsWith('_skillcape')) {
      const skillName = itemId.replace('_skillcape', '') as SkillName;
      // Verify it's a valid skill name
      if (['attack', 'strength', 'defence', 'hitpoints', 'ranged', 'prayer', 'magic', 
           'woodcutting', 'fishing', 'mining', 'smithing', 'cooking', 'firemaking', 
           'farming', 'runecrafting', 'agility', 'herblore', 'thieving', 'crafting', 
           'fletching', 'slayer'].includes(skillName)) {
        return skillName;
      }
    }
    
    return 'fishing';
  };

  const getItemTooltip = (item: StoreItem) => {
    const itemDetails = getItemById(item.id);
    if (!itemDetails) return '';

    const sections = [
      // Item Name
      itemDetails.name,

      // Stats if they exist
      itemDetails.stats && Object.entries(itemDetails.stats).length > 0 ? 
        ['Stats:'].concat(
          Object.entries(itemDetails.stats)
            .map(([stat, value]) => `  ${stat.charAt(0).toUpperCase() + stat.slice(1)}: +${value}`)
        ).join('\n') : 
        null,

      // Requirements
      item.levelRequired ? `Level Required: ${item.levelRequired}` : null,
      itemDetails.slot ? `Equipment Slot: ${itemDetails.slot}` : null,

      // Prices
      item.buyPrice ? `Buy Price: ${item.buyPrice.toLocaleString()} coins` : null,
      item.sellPrice ? `Sell Price: ${item.sellPrice.toLocaleString()} coins` : null,
    ].filter(Boolean).join('\n');

    return sections;
  };

  const calculateMaxQuantity = () => {
    if (selectedStoreItem) {
      // Buying - calculate max based on available coins
      const allStoreItems = getAllStoreItems();
      const item = allStoreItems.find(i => i.id === selectedStoreItem);
      if (!item) return 1;
      
      const playerCoins = bankItems.find(item => item.id === 'coins')?.quantity || 0;
      return Math.floor(playerCoins / item.buyPrice) || 1;
    } else if (selectedBankItem) {
      // Selling - calculate max based on available items
      const bankItem = bankItems.find(i => i.id === selectedBankItem);
      return bankItem?.quantity || 1;
    }
    return 1;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box position="relative" width="100%" minH="100vh" p={0}>
      {/* General Store background image */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
                    bgImage="url(/assets/BG/general_store.webp?v=2)"
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
      <Box position="relative" zIndex={2} p={6} mt={12}>
        <Flex align="flex-start" gap={8}>
          {/* Bank Items */}
          <Box 
            flex={2} 
            bg="rgba(24,24,24,0.85)" 
            p={4} 
            borderRadius="2xl" 
            display="flex" 
            flexDirection="column"
            minW="400px"
            boxShadow="xl"
            backdropFilter="blur(8px)"
            borderWidth={2}
            borderColor="rgba(120,120,120,0.32)"
            transition="box-shadow 0.2s, background 0.2s"
          >
            <Text color="white" fontSize="xl" mb={4}>Your Bank</Text>
            <InputGroup mb={4} size="sm">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search bank items..."
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                bg="whiteAlpha.200"
                color="white"
                _placeholder={{ color: 'gray.400' }}
              />
            </InputGroup>
            {/* Bank Tabs */}
            <HStack spacing={2} justify="flex-start" wrap="wrap" mb={4}>
              {displayTabs.map((tab) => (
                <BankTabButton
                  key={tab.id}
                  tab={tab}
                  isActive={tab.id === activeBankTab}
                  onSelect={() => setBankTab(tab.id)}
                  onDrop={(draggedItem) => moveToExistingTab(draggedItem, tab.id)}
                />
              ))}
              {!bankSearch && (
                <BankTabButton
                  tab={{ id: 'new_tab', name: 'New', items: [] }}
                  isActive={false}
                  onSelect={() => {}}
                  onDrop={createNewTab}
                />
              )}
            </HStack>

            <Divider borderColor="rgba(255,255,255,0.2)" mb={4} />

            {/* Bank Grid */}
            {displayActiveTab ? (
              <SimpleGrid columns={8} spacingX={1} spacingY={1} flex={1} overflow="auto">
                {displayActiveTab.items.map((item, index) => (
                  <ItemSlot
                    key={`${item.id}-${index}`}
                    item={item}
                    index={index}
                    tabId={activeBankTab}
                    moveItem={moveItem}
                    onClick={() => {
                      setSelectedBankItem(selectedBankItem === item.id ? null : item.id);
                      setSelectedStoreItem(null);
                    }}
                  />
                ))}
                {!bankSearch && emptySlots.map((_, index) => (
                  <ItemSlot
                    key={`empty-${index}`}
                    index={displayActiveTab.items.length + index}
                    tabId={activeBankTab}
                    moveItem={moveItem}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Flex flex={1} align="center" justify="center">
                <Text color="gray.500" fontSize="md">
                  No items found matching "{bankSearch}"
                </Text>
              </Flex>
            )}

            {/* Tab Info */}
            <HStack justify="space-between" color="gray.400" fontSize="xs" mt={2}>
              {displayActiveTab ? (
                <Text>
                  Tab: {displayActiveTab.name} ({displayActiveTab.items.length}/{bankSearch ? displayActiveTab.items.length : totalSlots} items)
                  {bankSearch && (
                    <Text as="span" color="blue.400" ml={2}>
                      (filtered)
                    </Text>
                  )}
                </Text>
              ) : (
                <Text>No matching items</Text>
              )}
              <Text>
                Total items: {bankSearch ? 
                  displayTabs.reduce((sum, tab) => sum + tab.items.length, 0) :
                  bankTabs.reduce((sum, tab) => sum + tab.items.length, 0)
                }
              </Text>
            </HStack>
          </Box>

          {/* Middle Section - Quantity Selection */}
          <VStack 
            spacing={6} 
            minW="240px" 
            alignSelf="center"
            bg="blackAlpha.400"
            p={6}
            borderRadius="xl"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <Text 
              color="white" 
              fontSize="xl" 
              fontWeight="semibold"
              textAlign="center"
            >
              Quantity
            </Text>
            
            <VStack spacing={4} width="full">
              <Box width="full">
                <Text 
                  color="gray.300" 
                  fontSize="sm" 
                  mb={2}
                  textAlign="center"
                >
                  Select Preset Amount
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={2} width="full">
                  {[1, 10, 25, 50].map((amount) => (
                    <Button
                      key={amount}
                      size="md"
                      variant={!isCustomAmount && quantity === amount ? "solid" : "outline"}
                      colorScheme="blue"
                      onClick={() => {
                        setQuantity(amount);
                        setIsCustomAmount(false);
                      }}
                      width="full"
                      _hover={{
                        transform: 'scale(1.05)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      {amount}
                    </Button>
                  ))}
                  <Button
                    size="md"
                    variant={!isCustomAmount && quantity === -1 ? "solid" : "outline"}
                    colorScheme="purple"
                    onClick={() => {
                      const maxQuantity = calculateMaxQuantity();
                      setQuantity(maxQuantity);
                      setIsCustomAmount(false);
                    }}
                    width="full"
                    gridColumn="span 2"
                    _hover={{
                      transform: 'scale(1.05)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    MAX
                  </Button>
                </Grid>
              </Box>

              <Box width="full" position="relative" py={2}>
                <Divider />
                <Text
                  color="gray.400"
                  fontSize="sm"
                  bg="blackAlpha.400"
                  px={3}
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                >
                  OR
                </Text>
              </Box>
              
              <Box width="full">
                <Text 
                  color="gray.300" 
                  fontSize="sm" 
                  mb={2}
                  textAlign="center"
                >
                  Custom Amount
                </Text>
                <HStack width="full">
                  <Input
                    type="number"
                    min={1}
                    value={isCustomAmount ? quantity : ''}
                    placeholder="Enter amount..."
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setQuantity(value);
                      setIsCustomAmount(true);
                    }}
                    textAlign="center"
                    size="md"
                    color="white"
                    bg="whiteAlpha.200"
                    borderColor="whiteAlpha.300"
                    _hover={{
                      borderColor: "whiteAlpha.400"
                    }}
                    _focus={{
                      borderColor: "blue.300",
                      boxShadow: "0 0 0 1px var(--chakra-colors-blue-300)"
                    }}
                  />
                  <Button
                    colorScheme="purple"
                    variant={isCustomAmount ? "solid" : "outline"}
                    onClick={() => {
                      if (!isCustomAmount) {
                        setIsCustomAmount(true);
                        onOpen();
                      } else {
                        setIsCustomAmount(false);
                        setQuantity(1);
                      }
                    }}
                    _hover={{
                      transform: 'scale(1.05)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    {isCustomAmount ? "Clear" : "Set"}
                  </Button>
                </HStack>
              </Box>
            </VStack>

            <Box 
              width="full" 
              borderTop="1px" 
              borderColor="whiteAlpha.200" 
              pt={4}
            >
              {(selectedStoreItem || selectedBankItem) && (
                <VStack spacing={2} mb={4} width="full">
                  <Text color="gray.300" fontSize="sm" textAlign="center">
                    Transaction Preview
                  </Text>
                  {selectedStoreItem && (
                    <>
                      <Text color="white" fontSize="lg" fontWeight="bold" textAlign="center">
                        {getAllStoreItems().find(i => i.id === selectedStoreItem)?.name}
                      </Text>
                      <Text color="gray.400" fontSize="sm" textAlign="center">
                        Quantity: {quantity}
                      </Text>
                      <Text color="white" fontSize="md" textAlign="center">
                        Total Cost: {(quantity * (getAllStoreItems().find(i => i.id === selectedStoreItem)?.buyPrice || 0)).toLocaleString()} coins
                      </Text>
                                        <Text color="gray.400" fontSize="sm" textAlign="center">
                    Your coins: {(bankItems.find(item => item.id === 'coins')?.quantity || 0).toLocaleString()}
                  </Text>
                    </>
                  )}
                  {selectedBankItem && (
                    <>
                      <Text color="white" fontSize="lg" fontWeight="bold" textAlign="center">
                        {bankItems.find(i => i.id === selectedBankItem)?.name}
                      </Text>
                      <Text color="gray.400" fontSize="sm" textAlign="center">
                        Quantity: {quantity}
                      </Text>
                      {(() => {
                        const storeItem = getStoreItemForBankItem(selectedBankItem);
                        const sellPrice = storeItem?.sellPrice || 0;
                        return (
                          <Text color="white" fontSize="md" textAlign="center">
                            You will receive: {(quantity * sellPrice).toLocaleString()} coins
                          </Text>
                        );
                      })()}
                      <Text color="gray.400" fontSize="sm" textAlign="center">
                        Available to sell: {(bankItems.find(item => item.id === selectedBankItem)?.quantity || 0).toLocaleString()}
                      </Text>
                    </>
                  )}
                </VStack>
              )}
              <Button
                colorScheme={selectedStoreItem ? "green" : "orange"}
                isDisabled={!selectedStoreItem && !selectedBankItem}
                onClick={handleTransaction}
                width="full"
                size="lg"
                fontWeight="bold"
                _hover={{
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s',
                }}
              >
                {selectedStoreItem ? "Buy Items" : selectedBankItem ? "Sell Items" : "Select Items"}
              </Button>
            </Box>
          </VStack>

          {/* Store Items */}
          <Box 
            flex={2} 
            bg="rgba(24,24,24,0.85)" 
            p={4} 
            borderRadius="2xl" 
            display="flex" 
            flexDirection="column"
            minW="400px"
            boxShadow="xl"
            backdropFilter="blur(8px)"
            borderWidth={2}
            borderColor="rgba(120,120,120,0.32)"
            transition="box-shadow 0.2s, background 0.2s"
          >
            <Text color="white" fontSize="xl" mb={4}>Store Items</Text>
            
            {/* Store Tabs */}
            {storeAction.storeTabs && (
              <HStack mb={4} spacing={2} overflowX="auto">
                {storeAction.storeTabs.map((tab) => (
                  <Button
                    key={tab.id}
                    size="sm"
                    variant={activeStoreTab === tab.id ? "solid" : "outline"}
                    colorScheme="blue"
                    onClick={() => setActiveStoreTab(tab.id)}
                    _hover={{
                      transform: 'scale(1.05)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    {tab.name}
                  </Button>
                ))}
              </HStack>
            )}
            
            <InputGroup mb={4} size="sm">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search store items..."
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
                bg="whiteAlpha.200"
                color="white"
                _placeholder={{ color: 'gray.400' }}
              />
            </InputGroup>
            <Box overflowY="auto" flex={1}>
              <Grid templateColumns="repeat(auto-fill, minmax(100px, 1fr))" gap={3}>
                {getActiveStoreItems().filter(item => 
                  item.name.toLowerCase().includes(storeSearch.toLowerCase())
                ).map((item) => {
                  // Handle auto-eating upgrades specially
                  if (item.id.startsWith('auto_eat_tier_')) {
                    return (
                      <Tooltip 
                        key={item.id} 
                        label={`${item.name}\nCost: ${item.buyPrice.toLocaleString()} coins\nPermanent upgrade to auto-eating system`}
                        placement="right"
                        hasArrow
                        bg="gray.800"
                        color="white"
                        p={3}
                        borderRadius="md"
                        whiteSpace="pre-line"
                      >
                        <Box
                          className={`relative cursor-pointer ${
                            selectedStoreItem === item.id ? 'border-2 border-blue-500' : ''
                          }`}
                          onClick={() => {
                            setSelectedStoreItem(selectedStoreItem === item.id ? null : item.id);
                            setSelectedBankItem(null);
                          }}
                        >
                          <ItemCard
                            id={item.id}
                            name={item.name}
                            icon="/assets/items/placeholder.png"
                            quantity={999}
                            isSelected={selectedStoreItem === item.id}
                            isStore={true}
                            levelRequired={1}
                            playerLevel={1}
                            price={item.buyPrice}
                          />
                        </Box>
                      </Tooltip>
                    );
                  }
                  
                  // Handle regular items
                  const itemDetails = getItemById(item.id);
                  if (!itemDetails) return null;
                  const skill = getSkillForItem(item.id);
                  
                  // Defensive check for skill existence
                  if (!character?.skills?.[skill]) {
                    console.warn(`Skill '${skill}' not found for item '${item.id}'`);
                    return null;
                  }
                  return (
                    <Tooltip 
                      key={item.id} 
                      label={getItemTooltip(item)}
                      placement="right"
                      hasArrow
                      bg="gray.800"
                      color="white"
                      p={3}
                      borderRadius="md"
                      whiteSpace="pre-line"
                    >
                      <Box
                        className={`relative cursor-pointer ${
                          selectedStoreItem === item.id ? 'border-2 border-blue-500' : ''
                        }`}
                        onClick={() => {
                          setSelectedStoreItem(selectedStoreItem === item.id ? null : item.id);
                          setSelectedBankItem(null);
                        }}
                      >
                        <ItemCard
                          id={item.id}
                          name={item.name}
                          icon={itemDetails.icon}
                          quantity={999}
                          isSelected={selectedStoreItem === item.id}
                          isStore={true}
                          levelRequired={item.levelRequired}
                          playerLevel={character.skills[skill]?.level || 1}
                          price={item.buyPrice}
                        />
                      </Box>
                    </Tooltip>
                  );
                })}
              </Grid>
            </Box>
          </Box>
        </Flex>
      </Box>

      {/* Custom Quantity Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.800" border="1px solid" borderColor="whiteAlpha.200">
          <ModalHeader color="white">Enter Custom Amount</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            <InputGroup size="lg">
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  setQuantity(value);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onClose();
                  }
                }}
                color="white"
                bg="whiteAlpha.200"
                borderColor="whiteAlpha.300"
                _hover={{
                  borderColor: "whiteAlpha.400"
                }}
                _focus={{
                  borderColor: "blue.300",
                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-300)"
                }}
              />
            </InputGroup>
            <Button
              mt={4}
              colorScheme="blue"
              width="full"
              onClick={onClose}
            >
              Confirm Amount
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      </Box>
    </DndProvider>
  );
};

export default GeneralStoreLocation; 