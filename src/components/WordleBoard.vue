<script setup lang="ts">
import { computed, ref } from 'vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '@/settings'
import englishWords from '@/englishWordsWith5Letters.json'

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) => englishWords.includes(wordGiven)
  }
})

const guessInProgess = ref('')
const guessSubmitted = ref('')
const formattedGuessInProgress = computed({
  get () {
    return guessInProgess.value
  },

  set(rawValue: string) {
    guessInProgess.value = rawValue.slice(0, 5)
  }
})

</script>

<template>
  <input
    type="text"
    maxlength="5"
    v-model="formattedGuessInProgress"
    @keydown.enter="guessSubmitted = guessInProgess"
  >
  <p
    v-if="guessSubmitted.length > 0"
    v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"
  />
</template>
