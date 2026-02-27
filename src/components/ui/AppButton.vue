<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  fullWidth?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
})
</script>

<template>
  <button
    class="inline-flex items-center justify-center font-bold rounded-2xl transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 select-none"
    :class="[
      // Size
      size === 'sm' && 'min-h-[44px] px-4 text-sm gap-1.5',
      size === 'md' && 'min-h-[52px] px-6 text-base gap-2',
      size === 'lg' && 'min-h-[64px] px-8 text-lg gap-2',
      // Variant
      variant === 'primary' && 'bg-violet-600 text-white hover:bg-violet-700 shadow-md hover:shadow-lg disabled:bg-violet-300',
      variant === 'secondary' && 'bg-white text-violet-700 border-2 border-violet-200 hover:border-violet-400 hover:bg-violet-50 shadow',
      variant === 'danger' && 'bg-red-500 text-white hover:bg-red-600 shadow-md',
      variant === 'ghost' && 'text-slate-600 hover:bg-slate-100',
      fullWidth && 'w-full',
      disabled && 'opacity-50 cursor-not-allowed',
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
