import { Text } from '@chakra-ui/react';
import type { Requirement } from '../../types/game';

interface RequirementStatusProps {
  requirement: Requirement;
  isMet: boolean;
}

export const RequirementStatus = ({ requirement, isMet }: RequirementStatusProps) => {
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