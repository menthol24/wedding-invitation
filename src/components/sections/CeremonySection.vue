<script setup lang="ts">
defineProps<{
  dateLabel: string
  venueName: string
}>()
</script>

<template>
  <section class="ceremony section-pad section-pad--after-poster">
    <div class="divider" />
    <p class="date">{{ dateLabel }}</p>
    <p class="venue">{{ venueName }}</p>
    <div class="divider" />
  </section>
</template>

<style scoped lang="scss">
.ceremony {
  text-align: center;
}

.divider {
  height: 1px;
  width: min(500px, 80%);
  margin: 0 auto;
  background: rgba(167, 120, 134, 0.18);
}

.date {
  margin: 36px auto 12px;
  font-size: 0.94rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--color-body);
  line-height: 1.85;
}

.venue {
  margin: 0 auto 36px;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-body-muted);
  letter-spacing: 0.03em;
  line-height: 1.75;
}
</style>
