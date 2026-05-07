<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{ open: boolean; busy: boolean }>()

const emit = defineEmits<{
  close: []
  submit: [{ name: string; password: string; message: string }]
}>()

const form = reactive({
  name: '',
  password: '',
  message: '',
})

watch(
  () => props.open,
  (v) => {
    if (!v) {
      form.name = ''
      form.password = ''
      form.message = ''
    }
  },
)

function onSubmit(ev: Event) {
  ev.preventDefault()
  if (!form.name.trim() || !form.password.trim() || !form.message.trim()) return
  emit('submit', {
    name: form.name.trim(),
    password: form.password,
    message: form.message.trim(),
  })
}
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="open" class="mask" role="presentation" @click.self="emit('close')">
        <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="guestbook-modal-title">
          <div class="head">
            <h2 id="guestbook-modal-title" class="h">방명록 작성</h2>
            <button type="button" class="close" aria-label="닫기" @click="emit('close')">✕</button>
          </div>

          <form class="form" @submit="onSubmit">
            <label class="field">
              <span class="label">이름</span>
              <input v-model="form.name" name="guest-name" class="input" autocomplete="name" />
            </label>

            <label class="field">
              <span class="label">내용</span>
              <textarea v-model="form.message" rows="5" class="textarea" />
            </label>
            <span style="font-size: 12px;">부적절한 글은 민선이에 의해 삭제될 수 있음</span>
            <div class="actions">
              <button type="button" class="btn btn--muted" @click="emit('close')">취소</button>
              <button type="submit" class="btn btn--accent" :disabled="busy">
                {{ busy ? '저장 중…' : '작성 완료' }}
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
  margin-bottom: 22px;

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

.form {
}

.field {
  display: grid;
  gap: 9px;
  margin-bottom: 16px;

  .label {
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--color-body-muted);
    letter-spacing: 0.03em;
  }
}

.input,
.textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: 13px;
  font-size: 0.92rem;
  background: rgba(250, 247, 243, 0.55);
  color: var(--color-body);
}

.textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.72;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;

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
    font-size:0.9rem;
    margin-block: 4px;
  }

  .btn--accent {
    background: rgba(169, 120, 134, 0.12);
    color: var(--color-section-heading);
    border: 1px solid rgba(169, 120, 134, 0.28);
    box-shadow: none;
    font-size:0.9rem;
    margin-block: 4px;
  }
}
</style>
