import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Image,
  Heading,
  Divider,
  List,
  ListItem,
  Icon,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  Progress,
  IconButton,
  Flex,
  SimpleGrid,
  Textarea
} from '@chakra-ui/react';
import { FaSkull, FaCoins, FaStar, FaLock, FaHeart, FaHistory, FaCheck, FaBookmark, FaEdit } from 'react-icons/fa';
import type { Location, Monster, CombatAction, ItemReward } from '../../types/game';
import { useGameStore } from '../../store/gameStore';

interface LocationCardProps {
  /** The location data to display */
  location: Location;
  /** Optional click handler for the card */
  onClick?: () => void;
  /** Optional custom class name */
  className?: string;
  /** Optional custom styles */
  style?: React.CSSProperties;
  /** Optional flag to disable hover effects */
  disableHover?: boolean;
  /** Optional flag to disable click functionality */
  disableClick?: boolean;
}

/** 
 * LocationCard component displays information about a game location including its name,
 * description, level requirements, monsters, and possible rewards.
 */
export const LocationCard: React.FC<LocationCardProps> = ({ 
  location, 
  onClick, 
  className,
  style,
  disableHover = false,
  disableClick = false
}) => {
  // Game state
  const { 
    character, 
    setLocation, 
    startAction,
    locations,
    toggleFavorite,
    setLocationNotes,
    recentLocations,
    favoriteLocations
  } = useGameStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditingNotes, setIsEditingNotes] = React.useState(false);
  const [notesInput, setNotesInput] = React.useState('');
  const toast = useToast();

  // Get location state
  const locationState = locations[location.id];
  const isFavorite = favoriteLocations.includes(location.id);
  const isRecent = recentLocations.includes(location.id);

  // Calculate progress percentages
  const progressPercentages = React.useMemo(() => {
    if (!locationState) return null;
    
    const { progress } = locationState;
    return {
      monsters: Object.values(progress.monstersDefeated).reduce((sum, count) => sum + count, 0),
      resources: Object.values(progress.resourcesGathered).reduce((sum, count) => sum + count, 0),
      actions: Object.values(progress.actionsCompleted).reduce((sum, count) => sum + count, 0)
    };
  }, [locationState]);

  // Extract combat actions and their rewards
  const combatActions = React.useMemo(() => {
    if (!location.actions) return [];
    return location.actions.filter((action): action is CombatAction => action.type === 'combat');
  }, [location.actions]);

  // Check if location is accessible
  const isAccessible = React.useMemo(() => {
    if (!character) return false;
    // Use character.combatLevel for combat locations, fallback to 1 if missing
    if (location.type === 'combat') {
      return (character.combatLevel ?? 1) >= location.levelRequired;
    }
    // For non-combat locations, allow access (or add other logic as needed)
    return true;
  }, [character, location.type, location.levelRequired]);

  // Handle location selection
  const handleLocationSelect = React.useCallback(() => {
    if (!character) {
      toast({
        title: "No character found",
        description: "Please create or select a character first.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!isAccessible) {
      toast({
        title: "Level requirement not met",
        description: `You need combat level ${location.levelRequired} to access this location.`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // If there's a custom click handler, use it
    if (onClick) {
      onClick();
      return;
    }

    // Otherwise, set the location and show details modal
    setLocation(location);
    onOpen();
  }, [character, isAccessible, location, onClick, setLocation, onOpen, toast]);

  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.300');
  const dividerColor = useColorModeValue('gray.200', 'gray.600');

  // Determine if the card is clickable
  const isClickable = !disableClick;

  return (
    <>
      <Box
        as="article"
        borderWidth="1px"
        borderRadius="xl"
        overflow="hidden"
        bg={bgColor}
        borderColor={borderColor}
        className={className}
        style={style}
        _hover={!disableHover ? {
          transform: isAccessible ? 'scale(1.02)' : 'none',
          transition: 'transform 0.2s',
          boxShadow: isAccessible ? 'xl' : 'none',
          borderColor: isAccessible ? 'blue.400' : borderColor,
          cursor: isAccessible ? 'pointer' : 'not-allowed'
        } : undefined}
        onClick={isClickable ? handleLocationSelect : undefined}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-label={isClickable ? `Location: ${location.name}` : undefined}
        position="relative"
        transition="all 0.2s"
        opacity={isAccessible ? 1 : 0.7}
      >
        {/* Location Image */}
        <Box position="relative">
          <Image
            src={typeof location.icon === 'string' ? location.icon : '/assets/locations/placeholder.png'}
            alt={`${location.name} location`}
            objectFit="cover"
            height="200px"
            width="100%"
            fallbackSrc="/assets/locations/placeholder.png"
          />
          
          {/* Status Badges */}
          <HStack position="absolute" top={2} left={2} spacing={1}>
            {locationState?.visited && (
              <Tooltip label="Visited" placement="top">
                <Badge colorScheme="green">
                  <Icon as={FaCheck} boxSize={3} />
                </Badge>
              </Tooltip>
            )}
            {isRecent && (
              <Tooltip label="Recently Visited" placement="top">
                <Badge colorScheme="blue">
                  <Icon as={FaHistory} boxSize={3} />
                </Badge>
              </Tooltip>
            )}
            {isFavorite && (
              <Tooltip label="Favorite" placement="top">
                <Badge colorScheme="red">
                  <Icon as={FaHeart} boxSize={3} />
                </Badge>
              </Tooltip>
            )}
          </HStack>

          {/* Level Badge */}
          <Badge
            position="absolute"
            top={2}
            right={2}
            colorScheme={isAccessible ? "purple" : "red"}
            fontSize="sm"
            px={3}
            py={1}
            borderRadius="full"
            boxShadow="md"
          >
            Level {location.levelRequired}+
          </Badge>

          {/* Lock Overlay */}
          {!isAccessible && (
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bg="blackAlpha.600"
              p={4}
              borderRadius="full"
            >
              <Icon as={FaLock} color="white" boxSize={8} data-testid="lock-icon" />
            </Box>
          )}
        </Box>

        <VStack p={4} spacing={4} align="stretch">
          {/* Header with Name and Actions */}
          <Flex justify="space-between" align="center">
            <Heading 
              size="md" 
              color={textColor}
              noOfLines={1}
              _hover={{ color: isAccessible ? 'blue.400' : textColor }}
              transition="color 0.2s"
            >
              {location.name}
            </Heading>
            <HStack spacing={2}>
              <IconButton
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                icon={<Icon as={FaHeart} color={isFavorite ? "red.400" : "gray.400"} />}
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(location.id);
                }}
              />
              {locationState?.visited && (
                <IconButton
                  aria-label="Edit notes"
                  icon={<Icon as={FaEdit} />}
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotesInput(locationState.customNotes || '');
                    setIsEditingNotes(true);
                  }}
                />
              )}
            </HStack>
          </Flex>

          {/* Description */}
          <Text 
            color={secondaryTextColor} 
            fontSize="sm"
            noOfLines={2}
          >
            {location.description}
          </Text>

          {/* Progress Section */}
          {locationState && progressPercentages && (
            <VStack spacing={2} align="stretch">
              <Text color={textColor} fontSize="sm" fontWeight="bold">Progress</Text>
              {location.monsters && location.monsters.length > 0 && (
                <Box>
                  <Text fontSize="xs" color={secondaryTextColor}>Monsters Defeated</Text>
                  <Progress value={progressPercentages.monsters} max={100} size="sm" colorScheme="red" />
                </Box>
              )}
              {location.resources && location.resources.length > 0 && (
                <Box>
                  <Text fontSize="xs" color={secondaryTextColor}>Resources Gathered</Text>
                  <Progress value={progressPercentages.resources} max={100} size="sm" colorScheme="green" />
                </Box>
              )}
              <Box>
                <Text fontSize="xs" color={secondaryTextColor}>Actions Completed</Text>
                <Progress value={progressPercentages.actions} max={100} size="sm" colorScheme="blue" />
              </Box>
            </VStack>
          )}

          <Divider borderColor={dividerColor} />

          {/* Monster Types */}
          {location.monsters && location.monsters.length > 0 && (
            <VStack align="stretch" spacing={2}>
              <HStack spacing={2}>
                <Icon as={FaSkull} color="red.400" />
                <Text color={textColor} fontWeight="bold" fontSize="sm">
                  Monsters
                </Text>
              </HStack>
              <List spacing={1}>
                {location.monsters.map((monsterId) => (
                  <ListItem 
                    key={monsterId} 
                    color={secondaryTextColor} 
                    fontSize="sm"
                    display="flex"
                    alignItems="center"
                  >
                    <Box 
                      as="span" 
                      w={1.5} 
                      h={1.5} 
                      borderRadius="full" 
                      bg="red.400" 
                      mr={2} 
                    />
                    {monsterId}
                  </ListItem>
                ))}
              </List>
            </VStack>
          )}

          {/* Rewards */}
          {combatActions.length > 0 && (
            <VStack align="stretch" spacing={2}>
              <HStack spacing={2}>
                <Icon as={FaCoins} color="yellow.400" />
                <Text color={textColor} fontWeight="bold" fontSize="sm">
                  Possible Rewards
                </Text>
              </HStack>
              <List spacing={1}>
                {combatActions.map(action => (
                  <ListItem 
                    key={action.id} 
                    color={secondaryTextColor} 
                    fontSize="sm"
                    display="flex"
                    alignItems="center"
                  >
                    <Box 
                      as="span" 
                      w={1.5} 
                      h={1.5} 
                      borderRadius="full" 
                      bg="yellow.400" 
                      mr={2} 
                    />
                    {action.itemReward?.name || 'No reward'} 
                    {action.itemReward?.quantity && action.itemReward.quantity > 0 && (
                      <Badge 
                        ml={2} 
                        colorScheme="yellow" 
                        variant="subtle"
                        fontSize="xs"
                      >
                        x{action.itemReward.quantity}
                      </Badge>
                    )}
                  </ListItem>
                ))}
              </List>
            </VStack>
          )}

          {/* Status */}
          <HStack justify="space-between" mt={2}>
            <Badge
              colorScheme={location.levelRequired <= 10 ? 'green' : 'orange'}
              variant="subtle"
              px={3}
              py={1}
              borderRadius="full"
            >
              {location.levelRequired <= 10 ? 'Beginner Friendly' : 'Advanced'}
            </Badge>
            {location.type === 'combat' && (
              <Tooltip 
                label="Combat Location" 
                placement="top"
                hasArrow
                bg="blue.600"
                color="white"
              >
                <Box>
                  <Icon 
                    as={FaStar} 
                    color="yellow.400" 
                    boxSize={5}
                    _hover={{ transform: 'scale(1.2)', color: 'yellow.300' }}
                    transition="all 0.2s"
                  />
                </Box>
              </Tooltip>
            )}
          </HStack>
        </VStack>
      </Box>

      {/* Location Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={bgColor}>
          <ModalHeader color={textColor}>
            <Flex justify="space-between" align="center">
              {location.name}
              <HStack spacing={2}>
                <IconButton
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  icon={<Icon as={FaHeart} color={isFavorite ? "red.400" : "gray.400"} />}
                  size="sm"
                  onClick={() => toggleFavorite(location.id)}
                />
                {locationState?.visited && (
                  <IconButton
                    aria-label="Edit notes"
                    icon={<Icon as={FaEdit} />}
                    size="sm"
                    onClick={() => {
                      setNotesInput(locationState.customNotes || '');
                      setIsEditingNotes(true);
                    }}
                  />
                )}
              </HStack>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Text color={secondaryTextColor}>{location.description}</Text>

              {/* Location Stats */}
              {locationState && (
                <VStack align="stretch" spacing={3}>
                  <Heading size="sm" color={textColor}>Location Stats</Heading>
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color={secondaryTextColor}>Last Visited</Text>
                      <Text color={textColor}>
                        {locationState.lastVisited 
                          ? new Date(locationState.lastVisited).toLocaleDateString() 
                          : 'Never'}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color={secondaryTextColor}>Actions Completed</Text>
                      <Text color={textColor}>{locationState.completedActions.length}</Text>
                    </Box>
                  </SimpleGrid>
                </VStack>
              )}

              {/* Notes Section */}
              {locationState?.visited && (
                <VStack align="stretch" spacing={3}>
                  <Heading size="sm" color={textColor}>Notes</Heading>
                  {isEditingNotes ? (
                    <VStack spacing={2}>
                      <Textarea
                        value={notesInput}
                        onChange={(e) => setNotesInput(e.target.value)}
                        placeholder="Add your notes about this location..."
                        size="sm"
                      />
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => {
                            setLocationNotes(location.id, notesInput);
                            setIsEditingNotes(false);
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setIsEditingNotes(false)}
                        >
                          Cancel
                        </Button>
                      </HStack>
                    </VStack>
                  ) : (
                    <Text color={secondaryTextColor}>
                      {locationState.customNotes || 'No notes added yet.'}
                    </Text>
                  )}
                </VStack>
              )}

              {/* Combat Actions */}
              {combatActions.length > 0 && (
                <VStack align="stretch" spacing={3}>
                  <Heading size="sm" color={textColor}>Available Actions</Heading>
                  {combatActions.map(action => (
                    <Button
                      key={action.id}
                      onClick={() => {
                        startAction(action);
                        onClose();
                      }}
                      colorScheme="blue"
                      size="sm"
                      leftIcon={<Icon as={FaSkull} />}
                    >
                      {action.name}
                    </Button>
                  ))}
                </VStack>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}; 