import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export const useOfflineTracking = () => {
  const { character, saveCharacter } = useGameStore();

  useEffect(() => {
    if (!character) return;

    const updateLastLogin = () => {
      if (character) {
        const updatedCharacter = {
          ...character,
          lastLogin: new Date()
        };
        // Update the store immediately for offline calculation
        useGameStore.getState().setCharacter(updatedCharacter);
        // Save to backend
        saveCharacter(updatedCharacter);
      }
    };

    // Track page visibility changes (tab switching)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updateLastLogin();
      }
    };

    // Track when user is about to leave the page
    const handleBeforeUnload = () => {
      updateLastLogin();
    };

    // Track when page loses focus (switching windows)
    const handleBlur = () => {
      updateLastLogin();
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('blur', handleBlur);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('blur', handleBlur);
    };
  }, [character, saveCharacter]);

  // Also update lastLogin periodically while active (every 30 seconds)
  useEffect(() => {
    if (!character) return;

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && character) {
        const updatedCharacter = {
          ...character,
          lastLogin: new Date()
        };
        useGameStore.getState().setCharacter(updatedCharacter);
        saveCharacter(updatedCharacter);
      }
    }, 30000); // Update every 30 seconds while active

    return () => clearInterval(interval);
  }, [character, saveCharacter]);
}; 