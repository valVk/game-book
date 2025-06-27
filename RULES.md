# GAME RULES - Повелитель Безбрежной Пустыни

This document contains the complete game mechanics and rules for the RPG game book.

## Character Creation

### Initial Character Stats

Character stats are determined by rolling 2d6 and consulting the following table:

| Sum (2d6) | ЛОВКОСТЬ (Agility) | СИЛА (Strength) | ОБАЯНИЕ (Charisma) |
|-----------|-------------------|-----------------|-------------------|
| 2         | 8                 | 22              | 8                 |
| 3         | 10                | 20              | 6                 |
| 4         | 12                | 16              | 5                 |
| 5         | 9                 | 18              | 8                 |
| 6         | 11                | 20              | 6                 |
| 7         | 9                 | 20              | 7                 |
| 8         | 10                | 16              | 7                 |
| 9         | 8                 | 24              | 7                 |
| 10        | 9                 | 22              | 6                 |
| 11        | 10                | 18              | 7                 |
| 12        | 11                | 20              | 5                 |

### Character Attributes

#### ЛОВКОСТЬ (Agility)
- Represents sword fighting ability, combat skills, and physical dexterity
- Higher agility improves combat effectiveness
- Cannot exceed initial maximum value (except in special circumstances)

#### СИЛА (Strength)
- Represents health, life force, and determination
- When Strength reaches 0, the character dies
- Cannot exceed initial maximum value (except in special circumstances)
- Can be restored by eating food (+4 Strength per food portion)

#### ОБАЯНИЕ (Charisma)
- Used for persuasion, negotiation, and social interactions
- Tested by rolling 2d6 against current Charisma value
- **Success**: Roll ≤ Charisma → Charisma increases by 1 (max 12)
- **Failure**: Roll > Charisma → Charisma decreases by 1 (min 1)
- At Charisma 12: Automatic success on all charisma tests
- At Charisma 1: Automatic failure on all charisma tests

## Luck System

### Luck Initialization
1. Roll 1d6 twice at the start of the journey
2. Mark the rolled numbers as "used" on the luck track (1-6)
3. One or two luck points will be unavailable from the start

### Luck Checks
When prompted to "ПРОВЕРИТЬ СВОЮ УДАЧУ" (Check Your Luck):
1. Roll 1d6
2. If the number is NOT crossed out → **Lucky** (then cross it out)
3. If the number IS already crossed out → **Unlucky**
4. Players can choose to skip luck checks (automatically unlucky)

### Luck Restoration
- Some items/events may restore luck points
- Roll 1d6 and restore that luck number
- If already available, no effect (unlucky)

## Combat System

### Combat Rounds
1. **Enemy Attack**: Roll 1d6 × 2 + Enemy's Agility = Enemy's Attack Power
2. **Player Attack**: Roll 1d6 × 2 + Player's Agility = Player's Attack Power
3. **Resolution**:
   - Higher Attack Power wins and deals damage
   - Equal Attack Power = blocked attack, continue combat
   - Lower Attack Power = takes damage

### Damage System
- Standard weapon damage: **2 Strength points**
- Special weapons may have different damage values
- Combat continues until one combatant reaches 0 Strength

### Combat Restrictions
- Cannot eat food during combat
- Must complete combat before other actions

## Resources & Equipment

### Starting Equipment
- Sword (equipped, not in backpack)
- Food for 3 days (takes 1 backpack slot)
- 15 Gold pieces
- 7-slot backpack for additional items

### Food System
- Each food portion restores **4 Strength points**
- Can be used anytime except during combat
- Food counter decreases with each use
- Updates inventory display automatically

### Inventory Management
- Maximum 7 items in backpack
- Food counts as 1 item regardless of quantity
- Weapons other than sword must fit in backpack (unless specified)
- Must drop items when backpack is full

## Special Abilities

### Сила мысли (Mental Power)
- Starting value: **3 points**
- Increases with victories and achievements
- Used for telepathic attacks against the main enemy
- Critical for final confrontation

## Game Progression

### Page Navigation
- Follow numbered links in format: `[**123**](#n_123)`
- Each choice leads to different story outcomes
- Some sections have conditional requirements (stats, items, etc.)

### Game Over Conditions
1. **Death**: Strength reaches 0
2. **Story Endings**: Sections without navigation links
3. **Victory**: Successfully defeating the main enemy

### Save System
- Character stats automatically saved to localStorage
- Progress tracked through visited pages
- Game session time recorded
- Can reset/restart at any time

## Text Indicators

### Special Prompts
- **"ПРОВЕРЬТЕ СВОЮ УДАЧУ"**: Triggers luck check mechanic
- **"Проверьте свое ОБАЯНИЕ"**: Triggers charisma test
- **Combat sections**: Automatic combat initiation with specified enemies

### Link Formats
- `[**123**](#n_123)` - Primary navigation format
- `[123](#n_123)` - Alternative navigation format
- Sections without links indicate game endings

## Victory Conditions

The ultimate goal is to reach the desert's lonely rock and defeat the powerful enemy sorcerer using accumulated Mental Power and combat skills. Success requires careful resource management, strategic decision-making, and some luck.