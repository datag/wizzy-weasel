import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SequenceDifficulty, SequenceMode } from '@/types'

const DEFAULT_DIFFICULTY: SequenceDifficulty = 'medium'
const DEFAULT_MODE: SequenceMode = 'all'

export const useSequenceTrainStore = defineStore('sequenceTrain', () => {
  const level = ref<SequenceDifficulty>(DEFAULT_DIFFICULTY)
  const mode = ref<SequenceMode>(DEFAULT_MODE)

  function setLevel(d: SequenceDifficulty) {
    level.value = d
  }

  function setMode(m: SequenceMode) {
    mode.value = m
  }

  return { level, mode, setLevel, setMode }
}, {
  persist: true,
})