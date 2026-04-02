/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface HomeAnimationConfig {
  background: {
    fieldSize: number
    density: {
      small: number
      medium: number
      large: number
    }
    size: {
      small: number
      medium: number
      large: number
    }
    speed: {
      small: number
      medium: number
      large: number
    }
    travel: number
  }
  twinkle: {
    enabled: boolean
    interval: number
    duration: number
    randomColors: boolean
    topBandRatio: number
    mobileMinSize: number
    mobileMaxSize: number
    desktopMinSize: number
    desktopMaxSize: number
  }
  meteor: {
    enabled: boolean
    interval: number
    duration: number
    lengthVh: number
    randomColors: boolean
  }
  reveal: {
    offset: number
    duration: number
    stagger: number
  }
}

interface HomeAnimationStore {
  defaults: HomeAnimationConfig
  getConfig: () => HomeAnimationConfig
  applyCssVars: () => void
  notify: () => void
  persist: () => void
  update: (path: string, value: boolean | number) => void
  reset: () => void
  subscribe: (listener: (config: HomeAnimationConfig) => void) => () => boolean
}

interface Window {
  changeTheme?: () => void
  __homeAnimation?: HomeAnimationStore
  __homeAnimationAnimate?: {
    replay?: () => void
  }
  __homeAnimationAnimateUnsubscribe?: () => void
  __homeAnimationBGUnsubscribe?: () => void
  __homeAnimationMeteorCleanup?: () => void
  __homeAnimationMeteorInterval?: number
  __homeAnimationPanelCleanup?: () => void
  __homeAnimationTwinkleCleanup?: () => void
  __homeAnimationTwinkleInterval?: number
  preloadTheme?: () => void
}

interface Element {
  __revealTimer?: number
}
