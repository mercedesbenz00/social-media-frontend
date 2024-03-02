import type { Ref } from "vue";
import { ref, onMounted, onUnmounted } from "vue";

class DeviceDetector {
  static MOBILE_BREAKPOINT = 640;
  static LAPTOP_BREAKPOINT = 1024;

  screenWidth: Ref<number> = ref(window.innerWidth)
  deviceType: Ref<string>

  constructor () {
    this.deviceType = ref(this.getDeviceType())
    onMounted(() => {
      window.addEventListener('resize', this.handleResize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', this.handleResize)
    })
  }

  private getDeviceType (): string {
    const width = this.screenWidth.value
    if (width < DeviceDetector.MOBILE_BREAKPOINT) return 'mobile'
    else if (width <= DeviceDetector.LAPTOP_BREAKPOINT) return 'laptop'
    else return 'desktop'
  }

  private handleResize = (): void => {
    this.screenWidth.value = window.innerWidth
    this.deviceType.value = this.getDeviceType()
  }
}

export function useDeviceDetector () {
  const detector = new DeviceDetector()
  return detector.deviceType
}