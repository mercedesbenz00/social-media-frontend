<template>
  <BaseRenderlessModal title="" subtitle="">
    <div class="text-center p-4">
      <div class="text-text-primary text-xl font-bold">{{ $t('post.ban_confirm_header') }}</div>
      <div class="py-4">
        {{ $t('post.ban_confirm_message') }}
      </div>
      <div class="w-100 mx-auto">
        <PDropdown
          v-model="period"
          :options="[
            { title: $t('post.ban_period_for_a_day'), value: 1 },
            { title: $t('post.ban_period_for_a_week'), value: 7 },
            { title: $t('post.ban_period_forever'), value: 8888 },
          ]"
          optionLabel="title"
          optionValue="value"
          :placeholder="$t('post.ban_period_placeholder')"
        />
      </div>
      <div class="py-6 flex justify-end gap-3">
        <PButton @click="close" class="p-button-outlined" :label="$t('post.ban_button_label_no')" />
        <PButton
          :disabled="period === undefined"
          @click="onConfirm"
          class="p-button-primary"
          :label="$t('post.ban_button_label_yes')"
        />
      </div>
    </div>
  </BaseRenderlessModal>
</template>
<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required } from '@/utils/validators.utils'

const emit = defineEmits(['confirmed', 'close'])
const period = ref()
const rules = {
  period: {
    required,
  },
}

useVuelidate(rules, period.value, {
  $autoDirty: true,
})

const onConfirm = async () => {
  emit('confirmed', period.value)
}

const close = () => {
  emit('close')
}
</script>
<style scoped lang="scss">
.border-bottom {
  border-bottom: 1px solid rgba(var(--bg-border-light));
}
</style>
