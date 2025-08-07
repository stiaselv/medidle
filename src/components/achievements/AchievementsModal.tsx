import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Box,
  Badge,
  Progress,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaTrophy, FaMedal, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { useGameStore } from '../../store/gameStore';
import { getAllAchievements, getAchievementsByCategory } from '../../data/achievements';
import { getLevelFromExperience } from '../../utils/experience';
import type { Achievement } from '../../types/game';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  const { character, getAchievementProgress } = useGameStore();
  
  if (!character || !achievement) return null;

  let progress = 0;
  try {
    progress = getAchievementProgress(achievement.id) || 0;
  } catch (error) {
    console.error('Error getting achievement progress:', error);
    progress = 0;
  }

  const isCompleted = achievement.isCompleted || false;
  const progressPercent = achievement.requirement?.target > 0 ? (progress / achievement.requirement.target) * 100 : 0;

  const getProgressText = () => {
    if (!achievement?.requirement) return '';
    
    try {
      if (achievement.requirement.type === 'action_count') {
        return `${progress.toLocaleString()} / ${achievement.requirement.target.toLocaleString()} actions`;
      } else if (achievement.requirement.type === 'gold_total') {
        return `${progress.toLocaleString()} / ${achievement.requirement.target.toLocaleString()} gold`;
      } else if (achievement.requirement.type === 'skill_level' && achievement.requirement.skillName) {
        const skillName = achievement.requirement.skillName;
        if (character?.skills?.[skillName]) {
          const currentLevel = getLevelFromExperience(character.skills[skillName].experience);
          return `Level ${currentLevel} / ${achievement.requirement.target}`;
        }
      }
    } catch (error) {
      console.error('Error getting progress text:', error);
    }
    return '';
  };

  return (
    <Box
      border="2px"
      borderColor={isCompleted ? "yellow.500" : "gray.600"}
      borderRadius="md"
      p={3}
      bg={isCompleted ? "yellow.900" : "gray.800"}
      _hover={{ borderColor: isCompleted ? "yellow.400" : "gray.500" }}
      transition="all 0.2s"
      opacity={isCompleted ? 1 : 0.8}
    >
      <VStack align="start" spacing={2}>
        {/* Achievement Header */}
        <HStack justify="space-between" w="100%">
          <HStack>
            <Text fontSize="2xl">{achievement?.icon || '🏆'}</Text>
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" fontWeight="bold" color="white">
                {achievement?.title || 'Unknown Achievement'}
              </Text>
              <Text fontSize="xs" color="gray.400">
                {achievement?.description || 'No description available'}
              </Text>
            </VStack>
          </HStack>
          {isCompleted && (
            <Icon as={FaTrophy} color="yellow.400" boxSize={5} />
          )}
        </HStack>

        {/* Progress */}
        {!isCompleted && (
          <VStack align="start" spacing={1} w="100%">
            <HStack justify="space-between" w="100%">
              <Text fontSize="xs" color="gray.300">
                {getProgressText()}
              </Text>
              <Text fontSize="xs" color="gray.400">
                {Math.min(progressPercent, 100).toFixed(1)}%
              </Text>
            </HStack>
            <Progress
              value={Math.min(progressPercent, 100)}
              size="sm"
              colorScheme="yellow"
              w="100%"
              bg="gray.700"
            />
          </VStack>
        )}

        {/* Completed Status */}
        {isCompleted && (
          <Badge colorScheme="yellow" variant="solid">
            Completed
          </Badge>
        )}
      </VStack>
    </Box>
  );
};

type CategoryView = 'overview' | 'actions' | 'wealth' | 'skills';

const CategoryCard = ({ 
  category, 
  title, 
  icon, 
  achievements, 
  completedCount, 
  onClick 
}: {
  category: CategoryView;
  title: string;
  icon: string | React.ComponentType;
  achievements: Achievement[];
  completedCount: number;
  onClick: () => void;
}) => {
  const progressPercent = achievements.length > 0 ? (completedCount / achievements.length) * 100 : 0;

  return (
    <Box
      border="2px"
      borderColor="gray.600"
      borderRadius="lg"
      p={6}
      bg="gray.800"
      _hover={{ 
        borderColor: "gray.500", 
        transform: "translateY(-2px)",
        shadow: "lg"
      }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={onClick}
    >
      <VStack align="start" spacing={4} w="100%">
        {/* Header */}
        <HStack justify="space-between" w="100%">
          <HStack spacing={3}>
            {typeof icon === 'string' ? (
              <Text fontSize="3xl">{icon}</Text>
            ) : (
              <Icon as={icon} boxSize={8} color="yellow.400" />
            )}
            <VStack align="start" spacing={0}>
              <Text fontSize="lg" fontWeight="bold" color="white">
                {title}
              </Text>
              <Text fontSize="sm" color="gray.400">
                {achievements.length} achievement{achievements.length !== 1 ? 's' : ''}
              </Text>
            </VStack>
          </HStack>
          <HStack>
            <Badge 
              colorScheme={completedCount === achievements.length ? "green" : "yellow"} 
              variant="solid"
              fontSize="sm"
            >
              {completedCount} / {achievements.length}
            </Badge>
            <Icon as={FaChevronRight} color="gray.400" />
          </HStack>
        </HStack>

        {/* Progress Bar */}
        <VStack align="start" spacing={2} w="100%">
          <HStack justify="space-between" w="100%">
            <Text fontSize="sm" color="gray.300">
              {progressPercent === 100 ? 'Complete!' : 'Progress'}
            </Text>
            <Text fontSize="sm" color="gray.400">
              {progressPercent.toFixed(1)}%
            </Text>
          </HStack>
          <Progress
            value={progressPercent}
            size="md"
            colorScheme={progressPercent === 100 ? "green" : "yellow"}
            w="100%"
            bg="gray.700"
            borderRadius="md"
          />
        </VStack>
      </VStack>
    </Box>
  );
};

export const AchievementsModal = ({ isOpen, onClose }: AchievementsModalProps) => {
  const { character } = useGameStore();
  const [currentView, setCurrentView] = useState<CategoryView>('overview');

  if (!character) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent bg="gray.900" color="white" maxH="90vh">
          <ModalHeader borderBottom="1px" borderColor="gray.700">
            <HStack>
              <Icon as={FaTrophy} color="yellow.400" />
              <Text>Achievements</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6}>
            <Text textAlign="center" color="gray.400" py={8}>
              No character selected. Please select a character first.
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  const allAchievements = getAllAchievements() || [];
  const actionAchievements = getAchievementsByCategory('actions') || [];
  const wealthAchievements = getAchievementsByCategory('wealth') || [];
  const skillAchievements = getAchievementsByCategory('skills') || [];

  // Update achievements with character's completion status
  const updateAchievementStatus = (achievements: Achievement[]) => {
    if (!achievements || !Array.isArray(achievements)) return [];
    
    return achievements.map(achievement => {
      if (!achievement) return null;
      return {
        ...achievement,
        isCompleted: character?.achievements?.some(a => a?.id === achievement.id && a?.isCompleted) || false
      };
    }).filter(Boolean) as Achievement[];
  };

  const updatedActionAchievements = updateAchievementStatus(actionAchievements);
  const updatedWealthAchievements = updateAchievementStatus(wealthAchievements);
  const updatedSkillAchievements = updateAchievementStatus(skillAchievements);

  const completedCounts = {
    actions: updatedActionAchievements.filter(a => a.isCompleted).length,
    wealth: updatedWealthAchievements.filter(a => a.isCompleted).length,
    skills: updatedSkillAchievements.filter(a => a.isCompleted).length,
  };

  const totalCompleted = Object.values(completedCounts).reduce((sum, count) => sum + count, 0);

  const handleBackToOverview = () => {
    setCurrentView('overview');
  };

  const renderCategoryView = (achievements: Achievement[], categoryTitle: string) => (
    <VStack spacing={4} align="start" w="100%">
      {/* Back Button */}
      <HStack 
        spacing={2} 
        cursor="pointer" 
        onClick={handleBackToOverview}
        _hover={{ color: "yellow.400" }}
        transition="color 0.2s"
      >
        <Icon as={FaChevronLeft} />
        <Text fontSize="sm">Back to Overview</Text>
      </HStack>
      
      {/* Category Header */}
      <Text fontSize="xl" fontWeight="bold" color="white" mb={2}>
        {categoryTitle} Achievements
      </Text>
      
      {/* Achievements Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4} w="100%">
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </SimpleGrid>
    </VStack>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg="gray.900" color="white" maxH="90vh">
        <ModalHeader borderBottom="1px" borderColor="gray.700">
          <HStack justify="space-between" w="100%">
            <HStack>
              <Icon as={FaTrophy} color="yellow.400" />
              <Text>Achievements</Text>
            </HStack>
            <Badge colorScheme="yellow" variant="outline">
              {totalCompleted} / {allAchievements.length} completed
            </Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={6}>
          {currentView === 'overview' ? (
            <VStack spacing={6} align="stretch">
              <Text fontSize="lg" color="gray.300" textAlign="center">
                Track your progress across different achievement categories
              </Text>
              
              <VStack spacing={4}>
                <CategoryCard
                  category="actions"
                  title="Action Achievements"
                  icon="⚡"
                  achievements={updatedActionAchievements}
                  completedCount={completedCounts.actions}
                  onClick={() => setCurrentView('actions')}
                />
                
                <CategoryCard
                  category="wealth"
                  title="Wealth Achievements"
                  icon="💰"
                  achievements={updatedWealthAchievements}
                  completedCount={completedCounts.wealth}
                  onClick={() => setCurrentView('wealth')}
                />
                
                <CategoryCard
                  category="skills"
                  title="Skill Mastery"
                  icon={FaMedal}
                  achievements={updatedSkillAchievements}
                  completedCount={completedCounts.skills}
                  onClick={() => setCurrentView('skills')}
                />
              </VStack>
            </VStack>
          ) : currentView === 'actions' ? (
            renderCategoryView(updatedActionAchievements, "Action")
          ) : currentView === 'wealth' ? (
            renderCategoryView(updatedWealthAchievements, "Wealth")
          ) : currentView === 'skills' ? (
            renderCategoryView(updatedSkillAchievements, "Skill Mastery")
          ) : null}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 