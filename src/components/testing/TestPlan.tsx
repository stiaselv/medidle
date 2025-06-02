import {
  Box,
  VStack,
  Heading,
  Text,
  List,
  ListItem,
  ListIcon,
  Button,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

interface TestCase {
  id: string;
  title: string;
  description: string;
  steps: string[];
  expectedResult: string;
  status: 'pending' | 'passed' | 'failed';
  error?: string;
}

interface TestSection {
  id: string;
  title: string;
  description: string;
  tests: TestCase[];
}

const testSections: TestSection[] = [
  {
    id: 'character',
    title: 'Character Creation and Selection',
    description: 'Tests for creating, selecting, and managing characters',
    tests: [
      {
        id: 'char-create',
        title: 'Create New Character',
        description: 'Create a new character and verify initial state',
        steps: [
          'Click "Create Character"',
          'Enter character name',
          'Submit form',
        ],
        expectedResult: 'Character created with correct initial stats and equipment',
        status: 'pending',
      },
      {
        id: 'char-select',
        title: 'Select Existing Character',
        description: 'Load and select an existing character',
        steps: [
          'Go to character selection',
          'Click on existing character',
        ],
        expectedResult: 'Character loaded with correct stats, equipment, and location',
        status: 'pending',
      },
      {
        id: 'char-persist',
        title: 'Character Data Persistence',
        description: 'Verify character data is saved correctly',
        steps: [
          'Make changes to character (gain XP, items)',
          'Refresh page',
          'Select same character',
        ],
        expectedResult: 'All character changes persisted after refresh',
        status: 'pending',
      },
    ],
  },
  {
    id: 'skills',
    title: 'Skill Training',
    description: 'Tests for skill actions, requirements, and progression',
    tests: [
      {
        id: 'skill-action',
        title: 'Start Skill Action',
        description: 'Start and complete a skill action',
        steps: [
          'Select a skill action',
          'Click to start',
          'Wait for completion',
        ],
        expectedResult: 'Action completes, rewards given, progress shown correctly',
        status: 'pending',
      },
      {
        id: 'skill-req-level',
        title: 'Level Requirements',
        description: 'Verify level requirements for actions',
        steps: [
          'Try action with insufficient level',
          'Level up to requirement',
          'Try action again',
        ],
        expectedResult: 'Action blocked when under-leveled, available when requirement met',
        status: 'pending',
      },
      {
        id: 'skill-req-equip',
        title: 'Equipment Requirements',
        description: 'Verify equipment requirements for actions',
        steps: [
          'Unequip required tool',
          'Try action without tool',
          'Equip tool',
          'Try action again',
        ],
        expectedResult: 'Action blocked without tool, available with correct equipment',
        status: 'pending',
      },
      {
        id: 'skill-progress',
        title: 'Action Progress and Animation',
        description: 'Verify action progress display and animation',
        steps: [
          'Start an action',
          'Watch progress bar',
          'Check character animation',
        ],
        expectedResult: 'Progress bar fills smoothly, character animates correctly',
        status: 'pending',
      },
    ],
  },
  {
    id: 'items',
    title: 'Bank and Equipment',
    description: 'Tests for item management and equipment',
    tests: [
      {
        id: 'bank-storage',
        title: 'Bank Storage',
        description: 'Verify items are stored correctly in bank',
        steps: [
          'Gain items from action',
          'Check bank for items',
          'Verify quantities',
        ],
        expectedResult: 'Items appear in bank with correct quantities',
        status: 'pending',
      },
      {
        id: 'equip-items',
        title: 'Equip/Unequip Items',
        description: 'Test equipping and unequipping items',
        steps: [
          'Open bank',
          'Equip an item',
          'Unequip the item',
        ],
        expectedResult: 'Items move correctly between bank and equipment slots',
        status: 'pending',
      },
    ],
  },
  {
    id: 'offline',
    title: 'Offline Progress',
    description: 'Tests for offline progression system',
    tests: [
      {
        id: 'offline-progress',
        title: 'Offline Progress Calculation',
        description: 'Verify offline progress is calculated correctly',
        steps: [
          'Start an action',
          'Close/refresh page',
          'Wait 2+ minutes',
          'Return to game',
        ],
        expectedResult: 'Offline progress calculated and rewards given correctly',
        status: 'pending',
      },
      {
        id: 'offline-popup',
        title: 'Offline Progress Popup',
        description: 'Verify offline progress popup display',
        steps: [
          'Return after offline progress',
          'Check popup content',
        ],
        expectedResult: 'Popup shows correct XP and items gained while offline',
        status: 'pending',
      },
      {
        id: 'reward-popup',
        title: 'Action Reward Popups',
        description: 'Verify action reward popup display',
        steps: [
          'Complete an action',
          'Check reward popup',
        ],
        expectedResult: 'Popup shows correct XP and items from action',
        status: 'pending',
      },
    ],
  },
];

export const TestPlan = () => {
  const [sections, setSections] = useState(testSections);
  const toast = useToast();
  const gameStore = useGameStore();

  const updateTestStatus = (sectionId: string, testId: string, status: 'passed' | 'failed', error?: string) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          tests: section.tests.map(test => {
            if (test.id === testId) {
              return { ...test, status, error };
            }
            return test;
          }),
        };
      }
      return section;
    }));

    toast({
      title: `Test ${status === 'passed' ? 'Passed' : 'Failed'}`,
      description: error || `${testId} test ${status === 'passed' ? 'passed successfully' : 'failed'}`,
      status: status === 'passed' ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Heading size="lg">Core Flow Test Plan</Heading>
        <Text>
          Use this plan to verify all core game functionality is working correctly.
          Mark each test as passed or failed after manual verification.
        </Text>

        <Accordion allowMultiple>
          {sections.map(section => (
            <AccordionItem key={section.id}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Heading size="md">{section.title}</Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <VStack align="stretch" spacing={4}>
                  <Text>{section.description}</Text>
                  <List spacing={4}>
                    {section.tests.map(test => (
                      <ListItem
                        key={test.id}
                        p={4}
                        borderWidth={1}
                        borderRadius="md"
                        borderColor={
                          test.status === 'passed' ? 'green.200' :
                          test.status === 'failed' ? 'red.200' :
                          'gray.200'
                        }
                        bg={
                          test.status === 'passed' ? 'green.50' :
                          test.status === 'failed' ? 'red.50' :
                          'white'
                        }
                      >
                        <VStack align="stretch" spacing={3}>
                          <HStack justify="space-between" align="center">
                            <Heading size="sm">{test.title}</Heading>
                            <Badge
                              colorScheme={
                                test.status === 'passed' ? 'green' :
                                test.status === 'failed' ? 'red' :
                                'gray'
                              }
                            >
                              {test.status}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm">{test.description}</Text>
                          <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={1}>Steps:</Text>
                            <List spacing={1}>
                              {test.steps.map((step, index) => (
                                <ListItem key={index} fontSize="sm">
                                  <ListIcon as={test.status === 'passed' ? CheckCircleIcon : undefined} color="green.500" />
                                  {step}
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                          <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={1}>Expected Result:</Text>
                            <Text fontSize="sm">{test.expectedResult}</Text>
                          </Box>
                          {test.error && (
                            <Box bg="red.50" p={2} borderRadius="md">
                              <Text color="red.500" fontSize="sm">
                                <ListIcon as={WarningIcon} color="red.500" />
                                Error: {test.error}
                              </Text>
                            </Box>
                          )}
                          <HStack spacing={2} justify="flex-end">
                            <Button
                              size="sm"
                              colorScheme="green"
                              onClick={() => updateTestStatus(section.id, test.id, 'passed')}
                            >
                              Pass
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="red"
                              onClick={() => updateTestStatus(section.id, test.id, 'failed')}
                            >
                              Fail
                            </Button>
                          </HStack>
                        </VStack>
                      </ListItem>
                    ))}
                  </List>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </VStack>
    </Box>
  );
}; 