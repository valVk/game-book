<template>
  <v-container fluid class="debug-page fantasy-body">
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-card class="fantasy-panel ma-4">
          <v-card-title class="fantasy-header text-center">
            <h1 class="display-1">🎮 Debug: Game Interactions</h1>
            <p class="subtitle-1 mt-2">All sections from INTERACTIONS.md with direct links for testing mechanics</p>
          </v-card-title>

          <v-card-text>
            <!-- Summary Stats -->
            <v-row class="mb-6">
              <v-col cols="12" md="6" lg="4" v-for="(category, index) in interactionCategories" :key="index">
                <v-card class="fantasy-card text-center pa-4" elevation="2">
                  <div class="text-h6 fantasy-header">{{ category.emoji }} {{ category.name }}</div>
                  <div class="text-h4 mt-2">{{ category.sections.length }}</div>
                  <div class="text-caption">sections</div>
                </v-card>
              </v-col>
            </v-row>

            <!-- Interaction Categories -->
            <v-expansion-panels multiple class="fantasy-panels">
              <v-expansion-panel
                v-for="(category, index) in interactionCategories"
                :key="index"
                class="fantasy-panel mb-3"
              >
                <v-expansion-panel-title class="fantasy-header">
                  <span class="text-h6">
                    {{ category.emoji }} {{ category.name }}
                    <v-chip class="ml-2" size="small" color="primary">{{ category.sections.length }}</v-chip>
                  </span>
                </v-expansion-panel-title>

                <v-expansion-panel-text class="fantasy-body">
                  <p class="mb-4 text-body-2">{{ category.description }}</p>

                  <!-- Section Grid -->
                  <v-row dense>
                    <v-col
                      cols="6"
                      sm="4"
                      md="3"
                      lg="2"
                      v-for="section in category.sections"
                      :key="section"
                    >
                      <v-btn
                        :to="`/debug/${section}`"
                        class="fantasy-button w-100"
                        variant="outlined"
                        size="small"
                        target="_blank"
                      >
                        {{ section }}
                      </v-btn>
                    </v-col>
                  </v-row>

                  <!-- Bulk Navigation -->
                  <v-divider class="my-4"></v-divider>
                  <div class="text-center">
                    <v-btn
                      class="fantasy-button ma-1"
                      @click="openRandomSection(category.sections)"
                      prepend-icon="mdi-shuffle"
                    >
                      Random {{ category.name }} Section
                    </v-btn>
                    <v-btn
                      class="fantasy-button ma-1"
                      @click="openFirstFive(category.sections)"
                      prepend-icon="mdi-open-in-new"
                    >
                      Open First 5
                    </v-btn>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- Quick Actions -->
            <v-card class="fantasy-panel mt-6 pa-4">
              <v-card-title class="fantasy-header">🔧 Quick Actions</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="quickSection"
                      label="Go to Section"
                      placeholder="e.g., 037"
                      class="fantasy-input"
                      @keyup.enter="goToSection"
                    >
                      <template #append>
                        <v-btn
                          class="fantasy-button"
                          @click="goToSection"
                          icon="mdi-arrow-right"
                          size="small"
                        ></v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-btn
                      class="fantasy-button mr-2"
                      @click="openCharacterSheet"
                      prepend-icon="mdi-account"
                    >
                      Character Sheet
                    </v-btn>
                    <v-btn
                      class="fantasy-button"
                      to="/game"
                      prepend-icon="mdi-home"
                    >
                      Game Home
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Page metadata
useHead({
  title: 'Debug: Game Interactions - RPG Game Book',
  meta: [
    { name: 'description', content: 'Debug page for testing all game interactions and mechanics' }
  ]
})

// Reactive data
const quickSection = ref('')

// Interaction categories from INTERACTIONS.md
const interactionCategories = ref([
  {
    emoji: '🎲',
    name: 'Luck System',
    description: 'Comprehensive luck mechanics: standard checks, restoration, penalties, and narrative references',
    sections: ['037', '063', '064', '067', '085', '094', '165', '199', '212', '213', '249', '276', '319', '326', '329', '340', '341', '399', '413', '420', '483', '500', '506', '531', '548', '568', '604', '612', '627']
  },
  {
    emoji: '⚔️',
    name: 'Combat/Fight Scenes',
    description: 'Combat scenes with enemy stat blocks using Agility and Strength mechanics',
    sections: ['016', '028', '038', '049', '068', '072', '083', '104', '105', '125', '128', '145', '146', '172', '180', '186', '203', '234', '254', '269', '274', '293', '310', '328', '372', '378', '380', '402', '405', '417', '423', '472', '480', '520', '541', '550', '566', '595', '622', '623']
  },
  {
    emoji: '💬',
    name: 'Charisma Tests',
    description: 'Social interactions and diplomatic challenges using "ОБАЯНИЕ" tests',
    sections: ['345', '628', '630', 'preface']
  },
  {
    emoji: '💪',
    name: 'Strength Checks',
    description: 'Physical challenges and endurance tests requiring Strength stat checks',
    sections: ['016', '021', '026', '028', '038', '042', '044', '046', '049', '068', '072', '083', '102', '104', '111', '112', '128', '138', '145', '146', '164', '172', '180', '186', '194', '203', '232', '234', '235', '237', '269', '274', '278', '291', '293', '310', '328', '343', '348', '372', '378', '380', '385', '402', '404', '405', '417', '423', '429', '430', '452', '465', '472', '480', '482', '486', '495', '515', '520', '528', '533', '537', '541', '546', '555', '566', '569', '570', '574', '576', '593', '595', '610', '622', '623', '625', 'preface']
  },
  {
    emoji: '🍖',
    name: 'Food Usage/Management',
    description: 'Sections dealing with food consumption, restoration, and survival mechanics',
    sections: ['005', '024', '044', '099', '114', '119', '154', '157', '166', '168', '184', '226', '228', '238', '239', '244', '268', '275', '288', '301', '317', '322', '325', '331', '357', '358', '370', '371', '383', '441', '456', '463', '475', '482', '497', '499', '503', '516', '525', '527', '538', '558', '560', '575', '594', '599', '605', '616', '624', '625', '632', 'preface']
  },
  {
    emoji: '😴',
    name: 'Rest/Healing',
    description: 'Strategic recovery mechanics and safe places to rest',
    sections: ['011', '020', '025', '034', '041', '042', '089', '096', '101', '111', '114', '152', '162', '191', '243', '245', '250', '251', '262', '273', '283', '340', '366', '372', '401', '498', '513', '523', '525']
  },
  {
    emoji: '🎯',
    name: 'Dice Mechanics',
    description: 'Sections with dice rolling for random events, damage calculation, and skill checks',
    sections: ['028', '029', '038', '060', '062', '067', '068', '072', '094', '104', '105', '119', '125', '128', '145', '153', '159', '171', '172', '178', '180', '186', '194', '203', '212', '213', '217', '234', '254', '256', '262', '276', '278', '283', '285', '293', '316', '328', '330', '340', '341', '372', '374', '378', '380', '400', '402', '404', '405', '417', '418', '423', '472', '480', '490', '512', '520', '541', '548', '550', '561', '566', '573', '582', '594', '595', '614', '622', '623', 'preface']
  },
  {
    emoji: '🧠',
    name: 'Mental Power/Telepathy',
    description: 'Telepathic combat, psychic powers, and mental challenges',
    sections: ['009', '010', '016', '021', '026', '046', '049', '055', '060', '063', '065', '078', '080', '083', '100', '110', '129', '138', '154', '166', '184', '200', '208', '211', '225', '228', '244', '258', '262', '266', '268', '269', '292', '293', '298', '322', '341', '350', '355', '362', '372', '380', '391', '400', '404', '410', '423', '429', '430', '445', '448', '456', '462', '468', '475', '480', '482', '486', '488', '492', '503', '515', '519', '530', '533', '539', '542', '546', '547', '562', '565', '591', '595', '599', '602', '607', '610', '616', '622', '623', '624', '630', '632', 'preface']
  },
  {
    emoji: '💰',
    name: 'Economic Interactions',
    description: 'Trading, purchasing, and economic resource management',
    sections: ['002', '015', '046', '094', '132', '154', '157', '166', '168', '184', '212', '222', '250', '275', '288', '301', '316', '317', '322', '330', '331', '347', '358', '371', '374', '423', '436', '440', '456', '475', '480', '485', '502', '508', '512', '527', '599', '605', '616', '624', '626', 'preface']
  }
])

// Methods
const openRandomSection = (sections: string[]) => {
  const randomSection = sections[Math.floor(Math.random() * sections.length)]
  window.open(`/debug/${randomSection}`, '_blank')
}

const openFirstFive = (sections: string[]) => {
  const firstFive = sections.slice(0, 5)
  firstFive.forEach(section => {
    window.open(`/debug/${section}`, '_blank')
  })
}

const goToSection = () => {
  if (quickSection.value.trim()) {
    const section = quickSection.value.trim()
    window.open(`/debug/${section}`, '_blank')
    quickSection.value = ''
  }
}

const openCharacterSheet = () => {
  // This would trigger the character sheet modal in the actual game
  navigateTo('/game')
}
</script>

<style scoped>
.debug-page {
  background: var(--parchment-bg);
  min-height: 100vh;
}

.fantasy-panel {
  background: var(--parchment-bg) !important;
  border: 2px solid var(--aged-border) !important;
  box-shadow: var(--parchment-shadow) !important;
}

.fantasy-card {
  background: var(--parchment-bg) !important;
  border: 1px solid var(--aged-border) !important;
  transition: transform 0.2s ease !important;
}

.fantasy-card:hover {
  transform: translateY(-2px);
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

.fantasy-panels :deep(.v-expansion-panel-title) {
  background: var(--parchment-bg) !important;
  color: var(--ink-color) !important;
  border-bottom: 1px solid var(--aged-border) !important;
}

.fantasy-panels :deep(.v-expansion-panel-text__wrapper) {
  background: var(--parchment-bg) !important;
  color: var(--ink-color) !important;
}

.fantasy-input :deep(.v-field) {
  background: var(--parchment-bg) !important;
  border: 1px solid var(--aged-border) !important;
}

.fantasy-input :deep(.v-field__input) {
  color: var(--ink-color) !important;
  font-family: var(--fantasy-font-body) !important;
}
</style>