import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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

interface OfflineRewards {
  xp: number;
  item: {
    id: string;
    name: string;
    quantity: number;
  };
  skill: string;
  timePassed: number;
  actionsCompleted: number;
}

function App() {
  const { character, setLocation, processOfflineProgress } = useGameStore();
  const [showOfflineProgress, setShowOfflineProgress] = useState(false);
  const [offlineRewards, setOfflineRewards] = useState<OfflineRewards | null>(null);

  useEffect(() => {
    // Set initial location
    setLocation(mockLocations[0]);

    // Process offline progress
    if (character) {
      const rewards = processOfflineProgress();
      if (rewards) {
        setOfflineRewards(rewards);
        setShowOfflineProgress(true);
      }
    }
  }, [character, setLocation, processOfflineProgress]);

  return (
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
  );
}

export default App;
