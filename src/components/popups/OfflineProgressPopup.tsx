import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  Image,
  useColorModeValue,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getItemById } from '../../data/items';

interface OfflineRewards {
  xp: number;
  item: {
    id: string;
    name: string;
    quantity: number;
  };
  skill: string;
  timePassed: number;
  actionsCompleted: number;
}

interface OfflineProgressPopupProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: OfflineRewards | null;
}

export const OfflineProgressPopup = ({ isOpen, onClose, rewards }: OfflineProgressPopupProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (!rewards) return null;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const itemData = rewards.item ? getItemById(rewards.item.id) : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={bgColor} borderRadius="xl" border="1px" borderColor={borderColor}>
        <ModalHeader textAlign="center" fontSize="2xl">
          Welcome Back!
        </ModalHeader>

        <ModalBody>
          <VStack spacing={6} align="stretch">
            <Text textAlign="center" color="gray.500">
              You were away for {formatTime(rewards.timePassed)}
            </Text>

            <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
              <VStack spacing={4}>
                <Text fontWeight="bold">
                  While you were gone, you continued {rewards.skill}:
                </Text>

                <Stat textAlign="center">
                  <StatLabel fontSize="lg">Actions Completed</StatLabel>
                  <StatNumber>{rewards.actionsCompleted}</StatNumber>
                </Stat>

                <Divider />

                <HStack spacing={6} justify="center">
                  {/* XP Gained */}
                  <Stat textAlign="center">
                    <StatLabel>XP Gained</StatLabel>
                    <StatNumber>{rewards.xp.toLocaleString()}</StatNumber>
                    <StatHelpText>{rewards.skill}</StatHelpText>
                  </Stat>

                  {/* Items Gained */}
                  <Stat textAlign="center">
                    <StatLabel>Items Gained</StatLabel>
                    <StatNumber>
                      {rewards.item ? (
                        <HStack justify="center" spacing={2}>
                          <Image
                            src={itemData?.icon}
                            alt={rewards.item.name}
                            boxSize="32px"
                            objectFit="contain"
                            fallbackSrc="/assets/items/placeholder.png"
                          />
                          <Text>{rewards.item.quantity.toLocaleString()}</Text>
                        </HStack>
                      ) : (
                        <Text>No items gained</Text>
                      )}
                    </StatNumber>
                    <StatHelpText>{rewards.item ? rewards.item.name : ''}</StatHelpText>
                  </Stat>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" w="full" onClick={onClose}>
            Continue Playing
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 