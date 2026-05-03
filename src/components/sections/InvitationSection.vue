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
  font-size: 1.42rem;
  font-weight: 500;
  letter-spacing: 0.07em;
  color: var(--color-section-heading);
}

.body {
  max-width: 23rem;
  margin: 0 auto;
}

.line {
  margin: 0;
  font-size: 0.98rem;
  line-height: 2.05;
  letter-spacing: 0.02em;
  color: var(--color-body);
}
</style>
