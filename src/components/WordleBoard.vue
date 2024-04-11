<script setup lang="ts">
import { ref } from 'vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE } from '@/settings'
import englishWords from '@/englishWordsWith5Letters.json'

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) => englishWords.includes(wordGiven)
  }
})

const guessInProgress = ref('')
const guessSubmitted = ref('')

function onSubmit () {
  if (!englishWords.includes(guessInProgress.value)) {
    return
  }

  guessSubmitted.value = guessInProgress.value
}

function handleInput (e: Event) {
  const target = e.target as HTMLInputElement

  guessInProgress.value = target.value
    .slice(0, WORD_SIZE)
    .toUpperCase()
    .replace(/[^A-Z]+/gi, '')

  target.value = guessInProgress.value
}

</script>

<template>
  <input
    type="text"
    :maxlength="WORD_SIZE"
    :value="guessInProgress"
    @input="handleInput"
    @keydown.enter="onSubmit"
  >
  <p
    v-if="guessSubmitted.length > 0"
    v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"
  />
</template>
