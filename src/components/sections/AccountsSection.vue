<script setup lang="ts">
import { ref } from 'vue'

export type AccountRow = {
  role: string
  bankInfo: string
  number: string
}

export type AccountGroup = {
  id: string
  label: string
  rows: AccountRow[]
}

const props = defineProps<{
  title: string
  introLines: string[]
  groups: AccountGroup[]
}>()

const openMap = ref<Record<string, boolean>>({})

function isOpen(id: string) {
  return openMap.value[id] ?? false
}

function toggle(id: string) {
  openMap.value = { ...openMap.value, [id]: !isOpen(id) }
}

async function copyNumber(num: string) {
  const text = num.replace(/\s/g, '')
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    window.prompt('계좌번호를 복사해 주세요', text)
  }
}
</script>

<template>
  <section class="acct section-pad section-pad--wide" aria-labelledby="acct-heading">
    <h2 id="acct-heading" class="title">{{ props.title }}</h2>

    <div class="intro">
      <p v-for="(ln, i) in props.introLines" :key="i" class="line">{{ ln }}</p>
    </div>

    <div class="accordions">
      <div
        v-for="g in props.groups"
        :key="g.id"
        class="acc"
        :class="{
          'acc--groom': g.id === 'groom-side',
          'acc--bride': g.id === 'bride-side',
        }"
      >
        <button
          type="button"
          class="acc__head"
          :aria-expanded="isOpen(g.id)"
          :aria-controls="`acc-${g.id}`"
          :id="`acc-btn-${g.id}`"
          @click="toggle(g.id)"
        >
          <span class="acc__label">{{ g.label }}</span>
          <span class="acc__chev" aria-hidden="true">{{ isOpen(g.id) ? '⌃' : '⌄' }}</span>
        </button>

        <div
          :id="`acc-${g.id}`"
          class="acc__panel"
          role="region"
          :aria-labelledby="`acc-btn-${g.id}`"
          :hidden="!isOpen(g.id)"
        >
          <div v-for="(row, ri) in g.rows" :key="ri" class="row">
            <div class="info">
              <p class="role">{{ row.role }}</p>
              <p class="num">{{ row.number }}</p>
              <p class="bank">{{ row.bankInfo }}</p>
            </div>
            <div class="ops">
              <button type="button" class="chip chip--copy" @click="copyNumber(row.number)">
                복사
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.title {
  margin: 0 0 32px;
  text-align: center;
  font-family: $font-display;
  font-size: 1.38rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--color-section-heading);
}

.intro {
  text-align: center;
  margin-bottom: 36px;

  .line {
    margin: 0 0 14px;
    font-size: 0.9rem;
    line-height: 1.92;
    color: var(--color-body-muted);
    letter-spacing: 0.01em;
    white-space: pre-line;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.accordions {
  display: grid;
  gap: 14px;
}

.acc {
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  overflow: hidden;
}

.acc__head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border: none;
  border-bottom: 1px solid rgba(72, 58, 54, 0.06);
  background: transparent;
  font-size: 0.92rem;
  font-weight: 500;
  letter-spacing: 0.04em;
}

.acc__label {
  color: var(--color-section-heading);
}

.acc__chev {
  font-size: 0.85rem;
  color: var(--color-body-muted);
}

.acc__panel {
  padding: 0;

  &[hidden] {
    display: none;
  }
}

.row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border-top: 1px solid rgba(72, 58, 54, 0.06);

  &:first-child {
    border-top: none;
  }
}

.info {
  flex: 1;
  min-width: 0;
  line-height: 1.5;
}

.role {
  margin: 0 0 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-section-heading);
  letter-spacing: 0.06em;
  line-height: 1.5
}

// 그룹별 신랑/신부 색상 — acc__label(아코디언 헤더)과 row의 .role 모두 적용
.acc--groom .acc__label,
.acc--groom .role {
  color: var(--color-role-groom);
}

.acc--bride .acc__label,
.acc--bride .role {
  color: var(--color-role-bride);
}

.num {
  margin: 0 0 8px;
  font-size: 0.92rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--color-body);
  font-variant-numeric: tabular-nums;
}

.bank {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-body-muted);
  line-height: 1.5;
}

.ops {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  width: 76px;
}

.chip {
  padding: 9px 10px;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 500;
  border: 1px solid rgba(72, 58, 54, 0.12);
  background: #ffffff;
  color: var(--color-body-muted);
}

.chip--pay {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #fee500;
  color: #191919;
  font-weight: 700;
  min-height: 36px;
}

.pay-mark {
  font-size: 0.78rem;
  letter-spacing: 0.02em;
}
</style>
