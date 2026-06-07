import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const DEFAULT_DIVISORS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const useMysticalDivisionOracleStore = defineStore('mysticalDivisionOracle', () => {
  // Allowed divisors – user-configurable, persisted
  const allowedDivisors = ref<number[]>(DEFAULT_DIVISORS)

  const divisorsDisplay = computed(() => allowedDivisors.value.join(', '))

  function setDivisorsFromString(input: string) {
    const parsed = input
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n >= 1 && n <= 10)
    const unique = [...new Set(parsed)].sort((a, b) => a - b)
    if (unique.length > 0) {
      allowedDivisors.value = unique
    }
  }

  function resetDivisors() {
    allowedDivisors.value = DEFAULT_DIVISORS
  }

  return { allowedDivisors, divisorsDisplay, setDivisorsFromString, resetDivisors }
}, {
  persist: true,
})
