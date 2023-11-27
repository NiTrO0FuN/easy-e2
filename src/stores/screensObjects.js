import { defineStore } from 'pinia'

export const useScreensStore = defineStore('screensObjects', {
    state: () => ({
        screensObjects: [],
        activeCanva: 0,
    }),
  })