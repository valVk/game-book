import { DiceRoll } from '@dice-roller/rpg-dice-roller'

export interface CharacterStats {
  agility: number // ЛОВКОСТЬ
  strength: number // СИЛА
  charisma: number // ОБАЯНИЕ
  maxAgility: number // Initial max values
  maxStrength: number
  luck: boolean[] // Array of 6 booleans for luck tracking
  gold: number
  food: number
  inventory: string[]
  mentalPower: number // Сила мысли
  currentPage: string // Current game page
  visitedPages: string[] // Pages visited during this session
  gameStartTime: number // When the game session started
  pendingRolls: Record<string, {
    type: 'luck' | 'charisma' | 'combat'
    result?: boolean
    timestamp: number
  }>
}

// Character stats table based on 2d6 roll
const STATS_TABLE: Record<number, { agility: number; strength: number; charisma: number }> = {
  2: { agility: 8, strength: 22, charisma: 8 },
  3: { agility: 10, strength: 20, charisma: 6 },
  4: { agility: 12, strength: 16, charisma: 5 },
  5: { agility: 9, strength: 18, charisma: 8 },
  6: { agility: 11, strength: 20, charisma: 6 },
  7: { agility: 9, strength: 20, charisma: 7 },
  8: { agility: 10, strength: 16, charisma: 7 },
  9: { agility: 8, strength: 24, charisma: 7 },
  10: { agility: 9, strength: 22, charisma: 6 },
  11: { agility: 10, strength: 18, charisma: 7 },
  12: { agility: 11, strength: 20, charisma: 5 }
}

// Global singleton state
const CHARACTER_STORAGE_KEY = 'rpg-character'

// Default character state
const defaultCharacter: CharacterStats = {
  agility: 0,
  strength: 0,
  charisma: 0,
  maxAgility: 0,
  maxStrength: 0,
  luck: [true, true, true, true, true, true], // All available initially
  gold: 15,
  food: 3,
  inventory: ['Food (3 days)'],
  mentalPower: 3,
  currentPage: 'preface',
  visitedPages: [],
  gameStartTime: 0,
  pendingRolls: {}
}

// Global reactive character state (singleton)
const character = ref<CharacterStats>({ ...defaultCharacter })
const isCharacterCreated = ref(false)

// Global initialization flag to ensure it runs only once
let isInitialized = false

// Initialize character from localStorage (runs once globally)
const initializeCharacter = () => {
  if (isInitialized || !process.client) return
  
  isInitialized = true
  const stored = localStorage.getItem(CHARACTER_STORAGE_KEY)
  console.log('Initializing character from localStorage:', stored)
  if (stored) {
    try {
      const parsedCharacter = JSON.parse(stored)
      console.log('Parsed character data:', parsedCharacter)
      
      // Migrate old character data to include pendingRolls if missing
      if (!parsedCharacter.pendingRolls) {
        console.log('Migrating character data: adding pendingRolls')
        parsedCharacter.pendingRolls = {}
      }
      
      character.value = parsedCharacter
      isCharacterCreated.value = parsedCharacter.gameStartTime > 0 // Character has started journey
      console.log('Character initialized:', {
        agility: character.value.agility,
        isCharacterCreated: isCharacterCreated.value,
        hasPendingRolls: !!character.value.pendingRolls
      })
    } catch (e) {
      console.error('Failed to parse stored character:', e)
    }
  } else {
    console.log('No stored character found, using defaults')
  }
}

export const useCharacter = () => {

  // Save character to localStorage
  const saveCharacter = () => {
    if (process.client) {
      localStorage.setItem(CHARACTER_STORAGE_KEY, JSON.stringify(character.value))
    }
  }

  // Roll 2d6 and generate character stats
  const rollStats = () => {
    const roll = new DiceRoll('2d6')
    const sum = roll.total
    const stats = STATS_TABLE[sum]
    
    // Extract individual dice values from the roll
    const dice = roll.rolls[0]?.rolls?.map((r: any) => r.value) || [1, 1]
    
    if (stats) {
      character.value.agility = stats.agility
      character.value.strength = stats.strength
      character.value.charisma = stats.charisma
      character.value.maxAgility = stats.agility
      character.value.maxStrength = stats.strength
      
      // Save the rolled stats immediately
      saveCharacter()
    }
    
    return { sum, roll: roll.output, stats, dice }
  }

  // Initialize luck by rolling 2d6 and marking used luck points
  const initializeLuck = () => {
    const roll1 = new DiceRoll('1d6').total
    const roll2 = new DiceRoll('1d6').total
    
    // Reset luck array
    character.value.luck = [true, true, true, true, true, true]
    
    // Mark rolled numbers as used (arrays are 0-indexed, dice are 1-6)
    character.value.luck[roll1 - 1] = false
    character.value.luck[roll2 - 1] = false
    
    return { roll1, roll2 }
  }

  // Check luck - returns true if lucky, false if unlucky
  const checkLuck = (pageId?: string): { lucky: boolean; roll: number } => {
    const roll = new DiceRoll('1d6').total
    const lucky = character.value.luck[roll - 1]
    
    if (lucky) {
      // Mark this luck as used
      character.value.luck[roll - 1] = false
    }
    
    // Track the roll result if pageId provided
    if (pageId) {
      // Ensure pendingRolls exists
      if (!character.value.pendingRolls) {
        character.value.pendingRolls = {}
      }
      
      // Update existing pending roll with result
      if (character.value.pendingRolls[pageId]) {
        character.value.pendingRolls[pageId].result = lucky
      } else {
        // Create new entry if it doesn't exist
        character.value.pendingRolls[pageId] = {
          type: 'luck',
          result: lucky,
          timestamp: Date.now()
        }
      }
    }
    
    saveCharacter()
    return { lucky, roll }
  }

  // Set pending roll for a page
  const setPendingRoll = (pageId: string, type: 'luck' | 'charisma' | 'combat') => {
    // Ensure pendingRolls exists
    if (!character.value.pendingRolls) {
      character.value.pendingRolls = {}
    }
    
    character.value.pendingRolls[pageId] = {
      type,
      timestamp: Date.now()
      // result is undefined initially (not rolled yet)
    }
    saveCharacter()
  }

  // Get pending roll status
  const getPendingRoll = (pageId: string) => {
    // Ensure pendingRolls exists
    if (!character.value.pendingRolls) {
      character.value.pendingRolls = {}
      return undefined
    }
    return character.value.pendingRolls[pageId]
  }

  // Clear pending roll
  const clearPendingRoll = (pageId: string) => {
    // Ensure pendingRolls exists
    if (!character.value.pendingRolls) {
      character.value.pendingRolls = {}
      return
    }
    delete character.value.pendingRolls[pageId]
    saveCharacter()
  }

  // Restore a luck point
  const restoreLuck = () => {
    const roll = new DiceRoll('1d6').total
    const wasAlreadyAvailable = character.value.luck[roll - 1]
    character.value.luck[roll - 1] = true
    saveCharacter()
    return { roll, wasAlreadyAvailable }
  }

  // Character stat getters and setters
  const getAgility = () => character.value.agility
  const setAgility = (value: number) => {
    character.value.agility = Math.max(0, Math.min(value, character.value.maxAgility))
    saveCharacter()
  }

  const getStrength = () => character.value.strength
  const setStrength = (value: number) => {
    character.value.strength = Math.max(0, Math.min(value, character.value.maxStrength))
    saveCharacter()
  }

  const getCharisma = () => character.value.charisma
  const setCharisma = (value: number) => {
    character.value.charisma = Math.max(1, Math.min(value, 12))
    saveCharacter()
  }

  const getGold = () => character.value.gold
  const setGold = (value: number) => {
    character.value.gold = Math.max(0, value)
    saveCharacter()
  }

  const getFood = () => character.value.food
  const setFood = (value: number) => {
    character.value.food = Math.max(0, value)
    saveCharacter()
  }

  // Test charisma (roll 2d6 vs charisma)
  const testCharisma = (): { success: boolean; roll: number; charisma: number } => {
    const roll = new DiceRoll('2d6').total
    const currentCharisma = character.value.charisma
    const success = roll <= currentCharisma
    
    if (success && currentCharisma < 12) {
      setCharisma(currentCharisma + 1)
    } else if (!success && currentCharisma > 1) {
      setCharisma(currentCharisma - 1)
    }
    
    return { success, roll, charisma: currentCharisma }
  }

  // Use food to restore strength
  const useFood = (): boolean => {
    if (character.value.food > 0) {
      character.value.food--
      character.value.strength = Math.min(
        character.value.strength + 4,
        character.value.maxStrength
      )
      // Update inventory
      if (character.value.food === 0) {
        character.value.inventory = character.value.inventory.filter(item => !item.includes('Food'))
      } else {
        const foodIndex = character.value.inventory.findIndex(item => item.includes('Food'))
        if (foodIndex !== -1) {
          character.value.inventory[foodIndex] = `Food (${character.value.food} days)`
        }
      }
      saveCharacter()
      return true
    }
    return false
  }

  // Start journey - finalize character creation
  const startJourney = () => {
    console.log('Starting journey with character:', {
      agility: character.value.agility,
      strength: character.value.strength,
      charisma: character.value.charisma
    })
    
    // Only start journey if character has valid stats
    if (character.value.agility === 0) {
      console.error('Cannot start journey - character has no stats!')
      return { roll1: 1, roll2: 1 }
    }
    
    const luckRolls = initializeLuck()
    character.value.gameStartTime = Date.now()
    character.value.currentPage = '001'
    character.value.visitedPages = ['001']
    isCharacterCreated.value = true
    saveCharacter()
    
    console.log('Journey started, character saved:', {
      agility: character.value.agility,
      isCharacterCreated: isCharacterCreated.value
    })
    
    return luckRolls
  }

  // Page navigation and tracking
  const navigateToPage = (pageId: string) => {
    character.value.currentPage = pageId
    
    // Add to visited pages if not already there
    if (!character.value.visitedPages.includes(pageId)) {
      character.value.visitedPages.push(pageId)
    }
    
    saveCharacter()
  }
  
  const getCurrentPage = () => character.value.currentPage
  
  const getVisitedPages = () => character.value.visitedPages
  
  const getGameDuration = () => {
    if (character.value.gameStartTime === 0) return 0
    return Date.now() - character.value.gameStartTime
  }
  
  // Reset character and end game session
  const endGameSession = () => {
    character.value = { ...defaultCharacter }
    isCharacterCreated.value = false
    if (process.client) {
      localStorage.removeItem(CHARACTER_STORAGE_KEY)
    }
  }
  
  // Reset character (alias for backward compatibility)
  const resetCharacter = () => {
    endGameSession()
  }

  // Debug mode functions
  const resetToDebugState = () => {
    // Generate random stats for debug testing
    const rollResult = rollStats()
    const luckRolls = initializeLuck()
    
    // Set up debug character state
    character.value.gameStartTime = Date.now()
    character.value.currentPage = 'debug'
    character.value.visitedPages = ['debug']
    character.value.gold = 15
    character.value.food = 3
    character.value.inventory = ['Food (3 days)', 'Sword', 'Backpack (7 slots)']
    character.value.mentalPower = 3
    
    // Clear all pending rolls for fresh testing
    character.value.pendingRolls = {}
    
    isCharacterCreated.value = true
    saveCharacter()
    
    return { rollResult, luckRolls }
  }

  const getAvailableLuckPoints = () => {
    return character.value.luck.reduce((count, available) => count + (available ? 1 : 0), 0)
  }

  const setDebugStats = (agility: number, strength: number, charisma: number) => {
    character.value.agility = Math.max(1, Math.min(agility, 12))
    character.value.strength = Math.max(1, Math.min(strength, 24))
    character.value.charisma = Math.max(1, Math.min(charisma, 12))
    character.value.maxAgility = character.value.agility
    character.value.maxStrength = character.value.strength
    saveCharacter()
  }

  // Initialize character state on first call
  initializeCharacter()

  return {
    character: readonly(character),
    isCharacterCreated: readonly(isCharacterCreated),
    rollStats,
    startJourney,
    resetCharacter,
    endGameSession,
    checkLuck,
    restoreLuck,
    testCharisma,
    useFood,
    // Pending rolls
    setPendingRoll,
    getPendingRoll,
    clearPendingRoll,
    // Page tracking
    navigateToPage,
    getCurrentPage,
    getVisitedPages,
    getGameDuration,
    // Getters and setters
    getAgility,
    setAgility,
    getStrength,
    setStrength,
    getCharisma,
    setCharisma,
    getGold,
    setGold,
    getFood,
    setFood,
    // Debug functions
    resetToDebugState,
    getAvailableLuckPoints,
    setDebugStats
  }
}