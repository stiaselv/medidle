---
description: Guidelines for creating and maintaining Roo Code rules to ensure consistency and effectiveness.
globs: .roo/rules/*.md
alwaysApply: true
---
# Adding New Items to the Game

When adding new items to the game, follow these steps to ensure they work correctly:

## 1. Item Definition Requirements

- **Always check both locations:**
  - Items must be defined in `src/data/items.ts` in the `ITEMS` object
  - Items must also be correctly referenced in action definitions (e.g., in `mockData.ts`)

- **Required Properties:**
  ```typescript
  // Example item definition
  item_id: {
    id: 'item_id',           // Must match the object key
    name: 'Item Name',       // Display name
    type: ItemType,          // 'tool' | 'resource' | 'consumable'
    category: ITEM_CATEGORIES.X, // Use constants from ITEM_CATEGORIES
    icon: '/assets/items/item_id.png', // Path to item icon
    // Optional properties
    level?: number,          // Required level to use (for tools)
    stats?: ItemStats,       // Item statistics
    slot?: EQUIPMENT_SLOTS.X // Equipment slot (for equippable items)
  }
  ```

## 2. Item Categories

- **Tools**: Equipment used for gathering skills
  - Must specify `level`, `stats`, and `slot`
  - Example: axes, pickaxes, fishing nets

- **Resources**: Raw materials from gathering skills
  - Example: logs, ores, raw fish
  - Use `ITEM_CATEGORIES.RESOURCES`

- **Consumables**: Processed items that can be used
  - Example: cooked food, potions
  - Use `ITEM_CATEGORIES.CONSUMABLES`

## 3. Item Type Validation

- **Check `ItemType` in `types/game.ts`:**
  ```typescript
  export type ItemType = 'tool' | 'resource' | 'consumable';
  ```
- Add new types here if needed (rare)

## 4. Common Mistakes to Avoid

- ❌ **DON'T** define reward items only in action definitions
  ```typescript
  // Wrong: Item only defined in action
  itemReward: {
    id: 'cooked_fish',  // Item doesn't exist in ITEMS
    name: 'Cooked Fish',
    quantity: 1
  }
  ```

- ✅ **DO** define items in both places
  ```typescript
  // In items.ts
  cooked_fish: {
    id: 'cooked_fish',
    name: 'Cooked Fish',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/items/cooked_fish.png'
  }

  // In action definition
  itemReward: {
    id: 'cooked_fish',
    name: 'Cooked Fish',
    quantity: 1
  }
  ```

## 5. Implementation Checklist

Before implementing a new item:
1. ✓ Check if item exists in `ITEMS` object
2. ✓ Verify item has all required properties
3. ✓ Ensure icon path is correct
4. ✓ Add to correct category
5. ✓ Set appropriate type
6. ✓ Add any required stats/level requirements
7. ✓ Update action definitions to reference item correctly

## 6. Example: Adding a New Consumable Item

```typescript
// In items.ts
export const ITEMS: Record<string, Item> = {
  // ... existing items ...
  
  cooked_salmon: {
    id: 'cooked_salmon',
    name: 'Cooked Salmon',
    type: 'consumable',
    category: ITEM_CATEGORIES.CONSUMABLES,
    icon: '/assets/items/cooked_salmon.png'
  }
};

// In mockData.ts action definition
{
  id: 'cook_salmon',
  name: 'Cook Salmon',
  type: 'cooking',
  // ... other action properties ...
  itemReward: {
    id: 'cooked_salmon',
    name: 'Cooked Salmon',
    quantity: 1
  }
}
```

## 7. Testing New Items

After adding a new item:
1. Verify item appears in bank when obtained
2. Check item icon loads correctly
3. Test item in relevant actions
4. Verify item requirements work
5. Test item equipment if applicable

- **Required Rule Structure:**
  ```markdown
  ---
  description: Clear, one-line description of what the rule enforces
  globs: path/to/files/*.ext, other/path/**/*
  alwaysApply: boolean
  ---

  - **Main Points in Bold**
    - Sub-points with details
    - Examples and explanations
  ```

- **File References:**
  - Use `[filename](mdc:path/to/file)` ([filename](mdc:filename)) to reference files
  - Example: [prisma.md](mdc:.roo/rules/prisma.md) for rule references
  - Example: [schema.prisma](mdc:prisma/schema.prisma) for code references

- **Code Examples:**
  - Use language-specific code blocks
  ```typescript
  // ✅ DO: Show good examples
  const goodExample = true;
  
  // ❌ DON'T: Show anti-patterns
  const badExample = false;
  ```

- **Rule Content Guidelines:**
  - Start with high-level overview
  - Include specific, actionable requirements
  - Show examples of correct implementation
  - Reference existing code when possible
  - Keep rules DRY by referencing other rules

- **Rule Maintenance:**
  - Update rules when new patterns emerge
  - Add examples from actual codebase
  - Remove outdated patterns
  - Cross-reference related rules

- **Best Practices:**
  - Use bullet points for clarity
  - Keep descriptions concise
  - Include both DO and DON'T examples
  - Reference actual code over theoretical examples
  - Use consistent formatting across rules 

# Image and Icon Usage Rules

## Asset Verification

- **Always Verify Asset Existence**
  - Before importing or referencing any image/icon, verify that the file exists in the correct location
  - Use placeholder images for missing assets instead of non-existent paths
  - For items without images, use `/assets/items/placeholder.png`
  - For skills without icons, use `/assets/skills/placeholder.png`

## Import Patterns

- **✅ DO: Use verified assets**
  ```typescript
  // Only import if file exists
  import coinsImg from '../assets/ItemThumbnail/Div/Coins.png';
  
  // Use placeholder for missing assets
  const missingItemIcon = '/assets/items/placeholder.png';
  const missingSkillIcon = '/assets/skills/placeholder.png';
  ```

- **❌ DON'T: Reference non-existent assets**
  ```typescript
  // Don't import non-existent files
  import nonExistentImg from '../assets/ItemThumbnail/Missing.png';
  
  // Don't use unverified paths
  const unverifiedPath = '/assets/items/some_item.png';
  ```

## Implementation Guidelines

1. **New Assets**
   - When adding new items or skills, default to placeholder images
   - Only update to actual image paths once assets are created and verified
   - Document missing assets to track what needs to be created

2. **Asset Organization**
   - Keep items images in `/assets/items/` or `/assets/ItemThumbnail/`
   - Keep skill icons in `/assets/skills/` or `/assets/ItemThumbnail/Div/`
   - Follow existing naming conventions for new assets

3. **Code Updates**
   - When removing non-existent asset imports, replace references with placeholder paths
   - Update item/skill definitions to use placeholders until proper assets are available
   - Maintain a consistent placeholder strategy across the codebase

## Examples

```typescript
// Item definition with placeholder
const newItem = {
  id: 'new_item',
  name: 'New Item',
  icon: '/assets/items/placeholder.png', // Use placeholder until asset exists
};

// Skill icon with placeholder
const skillIcon = {
  woodcutting: '/assets/skills/placeholder.png', // Use placeholder until icon exists
};
```

## Asset Verification Process

1. Check if asset exists in the specified path
2. If missing, use appropriate placeholder path
3. Document missing asset for future creation
4. Update code once asset is available

This ensures consistent handling of missing assets and prevents runtime errors from non-existent file references. 