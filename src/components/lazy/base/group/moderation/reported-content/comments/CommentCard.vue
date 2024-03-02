<template>
  <div class="card">
    <div class="flex items-center">
      <Avatar :person-id="comment.authorId" class="w-10 h-10" />
      <div class="flex justify-between items-center w-full">
        <div class="ms-2">
          <div class="font-bold">{{ author.displayName }}</div>
          <div class="text-text-secondary-light text-xs">{{ moment(comment.createdAt).locale(locale).fromNow() }}</div>
        </div>
        <RouterLink :to="'/posts/' + comment.postId" class="text-info text-xs">View post -></RouterLink>
      </div>
    </div>
    <div v-if="content" class="px-3 md:px-6 py-2 md:py-4 rounded-3xl border border-gray-200 my-2 md:my-4">
      <img class="w-full mb-2" v-if="comment.file" :src="comment.file?.path" />
      <div v-html="content"></div>
    </div>
    <div class="flex items-center justify-between">
      <PersonMute class="mt-2" :person-id="author.id" :display-name="author.displayName" />
      <div
        @click="emits('open-comments')"
        class="block text-info cursor-pointer text-xs underline underline-offset-2 lg:hidden"
      >
        Read the comment
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IPerson } from '@/data/persons/persons.interface'
import { usePersonsStore } from '@/data/persons/persons.store'
import type { IComment } from '@/data/posts/posts.interface'
import type { PropType } from 'vue'
import moment from 'moment-with-locales-es6'
import DOMPurify from 'dompurify'
const { locale } = useI18n()
const $persons = usePersonsStore()
const props = defineProps({
  comment: {
    type: Object as PropType<IComment>,
    required: true,
  },
})
const content = computed(() => DOMPurify.sanitize(props.comment.content, { ALLOWED_TAGS: ['a'] }))
const emits = defineEmits(['open-comments'])
const author = ref({} as IPerson)
const getAuthor = async () => {
  author.value = await $persons.getPersonById(props.comment.authorId)
}

onMounted(getAuthor)
</script>
<style scoped lang="scss">
.card {
  --at-apply: 'p-4 border border-bg-purple-light/50 mx-px md:card-defaults md:mx-0 md:border-none';
}
</style>
