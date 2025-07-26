export { workbenchLocation } from './workbench';
export { alchemyStationLocation } from './alchemyStation';
export { quarryLocation } from './quarry';
export { campLocation } from './camp';
export { forgeLocation } from './forge';
export { forestLocation } from './forest';
export { bankLocation } from './bank';
export { generalStoreLocation } from './generalStore';
export { combatLocation, COMBAT_LOCATIONS } from './combat';
export { templeLocation } from './temple';
export { slayerCaveLocation } from './slayerCave';
export { SLAYER_CAVE_LOCATIONS } from './slayerCaves';
export { rooftopThievingLocation } from './rooftopThieving';

// Import all locations for easy access
import { workbenchLocation } from './workbench';
import { alchemyStationLocation } from './alchemyStation';
import { quarryLocation } from './quarry';
import { campLocation } from './camp';
import { forgeLocation } from './forge';
import { forestLocation } from './forest';
import { bankLocation } from './bank';
import { generalStoreLocation } from './generalStore';
import { combatLocation, COMBAT_LOCATIONS } from './combat';
import { templeLocation } from './temple';
import { slayerCaveLocation } from './slayerCave';
import { SLAYER_CAVE_LOCATIONS } from './slayerCaves';
import { rooftopThievingLocation } from './rooftopThieving';

// Export all locations as an array (combat sub-locations are not included here as they're accessed through the combat hub)
export const locations = [
  generalStoreLocation,
  bankLocation,
  forestLocation,
  quarryLocation,
  campLocation,
  forgeLocation,
  workbenchLocation,
  alchemyStationLocation,
  rooftopThievingLocation,
  combatLocation, // Main combat hub
  templeLocation,
  slayerCaveLocation, // Main slayer hub (sub-locations are accessed through the hub)
]; 