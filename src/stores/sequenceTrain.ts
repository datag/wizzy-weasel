import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SequenceDifficulty } from '@/types'

const DEFAULT_DIFFICULTY: SequenceDifficulty = 'medium'

export const useSequenceTrainStore = defineStore('sequenceTrain', () => {
  const level = ref<SequenceDifficulty>(DEFAULT_DIFFICULTY)

  function setLevel(d: SequenceDifficulty) {
    level.value = d
  }

  return { level, setLevel }
}, {
  persist: true,
})