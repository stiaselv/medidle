import React from 'react';
import { Box, Flex, VStack, Text, Grid, Tabs, TabList, TabPanels, Tab, TabPanel, useBreakpointValue } from '@chakra-ui/react';
import { useGameStore } from '../../store/gameStore';
import type { SkillAction } from '../../types/game';
import { ActionSection } from './ForestLocation';
// Using direct path to public assets

export const FarmingLocation = () => {
  const { currentLocation, startAction, currentAction, canPerformAction } = useGameStore();
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!currentLocation) return null;

  const handleActionStart = (action: SkillAction) => {
    startAction(action);
  };

  // Filter farming actions by category
  const allotmentActions = currentLocation.actions.filter(
    (action): action is SkillAction => 
      action.type === 'farming' && 'category' in action && action.category === 'allotment'
  );

  const herbActions = currentLocation.actions.filter(
    (action): action is SkillAction => 
      action.type === 'farming' && 'category' in action && action.category === 'herbs'
  );

  const treeActions = currentLocation.actions.filter(
    (action): action is SkillAction => 
      action.type === 'farming' && 'category' in action && action.category === 'trees'
  );

  // Helper to safely cast currentAction to SkillAction | null
  const getSkillCurrentAction = (type: string): SkillAction | null => {
    if (currentAction && currentAction.type === type) {
      return currentAction as SkillAction;
    }
    return null;
  };

  return (
    <Box
      w="100%"
      minH="100vh"
      bgImage="url(/assets/BG/fields.webp)"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      position="relative"
    >
      {/* Background overlay for better text readability */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.300"
        zIndex={1}
      />

      <Flex
        position="relative"
        direction="column"
        minH="100vh"
        p={{ base: 4, md: 8 }}
        zIndex={2}
      >
        <VStack 
          spacing={8} 
          align="stretch"
          w="100%"
          maxW="100%"
        >
          {/* Location Header */}
          <Box
            bg="blackAlpha.700"
            p={6}
            borderRadius="xl"
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor="whiteAlpha.200"
            boxShadow="dark-lg"
            maxW="600px"
            mx="auto"
            textAlign="center"
          >
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="white"
              textShadow="0 2px 4px rgba(0,0,0,0.4)"
              mb={3}
            >
              {currentLocation.name}
            </Text>
            <Text
              fontSize="md"
              color="gray.300"
              maxW="500px"
              mx="auto"
              lineHeight="1.6"
            >
              {currentLocation.description}
            </Text>
          </Box>

          {/* Farming Tabs */}
          <Box
            bg="blackAlpha.700"
            borderRadius="xl"
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor="whiteAlpha.200"
            boxShadow="dark-lg"
            w="100%"
            maxW="1200px"
            mx="auto"
            p={4}
          >
            <Tabs variant="soft-rounded" colorScheme="green" isFitted={isMobile}>
              <TabList mb={4}>
                <Tab color="white" _selected={{ bg: "green.500", color: "white" }}>
                  Allotment ({allotmentActions.length})
                </Tab>
                <Tab color="white" _selected={{ bg: "green.500", color: "white" }}>
                  Herbs ({herbActions.length})
                </Tab>
                <Tab color="white" _selected={{ bg: "green.500", color: "white" }}>
                  Trees ({treeActions.length})
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <ActionSection
                    title="Allotment Farming"
                    actions={allotmentActions}
                    onActionClick={handleActionStart}
                    canPerformAction={canPerformAction}
                    currentAction={getSkillCurrentAction('farming')}
                  />
                </TabPanel>

                <TabPanel>
                  <ActionSection
                    title="Herb Farming"
                    actions={herbActions}
                    onActionClick={handleActionStart}
                    canPerformAction={canPerformAction}
                    currentAction={getSkillCurrentAction('farming')}
                  />
                </TabPanel>

                <TabPanel>
                  <ActionSection
                    title="Tree Farming"
                    actions={treeActions}
                    onActionClick={handleActionStart}
                    canPerformAction={canPerformAction}
                    currentAction={getSkillCurrentAction('farming')}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
}; 