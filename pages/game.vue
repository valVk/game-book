<script setup lang="ts">
import { DiceRoll } from '@dice-roller/rpg-dice-roller';
const route = useRoute()

const roll = new DiceRoll('1d6');
const dice = ref(roll.total)
const currentPage = ref('preface')

const changePage = (page: string) => {
  currentPage.value = page;
};
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
  <NuxtPage :page="currentPage" @change-page="changePage"/>
    <p>Current route: {{ route.path }}</p>
  </div>
</template>
