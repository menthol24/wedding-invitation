<script setup lang="ts">
export type InfoBlock = { subtitle: string; lines: string[] }

defineProps<{
  blocks: readonly InfoBlock[]
}>()
</script>

<template>
  <section class="transport section-pad section-pad--wide" aria-labelledby="transport-heading">
    <h2 id="transport-heading" class="visually-hidden">교통 안내</h2>

    <div class="blocks">
      <div v-for="(b, i) in blocks" :key="i" class="block">
        <h3 class="sub">{{ b.subtitle }}</h3>
        <p v-for="(ln, li) in b.lines" :key="li" class="para">{{ ln }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;
.transport {
  padding-top: 0px !important;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.block {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.sub {
  margin: 0 0 10px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-section-heading);
  letter-spacing: 0.02em;
}

.para {
  margin: 0 0 2px;
  font-size: 0.86rem;
  line-height: 1.85;
  color: var(--color-body-muted);
  letter-spacing: 0.01em;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
