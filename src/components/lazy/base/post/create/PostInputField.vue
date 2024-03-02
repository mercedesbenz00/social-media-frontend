<template>
  <div class="w-full">
    <InputField :shrink-wrap="true" class="w-full">
      <template v-if="!hideLeading" #leading>
        <i
          class="text-primary text-xl transform -translate-y-1 cursor-pointer absolute top-4"
          :class="$lodash.isEmpty(modelValue) ? 'i-figma:edit-2 bg' : 'i-figma:x'"
          @click="() => emits('update:modelValue', '')"
        />
      </template>
      <template #trailing>
        <div class="relative">
          <p-button
            class="btn-flat-primary text-2xl text-primary"
            icon="i-far:face-smile"
            @click="showEmojiStickerPicker = !showEmojiStickerPicker"
          />
          <div v-if="showEmojiStickerPicker" ref="emoji_rect" class="w-320px z-50 position-absolute top-10 end-0">
            <EmojiStickerWrapper
              @close="showEmojiStickerPicker = false"
              @input:emoji="onSelectEmoji"
              :onlyEmojis="true"
              :emojiPickerProps="{ hideGroupIcons: true, disableSkinTones: true, hideGroupNames: true }"
            />
          </div>
        </div>
      </template>
      <Mentionable
        class="flex-1 relative"
        :keys="['@']"
        :items="persons"
        insert-space
        @search="fetchPersons($event)"
        @open="fetchPersons()"
        @apply="mentioned"
      >
        <template #no-result> {{ loading ? 'Loading' : 'empty' }} </template>
        <template #item-@="{ item }">
          <PersonItem class="py-2 px-4" :person="item" />
        </template>
        <p-textarea
          v-bind="$attrs"
          ref="textarea"
          :dir="isRtl ? 'rtl' : 'ltr'"
          :auto-resize="true"
          rows="1"
          cols="50"
          class="post-textarea"
          :value="modelValue"
          @input="handleInput($event.target.value)"
        />
      </Mentionable>
    </InputField>
    <link-preview
      v-if="src || preview"
      :url="src"
      :meta="preview"
      :is-edit="true"
      @on-preview="emits('on-preview', $event)"
    />
  </div>
</template>
<script setup lang="ts">
import { useAuthStore } from '@/data/auth/auth.store'
import { usePersonsStore } from '@/data/persons/persons.store'
import type { IPost } from '@/data/posts/posts.interface'
import { debounce } from 'lodash'
import type { PropType } from 'vue'
import { Mentionable } from 'vue-mention'
const emits = defineEmits(['update:modelValue', 'mentioned', 'on-preview'])
const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: '',
  },
  hideLeading: {
    type: Boolean,
    required: false,
    default: false,
  },
  files: {
    type: Array as PropType<File[]>,
    required: false,
    default: [],
  },
  disableOutsideClickHide: {
    type: Boolean,
    required: false,
    default: false,
  },
  post: {
    type: Object as PropType<IPost>,
    required: false,
  },
  preview: {
    type: Object as PropType<any>,
    required: false,
  },
})
watch(props, () => {
  if (props.files && props.files.length > 0) showPreview.value = false
  else showPreview.value = true
})

const src = computed(() => props.modelValue.match(patternLink)?.pop())
const showPreview = ref(true)
const patternLink = /https?:\/\/\S+/gi
const $persons = usePersonsStore()
const emoji_rect = ref()
const loading = ref(false)
const persons = ref([] as any)
const $auth = useAuthStore()
const showEmojiStickerPicker = ref(false)
const { locale } = useI18n()
const arabicTextRegex = new RegExp('[\u0600-\u06FF]+')
const textarea = ref()
const isRtl = computed(() =>
  locale.value == 'ar' || locale.value == 'kur' ? true : arabicTextRegex.test(props.modelValue)
)
const mentioned = ($event) => {
  emits('mentioned', { id: $event.id, displayName: $event.displayName })
}
const handleInput = (val: string) => {
  emits('update:modelValue', val)
}
const onSelectEmoji = (emoji) => {
  if (textarea.value && textarea.value.$el) {
    // Get the reference to the currently focused textarea
    const textareaEle = textarea.value.$el
    // Get the current cursor position within the textarea
    const cursorPosition = textareaEle.selectionStart

    // Insert the emoji at the current cursor position
    const updatedValue =
      props.modelValue.substring(0, cursorPosition) + emoji.i + props.modelValue.substring(cursorPosition)
    const maxLengthAttr = textareaEle.getAttribute('maxlength')
    if (maxLengthAttr !== null && updatedValue.length > maxLengthAttr) {
      return
    }

    // Update the textarea value with the emoji
    emits('update:modelValue', updatedValue)
    // Set the focus back to the textarea
    textareaEle.focus()
  }
}
const me = computed(() => $auth.user)
const fetchPersons = debounce(async (searchText = null) => {
  try {
    loading.value = true
    let personsData: any = await $persons.getPersons({ query: searchText, followingFirst: true })
    if (personsData) {
      persons.value = personsData.content.map((person) => {
        person.value = person.displayName
        return person
      })
    } else {
      personsData = await $persons.getAllPersons({ query: searchText })
      persons.value = personsData.content.map((person) => {
        person.value = person.displayName
        return person
      })
    }
  } finally {
    loading.value = false
  }
}, 500)

onClickOutside(emoji_rect, () => {
  if (!props.disableOutsideClickHide) {
    showEmojiStickerPicker.value = false
  }
})
</script>
<style scoped lang="scss">
.post-textarea {
  --at-apply: ' w-full h-full rounded-3xl min-h-48px pt-3 md:pt-2 resize-none';
}
</style>
