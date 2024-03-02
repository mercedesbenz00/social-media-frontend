<template>
  <div class="bg-primary h-full pt-5 px-4 flex flex-col items-center">
    <div class="i-asset:logo text-4xl mb-10"></div>
    <div class="user-avatar bg-tertiary rounded-full p-2 font-bold text-white mb-8">AD</div>
    <div class="divider"></div>
    <div class="home-icon-wrapper p-4 my-5">
      <div class="i-heroicons-outline:home text-3xl font-bold"></div>
    </div>
    <div class="divider !mb-8"></div>
    <div class="i-heroicons-outline:bell text-3xl text-white font-bold mb-8"></div>
    <div class="i-heroicons-outline:cog text-3xl text-white font-bold mb-8"></div>
    <div class="i-heroicons-outline:logout text-3xl text-white font-bold" @click="() => logout()"></div>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '@/data/auth/auth.store'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return { $auth: useAuthStore() }
  },
  methods: {
    async logout() {
      await this.$auth.logout()
    },
  },
})
</script>

<style lang="scss" scoped>
.divider {
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin: 0 10px;
  width: 100%;
}
.home-icon-wrapper {
  background: #eaf2fe;
  border-radius: 10px;
}
</style>
