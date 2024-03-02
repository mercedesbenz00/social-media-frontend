<template>
  <ProfilePage :person-id="user?.id" />
</template>

<route lang="yaml">
meta:
  layout: profile
</route>

<script setup lang="ts">
import { useAuthStore } from '@/data/auth/auth.store'

const { user } = useAuthStore()
</script>
