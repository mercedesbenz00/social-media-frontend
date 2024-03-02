import type { App } from "vue";
import gAuth from 'vue3-google-auth';

export const install = (app: App) => {
  const $gAuth = gAuth.createGAuth({
    clientId: '1055327503816-8lvvrs3q3a364fs0i3ikt9eqao5eru2h.apps.googleusercontent.com',
    scope: 'email',
    prompt: 'consent',
    fetch_basic_profile: true,
    plugin_name: "chat"
  });
  app.use($gAuth)
}

export default install