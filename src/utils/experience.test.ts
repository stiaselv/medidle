import { getExperienceForLevel, getLevelFromExperience, EXPERIENCE_TABLE } from './experience';

// Test the experience calculations
console.log('Testing experience calculations...');

// Test a few key levels
const testLevels = [1, 2, 10, 50, 99];

for (const level of testLevels) {
  const exp = getExperienceForLevel(level);
  const calculatedLevel = getLevelFromExperience(exp);
  
  console.log(`Level ${level}: ${exp} exp -> Level ${calculatedLevel}`);
  
  if (level !== calculatedLevel) {
    console.error(`❌ ERROR: Level ${level} should have ${exp} exp, but got level ${calculatedLevel}`);
  } else {
    console.log(`✅ Level ${level} calculation correct`);
  }
}

// Test the experience table
console.log('\nTesting experience table...');
for (let level = 1; level <= 10; level++) {
  const tableExp = EXPERIENCE_TABLE[level];
  const calculatedExp = getExperienceForLevel(level);
  
  console.log(`Level ${level}: Table=${tableExp}, Calculated=${calculatedExp}`);
  
  if (tableExp !== calculatedExp) {
    console.error(`❌ ERROR: Level ${level} experience mismatch`);
  } else {
    console.log(`✅ Level ${level} experience correct`);
  }
}

console.log('\nExperience system test complete!'); 