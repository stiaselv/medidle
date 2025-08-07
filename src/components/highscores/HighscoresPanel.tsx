import {
  Box,
  VStack,
  HStack,
  Text,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Avatar,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaAward } from 'react-icons/fa';
import type { Character, SkillName } from '../../types/game';
import { calculateTotalLevel, calculateTotalExperience } from '../../utils/experience';
import { createApiUrl } from '../../config/api';

interface HighscoreEntry {
  characterId: string;
  characterName: string;
  rank: number;
  level: number;
  experience: number;
  totalLevel?: number;
  totalExperience?: number;
}

const SKILL_OPTIONS: { value: SkillName | 'total', label: string }[] = [
  { value: 'total', label: 'Total Level' },
  { value: 'attack', label: 'Attack' },
  { value: 'strength', label: 'Strength' },
  { value: 'defence', label: 'Defence' },
  { value: 'hitpoints', label: 'Hitpoints' },
  { value: 'prayer', label: 'Prayer' },
  { value: 'ranged', label: 'Ranged' },
  { value: 'magic', label: 'Magic' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'woodcutting', label: 'Woodcutting' },
  { value: 'fletching', label: 'Fletching' },
  { value: 'fishing', label: 'Fishing' },
  { value: 'firemaking', label: 'Firemaking' },
  { value: 'crafting', label: 'Crafting' },
  { value: 'smithing', label: 'Smithing' },
  { value: 'mining', label: 'Mining' },
  { value: 'herblore', label: 'Herblore' },
  { value: 'agility', label: 'Agility' },
  { value: 'thieving', label: 'Thieving' },
  { value: 'slayer', label: 'Slayer' },
  { value: 'farming', label: 'Farming' },
  { value: 'runecrafting', label: 'Runecrafting' },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <FaTrophy color="gold" />;
    case 2:
      return <FaMedal color="silver" />;
    case 3:
      return <FaAward color="#CD7F32" />; // Bronze
    default:
      return null;
  }
};

const getRankColor = (rank: number) => {
  if (rank === 1) return 'yellow';
  if (rank === 2) return 'gray';
  if (rank === 3) return 'orange';
  if (rank <= 10) return 'purple';
  if (rank <= 50) return 'blue';
  return 'gray';
};

export const HighscoresPanel = () => {
  const [selectedSkill, setSelectedSkill] = useState<SkillName | 'total'>('total');
  const [highscores, setHighscores] = useState<HighscoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    loadHighscores();
  }, [selectedSkill]);

  const loadHighscores = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = createApiUrl(`/api/highscores?skill=${selectedSkill}`);
      console.log('Fetching highscores from:', url);
      
      const response = await fetch(url, {
        credentials: 'include'
      });

      console.log('Highscores response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Highscores API error:', errorText);
        throw new Error(`Failed to load highscores: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Highscores data received:', data);
      setHighscores(data);
    } catch (error) {
      console.error('Failed to load highscores:', error);
      setError(`Failed to load highscores: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        title: 'Error loading highscores',
        description: 'Could not fetch leaderboard data',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const isTotal = selectedSkill === 'total';

  return (
    <VStack spacing={4} h="100%" w="100%">
      {/* Header with skill selection */}
      <HStack w="100%" justify="space-between" align="center">
        <Text fontSize="lg" fontWeight="bold" color="white">
          Highscores
        </Text>
        <Select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value as SkillName | 'total')}
          bg="gray.700"
          color="white"
          borderColor="gray.600"
          width="200px"
          size="sm"
        >
          {SKILL_OPTIONS.map((skill) => (
            <option key={skill.value} value={skill.value} style={{ backgroundColor: '#2D3748', color: 'white' }}>
              {skill.label}
            </option>
          ))}
        </Select>
      </HStack>

      {/* Loading state */}
      {loading && (
        <Flex justify="center" align="center" h="200px">
          <Spinner size="lg" color="blue.500" />
        </Flex>
      )}

      {/* Error state */}
      {error && !loading && (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Highscores table */}
      {!loading && !error && (
        <Box w="100%" overflowY="auto" maxH="400px">
          <Table variant="simple" size="sm">
            <Thead position="sticky" top={0} bg="gray.800" zIndex={1}>
              <Tr>
                <Th color="gray.300" border="none">Rank</Th>
                <Th color="gray.300" border="none">Player</Th>
                <Th color="gray.300" border="none" isNumeric>
                  {isTotal ? 'Total Level' : 'Level'}
                </Th>
                <Th color="gray.300" border="none" isNumeric>
                  {isTotal ? 'Total XP' : 'Experience'}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {highscores.length === 0 ? (
                <Tr>
                  <Td colSpan={4} textAlign="center" color="gray.400" border="none">
                    No data available
                  </Td>
                </Tr>
              ) : (
                highscores.map((entry) => (
                  <Tr key={entry.characterId} _hover={{ bg: 'gray.700' }}>
                    <Td border="none">
                      <HStack>
                        <Badge
                          colorScheme={getRankColor(entry.rank)}
                          variant="solid"
                          fontSize="xs"
                          minW="24px"
                          textAlign="center"
                        >
                          {entry.rank}
                        </Badge>
                        {getRankIcon(entry.rank)}
                      </HStack>
                    </Td>
                    <Td border="none">
                      <HStack>
                        <Avatar size="xs" name={entry.characterName} />
                        <Text color="white" fontWeight="medium">
                          {entry.characterName}
                        </Text>
                      </HStack>
                    </Td>
                    <Td border="none" isNumeric>
                      <Text color="white" fontWeight="bold">
                        {formatNumber(isTotal ? (entry.totalLevel || 0) : entry.level)}
                      </Text>
                    </Td>
                    <Td border="none" isNumeric>
                      <Text color="gray.300" fontSize="sm">
                        {formatNumber(isTotal ? (entry.totalExperience || 0) : entry.experience)}
                      </Text>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      )}
    </VStack>
  );
}; 