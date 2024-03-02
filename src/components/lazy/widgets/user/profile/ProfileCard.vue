<template>
  <div class="profile-card">
    <div
      class="cover"
      :style="[cover ? `background-image: url(${cover}); background-size: cover` : '']"
      :class="[{ 'cursor-pointer': isMyProfile }]"
      @click="openCoverModal(cover)"
    >
      <!-- Image Crop Area -->
      <CoverUploader
        v-if="isMyProfile"
        @upload="uploadCoverHandler"
        class="cover--uploader"
        :loading="coverUploaderLoading"
      />
      <!-- Image Crop Area -->
    </div>
    <div v-if="userData" class="content">
      <div class="flex justify-between flex-col sm:flex-row">
        <div class="flex flex-col sm:flex-row">
          <div
            class="avatar"
            @click="openAvatarUploadModal(avatar)"
            :class="[{ 'cursor-pointer': isMyProfile }, { 'border-4 border-white': avatar }]"
          >
            <img :src="avatar || assetImage('no-avatar.svg')" class="w-full h-full object-cover" />
            <span class="i-figma-camera" v-if="isMyProfile"></span>
          </div>
          <div class="px-3">
            <div class="name">{{ userData.displayName }}</div>
            <div class="location">{{ userLocation }}</div>
          </div>
        </div>
        <div class="text-center sm:text-right !my-3 !sm:my-0">
          <template v-if="isMyProfile">
            <router-link to="/settings">
              <PButton class="btn-outlined-primary px-8" icon="i-figma:edit" :label="$t('profile_card.edit')" />
            </router-link>
          </template>
          <div v-else class="flex items-center justify-center sm:justify-start">
            <PButton
              v-if="isFollowing"
              :loading="popupLoading"
              icon="i-figma:more-horizontal"
              @click.stop="toggle"
              aria:haspopup="true"
              aria-controls="dropdown_panel"
              class="btn-flat-primary text-2xl text-primary"
            >
            </PButton>
            <PopupMenu
              v-if="dropDownItems && dropDownItems.length > 0"
              :items="dropDownItems"
              ref="dropdown"
              id="dropdown_panel"
            />
            <PButton
              class="btn-flat-primary text-2xl !mr-2"
              icon="i-figma-mail"
              @click="openChat"
              :loading="chatStore.initRoomLoading"
            />
            <FollowUnFollowButton
              :following-display-name="userData.displayName"
              :following-id="userData.id"
              @refresh="refresh"
            />
          </div>
        </div>
      </div>
      <div class="flex gap-2 justify-center flex-wrap w-60% m-auto lg:w-full lg:gap-6 lg:mt-4 lg:justify-start">
        <ProfileInfo
          :title="$t('profile_card.post')"
          :value="userData.postCount"
          :is-row-item="false"
          icon="i-figma-edit2"
        />
        <ProfileInfo
          :title="$t('profile_card.followers')"
          :value="userData.followerCount"
          :is-row-item="false"
          icon="i-figma-heart"
          @click="gotoUserPage('followers')"
          class="cursor-pointer"
        />
        <ProfileInfo
          :title="$t('profile_card.following')"
          :value="userData.followingCount"
          :isRowItem="false"
          icon="i-figma-user-plus"
          @click="gotoUserPage('following')"
          class="cursor-pointer"
        />
        <ProfileInfo
          :title="$t('profile_card.groups')"
          :value="userData.groupCount"
          :isRowItem="false"
          icon="i-figma-users"
          @click="gotoUserPage('groups')"
          class="cursor-pointer"
        />
        <ProfileInfo
          v-if="isMyProfile"
          :title="$t('profile_card.collections')"
          :value="collections.totalElements || 0"
          :isRowItem="false"
          icon="i-figma:copy"
          @click="gotoUserPage('collections')"
          class="cursor-pointer"
        />
      </div>
      <div v-if="userData.bio">
        <PDivider />
        <div class="text-lg font-semibold">{{ $t('profile_update.bio') }}:</div>
        <PostContent :content="userData.bio" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { IUser } from '@/data/auth/auth.interface'
import { useAssets } from '@/composables/useAssets'
import { useAuthStore } from '@/data/auth/auth.store'
import { useCitiesStore } from '@/data/cities/cities.store'
import { useGlobals } from '@/main'
import { usePersonMediaStore } from '@/data/personMedia/personMedia.store'
import { useChatStore } from '@/data/chat/chat.store'
import { usePersonsStore } from '@/data/persons/persons.store'
import type { IPopupMenuItem } from '@/data/main.interface'
import { useSizedImage } from '@/composables/useSizedImage'
import { useMainStore } from '@/data/main.store'
import { usePostsStore } from '@/data/posts/posts.store'
import { useDeviceDetector } from '@/utils/device-detector.utils'
const $main = useMainStore()
const router = useRouter()
const chatStore = useChatStore()
const assetImage = useAssets
const props = defineProps({
  userData: {
    type: Object as PropType<IUser | undefined | null>,
  },
  isMyProfile: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const openChat = async () => {
  const roomId = await chatStore.initRoom(props.userData?.id)
  if (roomId) {
    if (device.value == 'desktop') return
    else router.push('/chat/' + roomId)
  }
}
const device = useDeviceDetector()
const { t } = useI18n()
const dropdown = ref()
const toggle = async (event) => {
  try {
    popupLoading.value = true
    if (props.userData)
      followerNotificationSettings.value = await $persons.getFollowingNotificationSettingsById(props.userData.id)
  } finally {
    popupLoading.value = false
  }
  dropdown.value.toggle(event)
}
const $auth = useAuthStore()
const $persons = usePersonsStore()
const $posts = usePostsStore()
const popupLoading = ref(false)
const isBlocked = computed(() => $persons.isBlocked(props.userData?.id))
const isMuted = computed(() => $persons.isMuted(props.userData?.id))
const isFollowing = computed(() => $persons.isFollowing(props.userData?.id))
const me = computed(() => $auth.user)
const collections = computed(() => $posts.collections)

const isFollower = computed(() => $auth.following.find((i) => i.subscribedTo.id === props.userData?.id))
const followerNotificationSettings = ref<boolean>(false)
interface IActions {
  [key: string]: IPopupMenuItem
}

const actions = computed<IActions>(() => {
  return {
    BLOCK_PERSON: {
      title: isBlocked.value ? 'profile_card.unblock' : 'profile_card.block',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      action: (e) => {
        if (isBlocked.value && props.userData) $persons.unBlockPeople(props.userData.id)
        else if (props.userData) $persons.blockPerson(props.userData.id)
      },
    } as IPopupMenuItem,
    MUTE_PERSON: {
      title: isMuted.value ? 'profile_card.unmute' : 'profile_card.mute',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      action: (e) => {
        if (isMuted.value && props.userData) $persons.unMutedPeople(props.userData.id)
        else if (props.userData) $persons.mutePerson(props.userData.id)
      },
    } as IPopupMenuItem,
    MUTE_FOLLOWER: {
      title: followerNotificationSettings.value ? t('post.unmute_person') : t('post.mute_person'),
      icon: 'i-figma:bell',
      action: (e) => {
        if (!props.userData) return
        $persons.setFollowerNotificationSettingsById(props.userData.id, !followerNotificationSettings.value)
        followerNotificationSettings.value = !followerNotificationSettings.value
        toggle(e)
      },
    } as IPopupMenuItem,
    COPY_LINK: {
      title: t('profile.copy_link'),
      icon: 'i-figma:copy',
      action: () => {
        if (!props.userData) return
        const href = window.location.origin
        navigator.clipboard.writeText(href + '/profile/' + props.userData.id)
        $main.toast({
          type: 'success',
          message: t('toast.success'),
          detail: t('profile.link_copied'),
        })
      },
    },
  }
})

const dropDownItems = computed<IPopupMenuItem[]>(() => [actions.value.MUTE_FOLLOWER, actions.value.COPY_LINK])
const emit = defineEmits(['avatarChange', 'coverChange', 'refresh'])
const cover = computed(() => useSizedImage([props.userData?.cover ?? []]))
const avatar = computed(() => useSizedImage([props.userData?.avatar ?? []]))

const refresh = () => {
  useAuthStore().me(true)
  emit('refresh')
}

const userLocation = computed(() => {
  if (props.userData?.cityId) {
    useCitiesStore().getCities()
    const { cities } = useCitiesStore()
    if (cities?.length) {
      const city = cities.filter((c) => c.id === props.userData?.cityId)
      if (city.length) {
        return city[0].name
      }
    }
  }
  return ''
})
const openCoverModal = (path: string) => {
  if (props.isMyProfile) return
  const { $vfm } = useGlobals()
  const component = resolveComponent('FullSizeImage')
  $vfm.show({
    component,
    bind: {
      drag: false,
      size: 'auto',
      noActions: true,
      adaptive: false,
      url: path,
    },
    on: {
      close: () => {
        $vfm.hideAll()
      },
    },
  })
}
const openAvatarUploadModal = (path?: string) => {
  const { $vfm } = useGlobals()
  if (!props.isMyProfile) {
    const component = resolveComponent('FullSizeImage')
    $vfm.show({
      component,
      bind: {
        drag: false,
        size: 'auto',
        adaptive: false,
        noActions: true,
        url: path,
      },
      on: {
        close: () => {
          $vfm.hideAll()
        },
      },
    })
  } else {
    const component = resolveComponent('AvatarUpload')
    $vfm.show({
      component,
      bind: {
        drag: false,
        size: 'auto',
        adaptive: false,
        noActions: true,
        src: path,
      },
      on: {
        upload: async (payload) => {
          await usePersonMediaStore().setAvatar(payload)
          refresh()
          $vfm.hideAll()
        },
      },
    })
  }
}

const coverUploaderLoading = ref(false)
const uploadCoverHandler = async (formData) => {
  coverUploaderLoading.value = true
  await usePersonMediaStore().setCover(formData)
  coverUploaderLoading.value = false
  refresh()
}

const gotoUserPage = (page) => {
  const id = props.userData?.id ?? null
  if (id) useGlobals().$router.push({ path: `/profile/${props.userData?.id}/${page}` })
}

onMounted(async () => {
  await Promise.all([
    $persons.getBlockedPeople(),
    $persons.getMutedPeople(),
    $persons.getFollowing(useAuthStore().user?.id),
    $posts.getCollections(),
  ])
})
</script>

<style lang="scss" scoped>
.profile-card {
  --at-apply: 'w-auto max-w-180 min-w-61 overflow-hidden shadow-none mx-px border border-bg-purple-light/50 lg:defaults lg:border-none lg:bg-bg-primary lg:card-defaults lg:rounded-lg lg:mx-0';
  --at-apply: 'md:w-180';
  .cover {
    --at-apply: 'h-50 bg-gray-500 flex justify-center items-center overflow-hidden';
  }
  .content {
    --at-apply: 'position-relative h-auto p-5';

    .avatar {
      --at-apply: 'position-relative mx-auto h-30 w-30 -mt-16 flex justify-center items-center';
      --at-apply: 'rounded-full overflow-hidden';

      .user-avatar {
        --at-apply: 'border-2 border-white';
      }

      span {
        --at-apply: 'hidden position-absolute';
      }

      &:hover {
        span {
          --at-apply: 'inline-flex text-white';
        }
      }
    }

    .name {
      --at-apply: 'font-bold text-2xl text-text-primary text-center sm:text-left';
    }
    .location {
      --at-apply: 'text-xs font-normal py-1 text-text-primary/50 text-center sm:ltr:text-left sm:rtl:text-right';
    }

    .icon {
      font-size: 4rem;
    }
  }

  .croppers {
    background: black;
    &__cropper {
      width: 100vw;
      margin: 0 auto;
      margin-bottom: 24px;
    }
  }
}
</style>
