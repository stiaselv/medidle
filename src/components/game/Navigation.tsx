import { 
  Box, 
  Button, 
  VStack, 
  Text, 
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Icon,
  HStack,
  Badge,
  Tooltip,
  Divider
} from "@chakra-ui/react";
import { useGameStore } from "../../store/gameStore";
import { 
  FaTree, 
  FaMountain, 
  FaCampground, 
  FaStore, 
  FaHeart, 
  FaHistory, 
  FaCompass
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { mockLocations } from '../../data/mockData';
import type { Location, SkillName } from '../../types/game';

interface LocationButtonProps {
  location: Location & { icon: IconType };
  isActive: boolean;
  onClick: () => void;
  showBadges?: boolean;
  isFavorite?: boolean;
  isRecent?: boolean;
}

const LocationButton: React.FC<LocationButtonProps> = ({ 
  location, 
  isActive, 
  onClick,
  showBadges = false,
  isFavorite = false,
  isRecent = false
}) => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const activeBgColor = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeBorderColor = useColorModeValue('blue.200', 'blue.700');

  return (
    <Button
      variant="outline"
      colorScheme={isActive ? "blue" : "gray"}
      height="auto"
      p={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      onClick={onClick}
      _hover={{ transform: 'scale(1.02)' }}
      transition="all 0.2s"
      w="100%"
      bg={isActive ? activeBgColor : bgColor}
      borderColor={isActive ? activeBorderColor : borderColor}
      position="relative"
    >
      <HStack spacing={2} w="100%" justify="center">
        <Icon as={location.icon} boxSize={5} />
        <Text fontWeight="bold">{location.name}</Text>
      </HStack>
      
      {showBadges && (
        <HStack spacing={1} position="absolute" top={1} right={1}>
          {isFavorite && (
            <Tooltip label="Favorite" placement="top">
              <Badge colorScheme="red" variant="solid" p={1}>
                <Icon as={FaHeart} boxSize={2} />
              </Badge>
            </Tooltip>
          )}
          {isRecent && (
            <Tooltip label="Recently Visited" placement="top">
              <Badge colorScheme="blue" variant="solid" p={1}>
                <Icon as={FaHistory} boxSize={2} />
              </Badge>
            </Tooltip>
          )}
        </HStack>
      )}

      <Text 
        fontSize="sm" 
        color="gray.400" 
        noOfLines={2}
        textAlign="center"
        w="100%"
        whiteSpace="normal"
        wordBreak="break-word"
      >
        {location.description}
      </Text>
      
      {location.availableSkills && (
        <HStack spacing={1} mt={2} flexWrap="wrap" justify="center">
          {location.availableSkills.map((skill: SkillName) => (
            <Tooltip key={skill} label={skill.charAt(0).toUpperCase() + skill.slice(1)} placement="top">
              <Box>
                <img
                  src={`/assets/ItemThumbnail/skillicons/${skill}.png`}
                  alt={`${skill} icon`}
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    filter: 'brightness(1.1)',
                    opacity: 0.8
                  }}
                  onError={(e) => {
                    e.currentTarget.src = '/assets/items/placeholder.png';
                  }}
                />
              </Box>
            </Tooltip>
          ))}
        </HStack>
      )}
    </Button>
  );
};

// Map location IDs to icons
const locationIcons: Record<string, IconType> = {
  forest: FaTree,
  quarry: FaMountain,
  camp: FaCampground,
  general_store: FaStore
};

export const Navigation = () => {
  const { currentLocation, setLocation, recentLocations, favoriteLocations } = useGameStore();

  // Get full location objects for recent and favorite locations
  const recentLocationObjects = recentLocations
    .map((id: string) => {
      const loc = mockLocations.find((l) => l.id === id);
      return loc ? { ...loc, icon: locationIcons[loc.id] || FaCompass } : null;
    })
    .filter((loc): loc is Location & { icon: IconType } => Boolean(loc))
    .filter((loc: Location & { icon: IconType }) => !['easy_cave', 'medium_cave', 'hard_cave', 'nightmare_cave', 'slayer_cave'].includes(loc.id));

  const favoriteLocationObjects = (favoriteLocations as string[])
    .map((id: string) => {
      const loc = mockLocations.find((l) => l.id === id);
      return loc ? { ...loc, icon: locationIcons[loc.id] || FaCompass } : null;
    })
    .filter((loc): loc is Location & { icon: IconType } => Boolean(loc))
    .filter((loc: Location & { icon: IconType }) => !['easy_cave', 'medium_cave', 'hard_cave', 'nightmare_cave', 'slayer_cave'].includes(loc.id));

  // Add icons to all locations
  const locationsWithIcons = mockLocations.map(loc => ({
    ...loc,
    icon: locationIcons[loc.id] || FaCompass
  })).filter((loc) => !['easy_cave', 'medium_cave', 'hard_cave', 'nightmare_cave', 'slayer_cave'].includes(loc.id));

  return (
    <Box p={4} bg={useColorModeValue('white', 'gray.900')} borderRadius="xl" shadow="lg">
      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList mb={4}>
          <Tab>
            <Icon as={FaCompass} mr={2} />
            All Locations
          </Tab>
          <Tab>
            <Icon as={FaHeart} mr={2} />
            Favorites
          </Tab>
          <Tab>
            <Icon as={FaHistory} mr={2} />
            Recent
          </Tab>
        </TabList>

        <TabPanels>
          {/* All Locations */}
          <TabPanel p={0}>
            <VStack spacing={4}>
              {locationsWithIcons.map((loc) => (
                <LocationButton
                  key={loc.id}
                  location={loc}
                  isActive={currentLocation?.id === loc.id}
                  onClick={() => setLocation(loc)}
                  showBadges
                  isFavorite={favoriteLocations.includes(loc.id)}
                  isRecent={recentLocations.includes(loc.id)}
                />
              ))}
            </VStack>
          </TabPanel>

          {/* Favorites */}
          <TabPanel p={0}>
            <VStack spacing={4}>
              {favoriteLocationObjects.length > 0 ? (
                favoriteLocationObjects.map((loc) => (
                  <LocationButton
                    key={loc.id}
                    location={loc}
                    isActive={currentLocation?.id === loc.id}
                    onClick={() => setLocation(loc)}
                    showBadges
                    isFavorite
                    isRecent={recentLocations.includes(loc.id)}
                  />
                ))
              ) : (
                <Text color="gray.500" py={4} textAlign="center">
                  No favorite locations yet.
                  Add locations to your favorites to see them here.
                </Text>
              )}
            </VStack>
          </TabPanel>

          {/* Recent */}
          <TabPanel p={0}>
            <VStack spacing={4}>
              {recentLocationObjects.length > 0 ? (
                recentLocationObjects.map((loc) => (
                  <LocationButton
                    key={loc.id}
                    location={loc}
                    isActive={currentLocation?.id === loc.id}
                    onClick={() => setLocation(loc)}
                    showBadges
                    isFavorite={favoriteLocations.includes(loc.id)}
                    isRecent
                  />
                ))
              ) : (
                <Text color="gray.500" py={4} textAlign="center">
                  No recently visited locations.
                  Visit locations to see them appear here.
                </Text>
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}; 