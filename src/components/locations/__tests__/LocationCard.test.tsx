import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { LocationCard } from '../LocationCard';
import { useGameStore } from '../../../store/gameStore';
import { theme } from '../../../theme';
import type { Location, Character, Skills } from '../../../types/game';
import '@testing-library/jest-dom';

// Mock the game store
jest.mock('../../../store/gameStore');
const mockedUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>;

// Mock character data
const mockCharacter: Character = {
  id: 'test-character',
  name: 'Test Character',
  skills: {
    attack: { name: 'Attack', level: 10, experience: 1000, nextLevelExperience: 1500 },
    strength: { name: 'Strength', level: 10, experience: 1000, nextLevelExperience: 1500 },
    defence: { name: 'Defence', level: 10, experience: 1000, nextLevelExperience: 1500 },
    ranged: { name: 'Ranged', level: 10, experience: 1000, nextLevelExperience: 1500 },
    magic: { name: 'Magic', level: 10, experience: 1000, nextLevelExperience: 1500 },
    prayer: { name: 'Prayer', level: 10, experience: 1000, nextLevelExperience: 1500 },
    woodcutting: { name: 'Woodcutting', level: 10, experience: 1000, nextLevelExperience: 1500 },
    fishing: { name: 'Fishing', level: 10, experience: 1000, nextLevelExperience: 1500 },
    mining: { name: 'Mining', level: 10, experience: 1000, nextLevelExperience: 1500 },
    smithing: { name: 'Smithing', level: 10, experience: 1000, nextLevelExperience: 1500 },
    crafting: { name: 'Crafting', level: 10, experience: 1000, nextLevelExperience: 1500 },
    cooking: { name: 'Cooking', level: 10, experience: 1000, nextLevelExperience: 1500 },
    firemaking: { name: 'Firemaking', level: 10, experience: 1000, nextLevelExperience: 1500 },
    fletching: { name: 'Fletching', level: 10, experience: 1000, nextLevelExperience: 1500 },
    slayer: { name: 'Slayer', level: 10, experience: 1000, nextLevelExperience: 1500 },
    hunter: { name: 'Hunter', level: 10, experience: 1000, nextLevelExperience: 1500 },
    combat: { name: 'Combat', level: 10, experience: 1000, nextLevelExperience: 1500 },
    none: { name: 'None', level: 1, experience: 0, nextLevelExperience: 83 }
  } as Skills,
  hitpoints: 10,
  maxHitpoints: 10,
  prayer: 1,
  maxPrayer: 1,
  specialEnergy: 100,
  maxSpecialEnergy: 100,
  activeEffects: [],
  equipment: {},
  bank: [],
  slayerPoints: 0,
  currentSlayerTask: null,
  lastLogin: new Date(),
  combatLevel: 10,
  lastAction: { type: 'none', location: 'none' }
};

// Mock location data
const mockLocation: Location = {
  id: 'test-location',
  name: 'Test Location',
  description: 'A test location for combat',
  type: 'combat',
  levelRequired: 5,
  monsters: ['goblin', 'rat'],
  resources: [],
  category: 'Combat',
  icon: '/test-icon.png',
  actions: [
    {
      id: 'test-combat',
      name: 'Fight Test Monster',
      type: 'combat',
      skill: 'combat',
      experience: 100,
      levelRequired: 5,
      baseTime: 2000,
      itemReward: {
        id: 'test-reward',
        name: 'Test Reward',
        quantity: 1
      }
    }
  ]
};

// Mock store functions
const mockSetLocation = jest.fn();
const mockStartAction = jest.fn();

describe('LocationCard', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseGameStore.mockReturnValue({
      character: mockCharacter,
      setLocation: mockSetLocation,
      startAction: mockStartAction
    } as any);
  });

  it('renders location information correctly', () => {
    render(
      <ChakraProvider theme={theme}>
        <LocationCard location={mockLocation} />
      </ChakraProvider>
    );

    // Check basic information is displayed
    expect(screen.getByText(mockLocation.name)).toBeInTheDocument();
    expect(screen.getByText(mockLocation.description)).toBeInTheDocument();
    expect(screen.getByText(`Level ${mockLocation.levelRequired}+`)).toBeInTheDocument();

    // Check monsters are listed
    mockLocation.monsters?.forEach(monster => {
      expect(screen.getByText(monster)).toBeInTheDocument();
    });

    // Check rewards are displayed
    mockLocation.actions.forEach(action => {
      if (action.type === 'combat' && action.itemReward) {
        expect(screen.getByText(action.itemReward.name)).toBeInTheDocument();
      }
    });
  });

  it('handles click events correctly when accessible', async () => {
    render(
      <ChakraProvider theme={theme}>
        <LocationCard location={mockLocation} />
      </ChakraProvider>
    );

    // Click the card
    fireEvent.click(screen.getByRole('button'));

    // Check that setLocation was called
    expect(mockSetLocation).toHaveBeenCalledWith(mockLocation);

    // Wait for modal to appear
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Check modal content
    expect(screen.getByText('Available Actions')).toBeInTheDocument();

    // Click a combat action
    const actionButton = screen.getByText(mockLocation.actions[0].name);
    fireEvent.click(actionButton);

    // Check that startAction was called
    expect(mockStartAction).toHaveBeenCalledWith(mockLocation.actions[0]);
  });

  it('shows warning when level requirement not met', () => {
    // Mock character with lower level
    mockedUseGameStore.mockReturnValue({
      character: {
        ...mockCharacter,
        skills: {
          ...mockCharacter.skills,
          combat: { ...mockCharacter.skills.combat, level: 1 }
        }
      },
      setLocation: mockSetLocation,
      startAction: mockStartAction
    } as any);

    render(
      <ChakraProvider theme={theme}>
        <LocationCard location={mockLocation} />
      </ChakraProvider>
    );

    // Click the card
    fireEvent.click(screen.getByRole('button'));

    // Check for warning message
    expect(screen.getByText(/level requirement not met/i)).toBeInTheDocument();
    expect(mockSetLocation).not.toHaveBeenCalled();
  });

  it('shows error when no character is present', () => {
    // Mock no character
    mockedUseGameStore.mockReturnValue({
      character: null,
      setLocation: mockSetLocation,
      startAction: mockStartAction
    } as any);

    render(
      <ChakraProvider theme={theme}>
        <LocationCard location={mockLocation} />
      </ChakraProvider>
    );

    // Click the card
    fireEvent.click(screen.getByRole('button'));

    // Check for error message
    expect(screen.getByText(/no character found/i)).toBeInTheDocument();
    expect(mockSetLocation).not.toHaveBeenCalled();
  });

  it('uses custom onClick handler when provided', () => {
    const customOnClick = jest.fn();

    render(
      <ChakraProvider theme={theme}>
        <LocationCard location={mockLocation} onClick={customOnClick} />
      </ChakraProvider>
    );

    // Click the card
    fireEvent.click(screen.getByRole('button'));

    // Check that custom handler was called instead of setLocation
    expect(customOnClick).toHaveBeenCalled();
    expect(mockSetLocation).not.toHaveBeenCalled();
  });

  it('respects disableHover prop', () => {
    const { container } = render(
      <ChakraProvider theme={theme}>
        <LocationCard location={mockLocation} disableHover />
      </ChakraProvider>
    );

    // Check that hover styles are not applied
    const card = container.querySelector('article');
    expect(card).not.toHaveStyle('transform: scale(1.02)');
  });

  it('respects disableClick prop', () => {
    render(
      <ChakraProvider theme={theme}>
        <LocationCard location={mockLocation} disableClick />
      </ChakraProvider>
    );

    // Check that the card is not clickable
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles keyboard navigation correctly', () => {
    render(
      <ChakraProvider theme={theme}>
        <LocationCard location={mockLocation} />
      </ChakraProvider>
    );

    const card = screen.getByRole('button');
    
    // Test keyboard focus
    card.focus();
    expect(card).toHaveFocus();

    // Test Enter key
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(mockSetLocation).toHaveBeenCalledWith(mockLocation);
  });

  it('displays correct visual state for inaccessible location', () => {
    // Mock character with lower level
    mockedUseGameStore.mockReturnValue({
      character: {
        ...mockCharacter,
        skills: {
          ...mockCharacter.skills,
          combat: { ...mockCharacter.skills.combat, level: 1 }
        }
      },
      setLocation: mockSetLocation,
      startAction: mockStartAction
    } as any);

    render(
      <ChakraProvider theme={theme}>
        <LocationCard location={mockLocation} />
      </ChakraProvider>
    );

    // Check for lock icon
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();

    // Check for reduced opacity
    const card = screen.getByRole('button');
    expect(card).toHaveStyle('opacity: 0.7');

    // Check for red level badge
    const badge = screen.getByText(`Level ${mockLocation.levelRequired}+`);
    expect(badge).toHaveClass('chakra-badge--red');
  });

  // Accessibility Tests
  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <ChakraProvider theme={theme}>
          <LocationCard location={mockLocation} />
        </ChakraProvider>
      );

      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('aria-label', `Location: ${mockLocation.name}`);
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('handles modal keyboard navigation', async () => {
      render(
        <ChakraProvider theme={theme}>
          <LocationCard location={mockLocation} />
        </ChakraProvider>
      );

      // Open modal
      fireEvent.click(screen.getByRole('button'));
      
      // Wait for modal
      const modal = await screen.findByRole('dialog');
      expect(modal).toBeInTheDocument();

      // Test close button focus
      const closeButton = screen.getByLabelText(/close/i);
      closeButton.focus();
      expect(closeButton).toHaveFocus();

      // Test Escape key
      fireEvent.keyDown(modal, { key: 'Escape' });
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  // Visual State Tests
  describe('visual states', () => {
    it('shows lock icon for inaccessible locations', () => {
      // Mock character with lower level
      mockedUseGameStore.mockReturnValue({
        character: {
          ...mockCharacter,
          skills: {
            ...mockCharacter.skills,
            combat: { ...mockCharacter.skills.combat, level: 1 }
          }
        },
        setLocation: mockSetLocation,
        startAction: mockStartAction
      } as any);

      render(
        <ChakraProvider theme={theme}>
          <LocationCard location={mockLocation} />
        </ChakraProvider>
      );

      expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
    });

    it('applies correct color scheme based on level requirement', () => {
      const { rerender } = render(
        <ChakraProvider theme={theme}>
          <LocationCard 
            location={{ 
              ...mockLocation, 
              levelRequired: 5 
            }} 
          />
        </ChakraProvider>
      );

      // Check beginner badge
      expect(screen.getByText('Beginner Friendly')).toHaveClass('chakra-badge');

      // Rerender with higher level requirement
      rerender(
        <ChakraProvider theme={theme}>
          <LocationCard 
            location={{ 
              ...mockLocation, 
              levelRequired: 15 
            }} 
          />
        </ChakraProvider>
      );

      // Check advanced badge
      expect(screen.getByText('Advanced')).toHaveClass('chakra-badge');
    });

    it('applies hover styles when accessible', () => {
      const { container } = render(
        <ChakraProvider theme={theme}>
          <LocationCard location={mockLocation} />
        </ChakraProvider>
      );

      const card = container.querySelector('article');
      expect(card).toHaveStyle('transition: all 0.2s');
      
      // Simulate hover
      fireEvent.mouseEnter(card!);
      expect(card).toHaveStyle('transform: scale(1.02)');
    });
  });

  // Modal Tests
  describe('modal functionality', () => {
    it('renders modal content correctly', async () => {
      render(
        <ChakraProvider theme={theme}>
          <LocationCard location={mockLocation} />
        </ChakraProvider>
      );

      // Open modal
      fireEvent.click(screen.getByRole('button'));

      // Wait for modal
      const modal = await screen.findByRole('dialog');
      expect(modal).toBeInTheDocument();

      // Check header
      expect(screen.getByText(mockLocation.name)).toBeInTheDocument();
      expect(screen.getByText(mockLocation.description)).toBeInTheDocument();

      // Check combat actions
      mockLocation.actions.forEach(action => {
        expect(screen.getByText(action.name)).toBeInTheDocument();
      });
    });

    it('handles modal close button', async () => {
      render(
        <ChakraProvider theme={theme}>
          <LocationCard location={mockLocation} />
        </ChakraProvider>
      );

      // Open modal
      fireEvent.click(screen.getByRole('button'));

      // Wait for modal
      await screen.findByRole('dialog');

      // Click close button
      fireEvent.click(screen.getByLabelText(/close/i));

      // Check modal is closed
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('handles combat action buttons in modal', async () => {
      render(
        <ChakraProvider theme={theme}>
          <LocationCard location={mockLocation} />
        </ChakraProvider>
      );

      // Open modal
      fireEvent.click(screen.getByRole('button'));

      // Wait for modal
      await screen.findByRole('dialog');

      // Click combat action
      const actionButton = screen.getByText(mockLocation.actions[0].name);
      fireEvent.click(actionButton);

      // Check action was started
      expect(mockStartAction).toHaveBeenCalledWith(mockLocation.actions[0]);

      // Check modal was closed
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });
}); 