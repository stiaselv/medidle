import React from 'react';
import { Button, HStack, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import { GiWoodAxe, GiFishingPole, GiMiningHelmet, GiAnvil, GiCampfire, GiCampCookingPot } from 'react-icons/gi';
import type { SkillAction } from '../../types/game';

interface ActionButtonProps {
  action: SkillAction;
  onClick: () => void;
  isDisabled?: boolean;
  isActive?: boolean;
}

const getActionIcon = (type: string) => {
  switch (type) {
    case 'woodcutting':
      return GiWoodAxe;
    case 'fishing':
      return GiFishingPole;
    case 'mining':
      return GiMiningHelmet;
    case 'smithing':
      return GiAnvil;
    case 'cooking':
      return GiCampCookingPot;
    case 'firemaking':
      return GiCampfire;
    default:
      return GiWoodAxe;
  }
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  onClick,
  isDisabled = false,
  isActive = false,
}) => {
  const ActionIcon = getActionIcon(action.type);

  return (
    <Tooltip
      label={`${action.name} - Level ${action.levelRequired} ${action.type}`}
      placement="top"
    >
      <Button
        width="100%"
        height="auto"
        py={3}
        px={4}
        onClick={onClick}
        isDisabled={isDisabled}
        variant="ghost"
        bg={isActive ? "whiteAlpha.300" : "whiteAlpha.100"}
        _hover={{
          bg: isActive ? "whiteAlpha.400" : "whiteAlpha.200",
        }}
        _active={{
          bg: "whiteAlpha.400",
        }}
        borderWidth={1}
        borderColor={isActive ? "whiteAlpha.400" : "transparent"}
        transition="all 0.2s"
      >
        <HStack width="100%" spacing={4} justify="flex-start">
          <Icon
            as={ActionIcon}
            boxSize={6}
            color={isActive ? "white" : "gray.300"}
          />
          <VStack align="flex-start" spacing={0} flex={1}>
            <Text
              color="white"
              fontSize="sm"
              fontWeight="medium"
              textAlign="left"
            >
              {action.name}
            </Text>
            <Text
              color="gray.400"
              fontSize="xs"
              textAlign="left"
            >
              Level {action.levelRequired} {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
            </Text>
          </VStack>
          <Text
            color="gray.400"
            fontSize="xs"
            textAlign="right"
          >
            {action.experience} XP
          </Text>
        </HStack>
      </Button>
    </Tooltip>
  );
}; 