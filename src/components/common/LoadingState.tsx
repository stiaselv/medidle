import {
  Box,
  Flex,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import type { ReactElement } from 'react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullscreen?: boolean;
}

export const LoadingState = ({ 
  message = 'Loading...', 
  size = 'md',
  fullscreen = false,
}: LoadingStateProps): ReactElement => {
  const bgColor = useColorModeValue('whiteAlpha.50', 'blackAlpha.50');
  const spinnerSizes = {
    sm: '24px',
    md: '40px',
    lg: '64px',
    xl: '96px',
  };

  const content = (
    <>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.600"
        size={size}
        width={spinnerSizes[size]}
        height={spinnerSizes[size]}
      />
      <Text
        fontSize={size === 'sm' ? 'sm' : 'md'}
        color="text-secondary"
        textAlign="center"
      >
        {message}
      </Text>
    </>
  );

  if (fullscreen) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={9999}
        bg={bgColor}
        backdropFilter="blur(4px)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap={4}
        p={4}
        role="alert"
        aria-label={message}
        aria-live="polite"
      >
        {content}
      </Box>
    );
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap={4}
      p={4}
      role="alert"
      aria-label={message}
      aria-live="polite"
    >
      {content}
    </Flex>
  );
}; 