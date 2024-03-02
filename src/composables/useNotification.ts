import type { INotificationMeta } from '@/data/main.model'

export function useNotification() {
  const showModal = (meta: INotificationMeta) => {
    const { $vfm } = useGlobals()
    const component = resolveComponent('NotificationModal')
    $vfm.show({
      component,
      bind: {
        drag: false,
        size: 'auto',
        adaptive: false,
        noActions: true,
        meta,
      },
      on: {
        close: () => {
          $vfm.hideAll()
        },
      },
    })
  }

  return reactive({
    showModal,
  })
}
