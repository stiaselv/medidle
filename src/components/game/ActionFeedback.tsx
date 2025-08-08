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
  type: 'reward' | 'levelup' | 'combat';
  // For combat grouped popup
  monsterName?: string;
  combatItems?: { id: string; name: string; quantity: number; icon?: string }[];
}

export const ActionFeedback = () => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const { lastActionReward, clearActionReward } = useGameStore();

  // Clean up old items (type-specific lifetimes)
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setFeedbackItems(prev => prev.filter(item => {
        const ttl = item.type === 'combat' ? 5000 : 2500; // Combat popups last longer
        return now - item.timestamp < ttl;
      }));
    }, 100);

    return () => clearInterval(cleanup);
  }, []);

  useEffect(() => {
    console.log('ActionFeedback: lastActionReward received:', lastActionReward);
    
    if (lastActionReward) {
      const newItems: FeedbackItem[] = [];
      const timestamp = Date.now();
      
      // Combat-specific formatting: single grouped popup with header and items list
      if (lastActionReward.context === 'combat') {
        const combatItems = (lastActionReward.items && lastActionReward.items.length > 0)
          ? lastActionReward.items.map(ri => ({ id: ri.id, name: ri.name, quantity: ri.quantity, icon: getItemById(ri.id)?.icon }))
          : (lastActionReward.item ? [{ id: lastActionReward.item.id, name: lastActionReward.item.name, quantity: lastActionReward.item.quantity, icon: getItemById(lastActionReward.item.id)?.icon }] : []);
        newItems.push({
          id: `combat-group-${timestamp}`,
          color: 'green.300',
          timestamp,
          type: 'combat',
          monsterName: lastActionReward.monsterName,
          combatItems
        });
      } else if (lastActionReward.items && lastActionReward.items.length > 0) {
        // Skill/other: Multi-row items: if items array is present, create one row per item
        lastActionReward.items.forEach((ri, idx) => {
          const itemData = getItemById(ri.id);
          newItems.push({
            id: `reward-item-${timestamp}-${idx}`,
            itemText: `+${ri.quantity} ${ri.name}`,
            color: 'blue.300',
            icon: itemData?.icon,
            timestamp: timestamp + idx,
            type: 'reward'
          });
        });
      } else if (lastActionReward.item || lastActionReward.xp) {
        // Legacy single combined row
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

      // Add XP rows at the bottom if exist (after items) and not combat
      if (lastActionReward.xp && lastActionReward.context !== 'combat') {
        newItems.push({
          id: `reward-xp-${timestamp}`,
          itemText: `+${lastActionReward.xp} ${lastActionReward.skill ? `${lastActionReward.skill} ` : ''}XP`,
          color: 'blue.300',
          timestamp: timestamp + 900,
          type: 'reward'
        });
      }
      if (lastActionReward.hitpointsXp && lastActionReward.hitpointsXp > 0 && lastActionReward.context !== 'combat') {
        newItems.push({
          id: `reward-hpxp-${timestamp}`,
          itemText: `+${lastActionReward.hitpointsXp} Hitpoints XP`,
          color: 'blue.300',
          timestamp: timestamp + 901,
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
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
      gap={2}
      maxHeight="80vh"
      overflow="hidden"
    >
      <AnimatePresence mode="popLayout">
        {feedbackItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ display: 'flex' }}
          >
            <Box
              backgroundColor={item.type === 'combat' ? 'rgba(0,0,0,0.85)' : 'rgba(0, 0, 0, 0.9)'}
              color={item.color}
              px={item.type === 'combat' ? 4 : 3}
              py={item.type === 'combat' ? 3 : 2}
              borderRadius={item.type === 'combat' ? 'lg' : 'full'}
              fontWeight="bold"
              boxShadow={item.type === 'combat' ? '0 8px 30px rgba(0,0,0,0.5)' : '0 2px 10px rgba(0,0,0,0.3)'}
              border={item.type === 'combat' ? '1px solid' : '2px solid'}
              borderColor={item.type === 'combat' ? 'whiteAlpha.300' : 'whiteAlpha.200'}
              display="flex"
              alignItems={item.type === 'combat' ? 'flex-start' : 'center'}
              gap={3}
              minW="fit-content"
              backdropFilter={item.type === 'combat' ? 'blur(6px)' : undefined}
              style={item.type === 'combat' ? { borderLeft: '4px solid #48BB78' } : undefined}
            >
              {item.icon && item.type !== 'combat' && (
                <Image
                  src={item.icon}
                  alt=""
                  boxSize="28px"
                  objectFit="contain"
                  fallbackSrc="/assets/items/placeholder.png"
                />
              )}
              {item.type === 'combat' ? (
                <VStack spacing={1.5} align="flex-start">
                  <Text fontSize="sm" whiteSpace="nowrap" color="green.300">Monster killed{item.monsterName ? `: ${item.monsterName}` : ''}</Text>
                  <Text fontSize="xs" whiteSpace="nowrap" color="gray.300" mt={1}>Items gained:</Text>
                  {item.combatItems && item.combatItems.length > 0 ? (
                    item.combatItems.map(ci => (
                      <HStack key={`${item.id}-${ci.id}-${ci.name}`} spacing={2} align="center">
                        {ci.icon && (
                          <Image src={ci.icon} alt="" boxSize="20px" objectFit="contain" fallbackSrc="/assets/items/placeholder.png" />
                        )}
                        <Text fontSize="sm" whiteSpace="nowrap">- {ci.quantity}x {ci.name}</Text>
                      </HStack>
                    ))
                  ) : (
                    <Text fontSize="sm" whiteSpace="nowrap">- None</Text>
                  )}
                </VStack>
              ) : (
                <Text fontSize={item.type === 'levelup' ? 'md' : 'sm'} whiteSpace="nowrap">
                  {item.itemText || item.xpText}
                </Text>
              )}
            </Box>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
}; 