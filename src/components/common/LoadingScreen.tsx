import React from 'react';
import {
  Box,
  VStack,
  Spinner,
  Text,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading your adventure..." 
}) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg={bgColor}
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={9999}
    >
      <VStack spacing={8} textAlign="center">
        {/* Game Logo or Icon */}
        <Box>
          <Image
            src="/assets/game_logo.png"
            alt="Game Logo"
            width="256px"
            height="256px"
            fallbackSrc="/assets/game_logo.png"
          />
        </Box>

        {/* Loading Spinner */}
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />

        {/* Loading Message */}
        <VStack spacing={2}>
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            {message}
          </Text>
          <Text fontSize="sm" color={textColor} opacity={0.7}>
            Please wait while we prepare your journey
          </Text>
        </VStack>

        {/* Loading Animation Dots */}
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box
            width="8px"
            height="8px"
            bg="blue.500"
            borderRadius="50%"
            marginX="2px"
            animation="bounce 1.4s infinite ease-in-out both"
            sx={{
              '@keyframes bounce': {
                '0%, 80%, 100%': {
                  transform: 'scale(0)',
                },
                '40%': {
                  transform: 'scale(1.0)',
                },
              },
            }}
          />
          <Box
            width="8px"
            height="8px"
            bg="blue.500"
            borderRadius="50%"
            marginX="2px"
            sx={{
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: '-0.32s',
              '@keyframes bounce': {
                '0%, 80%, 100%': {
                  transform: 'scale(0)',
                },
                '40%': {
                  transform: 'scale(1.0)',
                },
              },
            }}
          />
          <Box
            width="8px"
            height="8px"
            bg="blue.500"
            borderRadius="50%"
            marginX="2px"
            sx={{
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: '-0.16s',
              '@keyframes bounce': {
                '0%, 80%, 100%': {
                  transform: 'scale(0)',
                },
                '40%': {
                  transform: 'scale(1.0)',
                },
              },
            }}
          />
        </Box>
      </VStack>
    </Box>
  );
}; 