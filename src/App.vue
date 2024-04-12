<script setup lang="ts">
import WordleBoard from '@/components/WordleBoard.vue'
import englishWords from '@/englishWordsWith5Letters.json'

const randomWord = englishWords[Math.floor(Math.random() * englishWords.length)]
</script>

<template>
    <wordle-board :word-of-the-day="randomWord" />
    <p>
        Type your guess and press Enter to submit it
    </p>
</template>

<style>
p {
    text-align: center;
}
</style>
