import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { OfflineRewards as GlobalOfflineRewards } from './types/game';
import { GameLayout } from './components/layout/GameLayout';
import { CharacterCreation } from './components/character/CharacterCreation';
import { CharacterSelection } from './components/character/CharacterSelection';
import { useGameStore } from './store/gameStore';
import { mockLocations } from './data/mockData';
import { theme } from './theme';
import { ActionFeedback } from './components/game/ActionFeedback';
import { OfflineProgressPopup } from './components/popups/OfflineProgressPopup';
import { TestPlan } from './components/testing/TestPlan';
import { GameScreen } from './components/game/GameScreen';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import type { OfflineRewards } from './types/game';

function App() {
  const { character, setLocation, processOfflineProgress } = useGameStore();
  const [showOfflineProgress, setShowOfflineProgress] = useState(false);
  const [offlineRewards, setOfflineRewards] = useState<GlobalOfflineRewards | null>(null);

  useEffect(() => {
    // Process offline progress
    if (character) {
      const rewards = processOfflineProgress();
      if (rewards) {
        setOfflineRewards(rewards);
        setShowOfflineProgress(true);
      }
    }
  }, [character, processOfflineProgress]);

  return (
    <DndProvider backend={HTML5Backend}>
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/create" element={<CharacterCreation />} />
          <Route path="/select" element={<CharacterSelection />} />

          {/* Protected routes - require character */}
          <Route element={character ? <GameLayout /> : <Navigate to="/select" />}>
            {/* Default route */}
            <Route path="/" element={<Navigate to="/game" />} />
            
            {/* Game route */}
            <Route path="/game" element={<GameScreen />} />
            
            {/* Test route */}
            <Route path="/test" element={<TestPlan />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/game" />} />
          </Route>
        </Routes>
        <ActionFeedback />
        <OfflineProgressPopup
          isOpen={showOfflineProgress}
          onClose={() => setShowOfflineProgress(false)}
          rewards={offlineRewards}
        />
      </Router>
    </ChakraProvider>
    </DndProvider>
  );
}

export default App;
