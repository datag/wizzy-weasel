import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const DEFAULT_FACTORS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const useMysticalTimesTableStore = defineStore('mysticalTimesTable', () => {
  // Allowed "a" factors – user-configurable, persisted
  const allowedFactorsA = ref<number[]>(DEFAULT_FACTORS)

  const factorsDisplay = computed(() => allowedFactorsA.value.join(', '))

  function setFactorsFromString(input: string) {
    const parsed = input
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n >= 1 && n <= 10)
    const unique = [...new Set(parsed)].sort((a, b) => a - b)
    if (unique.length > 0) {
      allowedFactorsA.value = unique
    }
  }

  function resetFactors() {
    allowedFactorsA.value = DEFAULT_FACTORS
  }

  return { allowedFactorsA, factorsDisplay, setFactorsFromString, resetFactors }
}, {
  persist: true,
})
