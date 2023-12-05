import { defineStore } from 'pinia'

export const useScreensStore = defineStore('screensObjects', {
    state: () => ({
        screensObjects: [],
        activeCanva: 0,
    }),
    getters: {
        objectsCount: (state) => {
            let count = 0
            state.screensObjects.forEach(screen => {
                count += screen.length
            });
            return count
        }
    }
  })