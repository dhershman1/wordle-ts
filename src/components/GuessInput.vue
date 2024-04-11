<script setup lang="ts">
import { ref } from 'vue'
import { WORD_SIZE } from '@/settings'
import englishWords from '@/englishWordsWith5Letters.json'

const guessInProgress = ref('')
const emit = defineEmits<{
  'guess-submitted': [guess: string]
}>()

function onSubmit () {
  if (!englishWords.includes(guessInProgress.value)) {
    return
  }

  emit('guess-submitted', guessInProgress.value)
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
</template>
