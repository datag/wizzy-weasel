import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const MAX_BOOST = 5
export const XP_PER_LEVEL = 100
export const XP_PER_CORRECT = 10

export const useUserStore = defineStore('user', () => {
  const name = ref('Wizzy')
  const avatar = ref('🦡')
  const level = ref(1)
  const xp = ref(0)
  const boost = ref(MAX_BOOST)

  const xpProgress = computed(() => (xp.value % XP_PER_LEVEL) / XP_PER_LEVEL)

  function addXp(amount: number) {
    xp.value += amount
    const newLevel = Math.floor(xp.value / XP_PER_LEVEL) + 1
    if (newLevel > level.value) {
      level.value = newLevel
      // Restore full boost on level up
      boost.value = MAX_BOOST
    }
  }

  function loseBoost(amount = 1) {
    boost.value = Math.max(0, boost.value - amount)
  }

  function restoreBoost(amount = MAX_BOOST) {
    boost.value = Math.min(MAX_BOOST, boost.value + amount)
  }

  function reset() {
    name.value = 'Wizzy'
    avatar.value = '🦡'
    level.value = 1
    xp.value = 0
    boost.value = MAX_BOOST
  }

  return { name, avatar, level, xp, boost, xpProgress, addXp, loseBoost, restoreBoost, reset }
}, {
  persist: true,
})
