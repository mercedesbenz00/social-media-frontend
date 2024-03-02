export interface SideBarMenuItem {
  label: string
  to: string
  icon: string
}

export const sideBarMenuItems: SideBarMenuItem[] = [
  {
    label: 'Dashboard',
    to: '/',
    icon: 'i-heroicons-outline:view-grid',
  },
  {
    label: 'Store',
    to: '/store',
    icon: 'i-heroicons-outline:shopping-cart',
  },
  {
    label: 'Users',
    to: '/users',
    icon: 'i-heroicons-outline:users',
  },
  {
    label: 'Domains',
    to: '/domains',
    icon: 'i-heroicons-outline:cloud',
  },
  {
    label: 'Network',
    to: '/network',
    icon: 'i-heroicons-outline:globe-alt',
  },
  {
    label: 'Billing & Subscriptions',
    to: '/billing-and-subscriptions',
    icon: 'i-heroicons-outline:tag',
  },
]
