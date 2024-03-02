<template>
  <div id="splash-screen">
    <div class="splash-logo">
      {{ $t('powered_by') }}<br />
      <img class="logo-dark" height="40" width="114" src="@/assets/images/logo-dark.png" />
      <img class="logo-light" height="40" width="114" src="@/assets/images/logo-light.png" />
      <div class="splash-loader active"><span></span></div>
    </div>
  </div>
</template>
<script lang="ts" setup></script>
<style scoped>
html {
  height: 100%;
}

#splash-screen {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 99999;
  cursor: wait;
  transition: opacity 500ms ease-in-out;
}

#splash-screen .splash-logo {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 41%;
  left: 50%;
  transform: translateX(-50%);
  font: 400 1em Arial, sans-serif;
  color: #949ca1;
}

#splash-screen .splash-logo > svg {
  margin-top: 12px;
}

#splash-screen.fade-out {
  opacity: 0;
  pointer-events: none;
}

#splash-screen .splash-loader {
  width: 28px;
  height: 7px;
  margin: 30px 0 0 -14px;
  overflow: visible;
  transform: scale(0.9);
  visibility: hidden;
  opacity: 0;
  transition: visibility 0ms 300ms, opacity 200ms 0ms;
}

#splash-screen .splash-loader.active {
  visibility: visible;
  opacity: 1;
  transition-delay: 0ms;
}

#splash-screen .splash-loader > span,
#splash-screen .splash-loader::before,
#splash-screen .splash-loader::after {
  position: absolute;
  box-sizing: border-box;
  top: 0;
  left: 0;
  width: 7px;
  height: 7px;
  margin-left: -3.5px;
  border-radius: 50px;
  background: #888;
  animation: pulse 1200ms linear infinite;
  animation-delay: 150ms;
}

#splash-screen .splash-loader::before {
  content: '';
  left: 50%;
  animation-delay: 300ms;
}
#splash-screen .splash-loader::after {
  content: '';
  left: 100%;
  animation-delay: 450ms;
}

@keyframes pulse {
  0% {
    transform: scale(0.9);
    opacity: 1;
  }

  20% {
    transform: scale(0.5);
    opacity: 0.6;
  }

  40% {
    transform: scale(1.3);
  }

  60%,
  100% {
    transform: scale(0.9);
    opacity: 1;
  }
}

.dark-mode .logo-dark {
  display: none;
}

.light-mode .logo-light {
  display: none;
}
</style>
