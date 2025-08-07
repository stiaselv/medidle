import React from 'react';
import {
  Box,
  VStack,
  Text,
  Image,
  Heading,
  useColorModeValue,
  HStack,
  Icon,
  List,
  ListItem,
  Divider,
} from '@chakra-ui/react';
import { FaSkull } from 'react-icons/fa';
import type { Location } from '../../types/game';

interface SimpleCombatLocationCardProps {
  /** The location data to display */
  location: Location;
  /** Optional click handler for the card */
  onClick?: () => void;
}

/** 
 * SimpleCombatLocationCard component displays a simplified version of combat locations
 * without level requirements, progress bars, rewards, or edit functionality.
 */
export const SimpleCombatLocationCard: React.FC<SimpleCombatLocationCardProps> = ({ 
  location, 
  onClick
}) => {
  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box
      as="article"
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      bg={bgColor}
      borderColor={borderColor}
      _hover={{
        transform: 'scale(1.02)',
        transition: 'transform 0.2s',
        boxShadow: 'xl',
        borderColor: 'purple.400',
        cursor: 'pointer'
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Combat Location: ${location.name}`}
      position="relative"
      transition="all 0.2s"
      w="full"
      maxW="400px"
    >
      {/* Location Image */}
      <Box position="relative">
        <Image
          src={location.background || (typeof location.icon === 'string' ? location.icon : '/assets/locations/placeholder.png')}
          alt={`${location.name} location`}
          objectFit="cover"
          height="180px"
          width="100%"
          fallbackSrc="/assets/locations/placeholder.png"
        />
      </Box>

      <VStack p={4} spacing={3} align="stretch">
        {/* Header with Name */}
        <Heading 
          size="md" 
          color={textColor}
          noOfLines={1}
          textAlign="center"
          _hover={{ color: 'purple.400' }}
          transition="color 0.2s"
        >
          {location.name}
        </Heading>

        {/* Description */}
        <Text 
          color={secondaryTextColor} 
          fontSize="sm"
          textAlign="center"
          noOfLines={3}
        >
          {location.description}
        </Text>

        {/* Monster List */}
        {location.monsters && location.monsters.length > 0 && (
          <>
            <Divider borderColor={useColorModeValue('gray.200', 'gray.600')} />
            <VStack align="stretch" spacing={2}>
              <HStack spacing={2} justify="center">
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
                    justifyContent="center"
                  >
                    <Box 
                      as="span" 
                      w={1.5} 
                      h={1.5} 
                      borderRadius="full" 
                      bg="red.400" 
                      mr={2} 
                    />
                    {monsterId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </ListItem>
                ))}
              </List>
            </VStack>
          </>
        )}
      </VStack>
    </Box>
  );
}; 