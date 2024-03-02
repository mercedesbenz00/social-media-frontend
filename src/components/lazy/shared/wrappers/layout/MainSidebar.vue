<template>
  <div class="main-sidebar bg-bg-gray pt-5 h-full start-0 border-r-blue-50 border-e z-10">
    <div class="flex items-center px-5 justify-center whitespace-nowrap">
      <div class="company-title rounded text-white text-lg m-2">
        <span class="flex items-center justify-center py-2 px-1">{{ firstLettersOfCompanyTitle }}</span>
      </div>
      <RouterLink
        to="/"
        class="text-lg px-5 text-blue-600 font-bold text-ellipsis overflow-hidden whitespace-nowrap sidebar-company-title"
      >
        {{ companyTitle }}
      </RouterLink>
    </div>
    <nav class="flex justify-between text-textColor mt-9">
      <ul class="w-full">
        <li v-for="(item, i) in items" :key="i" class="navbar-item">
          <RouterLink :to="item.to" class="sidebar-nav-link">
            <div :class="[item.icon, 'me-2', 'text-xl']"></div>
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { sideBarMenuItems } from '@/constants/sidebar-items.constants'

export default defineComponent({
  props: {
    companyTitle: {
      type: String,
      default: 'Creative Advanced Technologies',
    },
  },
  setup() {
    return {
      items: sideBarMenuItems,
    }
  },
  computed: {
    firstLettersOfCompanyTitle(): string {
      return this.companyTitle
        ?.split(' ')
        .map((word) => word[0])
        .join('')
    },
  },
})
</script>

<style lang="scss" scoped>
.main-sidebar {
  width: 290px;
}

.company-title {
  background: #6fcf97;
}

.sidebar-nav-link {
  transition: all 0.2s ease-out;
  --at-apply: 'flex flex-wrap items-center pl-7 pr-5 py-4 text-text-primary hover:bg-bg-gray-dark hover:text-primary sidebar-nav-link';
}

.router-link-active {
  --at-apply: 'bg-bg-gray-dark text-primary font-bold';
}
</style>
