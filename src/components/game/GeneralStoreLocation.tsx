import {
  Box,
  Text,
  VStack,
  Grid,
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
import { useGameStore } from '../../store/gameStore';
import type { StoreAction, StoreItem, SkillName } from '../../types/game';
import { getItemById, meetsLevelRequirement } from '../../data/items';
import { useState } from 'react';
import { SearchIcon } from '@chakra-ui/icons';

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
      bg={bgColor}
      p={2}
      borderRadius="md"
      border="2px"
      borderColor={isSelected ? selectedBorderColor : borderColor}
      cursor="pointer"
      onClick={onClick}
      position="relative"
      opacity={1}
      transition="all 0.2s"
      _hover={{
        transform: 'scale(1.02)',
      }}
      style={{
        backgroundColor: !canAfford ? 'rgba(255, 0, 0, 0.1)' : undefined
      }}
    >
      <VStack spacing={1}>
        <Box position="relative" width="40px" height="40px">
          <Image
            src={icon}
            alt={name}
            width="100%"
            height="100%"
            objectFit="contain"
            style={{
              filter: !canAfford ? 'brightness(0.8)' : undefined
            }}
          />
          {levelRequired && isStore && (
            <Badge
              position="absolute"
              top={-2}
              right={-2}
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
          {isStore ? `${price} coins` : `Qty: ${quantity}`}
        </Text>
      </VStack>
    </Box>
  );
};

export const GeneralStoreLocation = () => {
  const { currentLocation, character, buyItem, sellItem } = useGameStore();
  const [selectedBankItem, setSelectedBankItem] = useState<string | null>(null);
  const [selectedStoreItem, setSelectedStoreItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [bankSearch, setBankSearch] = useState('');
  const [storeSearch, setStoreSearch] = useState('');
  
  if (!currentLocation || !character) return null;

  const storeAction = currentLocation.actions[0] as StoreAction;

  const getStoreItemForBankItem = (bankItemId: string) => {
    // First try to find the item in the store
    const storeItem = storeAction.storeItems.find(item => item.id === bankItemId);
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
      const item = storeAction.storeItems.find(i => i.id === selectedStoreItem);
      if (item) {
        // Check if player has enough coins
        const totalCost = item.buyPrice * quantity;
        const playerCoins = character.bank.find(item => item.id === 'coins')?.quantity || 0;
        
        if (playerCoins >= totalCost) {
          buyItem(selectedStoreItem, quantity);
          setQuantity(1);
          setSelectedStoreItem(null);
          setIsCustomAmount(false);
        } else {
          // Could add a toast notification here for insufficient funds
          console.log('Not enough coins');
        }
      }
    } else if (selectedBankItem) {
      // Sell operation
      const storeItem = getStoreItemForBankItem(selectedBankItem);
      const bankItem = character.bank.find(i => i.id === selectedBankItem);
      
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
    return 'fishing';
  };

  const getItemTooltip = (item: StoreItem) => {
    const itemDetails = getItemById(item.id);
    if (!itemDetails) return '';

    const sections = [
      // Item Name
      `${itemDetails.name}`,

      // Stats if they exist
      itemDetails.stats ? 
        Object.entries(itemDetails.stats)
          .map(([stat, value]) => `${stat.charAt(0).toUpperCase() + stat.slice(1)}: +${value}`)
          .join('\n') : 
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
      const item = storeAction.storeItems.find(i => i.id === selectedStoreItem);
      if (!item) return 1;
      
      const playerCoins = character.bank.find(item => item.id === 'coins')?.quantity || 0;
      return Math.floor(playerCoins / item.buyPrice) || 1;
    } else if (selectedBankItem) {
      // Selling - calculate max based on available items
      const bankItem = character.bank.find(i => i.id === selectedBankItem);
      return bankItem?.quantity || 1;
    }
    return 1;
  };

  return (
    <Box
      minH="100vh"
      w="100%"
      position="relative"
      bgGradient="linear(to-b, gray.900, gray.800)"
      p={6}
    >
      {/* Header */}
      <Box
        bg="blackAlpha.700"
        p={6}
        borderRadius="xl"
        backdropFilter="blur(10px)"
        border="1px solid"
        borderColor="whiteAlpha.200"
        boxShadow="dark-lg"
        maxW="600px"
        mx="auto"
        mb={8}
        textAlign="center"
      >
        <Text
          fontSize="3xl"
          fontWeight="bold"
          color="white"
          textShadow="0 2px 4px rgba(0,0,0,0.4)"
          mb={3}
        >
          {currentLocation.name}
        </Text>
        <Text
          fontSize="md"
          color="gray.300"
          maxW="500px"
          mx="auto"
          lineHeight="1.6"
        >
          {currentLocation.description}
        </Text>
      </Box>

      {/* Main Content */}
      <Flex gap={6} maxW="1800px" mx="auto" h="70vh">
        {/* Bank Items */}
        <Box 
          flex={2} 
          bg="blackAlpha.400" 
          p={4} 
          borderRadius="xl" 
          display="flex" 
          flexDirection="column"
          minW="400px"
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
          <Box overflowY="auto" flex={1}>
            <Grid templateColumns="repeat(auto-fill, minmax(100px, 1fr))" gap={3}>
              {character.bank.filter(item => 
                item.name.toLowerCase().includes(bankSearch.toLowerCase())
              ).map((item) => {
                const itemDetails = getItemById(item.id);
                if (!itemDetails) return null;
                const storeItem = getStoreItemForBankItem(item.id);
                return (
                  <Tooltip 
                    key={item.id} 
                    label={getItemTooltip(storeItem || { 
                      id: item.id, 
                      name: item.name,
                      buyPrice: itemDetails.buyPrice || 0,
                      sellPrice: itemDetails.sellPrice || 0,
                      levelRequired: itemDetails.level
                    })}
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
                        selectedBankItem === item.id ? 'border-2 border-blue-500' : ''
                      }`}
                      onClick={() => {
                        setSelectedBankItem(selectedBankItem === item.id ? null : item.id);
                        setSelectedStoreItem(null);
                      }}
                    >
                      <ItemCard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        icon={itemDetails.icon}
                        quantity={item.quantity}
                        isSelected={selectedBankItem === item.id}
                      />
                    </Box>
                  </Tooltip>
                );
              })}
            </Grid>
          </Box>
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
                      {storeAction.storeItems.find(i => i.id === selectedStoreItem)?.name}
                    </Text>
                    <Text color="gray.400" fontSize="sm" textAlign="center">
                      Quantity: {quantity}
                    </Text>
                    <Text color="white" fontSize="md" textAlign="center">
                      Total Cost: {(quantity * (storeAction.storeItems.find(i => i.id === selectedStoreItem)?.buyPrice || 0)).toLocaleString()} coins
                    </Text>
                    <Text color="gray.400" fontSize="sm" textAlign="center">
                      Your coins: {(character.bank.find(item => item.id === 'coins')?.quantity || 0).toLocaleString()}
                    </Text>
                  </>
                )}
                {selectedBankItem && (
                  <>
                    <Text color="white" fontSize="lg" fontWeight="bold" textAlign="center">
                      {character.bank.find(i => i.id === selectedBankItem)?.name}
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
                      Available to sell: {(character.bank.find(item => item.id === selectedBankItem)?.quantity || 0).toLocaleString()}
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
          bg="blackAlpha.400" 
          p={4} 
          borderRadius="xl" 
          display="flex" 
          flexDirection="column"
          minW="400px"
        >
          <Text color="white" fontSize="xl" mb={4}>Store Items</Text>
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
              {storeAction.storeItems.filter(item => 
                item.name.toLowerCase().includes(storeSearch.toLowerCase())
              ).map((item) => {
                const itemDetails = getItemById(item.id);
                if (!itemDetails) return null;
                const skill = getSkillForItem(item.id);
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
                        playerLevel={character.skills[skill].level}
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
  );
};

export default GeneralStoreLocation; 