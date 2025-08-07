import React, { useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useGameStore } from './store/gameStore';
import { theme } from './theme';
import { GameLayout } from './components/layout/GameLayout';
import { GameScreen } from './components/game/GameScreen';
import { CharacterSelection } from './components/character/CharacterSelection';
import { UserAuth } from './components/character/UserAuth';
import { LoadingState } from './components/common/LoadingState';
import { OfflineProgressPopup } from './components/popups/OfflineProgressPopup';
import type { OfflineRewards } from './types/game';
import { ActionFeedback } from './components/game/ActionFeedback';
import { TestPlan } from './components/testing/TestPlan';
import CharacterCreation from './components/character/CharacterCreation';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/themes.css';

const App = () => {
  const { user, character, checkAuth, loadCharacters, processOfflineProgress, saveCharacter, isLoading } = useGameStore();
  const [showOfflineProgress, setShowOfflineProgress] = useState(false);
  const [offlineRewards, setOfflineRewards] = useState<OfflineRewards | null>(null);

  useEffect(() => {
    // Check authentication status on initial load
    checkAuth();
  }, []); // Only run on mount

  useEffect(() => {
    // This effect runs when the user object changes (after login/logout)
    if (user) {
      loadCharacters();
    }
  }, [user, loadCharacters]);

  useEffect(() => {
    // This effect runs only when a character is selected/loaded.
    if (character) {
      const rewards = processOfflineProgress();
      if (rewards && (rewards.xp > 0 || (rewards.item && rewards.item.quantity > 0))) {
        setOfflineRewards(rewards);
        setShowOfflineProgress(true);
        // Save the character after offline progress has been applied
        const updatedCharacter = useGameStore.getState().character;
        if (updatedCharacter) {
          saveCharacter(updatedCharacter);
        }
      } else if (character.lastLogin) {
        // Check if enough time passed but no rewards (due to missing requirements)
        const now = new Date();
        const lastLogin = new Date(character.lastLogin);
        const timeDifference = now.getTime() - lastLogin.getTime();
        const MIN_OFFLINE_TIME = 60 * 1000; // 1 minute
        
        if (timeDifference >= MIN_OFFLINE_TIME) {
          setOfflineRewards(null);
          setShowOfflineProgress(true);
        }
      }
    }
  }, [character?.id, saveCharacter]); // Only run when character ID changes, not on every character update

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState message="Loading..." />;
    }

    if (user && character) {
      return (
        <GameLayout>
          <GameScreen />
          <OfflineProgressPopup
            isOpen={showOfflineProgress}
            onClose={() => setShowOfflineProgress(false)}
            rewards={offlineRewards}
            timePassed={character?.lastLogin ? new Date().getTime() - new Date(character.lastLogin).getTime() : undefined}
          />
        </GameLayout>
      );
    }

    if (user) {
      return <CharacterSelection />;
    }

    return <UserAuth />;
  };

  return (
    <ThemeProvider>
      <DndProvider backend={HTML5Backend}>
        <ChakraProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/login" element={!user ? <UserAuth /> : <Navigate to="/" />} />
            <Route 
              path="/create" 
              element={user ? <CharacterCreation /> : <Navigate to="/login" />} 
            />
            <Route
              path="/game"
              element={
                user && character ? (
                  <GameLayout>
                    <GameScreen />
                    <OfflineProgressPopup
                      isOpen={showOfflineProgress}
                      onClose={() => setShowOfflineProgress(false)}
                      rewards={offlineRewards}
                      timePassed={character?.lastLogin ? new Date().getTime() - new Date(character.lastLogin).getTime() : undefined}
                    />
                  </GameLayout>
                ) : (
                  <Navigate to={user ? '/' : '/login'} />
                )
              }
            />
            <Route 
              path="/" 
              element={user ? <CharacterSelection /> : <Navigate to="/login" />} 
            />
          </Routes>
          <ActionFeedback />
        </Router>
      </ChakraProvider>
    </DndProvider>
    </ThemeProvider>
  );
};

export default App;
