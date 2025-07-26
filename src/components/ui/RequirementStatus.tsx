import { Text, HStack, Image, Box } from '@chakra-ui/react';
import type { Requirement } from '../../types/game';
import { useGameStore } from '../../store/gameStore';
import { getItemById } from '../../data/items';

interface RequirementStatusProps {
  requirement: Requirement;
  isMet: boolean;
}

export const RequirementStatus = ({ requirement, isMet }: RequirementStatusProps) => {
  const { character } = useGameStore();

  const getRequirementText = () => {
    switch (requirement.type) {
      case 'level':
        return `Level ${requirement.level} ${requirement.skill} required`;
      case 'equipment':
        if (requirement.itemId?.toLowerCase().includes('axe')) {
          return 'Any axe required';
        }
        if (requirement.itemId?.toLowerCase().includes('pickaxe')) {
          return 'Any pickaxe required';
        }
        return `${requirement.itemId || 'Unknown item'} required`;
      case 'item':
        return `${requirement.quantity}x ${requirement.itemId} required`;
      default:
        return requirement.description || 'Unknown requirement';
    }
  };

  const renderItemRequirement = () => {
    if (requirement.type !== 'item' || !requirement.itemId) {
      return null;
    }

    const item = getItemById(requirement.itemId);
    const bankItem = character?.bank.find(i => i.id === requirement.itemId);
    const haveQuantity = bankItem?.quantity || 0;
    const requiredQuantity = requirement.quantity || 0;

    return (
      <HStack spacing={2} align="center">
        <Text fontSize="xs" color={isMet ? "green.300" : "red.300"} fontWeight="medium">
          Need: {requiredQuantity}x
        </Text>
        <Box
          w="16px"
          h="16px"
          borderRadius="sm"
          overflow="hidden"
          border="1px solid"
          borderColor={isMet ? "green.300" : "red.300"}
        >
          <Image
            src={item?.icon || '/assets/items/placeholder.png'}
            alt={item?.name || requirement.itemId}
            w="100%"
            h="100%"
            objectFit="contain"
            fallbackSrc="/assets/items/placeholder.png"
          />
        </Box>
        <Text fontSize="xs" color={isMet ? "green.300" : "red.300"} fontWeight="medium">
          {item?.name || requirement.itemId}
        </Text>
        <Text fontSize="xs" color={isMet ? "green.300" : "red.300"} fontWeight="medium">
          Have: {haveQuantity}x
        </Text>
        <Box
          w="16px"
          h="16px"
          borderRadius="sm"
          overflow="hidden"
          border="1px solid"
          borderColor={isMet ? "green.300" : "red.300"}
        >
          <Image
            src={item?.icon || '/assets/items/placeholder.png'}
            alt={item?.name || requirement.itemId}
            w="100%"
            h="100%"
            objectFit="contain"
            fallbackSrc="/assets/items/placeholder.png"
          />
        </Box>
        <Text fontSize="xs" color={isMet ? "green.300" : "red.300"} fontWeight="medium">
          {isMet ? '✓' : '✗'}
        </Text>
      </HStack>
    );
  };

  const renderNonItemRequirement = () => {
    return (
      <Text
        fontSize="xs"
        color={isMet ? "green.300" : "red.300"}
        fontWeight="medium"
      >
        {getRequirementText()} {isMet ? '✓' : '✗'}
      </Text>
    );
  };

  return (
    <Box>
      {requirement.type === 'item' ? renderItemRequirement() : renderNonItemRequirement()}
    </Box>
  );
}; 