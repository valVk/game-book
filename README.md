# Повелитель Безбрежной Пустыни (Master of the Endless Desert)

An interactive RPG game book built with Nuxt 3, featuring a text-based adventure game with character management, dice mechanics, and dynamic content navigation. Experience a classic "choose your own adventure" format where every decision matters and your character's stats affect gameplay outcomes.

## 🎮 Game Overview

You are a hero chosen by the King of Elgariol to venture into the endless desert and confront a powerful enemy sorcerer threatening the realm. Armed with only a sword, some provisions, and your wits, you must navigate through 600+ story sections, making crucial decisions that will determine your fate.

### 🏆 Victory Conditions
- Reach the lonely rock in the desert
- Defeat the enemy sorcerer using accumulated Mental Power
- Return alive to tell the tale

### ⚰️ Defeat Conditions
- Your Strength reaches 0 (death)
- Reach a story section with no further options (various endings)
- Make poor decisions that lead to insurmountable obstacles

## 🎲 Core Game Mechanics

### Character Stats

Your character has three primary attributes determined by dice rolls:

- **ЛОВКОСТЬ (Agility)**: Combat effectiveness, sword fighting ability, physical dexterity
- **СИЛА (Strength)**: Health points, life force, determination (0 = death)
- **ОБАЯНИЕ (Charisma)**: Persuasion ability, social skills, negotiation power

### Character Creation Process

1. **Roll 2d6** and consult the stats table to determine your initial attributes
2. **Initialize Luck** by rolling 2d6 and marking those numbers as "used"
3. **Starting Resources**: 15 gold pieces, 3 days of food, a sword, and a 7-slot backpack
4. **Mental Power**: Starts at 3, increases with victories

### Stats Distribution Table

| 2d6 Roll | Agility | Strength | Charisma |
|----------|---------|----------|----------|
| 2        | 8       | 22       | 8        |
| 3        | 10      | 20       | 6        |
| 4        | 12      | 16       | 5        |
| 5        | 9       | 18       | 8        |
| 6        | 11      | 20       | 6        |
| 7        | 9       | 20       | 7        |
| 8        | 10      | 16       | 7        |
| 9        | 8       | 24       | 7        |
| 10       | 9       | 22       | 6        |
| 11       | 10      | 18       | 7        |
| 12       | 11      | 20       | 5        |

## 🍀 Luck System

**Luck** represents fate's favor and provides advantages in critical moments:

- **Initialization**: Roll 2d6 at game start; mark those numbers as "used"
- **Usage**: When prompted to check luck, roll 1d6
  - If the number is available → **Lucky** (then mark as used)
  - If already used → **Unlucky**
- **Strategy**: Use luck wisely - once spent, it's harder to regain
- **Restoration**: Rare items and events can restore luck points

## ⚔️ Combat System

Combat is resolved through opposed dice rolls:

1. **Enemy Attack**: 1d6 × 2 + Enemy's Agility = Attack Power
2. **Your Attack**: 1d6 × 2 + Your Agility = Attack Power
3. **Resolution**:
   - Higher Attack Power wins and deals **2 Strength damage**
   - Equal Attack Power = blocked, continue fighting
   - Combat continues until someone reaches 0 Strength

## 💬 Charisma Tests

Social encounters use the Charisma system:

- **Test**: Roll 2d6 vs current Charisma value
- **Success** (roll ≤ Charisma): Charisma increases by 1 (max 12)
- **Failure** (roll > Charisma): Charisma decreases by 1 (min 1)
- **Mastery**: At 12 Charisma, automatic success
- **Ruin**: At 1 Charisma, automatic failure

## 🎒 Resource Management

### Food System
- **Healing**: Each portion restores 4 Strength points
- **Usage**: Can eat anytime except during combat
- **Limitation**: Start with 3 days worth, find more or risk starvation

### Inventory
- **Capacity**: 7-item backpack limit
- **Equipment**: Sword doesn't count (worn in sheath)
- **Strategy**: Choose items wisely, may need to drop things for better finds

## 🗺️ Navigation & Story

### How to Play
1. **Read** the current story section
2. **Choose** from available options (numbered links)
3. **Follow** consequences based on your stats, items, and luck
4. **Manage** resources carefully
5. **Progress** through 600+ interconnected story sections

### Special Indicators
- **"ПРОВЕРЬТЕ СВОЮ УДАЧУ"**: Luck check required
- **"Проверьте свое ОБАЯНИЕ"**: Charisma test needed
- **Combat sections**: Automatic battle with described enemies
- **No links**: Game ending (victory, defeat, or other conclusion)

## 🔧 Technical Features

### Built With
- **Nuxt 3**: Modern Vue.js framework
- **Vuetify**: Material Design UI components
- **TypeScript**: Type-safe development
- **Toast UI Editor**: Rich markdown rendering
- **RPG Dice Roller**: Authentic dice mechanics
- **Pinia**: State management

### Key Features
- **Persistent Character**: Saves automatically to browser storage
- **Responsive Design**: Works on desktop and mobile
- **Real Dice Mechanics**: Uses proper RPG dice rolling library
- **Interactive Character Sheet**: Floating panel with all stats
- **Dynamic Content**: 600+ story sections loaded on demand
- **Game State Tracking**: Remembers visited pages and choices

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
# Opens on http://localhost:3000
```

### Production Build
```bash
npm run build
npm run preview
```

## 📚 Additional Documentation

- **[RULES.md](./RULES.md)**: Complete game mechanics and rules
- **[CLAUDE.md](./CLAUDE.md)**: Development guide for contributors

## 🎯 Game Tips

1. **Balance Stats**: Don't rely only on combat - charisma and luck matter
2. **Manage Resources**: Food is precious, use it strategically
3. **Explore Thoroughly**: Multiple paths lead to different outcomes
4. **Take Notes**: The game world is vast and interconnected
5. **Embrace Failure**: Each playthrough teaches valuable lessons
6. **Save Luck**: Don't waste it on minor challenges

## 🌟 Story Background

The peaceful kingdom of Elgariol faces a new threat from the east. Beyond the Lonsam mountains and Mortland swamps lies an endless desert dominated by a lonely rock - the lair of a powerful enemy sorcerer. As the kingdom's chosen hero, you must traverse dangerous lands, survive countless perils, and confront this ultimate evil armed with courage, skill, and growing Mental Power.

Your journey will take you through:
- Treacherous mountain passes
- Mysterious desert oases  
- Ancient ruins and forgotten cities
- Encounters with monsters, merchants, and fellow adventurers
- Puzzles that test wit as much as strength

Every choice shapes your destiny. Will you become the Master of the Endless Desert, or will the sands claim another fallen hero?

**Begin your adventure and discover your fate!**

## ⚖️ Legal Notice

This is a personal, non-commercial digital adaptation created for educational purposes and to demonstrate web development techniques.

**Original Work**: "Повелитель Безбрежной Пустыни" © Дмитрий Браславский  
**Digital Implementation**: Technical code and UI components © 2024 valVK  
**Development Assistant**: Built with assistance from [Claude Code](https://claude.ai/code)  
**Usage**: Personal and educational use only - not licensed for public distribution  

All story content, characters, and game mechanics remain the intellectual property of the original author. This project respects copyright law and is created under fair use for educational purposes.

For complete copyright information, see [COPYRIGHT.md](./COPYRIGHT.md).
