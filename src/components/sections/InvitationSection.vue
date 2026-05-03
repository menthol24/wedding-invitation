<script setup lang="ts">
defineProps<{
  headline: string
  paragraphs: string[][]
}>()
</script>

<template>
  <section class="invite section-pad section-pad--wide">
    <h2 class="title">{{ headline }}</h2>
    <div class="body">
      <template v-for="(block, bi) in paragraphs" :key="bi">
        <p v-for="(line, li) in block" :key="`${bi}-${li}`" class="line">{{ line }}</p>
        <br v-if="bi < paragraphs.length - 1" />
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.invite {
  text-align: center;
}

.title {
  margin: 0 0 40px;
  font-family: $font-display;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-section-heading);
  letter-spacing: 0.01em;
  word-spacing: 0.02em !important;
}

.body {
  max-width: 23rem;
  margin: 0 auto;
}

.line {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  letter-spacing: -0.01em;
  color: var(--color-body);
}
</style>
