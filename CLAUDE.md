# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive RPG game book application built with Nuxt 3, featuring a text-based adventure game with character management, dice mechanics, and dynamic content navigation. The game follows a "choose your own adventure" format where players navigate through numbered sections with character stats affecting gameplay.

## Development Commands

### Local Development
```bash
npm run dev          # Start development server on localhost:3000
npm install          # Install dependencies
```

### Build & Deploy
```bash
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run generate     # Generate static site
```

## Architecture Overview

### Game Content System
- **Content Storage**: Game sections stored as markdown files in `/sections/` directory (001.md through 600+.md, plus preface.md)
- **Content API**: Server API at `/server/api/content/[...slug].ts` handles dynamic content loading and game state detection
- **Navigation**: Markdown links with format `[**89**](#n_89)` enable section-to-section navigation
- **Game Over Detection**: API automatically detects end-game sections by absence of navigation links

### Character Management
- **Global State**: Character data managed via `useCharacter()` composable with localStorage persistence
- **Stats System**: Based on dice rolls - Agility, Strength, Charisma with predefined lookup table
- **Dice Integration**: Uses `@dice-roller/rpg-dice-roller` for authentic RPG mechanics
- **Luck System**: Six-point luck tracking with visual representation

### UI Components Architecture
- **CharacterSheet.vue**: Floating character panel with stats, resources, and quick actions
- **CharacterCreation.vue**: Initial character setup and stat rolling
- **Game Pages**: `/pages/game/index.vue` handles main game content display and navigation
- **Content Viewer**: Uses TUI Editor for markdown rendering with custom click handlers

### Technology Stack
- **Framework**: Nuxt 3 with Vue 3 composition API
- **UI Library**: Vuetify 3 for Material Design components
- **State Management**: Pinia for global state, custom composables for character data
- **Content Rendering**: Toast UI Editor for markdown display
- **Dice Rolling**: RPG Dice Roller library for authentic game mechanics

### Key Files to Understand
- `composables/useCharacter.ts` - Core character management logic and dice mechanics
- `server/api/content/[...slug].ts` - Content loading and game state detection
- `pages/game/index.vue` - Main game interface and navigation handling
- `sections/` directory - Game content in numbered markdown files

### Game Flow
1. Character creation with dice-rolled stats
2. Luck initialization (2d6 roll marks unavailable luck points)
3. Content navigation through markdown links
4. Automatic game over detection when no navigation links present
5. Character sheet tracks all stats, resources, and visited pages

### Content Format
Game sections use specific markdown formatting:
- Navigation links: `[**123**](#n_123)` or `[123](#n_123)`
- Luck checks: Text containing "ПРОВЕРЬТЕ СВОЮ УДАЧУ"
- Charisma tests: Text containing "Проверьте свое ОБАЯНИЕ"

## Game Rules & Mechanics
For complete game rules, character creation, combat system, and mechanics, see [RULES.md](./RULES.md).

### Character Creation Process
1. Roll 2d6 and consult the stats table (see RULES.md)
2. Record initial ЛОВКОСТЬ (Agility), СИЛА (Strength), ОБАЯНИЕ (Charisma)
3. Initialize luck by rolling 2d6 and marking those numbers as "used"
4. Set starting resources: 15 gold, 3 days food, sword, 7-slot backpack
5. Set Mental Power to 3

## Code Style Guidelines
- Use TypeScript for all new files
- Follow Vue 3 Composition API pattern with `<script setup>`
- Prefix all game-related composables with `use` (e.g., `useCharacter`, `useGameState`)
- Use kebab-case for component file names, PascalCase for component names
- All dice rolls must use the @dice-roller/rpg-dice-roller library

## Game Content Rules
- Section numbers must be 3-digit padded (001.md, not 1.md)
- Navigation links must follow format: [**123**](#n_123)
- Never modify existing section content without checking dependent links
- Game over sections have no navigation links
- All Russian text should use proper Cyrillic characters
- Maintain the stats table exactly as defined in RULES.md
- Character creation must follow the 2d6 roll → table lookup process

## Common Issues & Debugging
- Character not loading: Check localStorage in browser dev tools
- Navigation broken: Verify markdown link format in sections/*.md
- Dice rolls not working: Ensure @dice-roller library is properly imported
- Content not displaying: Check server/api/content/[...slug].ts for path resolution
- Stats not matching: Verify STATS_TABLE in useCharacter.ts matches RULES.md table
- Luck system issues: Check luck array initialization in useCharacter.ts

## Security Considerations
- Never log character data to console in production
- Validate all section IDs before file system access
- Sanitize user input in character creation
- localStorage data should be validated on load
- Ensure dice rolls are truly random (not predictable)

## UI/UX Design Guidelines

### Fantasy Book Theme
The application uses a comprehensive fantasy book aesthetic with the following style system:

#### Color Palette
- **Primary Background**: `--parchment-bg: #f4f1e8` (aged parchment)
- **Text Color**: `--ink-color: #2d2926` (dark ink)
- **Border/Accent**: `--aged-border: #d4c5a9` (aged paper borders)
- **Link Color**: `#8B4513` (fantasy brown)
- **Shadow**: `--parchment-shadow: rgba(139, 129, 108, 0.2)`

#### Typography
- **Headers**: `'Cormorant Garamond', 'Cinzel', serif` (fantasy decorative font with Cyrillic support)
- **Body Text**: `'Crimson Text', serif` (readable book font with Cyrillic support)
- **Font Sizes**: 1.1rem base, larger headers, justified text with text-indent
- **Letter Spacing**: 0.5px for headers, proper line-height for readability
- **Cyrillic Support**: Both fonts support Russian and other Cyrillic scripts

#### Component Styling Standards
- **Paper-like containers**: Parchment background with aged borders and subtle shadows
- **Floating elements**: Character sheet positioned bottom-right with mobile responsiveness
- **Modal dialogs**: Must use parchment background, dark ink text, and fantasy borders
- **Buttons**: Fantasy brown gradients with hover effects and proper text contrast
- **Links**: Fantasy brown with underlines and hover animations

#### Mobile Responsiveness
- **Character Sheet**: Full-width when expanded, compact when collapsed on mobile
- **Content**: Reduced margins and padding on smaller screens
- **Typography**: Adjusted font sizes and text-indent for mobile readability

### Styling Implementation Rules

#### Vuetify Theme Configuration (Preferred Method)
1. **Use Vuetify theme system** - Configure fantasy theme in `nuxt.config.ts` with custom colors
2. **Apply component defaults** - Use Vuetify's `defaults` to set fantasy classes automatically
3. **Define fantasy classes** - Create `.fantasy-header`, `.fantasy-body`, `.fantasy-button` in app.vue
4. **CSS Variables** - Always use CSS variables for colors (defined in app.vue)

#### Legacy Override Method (Avoid when possible)
5. **Use :deep() selectors** only when Vuetify theme system is insufficient
6. **Minimize !important** - Only use when absolutely necessary for overriding
7. **Add texture overlays** with radial gradients for paper effect
8. **Implement hover animations** for interactive elements

#### Font Implementation
- **Headers**: Apply `var(--fantasy-font-headers)` via `.fantasy-header` class
- **Body Text**: Apply `var(--fantasy-font-body)` via `.fantasy-body` class
- **Automatic Application**: Vuetify defaults ensure classes are applied automatically

## Performance Guidelines
- Lazy load sections to avoid loading all 600+ markdown files
- Use Vue's `<ClientOnly>` for localStorage-dependent components
- Minimize watchers in useCharacter composable
- Cache frequently accessed sections
- Optimize character sheet updates to prevent excessive re-renders

## Testing Guidelines
- Test character creation with all possible 2d6 combinations (2-12)
- Verify stats match the official table in RULES.md
- Test luck system initialization and usage
- Test combat mechanics with various agility values
- Test charisma system progression (success/failure scenarios)
- Mock dice rolls for predictable testing
- Always test localStorage persistence for character data

## Copyright and Legal Compliance
- **Story Content**: All content in `/sections/` directory is copyrighted material
- **Code Attribution**: Technical implementation is MIT licensed (see LICENSE file)
- **Respect Copyright**: Never modify original story content without proper attribution
- **Educational Use**: This project is for educational and personal use only
- **No Commercial Use**: Content cannot be used commercially without permission
- **Attribution Required**: Always credit both original author and technical implementation
- **Documentation**: See COPYRIGHT.md for complete legal information