<script setup lang="ts">
import { ref } from 'vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '@/settings'
import englishWords from '@/englishWordsWith5Letters.json'

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) => wordGiven.length === 5
      && wordGiven.toUpperCase() === wordGiven
      && englishWords.includes(wordGiven)
  }
})

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
