import { useI18n } from 'vue-i18n'
import { defineStore } from 'pinia'
import { eStore } from './applications.endpoint'
import { useMainStore } from '../main.store'
import type { IProduct, IApplication, IApplicationResponse } from './applications.interface'

export const useApplicationsStore = defineStore({
    id: 'applications',
    state: () => {
        return {
            products: null as IProduct[] | null,
            loading: false
        }
    },
    getters: {
        getProductById: (state) => {
            return (productId): IProduct | undefined => state.products?.find((product) => product.id === productId) as IProduct | undefined
        },
    },
    actions: {
        async getApplications() {
            try {
                this.loading = true
                const { data } = await useApi<IApplicationResponse>({
                    ...eStore.products,
                    params: { lang: useI18n({ useScope: 'global' }).locale.value },
                    headers: { 'x-workspace-id': '7a838e15-944c-4334-aa7b-0c8eb0c5d9e3' },
                })
                this.products = fromApplicationsToProducts(data.applications) as IProduct[]
                return data
            } catch (e) {
                useMainStore().toast({ type: 'error', message: e.message })
            } finally {
                this.loading = false
            }
        },
    },
})

function fromApplicationsToProducts(apps: IApplication[]) {
    return apps.map((_: IApplication) => {
        const product: Partial<IProduct> = { ..._ }
        if (!product.size) product.size = (Math.round(Math.random() * 10000) / 100).toString() + ' KB'
        if (!product.languages) product.languages = ['Arabic', 'English']
        if (!product.developer) product.developer = 'Creative Advanced Technologies'
        if (!product.copyright) product.copyright = 'Creative Advanced Technologies 2021'
        if (!product.isAutoupdatable) product.isAutoupdatable = false
        if (!product.rating) product.rating = Math.ceil((Math.random() * 10) % 5)
        if (!product.preview) product.preview = `@/assets/products/${product?.name?.toLocaleLowerCase()}.jpg`
        if (!product.votes) product.votes = Math.ceil(Math.random() * 100)
        if (!product.usersCount) product.usersCount = 12
        if (!product.location) product.location = 'Device'
        return product
    })
}
