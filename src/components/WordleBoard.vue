<script setup lang="ts">
import { computed, ref } from 'vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE } from '@/settings'
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
    guessInProgess.value = rawValue.slice(0, WORD_SIZE)
  }
})

</script>

<template>
  <input
    type="text"
    :maxlength="WORD_SIZE"
    v-model="formattedGuessInProgress"
    @keydown.enter="guessSubmitted = guessInProgess"
  >
  <p
    v-if="guessSubmitted.length > 0"
    v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"
  />
</template>
