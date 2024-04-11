<script setup lang="ts">
import { ref } from 'vue';
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '@/settings';
defineProps<{
  wordOfTheDay: string
}>()

const guessInProgess = ref('')
const guessSubmitted = ref('')

</script>

<template>
  <input
    type="text"
    v-model="guessInProgess"
    @keydown.enter="guessSubmitted = guessInProgess"
  >
  <p
    v-if="guessSubmitted.length > 0"
    v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"
  />
</template>
