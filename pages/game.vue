<script setup lang="ts">

const route = useRoute()
import { DiceRoll } from '@dice-roller/rpg-dice-roller';

const roll = new DiceRoll('1d6');
const dice = ref(roll.total)

</script>

<template>
  <div>
  <ClientOnly>
    <v-icon
      large
      color="green darken-2"
    >
      mdi-dice-{{ dice }}
    </v-icon>

  </ClientOnly>
  <NuxtPage :page="'001'" />
    <p>Current route: {{ route.path }}</p>
  </div>
</template>
