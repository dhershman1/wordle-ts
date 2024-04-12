<script lang="ts" setup>
import { computed, ref } from 'vue'
import { WORD_SIZE } from '@/settings'
import englishWords from '@/englishWordsWith5Letters.json'
import GuessView from './GuessView.vue'

const guessInProgress = ref<string | null>(null)
const emit = defineEmits<{
  'guess-submitted': [guess: string]
}>()
const formattedGuessInProgress = computed<string>({
  get() {
    return guessInProgress.value ?? ''
  },
  set(rawValue: string) {
    guessInProgress.value = null
    guessInProgress.value = rawValue
        .slice(0, WORD_SIZE)
        .toUpperCase()
        .replace(/[^A-Z]+/gi, '')
  }
})
function onSubmit() {
  if (!englishWords.includes(formattedGuessInProgress.value)) {
    return
  }
  emit('guess-submitted', formattedGuessInProgress.value)
  guessInProgress.value = null
}

function focusInput (e: Event) {
  const target = e.target as HTMLInputElement

  setTimeout(() => {
    target.focus()
  }, 50)
}
</script>

<template>
  <guess-view :guess="formattedGuessInProgress" />

  <input v-model="formattedGuessInProgress"
         :maxlength="WORD_SIZE"
         autofocus
         @blur="focusInput"
         type="text"
         @keydown.enter="onSubmit">
</template>

<style scoped>
input {
  position: absolute;
  opacity: 0;
}
</style>
