import { Box, Text, VStack, keyframes, Image, HStack } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { getItemById } from '../../data/items';

interface FeedbackItem {
  id: string;
  xpText?: string;
  itemText?: string;
  color: string;
  icon?: string;
  timestamp: number;
  type: 'reward' | 'levelup';
}

export const ActionFeedback = () => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const { lastActionReward, clearActionReward } = useGameStore();

  // Clean up old items
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setFeedbackItems(prev => prev.filter(item => now - item.timestamp < 2000));
    }, 100);

    return () => clearInterval(cleanup);
  }, []);

  useEffect(() => {
    console.log('ActionFeedback: lastActionReward received:', lastActionReward);
    
    if (lastActionReward) {
      const newItems: FeedbackItem[] = [];
      const timestamp = Date.now();
      
      // Add combined XP and item feedback
      if (lastActionReward.xp || lastActionReward.item) {
        const itemData = lastActionReward.item ? getItemById(lastActionReward.item.id) : null;
        const xpText = lastActionReward.xp ? `+${lastActionReward.xp} XP` : '';
        const itemText = lastActionReward.item ? `+${lastActionReward.item.quantity} ${lastActionReward.item.name}` : '';
        
        newItems.push({
          id: `reward-${timestamp}`,
          xpText,
          itemText,
          color: 'blue.300',
          icon: itemData?.icon,
          timestamp,
          type: 'reward'
        });
      }

      // Add level up feedback (kept separate)
      if (lastActionReward.levelUp) {
        newItems.push({
          id: `levelup-${timestamp}`,
          itemText: `${lastActionReward.levelUp.skill} Level Up! (${lastActionReward.levelUp.level})`,
          color: 'yellow.300',
          timestamp,
          type: 'levelup'
        });
      }

      console.log('Setting new feedback items:', newItems);
      setFeedbackItems(prev => [...prev, ...newItems]);
      
      // Clear the reward after adding to feedbackItems
      setTimeout(() => {
        console.log('Clearing action reward');
        clearActionReward();
      }, 100);
    }
  }, [lastActionReward, clearActionReward]);

  return (
    <Box
      position="fixed"
      bottom="100px"
      right="20px"
      zIndex={99999}
      pointerEvents="none"
      maxHeight="80vh"
      overflow="hidden"
    >
      <AnimatePresence mode="popLayout">
        {feedbackItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.4,
                ease: "easeOut"
              }
            }}
            exit={{ 
              opacity: 0,
              transition: {
                delay: 1,
                duration: 1,
                ease: "easeOut"
              }
            }}
            style={{
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Box
              backgroundColor="rgba(0, 0, 0, 0.9)"
              color={item.color}
              px={4}
              py={2}
              borderRadius="full"
              fontWeight="bold"
              boxShadow="0 2px 10px rgba(0,0,0,0.3)"
              border="2px solid"
              borderColor="whiteAlpha.200"
              display="flex"
              alignItems="center"
              gap={3}
              minW="fit-content"
            >
              {item.icon && (
                <Image
                  src={item.icon}
                  alt=""
                  boxSize="32px"
                  objectFit="contain"
                  fallbackSrc="/assets/items/placeholder.png"
                />
              )}
              {item.type === 'reward' ? (
                <VStack spacing={0} align="flex-start">
                  {item.itemText && (
                    <Text fontSize="md" whiteSpace="nowrap">
                      {item.itemText}
                    </Text>
                  )}
                  {item.xpText && (
                    <Text fontSize="sm" whiteSpace="nowrap" opacity={0.9}>
                      {item.xpText}
                    </Text>
                  )}
                </VStack>
              ) : (
                <Text fontSize="lg" whiteSpace="nowrap">
                  {item.itemText}
                </Text>
              )}
            </Box>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
}; 