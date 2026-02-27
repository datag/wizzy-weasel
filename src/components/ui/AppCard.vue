<script setup lang="ts">
interface Props {
  padding?: boolean
}
withDefaults(defineProps<Props>(), {
  padding: true,
})
</script>

<template>
  <div
    class="bg-white rounded-3xl shadow-md"
    :class="padding ? 'p-6' : ''"
  >
    <slot />
  </div>
</template>
