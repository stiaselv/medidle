import React from 'react';
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
  Button,
  Box,
  Divider,
  Badge,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FaMoon, FaScroll, FaCheck } from 'react-icons/fa';
import { useTheme, type Theme } from '../../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeCard: React.FC<{
  theme: Theme;
  isSelected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  icon: React.ElementType;
  preview?: string;
}> = ({ theme, isSelected, onClick, title, description, icon, preview }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const selectedBorderColor = useColorModeValue('blue.400', 'blue.400');

  return (
    <Box
      as="button"
      onClick={onClick}
      p={4}
      borderRadius="lg"
      borderWidth={2}
      borderColor={isSelected ? selectedBorderColor : borderColor}
      bg={isSelected ? selectedBg : bgColor}
      _hover={{ 
        borderColor: selectedBorderColor,
        transform: 'translateY(-2px)',
        shadow: 'lg'
      }}
      transition="all 0.2s"
      w="100%"
      position="relative"
      textAlign="left"
    >
      {isSelected && (
        <Icon 
          as={FaCheck} 
          position="absolute" 
          top={2} 
          right={2} 
          color="blue.400" 
          boxSize={4}
        />
      )}
      
      <VStack spacing={3} align="flex-start">
        <HStack spacing={3}>
          <Icon as={icon} boxSize={6} color={isSelected ? 'blue.400' : 'gray.500'} />
          <VStack align="flex-start" spacing={0}>
            <Text fontWeight="bold" fontSize="lg">
              {title}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {description}
            </Text>
          </VStack>
        </HStack>
        
        {preview && (
          <Box
            w="100%"
            h="60px"
            borderRadius="md"
            bg={preview}
            border="1px solid"
            borderColor="gray.300"
            position="relative"
            overflow="hidden"
          >
            <Text 
              position="absolute" 
              bottom={1} 
              right={2} 
              fontSize="xs" 
              color="white"
              textShadow="1px 1px 1px rgba(0,0,0,0.8)"
            >
              Preview
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: 'dark' as Theme,
      title: 'Dark Theme',
      description: 'Modern dark interface with blue accents',
      icon: FaMoon,
      preview: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
    },
    {
      id: 'medieval' as Theme,
      title: 'Medieval Theme',
      description: 'Parchment and wood aesthetic with scroll elements',
      icon: FaScroll,
      preview: 'linear-gradient(135deg, #f7fafc 0%, #e2e8f0 50%, #8b4513 100%)'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent>
        <ModalHeader>
          <HStack spacing={3}>
            <Text>Game Settings</Text>
            <Badge colorScheme="blue" variant="subtle">
              v1.0
            </Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {/* Theme Section */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={3}>
                Appearance
              </Text>
              <Text fontSize="sm" color="gray.500" mb={4}>
                Choose your preferred visual theme for the game
              </Text>
              
              <VStack spacing={3}>
                {themes.map((themeOption) => (
                  <ThemeCard
                    key={themeOption.id}
                    theme={themeOption.id}
                    isSelected={theme === themeOption.id}
                    onClick={() => setTheme(themeOption.id)}
                    title={themeOption.title}
                    description={themeOption.description}
                    icon={themeOption.icon}
                    preview={themeOption.preview}
                  />
                ))}
              </VStack>
            </Box>

            <Divider />

            {/* Future Settings Sections */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={3}>
                More Settings Coming Soon
              </Text>
              <Text fontSize="sm" color="gray.500">
                Audio, notifications, and gameplay preferences will be available in future updates.
              </Text>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 