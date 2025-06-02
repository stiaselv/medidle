import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  height?: string;
  colorScheme?: string;
  showPercentage?: boolean;
  isAnimated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  height = '20px',
  colorScheme = 'blue',
  showPercentage = true,
  isAnimated = true,
}) => {
  const percentage = Math.min(Math.max(progress * 100, 0), 100);

  return (
    <Box width="100%">
      {label && (
        <Text mb={1} fontSize="sm" color="gray.300">
          {label}
        </Text>
      )}
      <Box
        height={height}
        bg="whiteAlpha.200"
        borderRadius="full"
        overflow="hidden"
        position="relative"
      >
        <Box
          height="100%"
          width={`${percentage}%`}
          bg={`${colorScheme}.500`}
          transition={isAnimated ? "width 0.3s ease-in-out" : "none"}
          borderRadius="full"
          position="relative"
          _hover={{
            bg: `${colorScheme}.400`,
          }}
          _before={isAnimated ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.1) 50%,
              transparent 100%
            )`,
            transform: 'translateX(-100%)',
            animation: 'shimmer 2s infinite',
          } : undefined}
        />
        {showPercentage && (
          <Text
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            color="white"
            fontSize="xs"
            fontWeight="bold"
            textShadow="0 1px 2px rgba(0,0,0,0.6)"
          >
            {Math.round(percentage)}%
          </Text>
        )}
      </Box>
    </Box>
  );
}; 