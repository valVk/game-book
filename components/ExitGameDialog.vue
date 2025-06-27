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
.v-card {
  border-radius: 16px;
}

.game-summary {
  max-width: 400px;
  margin: 0 auto;
}

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 4px;
}
</style>