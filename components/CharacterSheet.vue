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
  top: 20px;
  right: 20px;
  width: 280px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.floating-character-sheet:not(.expanded) {
  width: 200px;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 12px;
  font-weight: 500;
  flex: 1;
}

.stat-value {
  font-size: 12px;
  font-weight: bold;
  color: #1976d2;
}

.luck-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 8px;
}

.luck-boxes {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.luck-box {
  width: 24px;
  height: 24px;
  border: 2px solid #4caf50;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: #4caf50;
  background: #f1f8e9;
}

.luck-box.used {
  background: #ffebee;
  border-color: #f44336;
  color: #f44336;
  text-decoration: line-through;
}

.resources-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-actions {
  border-top: 1px solid #e0e0e0;
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 768px) {
  .floating-character-sheet {
    position: relative;
    top: 0;
    right: 0;
    width: 100%;
    margin-bottom: 16px;
  }
}
</style>