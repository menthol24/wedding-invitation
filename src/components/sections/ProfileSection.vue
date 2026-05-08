<script setup lang="ts">
export interface ProfileCard {
  id: string
  roleLabel: string
  name: string
  photoUrl: string
  alt?: string
  description: string
}

defineProps<{
  title?: string
  cards: ProfileCard[]
}>()
</script>

<template>
  <section class="profile section-pad section-pad--wide" aria-labelledby="profile-heading">
    <h2 v-if="title" id="profile-heading" class="title">{{ title }}</h2>

    <div class="stack">
      <article
        v-for="card in cards"
        :key="card.id"
        class="card"
        :class="`card--${card.id}`"
      >
        <figure :class="`photo photo--${card.id}`">
          <img
            :src="card.photoUrl"
            :alt="card.alt ?? card.name"
            loading="lazy"
            decoding="async"
          />
          <div class="meta">
            <div class="meta-content">
              <p class="role">{{ card.roleLabel }}</p>
              <h3 class="name">{{ card.name }}</h3>
            </div>
            <p class="desc">{{ card.description }}</p>
          </div>
        </figure>

      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

// 섹션 자체에 연한 아이보리/베이지 배경을 깔아 카드(흰색)와 대비
#profile-heading {
  text-align: right;
  margin-bottom: 15px;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.photo {
  margin: 0;
  display: flex;
  align-items: center;
  background: var(--color-bg-soft);
  border-radius: var(--radius-photo);
  height: 200px;
  position: relative;
  overflow: visible;

  img {
    display: block;
    width: 35%;
    object-fit: contain;
    object-position: bottom center;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;
  }
}

.photo--bride {
  direction: ltr;

  img {
    left: auto;
    right: 0;
  }

  .meta {
    margin-left: 0;
  }
}

.meta {
  position: relative;
  z-index: 1;
  width: 70%;
  margin-left: 35%;
  padding: 0 0px;
  text-align: center;
}

.meta-content {
  display: flex;
  justify-content: center;
  align-items: baseline;
  margin-bottom: 8px;
}

.role {
  margin: 0 0 8px;
  font-family: $font-body-strong;
  font-weight: 600;
  font-size: $fs-sm;
  letter-spacing: $ls-wider;
  text-transform: uppercase;
}

.card {
  overflow: visible;
}

.card--groom .role {
  color: var(--color-role-groom);
}

.card--bride .role {
  color: var(--color-role-bride);
  font-family: $font-body-strong;
}

.name {
  margin-left: 8px;
  font-family: $font-body;
  font-size: $fs-md;
  font-weight: 500;
  letter-spacing: $ls-wide;
  color: var(--color-body);
}

.desc {
  margin: 0;
  font-size: $fs-base;
  line-height: $lh-base;
  color: var(--color-body-muted);
}

</style>
