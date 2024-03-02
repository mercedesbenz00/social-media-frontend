import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { useNotificationsStore } from '@/data/notifications/notifications.store'
import { useAuthStore } from '@/data/auth/auth.store'

export const install = () => {
  const $notifications = useNotificationsStore()
  const $auth = useAuthStore()
  const firebaseConfig = {
    apiKey: 'AIzaSyBGPPYsF9a5Gdqgfsg8wqLuydJaBpk1sFc',
    authDomain: 'sn-vkassin.firebaseapp.com',
    projectId: 'sn-vkassin',
    storageBucket: 'sn-vkassin.appspot.com',
    messagingSenderId: '1055327503816',
    appId: '1:1055327503816:web:cf9db19da4ee66bae6acfd',
    measurementId: 'G-R86KZTNQ9T',
  }

  let firebase
  let messaging: any
  try {
    firebase = initializeApp(firebaseConfig)
    messaging = getMessaging(firebase)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize Firebase Messaging', error)
  }

  const initToken = async () => {
    const token = await getToken(messaging, {
      vapidKey: 'BL5r2WB5Zqf5AUvfX-VSOmOhncQTCed928tiZDurWYueQqhLqNKDfP6q2tVx1-IJLVJReu1lijEdxu66QkTPJ_4',
    })
    $notifications.updateToken(token)
  }

  onMessage(messaging, () => {
    $notifications.getNotifications({ state: 'NEW', size: 100 })
  })

  const checkPermissions = () => {
    const permission = Notification.permission
    if (permission === 'granted') initToken()
    else {
      Notification.requestPermission().then((response) => {
        if (response === 'granted') initToken()
        // eslint-disable-next-line no-console
        else console.error('no permissions')
      })
    }
  }
  const user = computed(() => $auth.user)
  watch(user, () => {
    if (user.value) checkPermissions()
  })
}

export default install
