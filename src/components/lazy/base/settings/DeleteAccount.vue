<template>
  <div>
    <h3 class="font-bold text-lg text-text-primary mb-4">{{ $t('settings.delete_account_title') }}</h3>
    <p class="mb-4 text-sm text-text-secondary-light">
      {{ $t('settings.delete_account_subtitle') }}
    </p>
    <a class="text-text-blue-light-color text-link cursor-pointer" @click="confirmDeletion">{{$t('delete_account.btn')}}</a>
  </div>
</template>

<script lang="ts" setup>
import { usePersonsStore } from '@/data/persons/persons.store'
import { useConfirm } from 'primevue/useconfirm'
const confirm = useConfirm()
const personStore = usePersonsStore()

const { t } = useI18n()

function confirmDeletion() {
  confirm.require({
    header: t('delete_account.title'),
    message: t('delete_account.message'),
    icon: 'pi pi-exclamation-triangle text-error',
    acceptLabel: t('delete_account.yes'),
    rejectLabel: t('delete_account.no'),
    acceptClass: 'btn-error',
    rejectClass: 'p-button',
    accept: async () => await personStore.deleteAccount(),
    reject: () => {
      confirm.close()
    },
  })
}
</script>
