import { Box, keyframes } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleEffect } from './ParticleEffect';

const progressKeyframes = keyframes`
  0% { width: 0%; }
  100% { width: 100%; }
`;

const pulseKeyframes = keyframes`
  0% { opacity: 0.4; }
  50% { opacity: 0.8; }
  100% { opacity: 0.4; }
`;

const glowKeyframes = keyframes`
  0% { box-shadow: 0 0 5px rgba(66, 153, 225, 0.3); }
  50% { box-shadow: 0 0 15px rgba(66, 153, 225, 0.6); }
  100% { box-shadow: 0 0 5px rgba(66, 153, 225, 0.3); }
`;

interface ProgressBarProps {
  duration: number;
  isActive: boolean;
  onComplete?: () => void;
}

export const ProgressBar = ({ duration, isActive, onComplete }: ProgressBarProps) => {
  return (
    <Box
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      height="8px"
      bg="whiteAlpha.200"
      overflow="hidden"
      borderBottomRadius="xl"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: 'linear-gradient(90deg, transparent, whiteAlpha.100, transparent)',
        animation: isActive ? `${pulseKeyframes} 2s infinite` : 'none',
      }}
    >
      <AnimatePresence>
        {isActive && (
          <>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ 
                duration: duration / 1000,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop"
              }}
              onAnimationComplete={onComplete}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #4299E1 0%, #63B3ED 100%)',
                position: 'relative',
                animation: `${glowKeyframes} 2s infinite`,
              }}
            >
              <Box
                position="absolute"
                right="-2px"
                top="0"
                bottom="0"
                width="4px"
                bg="white"
                opacity={0.6}
                borderRadius="full"
                animation={`${pulseKeyframes} 1s infinite`}
              />
            </motion.div>
            <ParticleEffect 
              isActive={isActive} 
              color="blue.300"
              particleCount={6}
            />
          </>
        )}
      </AnimatePresence>
    </Box>
  );
}; 