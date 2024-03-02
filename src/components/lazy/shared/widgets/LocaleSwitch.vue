<template>
  <div class="rtl:left-4 ltr:right-4 flex gap-x-2">
    <!-- <PButton class="uppercase" :label="nextLocale" @click="changeLocale"></PButton> -->
    <PButton class="uppercase" v-for="loc in otherLocales" :key="loc" :label="loc" @click="changeLocale(loc)"></PButton>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    const otherLocales = computed(() => {
      return ['en', 'ar', 'kur'].filter(function (item) {
        return item !== locale.value
      })
    })

    return {
      locale,
      otherLocales,
    }
  },

  methods: {
    changeLocale(loc) {
      this.locale = loc
    },
  },
})
</script>

<style scoped></style>
