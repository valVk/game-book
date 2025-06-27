<template>
  <v-card
    v-if="character && (character.agility > 0 || isCharacterCreated)"
    class="floating-character-sheet"
    :class="{ 'expanded': expanded }"
    elevation="8"
  >
    <v-card-title class="d-flex justify-space-between align-center pa-2">
      <span class="text-h6">Персонаж</span>
      <v-btn
        icon
        size="small"
        @click="expanded = !expanded"
      >
        <v-icon>{{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-title>

    <v-expand-transition>
      <div v-show="expanded">
        <v-card-text class="pa-2">
          <!-- Main Stats -->
          <div class="stats-grid mb-3">
            <div class="stat-item">
              <v-icon color="grey" size="small">mdi-run</v-icon>
              <span class="stat-label">ЛОВКОСТЬ:</span>
              <span class="stat-value">{{ character.agility }}/{{ character.maxAgility }}</span>
            </div>

            <div class="stat-item">
              <v-icon color="red" size="small">mdi-heart</v-icon>
              <span class="stat-label">СИЛА:</span>
              <span class="stat-value">{{ character.strength }}/{{ character.maxStrength }}</span>
            </div>

            <div class="stat-item">
              <v-icon color="purple" size="small">mdi-account-heart</v-icon>
              <span class="stat-label">ОБАЯНИЕ:</span>
              <span class="stat-value">{{ character.charisma }}</span>
            </div>
          </div>

          <!-- Luck Display -->
          <div class="luck-section mb-3">
            <div class="d-flex align-center mb-1">
              <v-icon color="green" size="small" class="mr-1">mdi-clover</v-icon>
              <span class="stat-label">УДАЧА:</span>
            </div>
            <div class="luck-boxes">
              <div
                v-for="(available, index) in character.luck"
                :key="index"
                class="luck-box"
                :class="{ 'used': !available }"
              >
                {{ index + 1 }}
              </div>
            </div>
          </div>

          <!-- Resources -->
          <div class="resources-section">
            <div class="stat-item">
              <v-icon color="yellow" size="small">mdi-gold</v-icon>
              <span class="stat-label">Золото:</span>
              <span class="stat-value">{{ character.gold }}</span>
            </div>

            <div class="stat-item">
              <v-icon color="brown" size="small">mdi-food-apple</v-icon>
              <span class="stat-label">Еда:</span>
              <span class="stat-value">{{ character.food }} дн.</span>
            </div>

            <div class="stat-item">
              <v-icon color="blue" size="small">mdi-brain</v-icon>
              <span class="stat-label">Сила мысли:</span>
              <span class="stat-value">{{ character.mentalPower }}</span>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="quick-actions mt-3">
            <div class="d-flex flex-column ga-2">
              <div class="d-flex ga-2 flex-wrap">
                <v-btn
                  v-if="character.food > 0"
                  size="small"
                  color="success"
                  variant="outlined"
                  @click="$emit('use-food')"
                >
                  <v-icon size="small">mdi-food-apple</v-icon>
                  Поесть (+4 СИЛЫ)
                </v-btn>

                <v-btn
                  size="small"
                  color="green"
                  variant="outlined"
                  @click="$emit('check-luck')"
                >
                  <v-icon size="small">mdi-clover</v-icon>
                  Проверить УДАЧУ
                </v-btn>
              </div>

              <v-btn
                size="small"
                color="red"
                variant="outlined"
                @click="$emit('exit-game')"
                class="mt-2"
                block
              >
                <v-icon size="small">mdi-exit-to-app</v-icon>
                Завершить игру
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  character: any
  isCharacterCreated: boolean
}

defineProps<Props>()
defineEmits(['use-food', 'check-luck', 'exit-game'])

const expanded = ref(true)
</script>

<style scoped>
.floating-character-sheet {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  z-index: 1000;
  background: var(--parchment-bg);
  border: 2px solid var(--aged-border);
  border-radius: 12px;
  box-shadow: 
    0 8px 32px var(--parchment-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  font-family: var(--fantasy-font-body);
  color: var(--ink-color);
  overflow: hidden;
}

.floating-character-sheet::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(139, 129, 108, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(139, 129, 108, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.floating-character-sheet > * {
  position: relative;
  z-index: 1;
}

.floating-character-sheet:not(.expanded) {
  width: 240px;
}

:deep(.v-card-title) {
  font-family: var(--fantasy-font-headers) !important;
  font-weight: 500 !important;
  color: var(--ink-color) !important;
  background: rgba(212, 197, 169, 0.3) !important;
  border-bottom: 1px solid var(--aged-border);
  letter-spacing: 0.5px;
}

:deep(.v-card-text) {
  background: transparent !important;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: rgba(212, 197, 169, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(212, 197, 169, 0.3);
}

.stat-label {
  font-size: 13px;
  font-weight: 600;
  flex: 1;
  font-family: var(--fantasy-font-headers);
  color: var(--ink-color);
  letter-spacing: 0.3px;
}

.stat-value {
  font-size: 14px;
  font-weight: bold;
  color: #8B4513;
  font-family: var(--fantasy-font-headers);
  text-shadow: 0 1px 2px rgba(139, 69, 19, 0.2);
}

.luck-section {
  border-top: 2px solid var(--aged-border);
  padding-top: 12px;
  margin-top: 8px;
}

.luck-boxes {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.luck-box {
  width: 28px;
  height: 28px;
  border: 2px solid #8B4513;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: bold;
  color: #8B4513;
  background: rgba(244, 241, 232, 0.8);
  font-family: var(--fantasy-font-headers);
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(139, 69, 19, 0.15);
}

.luck-box:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(139, 69, 19, 0.25);
}

.luck-box.used {
  background: rgba(139, 69, 19, 0.1);
  border-color: #A0522D;
  color: #A0522D;
  text-decoration: line-through;
  opacity: 0.6;
}

.resources-section {
  border-top: 2px solid var(--aged-border);
  padding-top: 12px;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quick-actions {
  border-top: 2px solid var(--aged-border);
  padding-top: 12px;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.quick-actions .v-btn) {
  font-family: var(--fantasy-font-headers) !important;
  font-weight: 500 !important;
  letter-spacing: 0.3px !important;
  border-radius: 8px !important;
  text-transform: none !important;
  box-shadow: 0 2px 8px rgba(139, 69, 19, 0.15) !important;
  transition: all 0.3s ease !important;
}

:deep(.quick-actions .v-btn:hover) {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.25) !important;
}

:deep(.quick-actions .v-btn--variant-outlined) {
  background: var(--parchment-bg) !important;
  color: var(--ink-color) !important;
  border-color: var(--aged-border) !important;
}

:deep(.quick-actions .v-btn--variant-outlined:hover) {
  background: rgba(212, 197, 169, 0.2) !important;
}

@media (max-width: 768px) {
  .floating-character-sheet {
    position: fixed;
    bottom: 10px;
    right: 10px;
    left: 10px;
    width: auto;
    border-radius: 8px;
  }
  
  .floating-character-sheet:not(.expanded) {
    width: auto;
    bottom: 10px;
    right: 10px;
    left: auto;
    width: 200px;
  }
  
  .stat-label {
    font-size: 12px;
  }
  
  .stat-value {
    font-size: 13px;
  }
  
  .luck-box {
    width: 26px;
    height: 26px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .floating-character-sheet {
    bottom: 10px;
    right: 5px;
    left: 5px;
  }
  
  .floating-character-sheet:not(.expanded) {
    right: 5px;
    left: auto;
    width: 160px;
  }
}
</style>