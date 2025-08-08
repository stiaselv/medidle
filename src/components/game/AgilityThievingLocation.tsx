import { Box, Flex, Heading, VStack, useBreakpointValue, Text, SimpleGrid } from '@chakra-ui/react';
// import agilityBg from '../../assets/BG/rooftop_thieving.webp'; // Using public path instead
import { useGameStore } from '../../store/gameStore';
import { mockLocations } from '../../data/mockData';
import { ActionSection } from './ForestLocation';

const outerCityLocation = mockLocations.find(loc => loc.id === 'rooftop_thieving');
const locationName = outerCityLocation?.name || 'Outer city';
const locationDescription = outerCityLocation?.description || '';
const actions = (outerCityLocation?.actions || []).filter(
  (a) => a.type === 'agility' || a.type === 'thieving'
) as import('../../types/game').SkillAction[];

const AgilityThievingLocation = () => {
  const { character, startAction, currentAction, canPerformAction } = useGameStore();
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!character) return null;

  const agilityActions = actions.filter(a => a.skill === 'agility');
  const thievingActions = actions.filter(a => a.skill === 'thieving');

  // Type guard for SkillAction
  function isSkillAction(action: any): action is import('../../types/game').SkillAction {
    return action && (action.type === 'agility' || action.type === 'thieving');
  }

  const skillCurrentAction = isSkillAction(currentAction) ? currentAction : null;

  return (
    <Box
      w="100vw"
      minH="100vh"
      bgImage="url('/assets/BG/rooftop_thieving.webp?v=2')"
      bgSize="cover"
      bgPosition="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      pt={{ base: 4, md: 10 }}
      px={{ base: 2, md: 8 }}
    >
      <Heading color="white" mb={6} textShadow="0 2px 8px #000">{locationName}</Heading>
      <Text mb={6}>{locationDescription}</Text>
      <Flex direction={{ base: 'column', md: 'row' }} gap={8} width="100%" maxW="1200px" justify="center">
        <VStack spacing={8} align="stretch" width="100%">
          <Flex direction={{ base: 'column', md: 'row' }} gap={8} width="100%">
            <Box flex={1} minW={0}>
              <ActionSection
                title="Agility Actions"
                actions={agilityActions}
                onActionClick={startAction}
                canPerformAction={canPerformAction}
                currentAction={skillCurrentAction}
              />
            </Box>
            <Box flex={1} minW={0}>
              <ActionSection
                title="Thieving Actions"
                actions={thievingActions}
                onActionClick={startAction}
                canPerformAction={canPerformAction}
                currentAction={skillCurrentAction}
              />
            </Box>
          </Flex>
        </VStack>
      </Flex>
    </Box>
  );
};

export default AgilityThievingLocation; 