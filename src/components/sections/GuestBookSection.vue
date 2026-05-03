<script setup lang="ts">
import { onMounted, ref } from 'vue'
import GuestBookWriteModal from '@/components/guestbook/GuestBookWriteModal.vue'
import { useGuestbook } from '@/composables/useGuestbook'
import type { GuestBookCreateInput } from '@/services/guestbook/types'

const props = defineProps<{
  title: string
  emptyMessageLines: string[]
}>()

const { entries, visibleEntries, loading, refresh, submit, allVisible, toggleShowAll } =
  useGuestbook()

const modalOpen = ref(false)
const submitBusy = ref(false)

onMounted(refresh)

async function onSubmit(input: GuestBookCreateInput) {
  submitBusy.value = true
  try {
    await submit(input)
    modalOpen.value = false
  } finally {
    submitBusy.value = false
  }
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  const y = d.getFullYear()
  const mo = `${d.getMonth() + 1}`.padStart(2, '0')
  const da = `${d.getDate()}`.padStart(2, '0')
  return `${y}.${mo}.${da}`
}
</script>

<template>
  <section class="guest section-pad section-pad--wide" aria-labelledby="guest-heading">
    <h2 id="guest-heading" class="title">{{ props.title }}</h2>

    <div class="toolbar">
      <button type="button" class="linkish" @click="toggleShowAll">{{
        allVisible ? '접기' : '전체보기'
      }}</button>
      <button type="button" class="primary" @click="modalOpen = true">작성</button>
    </div>

    <p v-if="loading" class="hint">방명록을 불러오는 중입니다.</p>

    <div v-if="!loading && entries.length === 0" class="empty">
      <p v-for="(ln, i) in props.emptyMessageLines" :key="i">{{ ln }}</p>
    </div>

    <ul v-else class="list">
      <li v-for="e in visibleEntries" :key="e.id" class="item">
        <div class="meta">
          <span class="name">{{ e.name }}</span>
          <span class="date">{{ fmtDate(e.createdAt) }}</span>
        </div>
        <p class="body">{{ e.content }}</p>
      </li>
    </ul>

    <GuestBookWriteModal
      :open="modalOpen"
      :busy="submitBusy"
      @close="modalOpen = false"
      @submit="onSubmit"
    />
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

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 36px;

  .linkish,
  .primary {
    flex: 1;
    padding: 11px 12px;
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.04em;
  }

  .linkish {
    background: #ffffff;
    border: 1px solid rgba(72, 58, 54, 0.12);
    color: var(--color-body-muted);
    border-radius: 4px;
  }

  .primary {
    border: 1px solid rgba(72, 58, 54, 0.12);
    background: #ffffff;
    color: var(--color-body);
    border-radius: 4px;
    box-shadow: none;
  }
}

.hint {
  margin: 0 0 22px;
  text-align: center;
  font-size: 0.82rem;
  color: var(--color-body-muted);
}

.empty {
  text-align: center;
  padding: 20px 0 28px;

  p {
    margin: 8px 0;
    font-size: 0.9rem;
    line-height: 1.88;
    color: var(--color-body-muted);
  }
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
}

.item {
  padding: 18px;
  border-radius: var(--radius-card);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lift);
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;

  .name {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-body);
  }

  .date {
    font-size: 0.72rem;
    letter-spacing: 0.05em;
    color: var(--color-body-muted);
    opacity: 0.85;
  }
}

.body {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.82;
  color: var(--color-body-muted);
  white-space: pre-wrap;
}
</style>
