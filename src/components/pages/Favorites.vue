<template>
  <div class="min-h-screen bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-4xl font-bold text-white mb-2 flex items-center space-x-3">
            <svg class="w-10 h-10 text-red-500 fill-current" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span>My Favorites</span>
          </h1>
        </div>
        
        <button
          v-if="favoriteMovies.length > 0"
          @click="clearAllFavorites"
          class="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          <span>Clear All</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
        <div class="ml-4 text-white">Loading favorite movies...</div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <h2 class="text-2xl font-bold text-white mb-4">Error Loading Favorites</h2>
        <p class="text-gray-400 mb-4">{{ error }}</p>
        <button @click="loadFavoriteMovies" class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors">
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="favoriteMovies.length === 0 && favorites.length === 0" class="text-center py-20">
        <svg class="w-24 h-24 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        <h2 class="text-2xl font-bold text-white mb-4">No favorite movies yet</h2>
        <p class="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Start adding movies to your favorites by clicking the heart icon on any movie
        </p>
        <button 
          @click="$router.push('/')"
          class="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Browse Movies
        </button>
      </div>

      <!-- Favorites with IDs but no loaded movies -->
      <div v-else-if="favoriteMovies.length === 0 && favorites.length > 0" class="text-center py-20">
        <h2 class="text-2xl font-bold text-white mb-4">Unable to load favorite movies</h2>
        <p class="text-gray-400 mb-4">Found {{ favorites.length }} favorite IDs but couldn't load movie details</p>
        <button @click="loadFavoriteMovies" class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors">
          Retry Loading
        </button>
      </div>

      <!-- Favorites Grid -->
      <div v-else class="space-y-8">
        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gray-800 rounded-xl p-6 text-center">
            <div class="text-3xl font-bold text-red-500 mb-2">{{ favoriteMovies.length }}</div>
            <div class="text-gray-400">Total Favorites</div>
          </div>
          <div class="bg-gray-800 rounded-xl p-6 text-center">
            <div class="text-3xl font-bold text-yellow-400 mb-2">
              {{ favoriteMovies.length > 0 ? (favoriteMovies.reduce((sum, movie) => sum + movie.vote_average, 0) / favoriteMovies.length).toFixed(1) : '0.0' }}
            </div>
            <div class="text-gray-400">Average Rating</div>
          </div>
          <div class="bg-gray-800 rounded-xl p-6 text-center">
            <div class="text-3xl font-bold text-blue-400 mb-2">
              {{ favoriteMovies.reduce((sum, movie) => sum + (movie.runtime || 0), 0) }}
            </div>
            <div class="text-gray-400">Total Minutes</div>
          </div>
        </div>

        <!-- Movies Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div
            v-for="movie in sortedFavorites"
            :key="movie.id"
            class="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <!-- Movie Poster -->
            <div class="relative aspect-[2/3] overflow-hidden cursor-pointer" @click="selectMovie(movie)">
              <img
                :src="getImageUrl(movie.poster_path)"
                :alt="movie.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                @error="handleImageError"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="absolute bottom-4 left-4 right-4">
                  <div class="flex items-center space-x-2 mb-2">
                    <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span class="text-white text-sm font-medium">{{ movie.vote_average.toFixed(1) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Movie Info -->
            <div class="p-6">
              <h3 class="text-white font-bold text-lg mb-2 line-clamp-2 cursor-pointer hover:text-red-400 transition-colors" @click="selectMovie(movie)">
                {{ movie.title }}
              </h3>
              
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-2 text-gray-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span class="text-sm">{{ new Date(movie.release_date).getFullYear() }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span class="text-white text-sm font-medium">{{ movie.vote_average.toFixed(1) }}</span>
                </div>
              </div>
              
              <p class="text-gray-400 text-sm line-clamp-3 mb-4">{{ movie.overview }}</p>
              
              <div class="flex items-center justify-between">
                <button
                  @click="selectMovie(movie)"
                  class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  View Details
                </button>
                <button
                  @click="removeFavorite(movie.id)"
                  class="p-2 rounded-full bg-gray-700 hover:bg-red-600 text-red-400 hover:text-white transition-colors"
                  title="Remove from favorites"
                >
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// API Configuration
const apiKey = import.meta.env.VITE_TMDB_API_KEY
const baseUrl = 'https://api.themoviedb.org/3'

// State
const favoriteMovies = ref([])
const loading = ref(true)
const error = ref(null)
const favorites = ref(JSON.parse(localStorage.getItem('movieFavorites') || '[]'))

// Computed
const sortedFavorites = computed(() => {
  return favoriteMovies.value.sort((a, b) => b.vote_average - a.vote_average)
})

// Helper functions
const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750/1f2937/ffffff?text=No+Image'
  return `https://image.tmdb.org/t/p/${size}${path}`
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/500x750/1f2937/ffffff?text=Image+Error'
}

// API Functions
const getMovieDetails = async (movieId) => {
  try {
    console.log(`Fetching movie details for ID: ${movieId}`)
    const url = `${baseUrl}/movie/${movieId}?api_key=${apiKey}`
    console.log(`URL: ${url}`)
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log(`Movie details received:`, data)
    return data
  } catch (error) {
    console.error(`Error fetching movie ${movieId}:`, error)
    return null
  }
}

// Methods
const loadFavoriteMovies = async () => {
  loading.value = true
  error.value = null
  
  try {
    console.log('Loading favorite movies...')
    console.log('Favorite IDs:', favorites.value)
    
    if (!apiKey) {
      throw new Error('TMDB API key is missing')
    }
    
    if (favorites.value.length === 0) {
      favoriteMovies.value = []
      return
    }
    
    const moviePromises = favorites.value.map(id => getMovieDetails(id))
    const movies = await Promise.all(moviePromises)
    favoriteMovies.value = movies.filter(movie => movie !== null)
    
    console.log('Favorite movies loaded:', favoriteMovies.value.length)
    
  } catch (err) {
    console.error('Error loading favorite movies:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const selectMovie = (movie) => {
  router.push({ name: 'MovieDetail', params: { id: movie.id } })
}

const removeFavorite = (movieId) => {
  const index = favorites.value.indexOf(movieId)
  if (index > -1) {
    favorites.value.splice(index, 1)
    favoriteMovies.value = favoriteMovies.value.filter(movie => movie.id !== movieId)
    localStorage.setItem('movieFavorites', JSON.stringify(favorites.value))
  }
}

const clearAllFavorites = () => {
  if (confirm('Are you sure you want to remove all favorites?')) {
    favorites.value = []
    favoriteMovies.value = []
    localStorage.setItem('movieFavorites', JSON.stringify([]))
  }
}

onMounted(() => {
  loadFavoriteMovies()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
