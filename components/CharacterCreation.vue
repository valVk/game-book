<template>
  <v-dialog
    v-model="showDialog"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5 text-center pa-4">
        <v-icon color="primary" class="mr-2">mdi-dice-multiple</v-icon>
        Создание Персонажа
      </v-card-title>

      <v-card-text class="pa-4">
        <div class="text-center mb-4">
          <p class="text-body-1 mb-2">
            Бросьте два кубика, чтобы определить характеристики вашего героя
          </p>
          <p class="text-caption text-grey">
            Вы можете бросать кубики сколько угодно раз, пока не будете довольны результатом
          </p>
        </div>

        <!-- Dice Animation -->
        <div class="dice-section text-center mb-4">
          <div class="dice-container">
            <v-icon
              v-for="n in 2"
              :key="n"
              size="60"
              :color="rolling ? 'grey' : 'primary'"
              :class="{ 'dice-rolling': rolling }"
              class="mx-2"
            >
              mdi-dice-{{ rolling ? 'multiple' : (lastRoll?.dice[n-1] || 1) }}
            </v-icon>
          </div>

          <div v-if="lastRoll && !rolling" class="mt-2">
            <v-chip color="primary" variant="outlined" class="mr-2">
              Кубик 1: {{ lastRoll.dice[0] }}
            </v-chip>
            <v-chip color="primary" variant="outlined" class="mr-2">
              Кубик 2: {{ lastRoll.dice[1] }}
            </v-chip>
            <v-chip color="success" variant="outlined">
              Сумма: {{ lastRoll.sum }}
            </v-chip>
          </div>
        </div>

        <!-- Current Stats Display -->
        <v-card
          v-if="currentStats"
          variant="outlined"
          class="mb-4"
        >
          <v-card-title class="text-h6 text-center">
            Характеристики персонажа
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="4" class="text-center">
                <v-icon color="grey" class="mb-1">mdi-run</v-icon>
                <div class="text-caption">ЛОВКОСТЬ</div>
                <div class="text-h5 font-weight-bold">{{ currentStats.agility }}</div>
              </v-col>
              <v-col cols="4" class="text-center">
                <v-icon color="red" class="mb-1">mdi-heart</v-icon>
                <div class="text-caption">СИЛА</div>
                <div class="text-h5 font-weight-bold">{{ currentStats.strength }}</div>
              </v-col>
              <v-col cols="4" class="text-center">
                <v-icon color="purple" class="mb-1">mdi-account-heart</v-icon>
                <div class="text-caption">ОБАЯНИЕ</div>
                <div class="text-h5 font-weight-bold">{{ currentStats.charisma }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Starting Equipment -->
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-h6">Начальное снаряжение</v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="grey">mdi-sword</v-icon>
                </template>
                <v-list-item-title>Меч</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="brown">mdi-food-apple</v-icon>
                </template>
                <v-list-item-title>Еда на 3 дня (+4 СИЛЫ за порцию)</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="yellow">mdi-gold</v-icon>
                </template>
                <v-list-item-title>15 золотых монет</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="blue">mdi-brain</v-icon>
                </template>
                <v-list-item-title>Сила мысли: 3</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-card-text>

      <v-card-actions class="pa-4">
        <div class="d-flex flex-column w-100 ga-3">
          <v-btn
            color="primary"
            variant="outlined"
            :disabled="rolling"
            :loading="rolling"
            @click="rollDice"
            size="large"
            block
          >
            <v-icon class="mr-2">mdi-dice-multiple</v-icon>
            {{ currentStats ? 'Бросить еще раз' : 'Бросить кубики' }}
          </v-btn>

          <v-btn
            v-if="currentStats"
            color="success"
            :disabled="rolling"
            @click="startJourney"
            size="large"
            block
            elevation="2"
          >
            <v-icon class="mr-2">mdi-map</v-icon>
            Начать путешествие
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Luck Initialization Dialog -->
  <v-dialog
    v-model="showLuckDialog"
    max-width="500"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5 text-center">
        <v-icon color="green" class="mr-2">mdi-clover</v-icon>
        Инициализация УДАЧИ
      </v-card-title>
      <v-card-text class="text-center pa-4">
        <p class="mb-4">Бросьте два кубика для определения начальной УДАЧИ</p>

        <div v-if="luckRolls" class="mb-4">
          <v-chip color="orange" variant="outlined" class="mr-2">
            Первый бросок: {{ luckRolls.roll1 }}
          </v-chip>
          <v-chip color="orange" variant="outlined">
            Второй бросок: {{ luckRolls.roll2 }}
          </v-chip>
          <p class="text-caption mt-2">
            Эти числа помечены как использованные в вашей УДАЧЕ
          </p>
        </div>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-btn
          color="success"
          @click="finishCharacterCreation"
          block
        >
          Понятно, начинаем приключение!
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'character-created'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { rollStats, startJourney: startCharacterJourney } = useCharacter()

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const showLuckDialog = ref(false)
const rolling = ref(false)
const lastRoll = ref<{ sum: number; dice: number[] } | null>(null)
const currentStats = ref<{ agility: number; strength: number; charisma: number } | null>(null)
const luckRolls = ref<{ roll1: number; roll2: number } | null>(null)

const rollDice = async () => {
  rolling.value = true

  // Simulate dice rolling animation
  await new Promise(resolve => setTimeout(resolve, 1000))

  const result = rollStats()

  // Use dice values directly from the rollStats result
  const dice = result.dice || [1, 1]

  console.log('Roll result:', result)
  console.log('Dice values:', dice, 'Sum:', result.sum)
  console.log('Character state after rollStats:', {
    agility: result.stats?.agility,
    strength: result.stats?.strength,
    charisma: result.stats?.charisma
  })

  lastRoll.value = {
    sum: result.sum,
    dice
  }

  currentStats.value = result.stats
  rolling.value = false
}

const startJourney = async () => {
  if (!currentStats.value) return

  console.log('Starting journey with stats:', currentStats.value)

  // Initialize luck and show dialog
  const luckResult = startCharacterJourney()
  console.log('Luck initialization result:', luckResult)

  luckRolls.value = luckResult
  showLuckDialog.value = true
}

const finishCharacterCreation = () => {
  console.log('Finishing character creation...')
  console.log('Current stats:', currentStats.value)
  showLuckDialog.value = false
  showDialog.value = false
  console.log('Emitting character-created event')
  emit('character-created')

}
</script>

<style scoped>
.dice-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.dice-rolling {
  animation: spin 0.5s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.v-card {
  border-radius: 16px;
}

.text-h5 {
  color: #1976d2;
}
</style>