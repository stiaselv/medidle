import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Box, SimpleGrid, useBreakpointValue } from '@chakra-ui/react';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import type { ListRowProps } from 'react-virtualized';
import type { Location } from '../../types/game';
import { COMBAT_LOCATIONS } from '../../data/locations/combat';
import { CombatLocation } from './CombatLocation';

interface CombatLocationsGridProps {
  onLocationSelect?: (location: Location) => void;
}

const BATCH_SIZE = 10; // Number of items to load at once

export const CombatLocationsGrid: React.FC<CombatLocationsGridProps> = ({ onLocationSelect }) => {
  // Filter out the Slayer Cave locations as they're handled separately
  const allLocations = useMemo(() => {
    return Object.values(COMBAT_LOCATIONS).filter(location => 
      !location.id.includes('_cave') && location.id !== 'slayer_cave'
    );
  }, []);

  // State for lazy loading
  const [visibleLocations, setVisibleLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const currentBatchRef = useRef(1);

  // Load initial batch
  useEffect(() => {
    setVisibleLocations(allLocations.slice(0, BATCH_SIZE));
  }, [allLocations]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoading) {
          loadMoreItems();
        }
      },
      {
        root: null,
        rootMargin: '20px',
        threshold: 0.1,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading]);

  // Load more items when scrolling
  const loadMoreItems = useCallback(() => {
    if (isLoading || visibleLocations.length >= allLocations.length) return;

    setIsLoading(true);
    const nextBatch = currentBatchRef.current + 1;
    const nextItems = allLocations.slice(0, nextBatch * BATCH_SIZE);

    setTimeout(() => {
      setVisibleLocations(nextItems);
      currentBatchRef.current = nextBatch;
      setIsLoading(false);
    }, 500); // Add small delay to prevent rapid loading
  }, [isLoading, visibleLocations.length, allLocations]);

  // Responsive grid columns
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 }) || 1;

  return (
    <Box p={4} maxW="1200px" mx="auto">
      <SimpleGrid columns={columns} spacing={4}>
        {visibleLocations.map((location) => (
          <Box
            key={location.id}
            onClick={() => onLocationSelect?.(location)}
            cursor="pointer"
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.02)' }}
          >
            <CombatLocation location={location} />
          </Box>
        ))}
      </SimpleGrid>
      
      {/* Loading trigger element */}
      <Box ref={loadMoreRef} h="20px" mt={4}>
        {isLoading && visibleLocations.length < allLocations.length && (
          <Box textAlign="center" color="gray.500">
            Loading more locations...
          </Box>
        )}
      </Box>
    </Box>
  );
}; 