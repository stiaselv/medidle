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
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getItemById } from '../../data/items';

interface OfflineRewards {
  xp: number;
  item: {
    id: string;
    name: string;
    quantity: number;
  } | null;
  skill: string;
  timePassed: number;
  actionsCompleted: number;
  consumedItems?: Array<{
    id: string;
    name: string;
    quantity: number;
  }>;
}

interface OfflineProgressPopupProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: OfflineRewards | null;
  timePassed?: number; // Optional: pass time passed even when no rewards
}

export const OfflineProgressPopup = ({ isOpen, onClose, rewards, timePassed }: OfflineProgressPopupProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

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

  const itemData = rewards?.item ? getItemById(rewards.item.id) : null;

  // If no rewards but time passed, show a message about why
  if (!rewards && timePassed && timePassed >= 60000) { // At least 1 minute
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
                You were away for {formatTime(timePassed)}
              </Text>

              <Alert status="info" borderRadius="lg">
                <AlertIcon />
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">No Offline Progress</Text>
                  <Text fontSize="sm">
                    Your character couldn't continue their last action while you were away. 
                    This usually happens when:
                  </Text>
                  <Text fontSize="sm" as="ul" pl={4}>
                    <li>• You ran out of required items (like ores for smelting)</li>
                    <li>• You no longer meet the level requirements</li>
                    <li>• You don't have the required equipment equipped</li>
                    <li>• The last action was combat-related (combat doesn't continue offline)</li>
                  </Text>
                  <Text fontSize="sm" mt={2}>
                    Start a new action to enable offline progression for your next session!
                  </Text>
                </VStack>
              </Alert>
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
  }

  if (!rewards) return null;

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

                {/* Consumed Items */}
                {rewards.consumedItems && rewards.consumedItems.length > 0 && (
                  <>
                    <Divider />
                    <VStack spacing={2} align="stretch">
                      <Text fontSize="sm" fontWeight="bold" textAlign="center">
                        Resources Consumed:
                      </Text>
                      <HStack spacing={4} justify="center" wrap="wrap">
                        {rewards.consumedItems.map((consumedItem, index) => (
                          <HStack key={index} spacing={2} bg={useColorModeValue('gray.100', 'gray.600')} p={2} borderRadius="md">
                            <Image
                              src={getItemById(consumedItem.id)?.icon}
                              alt={consumedItem.name}
                              boxSize="24px"
                              objectFit="contain"
                              fallbackSrc="/assets/items/placeholder.png"
                            />
                            <Text fontSize="sm">
                              {consumedItem.quantity.toLocaleString()} {consumedItem.name}
                            </Text>
                          </HStack>
                        ))}
                      </HStack>
                    </VStack>
                  </>
                )}
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