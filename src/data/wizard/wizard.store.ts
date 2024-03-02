import { defineStore } from 'pinia'

export const useWizardStore = defineStore('wizard', {
  state: () => ({
    company: '',
    firstName: '',
    lastName: '',
    role: '',
    network: '',
    roles: ['Administrator', 'CEO', 'Human Resources', 'IT'],
  }),
})
