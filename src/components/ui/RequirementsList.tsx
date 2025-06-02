import React from 'react';
import { Box, HStack, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import type { Requirement } from '../../types/game';

interface RequirementsListProps {
  requirements: Requirement[];
  checkRequirement: (req: Requirement) => boolean;
}

export const RequirementsList: React.FC<RequirementsListProps> = ({
  requirements,
  checkRequirement,
}) => {
  if (!requirements || requirements.length === 0) return null;

  return (
    <VStack align="stretch" spacing={2}>
      {requirements.map((req, index) => {
        const isMet = checkRequirement(req);
        return (
          <Tooltip
            key={index}
            label={req.description || `Requires ${req.type} level ${req.level}`}
            placement="top"
          >
            <HStack
              spacing={2}
              bg={isMet ? 'whiteAlpha.200' : 'whiteAlpha.100'}
              p={2}
              borderRadius="md"
              transition="all 0.2s"
              _hover={{
                bg: isMet ? 'whiteAlpha.300' : 'whiteAlpha.200',
              }}
            >
              <Icon
                as={isMet ? FaCheck : FaTimes}
                color={isMet ? 'green.400' : 'red.400'}
                boxSize={3}
              />
              <Text
                fontSize="sm"
                color={isMet ? 'white' : 'gray.400'}
                fontWeight={isMet ? 'medium' : 'normal'}
              >
                {req.type.charAt(0).toUpperCase() + req.type.slice(1)} Level {req.level}
              </Text>
            </HStack>
          </Tooltip>
        );
      })}
    </VStack>
  );
}; 