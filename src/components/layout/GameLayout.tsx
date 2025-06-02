import { Box, Flex, useBreakpointValue, Button, Menu, MenuButton, MenuList, MenuItem, Avatar, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { GameScreen } from '../game/GameScreen';
import { Footer } from './Footer';
import { useGameStore } from '../../store/gameStore';
import { Outlet, useNavigate } from 'react-router-dom';
import { IconButton } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useEffect } from 'react';
import { FaUserFriends, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Icon } from '@chakra-ui/react';
import { MenuDivider } from '@chakra-ui/react';

const MotionBox = motion(Box);

export const GameLayout = () => {
  const { isFooterExpanded, toggleFooter, character, signOut, stopAction } = useGameStore();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/select');
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // ESC key to stop current action
      if (event.key === 'Escape') {
        stopAction();
      }
      // Space bar to toggle footer
      if (event.key === ' ' && !event.repeat && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
        event.preventDefault();
        toggleFooter();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [stopAction, toggleFooter]);

  return (
    <Flex direction="column" h="100vh" w="100vw" overflow="hidden" role="application" aria-label="Game interface">
      {/* Header with Account Menu */}
      <Flex
        as="header"
        w="100%"
        h="60px"
        bg="gray.800"
        borderBottom="1px"
        borderColor="gray.700"
        px={4}
        align="center"
        justify="space-between"
        role="banner"
      >
        {/* Empty flex for spacing */}
        <Box flex="1" />
        
        {/* Centered Title */}
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="white"
          textAlign="center"
          flex="1"
        >
          Medidle
        </Text>

        {/* Account Menu */}
        <Flex flex="1" justify="flex-end">
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              colorScheme="blue"
              leftIcon={<Avatar size="sm" name={character?.name} />}
              rightIcon={<ChevronDownIcon />}
              aria-label="Account menu"
              _hover={{ bg: 'whiteAlpha.200' }}
              _active={{ bg: 'whiteAlpha.300' }}
            >
              {character?.name}
            </MenuButton>
            <MenuList>
              <MenuItem 
                onClick={() => navigate('/select')} 
                aria-label="Switch character"
                icon={<Icon as={FaUserFriends} />}
              >
                Switch Character
              </MenuItem>
              <MenuItem 
                onClick={() => {}} 
                aria-label="Account settings"
                icon={<Icon as={FaCog} />}
              >
                Account Settings
              </MenuItem>
              <MenuDivider />
              <MenuItem 
                onClick={handleSignOut} 
                aria-label="Sign out"
                icon={<Icon as={FaSignOutAlt} />}
              >
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {/* Main Game Area */}
      <Box flex="1" overflow="auto" role="main">
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        position="relative"
        h={isFooterExpanded ? "600px" : "60px"}
        minH={isFooterExpanded ? "600px" : "60px"}
        transition="height 0.3s ease-in-out"
        role="complementary"
        aria-label="Game information panel"
      >
        <IconButton
          aria-label={isFooterExpanded ? "Collapse footer" : "Expand footer"}
          icon={isFooterExpanded ? <ChevronDownIcon boxSize={5} /> : <ChevronUpIcon boxSize={5} />}
          position="absolute"
          top="-24px"
          left="50%"
          transform="translateX(-50%)"
          zIndex={2}
          onClick={toggleFooter}
          w="48px"
          h="48px"
          minW="48px"
          minH="48px"
          p="0"
          colorScheme="blue"
          borderRadius="50%"
          boxShadow="0 0 10px rgba(0, 0, 0, 0.3), 0 0 20px rgba(66, 153, 225, 0.3)"
          bg="blue.500"
          border="2px solid"
          borderColor="blue.200"
          sx={{
            '&:hover': {
              bg: 'var(--chakra-colors-blue-400)',
              boxShadow: '0 0 15px rgba(0, 0, 0, 0.4), 0 0 30px rgba(66, 153, 225, 0.4)',
            },
            '&:active': {
              bg: 'var(--chakra-colors-blue-600)',
              boxShadow: '0 0 5px rgba(0, 0, 0, 0.2), 0 0 10px rgba(66, 153, 225, 0.2)',
            }
          }}
          transition="all 0.2s"
        />
        <Footer />
      </Box>
    </Flex>
  );
}; 