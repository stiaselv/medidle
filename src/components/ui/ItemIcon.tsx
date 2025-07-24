import React from 'react';
import {
  Box,
  Image,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import type { ItemReward } from '../../types/game';
import { getItemById } from '../../data/items';

interface ItemIconProps {
  /** Item data - can be a full ItemReward object or just an item ID */
  item: ItemReward | string;
  /** Size of the icon in pixels (default: 48) */
  size?: number;
  /** Whether the item is selected/highlighted */
  isSelected?: boolean;
  /** Whether the item is equipped */
  isEquipped?: boolean;
  /** Whether to show the quantity badge */
  showQuantity?: boolean;
  /** Custom quantity to override item.quantity */
  quantity?: number;
  /** Click handler */
  onClick?: () => void;
  /** Whether the item is draggable */
  isDraggable?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Custom border color */
  borderColor?: string;
  /** Whether to disable hover effects */
  disableHover?: boolean;
}

export const ItemIcon: React.FC<ItemIconProps> = ({
  item,
  size = 48,
  isSelected = false,
  isEquipped = false,
  showQuantity = true,
  quantity,
  onClick,
  isDraggable = false,
  className,
  borderColor,
  disableHover = false,
}) => {
  // Extract item data
  const itemData = typeof item === 'string' ? getItemById(item) : item;
  const fullItemData = typeof item === 'string' ? getItemById(item) : getItemById(item.id);
  
  if (!itemData || !fullItemData) {
    return (
      <Box
        w={`${size}px`}
        h={`${size}px`}
        bg={useColorModeValue('gray.100', 'gray.700')}
        border="2px solid"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        className={className}
      >
        {/* Empty slot or placeholder */}
      </Box>
    );
  }

  const displayQuantity = quantity ?? (typeof item !== 'string' ? item.quantity : 1);
  const shouldShowQuantity = showQuantity && displayQuantity > 1;

  // Format quantity for display
  const formatQuantity = (qty: number): string => {
    if (qty >= 1000000) return `${Math.floor(qty / 1000000)}M`;
    if (qty >= 1000) return `${Math.floor(qty / 1000)}K`;
    return qty.toString();
  };

  return (
    <Box
      position="relative"
      w={`${size}px`}
      h={`${size}px`}
      bg={useColorModeValue('white', 'gray.800')}
      border="2px solid"
      borderColor={
        borderColor || 
        (isEquipped ? 'blue.400' : 
         isSelected ? 'yellow.400' : 
         useColorModeValue('gray.200', 'gray.600'))
      }
      borderRadius="md"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      className={className}
      transition="all 0.2s"
      _hover={!disableHover && onClick ? {
        borderColor: isEquipped ? 'blue.500' : 'blue.400',
        transform: 'scale(1.02)',
        shadow: 'md'
      } : {}}
      _active={!disableHover && onClick ? { 
        transform: 'scale(0.98)' 
      } : {}}
      overflow="hidden"
    >
      {/* Item Image */}
      <Image
        src={fullItemData.icon}
        alt={fullItemData.name}
        w="100%"
        h="100%"
        objectFit="contain"
        fallbackSrc="/assets/items/placeholder.png"
        p={1}
      />

      {/* Quantity Badge */}
      {shouldShowQuantity && (
        <Badge
          position="absolute"
          top="-2px"
          right="-2px"
          bg="yellow.400"
          color="black"
          fontSize="10px"
          fontWeight="bold"
          borderRadius="md"
          px={1}
          minW="18px"
          textAlign="center"
          lineHeight="16px"
          height="16px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 1px 3px rgba(0,0,0,0.3)"
          border="1px solid"
          borderColor="yellow.600"
        >
          {formatQuantity(displayQuantity)}
        </Badge>
      )}

      {/* Equipped Badge */}
      {isEquipped && (
        <Badge
          position="absolute"
          top="2px"
          left="2px"
          bg="blue.500"
          color="white"
          fontSize="8px"
          fontWeight="bold"
          borderRadius="sm"
          px={1}
        >
          E
        </Badge>
      )}

      {/* Selected Glow Effect */}
      {isSelected && (
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          boxShadow="0 0 0 2px #fbbf24, 0 0 8px rgba(251, 191, 36, 0.5)"
          borderRadius="md"
          pointerEvents="none"
        />
      )}
    </Box>
  );
}; 