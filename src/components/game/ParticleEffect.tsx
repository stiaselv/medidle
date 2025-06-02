import { Box, keyframes } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const particleKeyframes = keyframes`
  0% { transform: translate(0, 0); opacity: 1; }
  100% { transform: translate(var(--x), var(--y)); opacity: 0; }
`;

interface ParticleProps {
  x: number;
  y: number;
  color: string;
}

const Particle = ({ x, y, color }: ParticleProps) => (
  <Box
    position="absolute"
    width="8px"
    height="8px"
    borderRadius="full"
    bg={color}
    style={{
      '--x': `${x}px`,
      '--y': `${y}px`,
    } as any}
    animation={`${particleKeyframes} 0.8s ease-out forwards`}
  />
);

interface ParticleEffectProps {
  isActive: boolean;
  color?: string;
  particleCount?: number;
}

export const ParticleEffect = ({ 
  isActive, 
  color = 'blue.300',
  particleCount = 8 
}: ParticleEffectProps) => {
  const [particles, setParticles] = useState<ParticleProps[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: particleCount }).map(() => ({
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        color,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isActive, color, particleCount]);

  return (
    <AnimatePresence>
      {isActive && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={10}
          pointerEvents="none"
        >
          {particles.map((particle, index) => (
            <Particle key={index} {...particle} />
          ))}
        </Box>
      )}
    </AnimatePresence>
  );
}; 