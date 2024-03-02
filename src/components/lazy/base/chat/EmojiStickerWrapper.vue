<template>
  <div class="emoji-sticker-wrapper">
    <div class="content">
      <PTabView v-model:activeIndex="activeTab">
        <PTabPanel v-if="!onlyEmojis">
          <template #header>
            <div class="i-figma:gifs w-5 h-5"></div>
          </template>
          <StickerPicker
            :static-texts="{ placeholder: $t('emoji_sticker.sticker_placeholder') }"
            v-if="activeTab === 0"
            @select="(gif) => $emit('input:gif', gif)"
          />
        </PTabPanel>
        <PTabPanel v-if="!onlyEmojis">
          <template #header>
            <div class="i-figma:stickers w-5 h-5"></div>
          </template>
          <StickerPicker
            :static-texts="{ placeholder: $t('emoji_sticker.sticker_placeholder') }"
            filter="sticker,static"
            v-if="activeTab === 1"
            @select="(sticker) => $emit('input:sticker', sticker)"
          />
        </PTabPanel>
        <PTabPanel>
          <template #header>
            <div class="i-far:face-smile w-5 h-5"></div>
          </template>
          <EmojiPicker
            v-if="activeTab === 2 || onlyEmojis"
            :native="true"
            @select="(emoji) => $emit('input:emoji', emoji)"
            v-bind="$props.emojiPickerProps"
            :static-texts="{
              placeholder: $t('emoji_sticker.emoji_placeholder'),
              skinTone: $t('emojis_static.skinTone'),
            }"
            :group-names="groupNames"
            :disable-sticky-group-names="true"
          />
        </PTabPanel>
      </PTabView>
      <PButton class="close" icon="i-fas:xmark" @click="$emit('close')" />
    </div>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref(0)
const { t } = useI18n()
defineEmits(['input:emoji', 'input:sticker', 'input:gif', 'close'])
defineProps({
  onlyEmojis: {
    type: Boolean,
    default: false,
  },
  emojiPickerProps: {
    type: Object,
  },
})
const groupNames = computed(() => {
  return {
    smileys_people: t('emojis_groups.smileys_people'),
    animals_nature: t('emojis_groups.animals_nature'),
    food_drink: t('emojis_groups.food_drink'),
    activities: t('emojis_groups.activities'),
    travel_places: t('emojis_groups.travel_places'),
    objects: t('emojis_groups.objects'),
    symbols: t('emojis_groups.symbols'),
    flags: t('emojis_groups.flags'),
  }
})
</script>

<style lang="scss">
.emoji-sticker-wrapper {
  --at-apply: 'p-3 h-400px overflow-hidden card-defaults';
  z-index: 99;
  .content {
    --at-apply: 'position-relative w-full';
    z-index: inherit;
    .p-tabview-nav-content {
      --at-apply: 'rounded-2xl';
      .p-tabview-nav {
        --at-apply: 'flex border-none rounded-lg p-1';
      }
      .p-tabview-header {
        --at-apply: 'mx-2';
      }
      .p-tabview-nav-link {
        --at-apply: ' !border-none !px-2 !py-1 !font-light !text-sm !font-normal rounded-2xl';
      }
      .p-highlight {
        .p-tabview-nav-link {
          --at-apply: '!text-text-primary !rounded-2xl';
          background-color: rgba(var(--primary-color), 0.2) !important;
        }
      }
    }
    .p-tabview-panels {
      --at-apply: ' px-0';
    }

    .p-tabview .p-tabview-panels {
      --at-apply: '!p-0';
    }

    .close {
      --at-apply: 'p-button-icon-only btn-flat-primary position-absolute -top-1 ltr:-right-1 rtl:-left-1 !w-8';
    }

    .v3-emoji-picker .v3-header {
      --at-apply: 'bg-bg-primary text-text-primary border-none rounded-md mt-2';
    }
    .v3-emoji-picker {
      --at-apply: 'h-372px !w-auto !shadow-none defaults bg-bg-primary';
    }
    .v3-emoji-picker .v3-body .v3-body-inner .v3-group h5 {
      --at-apply: 'bg-inherit';
    }
  }
}
.dark-mode {
  .emoji-sticker-wrapper {
    .content {
      .v3-emoji-picker {
        .v3-groups {
          --at-apply: 'invert';
        }
        .v3-text {
          --at-apply: 'text-white';
        }
      }
    }
  }
}
</style>
