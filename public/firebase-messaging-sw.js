importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js')
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js'

const firebaseConfig = {
  apiKey: 'AIzaSyBGPPYsF9a5Gdqgfsg8wqLuydJaBpk1sFc',
  authDomain: 'sn-vkassin.firebaseapp.com',
  projectId: 'sn-vkassin',
  storageBucket: 'sn-vkassin.appspot.com',
  messagingSenderId: '1055327503816',
  appId: '1:1055327503816:web:cf9db19da4ee66bae6acfd',
  measurementId: 'G-R86KZTNQ9T',
}

const app = firebase.initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  const channel = new BroadcastChannel('sw-messages')
  channel.postMessage(payload)
  const notificationTitle =
    'Social Media - ' + payload?.notification?.title ? payload.notification.title : 'notification'
  const notificationOptions = {
    body: payload?.notification?.body,
    icon: '/firebase-logo.png',
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
