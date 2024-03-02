<template>
  <div v-if="diff" class="date-separator">{{ diff }}</div>
</template>

<script setup>
import moment from 'moment-with-locales-es6'
const { t, locale } = useI18n()

const props = defineProps({
  current: {
    type: Object,
    required: true,
  },
  next: {
    type: Object,
    default: undefined,
  },
})

const diff = computed(() => {
  if (props.next) {
    const currentTime = moment(props.current.event.origin_server_ts)
    const currentDate = currentTime.format('DD-MM-YYYY')
    const nextTime = moment(props.next.event.origin_server_ts)
    const nextDate = nextTime.format('DD-MM-YYYY')
    if (currentDate === nextDate) return
    const now = moment()

    const difference = now.diff(nextTime, 'days')
    switch (difference) {
      case 0:
        return t('chat.today')
      case 1:
        return t('chat.yesterday')
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        return nextTime.locale(locale.value).format('dddd')
      default:
        return nextTime.locale(locale.value).format('LL')
    }
  }
  return undefined
})
</script>

<style lang="scss" scoped>
.date-separator {
  --at-apply: 'w-full text-center py-3 text-gray-400 text-xs';
  span {
    &:after,
    &:before {
      display: inline-block;
      content: '';
      border-top: 1px solid #e8e8e8;
      width: 4rem;
      margin: 0 1rem;
      transform: translateY(-3px);
    }
  }
}
</style>
