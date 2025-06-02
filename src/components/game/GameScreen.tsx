import { Box, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { ForestLocation } from './ForestLocation';
import { QuarryLocation } from './QuarryLocation';
import CampLocation from './CampLocation';
import GeneralStoreLocation from './GeneralStoreLocation';

const MotionBox = motion(Box);

export const GameScreen = () => {
  const { currentLocation, currentAction } = useGameStore();

  const renderLocation = () => {
    switch (currentLocation?.id) {
      case 'forest':
        return <ForestLocation />;
      case 'quarry':
        return <QuarryLocation />;
      case 'camp':
        return <CampLocation />;
      case 'general_store':
        return <GeneralStoreLocation />;
      default:
        return <ForestLocation />;
    }
  };

  return (
    <Flex
      position="relative"
      width="100%"
      height="100%"
      direction="column"
      overflow="hidden"
    >
      {/* Location Content */}
      <Box flex={1}>
        {renderLocation()}
      </Box>
    </Flex>
  );
}; 