<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  open: boolean
  busy: boolean
}>()

const emit = defineEmits<{
  close: []
  /** 입력된 비밀번호를 부모로 전달 — 검증은 부모(섹션)가 마스터 비밀번호로 비교 */
  confirm: [{ password: string }]
}>()

const password = ref('')
const errorMsg = ref('')

watch(
  () => props.open,
  (v) => {
    if (!v) {
      password.value = ''
      errorMsg.value = ''
    }
  },
)

/** 부모가 비밀번호 불일치 시 호출할 수 있도록 노출 */
function showError(msg: string) {
  errorMsg.value = msg
}

defineExpose({ showError })

function onSubmit(ev: Event) {
  ev.preventDefault()
  if (!password.value.trim()) return
  errorMsg.value = ''
  emit('confirm', { password: password.value })
}
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="open" class="mask" role="presentation" @click.self="emit('close')">
        <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="guestbook-delete-title">
          <div class="head">
            <h2 id="guestbook-delete-title" class="h">방명록 삭제</h2>
            <button type="button" class="close" aria-label="닫기" @click="emit('close')">✕</button>
          </div>

          <form class="form" @submit="onSubmit">
            <p class="desc">관리자 비밀번호를 입력해 주세요.</p>

            <label class="field">
              <span class="label">비밀번호</span>
              <input
                v-model="password"
                type="password"
                class="input"
                autocomplete="current-password"
                :disabled="busy"
              />
            </label>

            <p v-if="errorMsg" class="error" role="alert">{{ errorMsg }}</p>

            <div class="actions">
              <button type="button" class="btn btn--muted" @click="emit('close')">취소</button>
              <button type="submit" class="btn btn--accent" :disabled="busy">
                {{ busy ? '삭제 중…' : '삭제' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.mask {
  position: fixed;
  inset: 0;
  z-index: 1900;
  background: rgba(42, 36, 34, 0.28);
  display: grid;
  place-items: flex-end stretch;
}

.sheet {
  width: min(var(--page-max), 100%);
  margin: 0 auto;
  padding: calc(24px + env(safe-area-inset-top)) 24px calc(28px + env(safe-area-inset-bottom));
  border-radius: 20px 20px 0 0;
  background: var(--color-surface);
  box-shadow: 0 -8px 40px rgba(42, 36, 34, 0.08);
  border: 1px solid var(--color-border);
  max-height: min(94vh, 720px);
  overflow: auto;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;

  .h {
    margin: 0;
    font-size: 1.02rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--color-body);
  }

  .close {
    flex-shrink: 0;
    border: none;
    background: rgba(250, 247, 243, 0.9);
    width: 38px;
    height: 36px;
    border-radius: var(--radius-button);
    font-size: 1rem;
    color: var(--color-body-muted);
  }
}

.desc {
  margin: 0 0 16px;
  font-size: 0.86rem;
  color: var(--color-body-muted);
  line-height: 1.6;
}

.field {
  display: grid;
  gap: 9px;
  margin-bottom: 8px;

  .label {
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--color-body-muted);
    letter-spacing: 0.03em;
  }
}

.input {
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: 13px;
  font-size: 0.92rem;
  background: rgba(250, 247, 243, 0.55);
  color: var(--color-body);
}

.error {
  margin: 8px 0 0;
  font-size: 0.8rem;
  color: #c0463a;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;

  .btn {
    flex: 1;
    border-radius: var(--radius-button);
    padding: 12px;
    border: none;
    font-weight: 500;

    &:disabled {
      opacity: 0.55;
    }
  }

  .btn--muted {
    background: transparent;
    color: var(--color-body-muted);
    border: 1px solid rgba(72, 58, 54, 0.1);
    font-size: 0.9rem;
    margin-block: 4px;
  }

  .btn--accent {
    background: rgba(169, 120, 134, 0.12);
    color: var(--color-section-heading);
    border: 1px solid rgba(169, 120, 134, 0.28);
    box-shadow: none;
    font-size: 0.9rem;
    margin-block: 4px;
  }
}
</style>
