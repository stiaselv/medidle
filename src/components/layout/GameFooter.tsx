import { Box, IconButton } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Footer } from './Footer';

interface GameFooterProps {
  onToggle: () => void;
  isExpanded: boolean;
}

export const GameFooter = ({ onToggle, isExpanded }: GameFooterProps) => {
  return (
    <Box 
      position="relative" 
      h={isExpanded ? "600px" : "60px"}
      minH={isExpanded ? "600px" : "60px"}
      bg="gray.800" 
      borderTop="2px" 
      borderColor="blue.500"
      boxShadow="0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)"
    >
      <IconButton
        aria-label="Toggle footer"
        icon={isExpanded ? <ChevronDownIcon boxSize={5} /> : <ChevronUpIcon boxSize={5} />}
        position="absolute"
        top="-24px"
        left="50%"
        transform="translate(-50%, 0)"
        onClick={onToggle}
        zIndex={2}
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
            transform: 'translate(-50%, 0) scale(1.1)',
          },
          '&:active': {
            bg: 'var(--chakra-colors-blue-600)',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.2), 0 0 10px rgba(66, 153, 225, 0.2)',
            transform: 'translate(-50%, 0) scale(0.95)',
          }
        }}
        transition="all 0.2s"
      />
      <Footer />
    </Box>
  );
}; 