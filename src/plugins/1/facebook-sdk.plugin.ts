import type { App } from "vue";

export const install = (app: App) => {
  (window as any).fbAsyncInit = function() {
    (window as any).FB.init({
      appId      : import.meta.env.APP_FACEBOOK_ID,
      cookie     : true,
      xfbml      : true,
      version    : 'v14.0'
    });
    (window as any).FB.AppEvents.logPageView();   
      
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode?.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
}