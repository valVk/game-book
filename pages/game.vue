<script setup lang="ts">

const route = useRoute()
import { DiceRoll } from '@dice-roller/rpg-dice-roller';

const roll = new DiceRoll('1d6');
const dice = ref(roll.total)
const currentPage = ref('001')

const changePage = (page: string) => {
  console.log(page)
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
