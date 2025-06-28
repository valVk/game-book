<template>
  <v-dialog
    v-model="showDialog"
    max-width="500"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5 text-center pa-4 bg-red-lighten-5">
        <v-icon color="red" class="mr-2">mdi-alert-circle</v-icon>
        Завершить игру?
      </v-card-title>

      <v-card-text class="pa-4">
        <div class="text-center">
          <p class="text-body-1 mb-3">
            Вы уверены, что хотите завершить текущую игровую сессию?
          </p>
          
          <v-alert 
            type="warning" 
            variant="outlined" 
            class="mb-4"
          >
            <div class="text-left">
              <strong>Это действие удалит:</strong>
              <ul class="mt-2">
                <li>Все характеристики персонажа</li>
                <li>Прогресс в игре</li>
                <li>Посещенные страницы</li>
                <li>Предметы инвентаря</li>
              </ul>
            </div>
          </v-alert>

          <div v-if="gameStats" class="game-summary mb-4">
            <v-card variant="outlined">
              <v-card-title class="text-h6">Статистика сессии</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <div class="text-caption">Время игры</div>
                    <div class="text-body-2">{{ formatDuration(gameStats.duration) }}</div>
                  </v-col>
                  <v-col cols="6">
                    <div class="text-caption">Посещено страниц</div>
                    <div class="text-body-2">{{ gameStats.pagesVisited }}</div>
                  </v-col>
                  <v-col cols="6">
                    <div class="text-caption">Текущая страница</div>
                    <div class="text-body-2">{{ gameStats.currentPage }}</div>
                  </v-col>
                  <v-col cols="6">
                    <div class="text-caption">Сила персонажа</div>
                    <div class="text-body-2">{{ gameStats.strength }}/{{ gameStats.maxStrength }}</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-btn
          color="grey"
          variant="outlined"
          @click="cancel"
          block
        >
          <v-icon class="mr-2">mdi-arrow-left</v-icon>
          Продолжить игру
        </v-btn>
        
        <v-btn
          color="red"
          @click="confirm"
          block
          class="ml-3"
        >
          <v-icon class="mr-2">mdi-exit-to-app</v-icon>
          Да, завершить игру
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  gameStats?: {
    duration: number
    pagesVisited: number
    currentPage: string
    strength: number
    maxStrength: number
  }
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}ч ${minutes % 60}м`
  } else if (minutes > 0) {
    return `${minutes}м ${seconds % 60}с`
  } else {
    return `${seconds}с`
  }
}

const confirm = () => {
  emit('confirm')
  showDialog.value = false
}

const cancel = () => {
  emit('cancel')
  showDialog.value = false
}
</script>

<style scoped>
:deep(.v-overlay__content) {
  margin: 0 !important;
}

:deep(.v-overlay .v-overlay__content) {
  background: transparent;
}

:deep(.v-dialog) {
  background: transparent;
}

:deep(.v-dialog .v-card) {
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 12px 48px var(--parchment-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

:deep(.v-dialog .v-card::before) {
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
  z-index: 0;
}

:deep(.v-dialog .v-card > *) {
  position: relative;
  z-index: 1;
}

:deep(.v-card-title) {
  background: rgba(255, 183, 183, 0.2);
  border-bottom: 2px solid rgba(244, 67, 54, 0.3);
  font-size: 1.4rem;
}

:deep(.v-card-text) {
  background: transparent;
}

:deep(.v-card-text p) {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

:deep(.text-grey) {
  opacity: 0.7;
}

:deep(.v-alert) {
  background: rgba(255, 193, 7, 0.1);
  border: 2px solid rgba(255, 193, 7, 0.4);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.2);
}

:deep(.v-alert strong) {
  font-weight: 600;
}

.game-summary {
  max-width: 400px;
  margin: 0 auto;
}

:deep(.v-card--variant-outlined) {
  border: 2px solid var(--aged-border);
  background: rgba(212, 197, 169, 0.1);
  border-radius: 10px;
}

:deep(.v-card--variant-outlined .v-card-title) {
  background: rgba(212, 197, 169, 0.2);
  border-bottom: 1px solid var(--aged-border);
  font-weight: 500;
}

:deep(.v-card--variant-outlined .v-card-text) {
  background: transparent;
}

:deep(.text-caption) {
  font-weight: 500;
  color: rgba(45, 41, 38, 0.7);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 0.75rem;
}

:deep(.text-body-2) {
  color: #8B4513;
  font-weight: 600;
  font-size: 1rem;
}

:deep(.v-card-actions) {
  background: rgba(212, 197, 169, 0.2);
  border-top: 2px solid var(--aged-border);
  padding: 20px;
}

:deep(.v-btn) {
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.15);
  transition: all 0.3s ease;
  padding: 12px 24px;
}

:deep(.v-btn:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 69, 19, 0.25);
}

:deep(.v-btn--variant-outlined) {
  background: var(--parchment-bg);
  border-color: var(--aged-border);
  border-width: 2px;
}

:deep(.v-btn--variant-outlined:hover) {
  background: rgba(212, 197, 169, 0.3);
  border-color: #8B4513;
}

:deep(.v-btn[color="red"]) {
  background: linear-gradient(135deg, #d32f2f, #f44336);
  color: white;
  border: none;
}

:deep(.v-btn[color="red"]:hover) {
  background: linear-gradient(135deg, #f44336, #ff5722);
}

ul {
  padding-left: 24px;
  font-family: var(--fantasy-font-body);
}

li {
  margin-bottom: 6px;
  color: var(--ink-color);
  line-height: 1.5;
}

@media (max-width: 768px) {
  :deep(.v-dialog .v-card) {
    margin: 1rem !important;
    border-radius: 12px !important;
  }
  
  :deep(.v-card-title) {
    font-size: 1.2rem !important;
  }
  
  :deep(.v-card-text p) {
    font-size: 1rem !important;
  }
  
  .game-summary {
    max-width: 100%;
  }
}
</style>