<script setup lang="ts">
const {
  character,
  isCharacterCreated,
  checkLuck,
  useFood,
  testCharisma,
  navigateToPage,
  getCurrentPage,
  getVisitedPages,
  getGameDuration,
  endGameSession
} = useCharacter()

const currentPage = ref('preface')
const showCharacterCreation = ref(false)
const showExitDialog = ref(false)

const changePage = (page: string) => {
  // If trying to start the game (page 001) but character not created, show creation dialog
  if (page === '001' && !isCharacterCreated.value) {
    showCharacterCreation.value = true
    return
  }

  // Update both local state and character tracking
  currentPage.value = page
  if (isCharacterCreated.value) {
    navigateToPage(page)
  }
};

const onCharacterCreated = () => {
  console.log('Character created, navigating to section 001')
  console.log('Character state after creation:', {
    isCharacterCreated: isCharacterCreated.value,
    character: character.value,
    agility: character.value?.agility
  })

  // Check localStorage directly
  if (process.client) {
    const stored = localStorage.getItem('rpg-character')
    console.log('localStorage content:', stored ? JSON.parse(stored) : 'empty')
  }

  // After character creation, go to the first section
  currentPage.value = '001'

  // Force reactivity update
  nextTick(() => {
    console.log('After nextTick - Character state:', {
      isCharacterCreated: isCharacterCreated.value,
      character: character.value,
      agility: character.value?.agility
    })
  })
}

const handleUseFood = () => {
  const success = useFood()
  if (success) {
    // Could show a snackbar or notification here
    console.log('Food used, strength restored!')
  }
}

const handleCheckLuck = () => {
  const result = checkLuck()
  // Could show a dialog with the result
  console.log('Luck check:', result)
}

const handleExitGame = () => {
  showExitDialog.value = true
}

const confirmExitGame = () => {
  endGameSession()
  currentPage.value = 'preface'
  showExitDialog.value = false
}

const cancelExitGame = () => {
  showExitDialog.value = false
}

// Computed game stats for exit dialog
const gameStats = computed(() => {
  if (!isCharacterCreated.value || !character.value) return null

  try {
    return {
      duration: getGameDuration(),
      pagesVisited: getVisitedPages()?.length || 0,
      currentPage: getCurrentPage() || 'unknown',
      strength: character.value.strength || 0,
      maxStrength: character.value.maxStrength || 0
    }
  } catch (error) {
    console.error('Error getting game stats:', error)
    return null
  }
})

// Initialize page state and handle browser refresh
onMounted(() => {
  // Wait for character to be loaded from localStorage
  nextTick(() => {
    try {
      // Restore current page from character data if character exists
      if (isCharacterCreated.value && getCurrentPage) {
        const savedPage = getCurrentPage()
        if (savedPage && savedPage !== 'preface') {
          currentPage.value = savedPage
        }
      } else if (currentPage.value !== 'preface') {
        // If no character but trying to access game page, show creation
        showCharacterCreation.value = true
      }
    } catch (error) {
      console.error('Error initializing page state:', error)
      // Fallback to preface if there's an error
      currentPage.value = 'preface'
    }
  })
})
</script>

<template>
  <div>
    <!-- Character Sheet (floating) -->
    <ClientOnly>
      <CharacterSheet
        :character="character"
        :is-character-created="isCharacterCreated"
        @use-food="handleUseFood"
        @check-luck="handleCheckLuck"
        @exit-game="handleExitGame"
      />
    </ClientOnly>

    <!-- Character Creation Dialog -->
    <CharacterCreation
      v-model="showCharacterCreation"
      @character-created="onCharacterCreated"
    />

    <!-- Exit Game Confirmation Dialog -->
    <ExitGameDialog
      v-model="showExitDialog"
      :game-stats="gameStats"
      @confirm="confirmExitGame"
      @cancel="cancelExitGame"
    />

    <!-- Main Game Content -->
    <GameContent
      :page="currentPage"
      :character="character"
      :is-character-created="isCharacterCreated"
      @change-page="changePage"
      @test-charisma="testCharisma"
      @check-luck="handleCheckLuck"
      @use-food="handleUseFood"
    />
  </div>
</template>
