import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const MAX_STAMINA = 5
export const XP_PER_LEVEL = 100
export const XP_PER_CORRECT = 10
export const STAMINA_PENALTY = 1

export const useUserStore = defineStore('user', () => {
  const name = ref('Wizzy')
  const avatar = ref('🦡')
  const level = ref(1)
  const xp = ref(0)
  const stamina = ref(MAX_STAMINA)

  const xpProgress = computed(() => (xp.value % XP_PER_LEVEL) / XP_PER_LEVEL)

  function addXp(amount: number) {
    xp.value += amount
    const newLevel = Math.floor(xp.value / XP_PER_LEVEL) + 1
    if (newLevel > level.value) {
      level.value = newLevel
      // Restore full stamina on level up
      stamina.value = MAX_STAMINA
    }
  }

  function loseStamina(amount = STAMINA_PENALTY) {
    stamina.value = Math.max(0, stamina.value - amount)
  }

  function restoreStamina(amount = MAX_STAMINA) {
    stamina.value = Math.min(MAX_STAMINA, stamina.value + amount)
  }

  function reset() {
    name.value = 'Wizzy'
    avatar.value = '🦡'
    level.value = 1
    xp.value = 0
    stamina.value = MAX_STAMINA
  }

  return { name, avatar, level, xp, stamina, xpProgress, addXp, loseStamina, restoreStamina, reset }
}, {
  persist: true,
})
