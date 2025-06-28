<template>
  <v-container fluid class="debug-section-page fantasy-body">
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <!-- Debug Header -->
        <v-card class="fantasy-panel mb-4">
          <v-card-title class="fantasy-header d-flex align-center justify-space-between">
            <div>
              🐛 Debug Section: {{ currentSection }}
              <v-chip class="ml-2" size="small" color="primary">{{ interactionType || 'Unknown' }}</v-chip>
            </div>
            <div>
              <v-btn
                class="fantasy-button mr-2"
                @click="resetCharacter"
                prepend-icon="mdi-refresh"
                size="small"
              >
                Reset Character
              </v-btn>
              <v-btn
                class="fantasy-button mr-2"
                to="/debug"
                prepend-icon="mdi-arrow-left"
                size="small"
              >
                Back to Debug
              </v-btn>
              <v-btn
                class="fantasy-button"
                @click="toggleDebugMode"
                :prepend-icon="debugMode ? 'mdi-eye-off' : 'mdi-eye'"
                size="small"
                :color="debugMode ? 'success' : 'warning'"
              >
                {{ debugMode ? 'Hide Debug' : 'Show Debug' }}
              </v-btn>
            </div>
          </v-card-title>
        </v-card>

        <v-row>
          <!-- Main Content -->
          <v-col :cols="debugMode ? 8 : 12">
            <v-card class="fantasy-panel">
              <v-card-text class="fantasy-body">
                <div v-if="pending" class="text-center pa-8">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  <p class="mt-4">Loading section {{ currentSection }}...</p>
                </div>

                <div v-else-if="error" class="text-center pa-8 text-error">
                  <v-icon size="48" class="mb-4">mdi-alert-circle</v-icon>
                  <h3>Error Loading Section</h3>
                  <p>{{ error.message || 'Failed to load section content' }}</p>
                  <v-btn class="fantasy-button mt-4" @click="refresh()">Retry</v-btn>
                </div>

                <div v-else-if="content" class="section-content">
                  <!-- Game Indicators -->
                  <div v-if="content.hasLuckCheck || content.hasCharisma || content.isGameOver" class="game-indicators mb-3">
                    <v-chip v-if="content.hasLuckCheck" color="green" size="small" class="mr-2">
                      <v-icon size="small" class="mr-1">mdi-clover</v-icon>
                      ПРОВЕРЬТЕ СВОЮ УДАЧУ
                    </v-chip>
                    <v-chip v-if="content.hasCharisma" color="purple" size="small" class="mr-2">
                      <v-icon size="small" class="mr-1">mdi-account-heart</v-icon>
                      ОБАЯНИЕ Test
                    </v-chip>
                    <v-chip v-if="content.hasCombat" color="red" size="small" class="mr-2">
                      <v-icon size="small" class="mr-1">mdi-sword</v-icon>
                      Combat
                    </v-chip>
                    <v-chip v-if="content.isGameOver" color="orange" size="small" class="mr-2">
                      <v-icon size="small" class="mr-1">mdi-flag-checkered</v-icon>
                      Game Over
                    </v-chip>
                  </div>

                  <!-- Content Display with TUI Editor -->
                  <ClientOnly>
                    <ToastuiEditorViewer
                      ref="toastuiEditor"
                      :initial-value="content.content || ''"
                      @load="onEditorLoad"
                    />
                  </ClientOnly>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Debug Panel -->
          <v-col cols="4" v-if="debugMode">
            <v-card class="fantasy-panel sticky-debug">
              <v-card-title class="fantasy-header">
                🔍 Debug Info
              </v-card-title>
              <v-card-text class="fantasy-body">

                <!-- Character Stats -->
                <div class="mb-4">
                  <h4 class="fantasy-header mb-2">Character Stats</h4>
                  <v-chip class="mr-1 mb-1" size="small">AGI: {{ character.character._value.agility }}</v-chip>
                  <v-chip class="mr-1 mb-1" size="small">STR: {{ character.character._value.strength }}</v-chip>
                  <v-chip class="mr-1 mb-1" size="small">CHA: {{ character.character._value.charisma }}</v-chip>
                  <v-chip class="mr-1 mb-1" size="small">MP: {{ character.character._value.mentalPower }}</v-chip>
                  <v-chip class="mr-1 mb-1" size="small">Gold: {{ character.character._value.gold }}</v-chip>
                  <v-chip class="mr-1 mb-1" size="small">Food: {{ character.character._value.food }}</v-chip>
                </div>

                <!-- Luck Points -->
                <div class="mb-4">
                  <h4 class="fantasy-header mb-2">Luck Points</h4>
                  <div class="d-flex flex-wrap">
                    <v-chip
                      v-for="(used, index) in character.character._value.luck"
                      :key="index"
                      :class="used ? 'luck-available' : 'luck-used'"
                      size="small"
                      class="mr-1 mb-1"
                    >
                      {{ index + 1 }}
                    </v-chip>
                  </div>
                </div>

                <!-- Section Info -->
                <div class="mb-4">
                  <h4 class="fantasy-header mb-2">Section Analysis</h4>
                  <p><strong>Type:</strong> {{ interactionType || 'None detected' }}</p>
                  <p><strong>Has Combat:</strong> {{ content?.hasCombat ? 'Yes' : 'No' }}</p>
                  <p><strong>Has Luck Check:</strong> {{ content?.hasLuckCheck ? 'Yes' : 'No' }}</p>
                  <p><strong>Has Charisma:</strong> {{ content?.hasCharisma ? 'Yes' : 'No' }}</p>
                  <p><strong>Game Over:</strong> {{ content?.isGameOver ? 'Yes' : 'No' }}</p>
                </div>

                <!-- Quick Actions -->
                <div class="mb-4">
                  <h4 class="fantasy-header mb-2">Quick Actions</h4>
                  <v-btn
                    class="fantasy-button w-100 mb-2"
                    @click="rollLuck"
                    size="small"
                    prepend-icon="mdi-dice-6"
                  >
                    Test Luck Roll
                  </v-btn>
                  <v-btn
                    class="fantasy-button w-100 mb-2"
                    @click="rollCharisma"
                    size="small"
                    prepend-icon="mdi-account-heart"
                  >
                    Test Charisma
                  </v-btn>
                  <v-btn
                    class="fantasy-button w-100 mb-2"
                    @click="simulateCombat"
                    size="small"
                    prepend-icon="mdi-sword"
                  >
                    Simulate Combat
                  </v-btn>
                </div>

                <!-- Navigation History -->
                <div v-if="navigationHistory.length">
                  <h4 class="fantasy-header mb-2">Recent Sections</h4>
                  <v-chip
                    v-for="section in navigationHistory.slice(-5)"
                    :key="section"
                    :to="`/debug/${section}`"
                    class="mr-1 mb-1"
                    size="small"
                    clickable
                  >
                    {{ section }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="4000"
      location="bottom"
    >
      {{ snackbar.text }}
      <template #actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { DiceRoll } from '@dice-roller/rpg-dice-roller'

// Route params
const route = useRoute()
const currentSection = computed(() => route.params.section as string)

// Debug mode state
const debugMode = ref(true)
const navigationHistory = ref<string[]>([])
const snackbar = ref({ show: false, text: '', color: 'info' })
const toastuiEditor = ref()

// Character composable with debug mode
const character = useCharacter()

const roll1 = new DiceRoll('1d6').total
const roll2 = new DiceRoll('1d6').total

// Mark rolled numbers as used (arrays are 0-indexed, dice are 1-6)
character.character._value.luck[roll1 - 1] = false
character.character._value.luck[roll2 - 1] = false

// Initialize character for debug mode on page load
onMounted(() => {
  console.log('Debug page mounted, character state:', character.character)
  console.log('Character agility:', character.character.agility)
  console.log('Character currentPage:', character.character.currentPage)

  // Always reset to debug state for now to ensure it works
  const result = character.resetToDebugState()
  console.log('Reset result:', result)
  console.log('Character after reset:', character.character)

  showToast('Character initialized for debug mode', 'success')
})

// Content fetching - make it reactive to route changes
const { data: content, pending, error, refresh } = await useFetch(() => `/api/content/${currentSection.value}`, {
  key: `debug-section-${currentSection.value}`,
  transform: (data: any) => {
    // Analyze content for interactions
    const html = data.html || ''
    const text = data.content || ''

    return {
      ...data,
      hasCombat: /ЛОВКОСТЬ.*\d+/i.test(text),
      hasLuckCheck: /ПРОВЕРЬТЕ СВОЮ УДАЧУ/i.test(text),
      hasCharisma: /ОБАЯНИЕ/i.test(text),
      hasFood: /еды|пищи|порци/i.test(text),
      hasDice: /бросьте|кубик|кость/i.test(text),
      hasMentalPower: /МЕНТАЛЬНАЯ|телепат|психич/i.test(text),
      hasEconomic: /золот|монет|купить|продать/i.test(text)
    }
  },
  watch: [currentSection]
})

// Detect interaction type
const interactionType = computed(() => {
  if (!content.value) return null

  const types = []
  if (content.value.hasLuckCheck) types.push('Luck Check')
  if (content.value.hasCombat) types.push('Combat')
  if (content.value.hasCharisma) types.push('Charisma')
  if (content.value.hasFood) types.push('Food')
  if (content.value.hasDice) types.push('Dice')
  if (content.value.hasMentalPower) types.push('Mental Power')
  if (content.value.hasEconomic) types.push('Economic')

  return types.length > 0 ? types.join(', ') : null
})

// TUI Editor handling
const onEditorLoad = (editor: any) => {
  editor.preview.previewContent.addEventListener('click', handleClick)
  toastuiEditor.value = editor
}

const handleClick = (event: MouseEvent) => {
  if (toastuiEditor.value) {
    const target = event.target as HTMLElement
    const link = target.closest('a')
    if (link) {
      event.preventDefault()
      const href = link.getAttribute('href')
      if (href) {
        // Extract page ID from href (e.g., "001", "#n_89", etc.)
        const pageId = href.replace('#n_', '').replace('#', '')
        // Navigate to debug version of the linked section
        navigateTo(`/debug/${pageId}`)
      }
    }
  }
}

// Utility functions
const showToast = (text: string, color = 'info') => {
  snackbar.value = { show: true, text, color }
}

// Methods
const resetCharacter = () => {
  character.resetToDebugState()
  showToast('Character reset for debug testing', 'success')
}

const toggleDebugMode = () => {
  debugMode.value = !debugMode.value
}

const rollLuck = () => {
  const roll = new DiceRoll('1d6').total
  const availableLuck = character.getAvailableLuckPoints()
  const isLucky = character.character._value.luck[roll - 1]

  showToast(`Luck Roll: ${roll} - ${isLucky ? 'LUCKY!' : 'UNLUCKY'} (Available: ${availableLuck})`)
}

const rollCharisma = () => {
  const roll = new DiceRoll('2d6')
  const total = roll.total
  const currentCharisma = character.character._value.charisma

  showToast(`Charisma Test: ${roll.output} = ${total} vs ${currentCharisma} - ${total <= currentCharisma ? 'SUCCESS' : 'FAILURE'}`)
}

const simulateCombat = () => {
  const enemyAgility = new DiceRoll('1d12').total
  const playerAgility = character.character._value.agility

  showToast(`Combat Round: Player AGI ${playerAgility} vs Enemy AGI ${enemyAgility} - ${playerAgility >= enemyAgility ? 'Player attacks first!' : 'Enemy attacks first!'}`)
}

// Track navigation
watch(currentSection, (newSection) => {
  if (newSection && !navigationHistory.value.includes(newSection)) {
    navigationHistory.value.push(newSection)
  }
}, { immediate: true })

// Page metadata
useHead({
  title: `Debug Section ${currentSection.value} - RPG Game Book`,
  meta: [
    { name: 'description', content: `Debug view for game section ${currentSection.value}` }
  ]
})
</script>

<style scoped>
.debug-section-page {
  background: var(--parchment-bg);
  min-height: 100vh;
}

.fantasy-panel {
  background: var(--parchment-bg) !important;
  border: 2px solid var(--aged-border) !important;
  box-shadow: var(--parchment-shadow) !important;
}

.fantasy-header {
  font-family: var(--fantasy-font-headers) !important;
  color: var(--ink-color) !important;
  font-weight: bold !important;
}

.fantasy-body {
  font-family: var(--fantasy-font-body) !important;
  color: var(--ink-color) !important;
}

.fantasy-button {
  background: linear-gradient(145deg, #8B4513, #A0522D) !important;
  color: white !important;
  border: 1px solid var(--aged-border) !important;
  font-family: var(--fantasy-font-body) !important;
  transition: all 0.2s ease !important;
}

.fantasy-button:hover {
  background: linear-gradient(145deg, #A0522D, #8B4513) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(139, 69, 19, 0.3) !important;
}

.sticky-debug {
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.section-content {
  font-family: var(--fantasy-font-body);
  line-height: 1.8;
  color: var(--ink-color);
}

.section-content :deep(h1),
.section-content :deep(h2),
.section-content :deep(h3) {
  font-family: var(--fantasy-font-headers);
  color: var(--ink-color);
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.section-content :deep(p) {
  margin-bottom: 1rem;
  text-align: justify;
  text-indent: 1.5rem;
}

.section-content :deep(strong) {
  font-weight: bold;
  color: #8B4513;
}

.markdown-content {
  background: var(--parchment-bg);
  padding: 1rem;
  border-radius: 4px;
}

/* Luck point styling */
.luck-available {
  background: linear-gradient(145deg, #4CAF50, #66BB6A) !important;
  color: white !important;
  border: 1px solid #388E3C !important;
}

.luck-used {
  background: linear-gradient(145deg, #F44336, #EF5350) !important;
  color: white !important;
  border: 1px solid #C62828 !important;
}

.luck-available:hover {
  background: linear-gradient(145deg, #66BB6A, #4CAF50) !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3) !important;
}

.luck-used:hover {
  background: linear-gradient(145deg, #EF5350, #F44336) !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(244, 67, 54, 0.3) !important;
}
</style>