import { defineStore } from "pinia"

export const useFavoritesStore = defineStore("favorites", {
  state: () => ({
    favorites: JSON.parse(localStorage.getItem("movieFavorites") || "[]"),
  }),

  getters: {
    isFavorite: (state) => (movieId) => {
      return state.favorites.includes(movieId)
    },

    favoritesCount: (state) => {
      return state.favorites.length
    },
  },

  actions: {
    toggleFavorite(movieId) {
      const index = this.favorites.indexOf(movieId)
      if (index > -1) {
        this.favorites.splice(index, 1)
      } else {
        this.favorites.push(movieId)
      }
      this.saveFavorites()
    },

    addFavorite(movieId) {
      if (!this.favorites.includes(movieId)) {
        this.favorites.push(movieId)
        this.saveFavorites()
      }
    },

    removeFavorite(movieId) {
      const index = this.favorites.indexOf(movieId)
      if (index > -1) {
        this.favorites.splice(index, 1)
        this.saveFavorites()
      }
    },

    clearFavorites() {
      this.favorites = []
      this.saveFavorites()
    },

    saveFavorites() {
      localStorage.setItem("movieFavorites", JSON.stringify(this.favorites))
    },
  },
})
