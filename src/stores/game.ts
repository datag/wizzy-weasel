import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  const currentGame = ref<string | null>(null)
  const round = ref(0)
  const sessionScore = ref(0)
  const bestScore = ref<Record<string, number>>({})

  function startGame(gameId: string) {
    currentGame.value = gameId
    round.value = 0
    sessionScore.value = 0
  }

  function nextRound() {
    round.value++
  }

  function addScore(points: number) {
    sessionScore.value += points
  }

  function endGame() {
    if (currentGame.value) {
      const id = currentGame.value
      if ((bestScore.value[id] ?? 0) < sessionScore.value) {
        bestScore.value[id] = sessionScore.value
      }
    }
    currentGame.value = null
  }

  return { currentGame, round, sessionScore, bestScore, startGame, nextRound, addScore, endGame }
}, {
  persist: true,
})
