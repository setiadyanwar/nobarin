<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      <div class="ml-4 text-white">Loading movies...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-white mb-4">Error Loading Movies</h2>
        <p class="text-gray-400 mb-4">{{ error }}</p>
        <button @click="loadMovies" class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors">
          Try Again
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-12">
      <!-- Hero Section -->
      <section v-if="featuredMovie" class="relative h-screen flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0">
          <img
            :src="getBackdropUrl(featuredMovie.backdrop_path)"
            :alt="featuredMovie.title"
            class="w-full h-full object-cover"
            @error="handleHeroImageError"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
        
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-3xl">
            <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {{ featuredMovie.title }}
            </h1>
            
            <div class="flex items-center space-x-6 mb-6 text-lg">
              <div class="flex items-center space-x-2">
                <svg class="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span class="text-white font-semibold">{{ featuredMovie.vote_average?.toFixed(1) || 'N/A' }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span class="text-gray-300">{{ getReleaseYear(featuredMovie.release_date) }}</span>
              </div>
            </div>
            
            <p class="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              {{ featuredMovie.overview }}
            </p>
            
            <div class="flex flex-wrap gap-4">
              <button
                @click="selectMovie(featuredMovie)"
                class="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span>Watch Now</span>
              </button>
              <button
                @click="toggleFavorite(featuredMovie.id)"
                :class="['px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2',
                         isFavorite(featuredMovie.id) 
                           ? 'bg-red-600 hover:bg-red-700 text-white' 
                           : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm']"
              >
                <svg 
                  :class="['w-6 h-6', isFavorite(featuredMovie.id) ? 'fill-current' : '']"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                <span>{{ isFavorite(featuredMovie.id) ? 'Remove from Favorites' : 'Add to Favorites' }}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Movie Sections -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <!-- Popular Movies -->
        <section v-if="popularMovies.length > 0">
          <h2 class="text-3xl font-bold text-white mb-8">Popular Movies</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <MovieCard
              v-for="movie in popularMovies"
              :key="`popular-${movie.id}`"
              :movie="movie"
            />
          </div>
        </section>

        <!-- Trending Movies -->
        <section v-if="trendingMovies.length > 0">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-3xl font-bold text-white flex items-center space-x-3">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
              <span>Trending This Week</span>
            </h2>
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <MovieCard
              v-for="movie in trendingMovies"
              :key="`trending-${movie.id}`"
              :movie="movie"
            />
          </div>
        </section>

        <!-- Top Rated Movies -->
        <section v-if="topRatedMovies.length > 0">
          <h2 class="text-3xl font-bold text-white mb-8">Top Rated Movies</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <MovieCard
              v-for="movie in topRatedMovies"
              :key="`toprated-${movie.id}`"
              :movie="movie"
            />
          </div>
        </section>

        <!-- No Data Message -->
        <div v-if="!loading && !error && popularMovies.length === 0 && trendingMovies.length === 0 && topRatedMovies.length === 0" class="text-center py-20">
          <h2 class="text-2xl font-bold text-white mb-4">No movies found</h2>
          <p class="text-gray-400 mb-4">Unable to load movies from TMDB API</p>
          <button @click="loadMovies" class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors">
            Retry
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MovieCard from '../MovieCard.vue'

const router = useRouter()

// API Configuration
const apiKey = import.meta.env.VITE_TMDB_API_KEY
const baseUrl = 'https://api.themoviedb.org/3'

// Favorites store (using localStorage directly)
const favorites = ref(JSON.parse(localStorage.getItem('movieFavorites') || '[]'))

const saveFavorites = () => {
  localStorage.setItem('movieFavorites', JSON.stringify(favorites.value))
}

const toggleFavorite = (movieId) => {
  const index = favorites.value.indexOf(movieId)
  if (index > -1) {
    favorites.value.splice(index, 1)
  } else {
    favorites.value.push(movieId)
  }
  saveFavorites()
}

const isFavorite = (movieId) => {
  return favorites.value.includes(movieId)
}

// State
const popularMovies = ref([])
const trendingMovies = ref([])
const topRatedMovies = ref([])
const featuredMovie = ref(null)
const loading = ref(true)
const error = ref(null)

// Helper functions
const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750/1f2937/ffffff?text=No+Image'
  return `https://image.tmdb.org/t/p/${size}${path}`
}

const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) return 'https://via.placeholder.com/1280x720/1f2937/ffffff?text=No+Image'
  return `https://image.tmdb.org/t/p/${size}${path}`
}

const getReleaseYear = (date) => {
  if (!date) return 'Unknown'
  return new Date(date).getFullYear()
}

const handleHeroImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/1280x720/1f2937/ffffff?text=No+Image'
}

// API Functions
const fetchFromTMDB = async (endpoint) => {
  try {
    const url = `${baseUrl}${endpoint}?api_key=${apiKey}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.results || []
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err)
    throw err
  }
}

const getPopularMovies = () => fetchFromTMDB('/movie/popular')
const getTrendingMovies = () => fetchFromTMDB('/trending/movie/week')
const getTopRatedMovies = () => fetchFromTMDB('/movie/top_rated')

// Methods
const loadMovies = async () => {
  loading.value = true
  error.value = null
  
  try {
    if (!apiKey) {
      throw new Error('TMDB API key is missing. Please check your .env file.')
    }
    
    const [popular, trending, topRated] = await Promise.all([
      getPopularMovies(),
      getTrendingMovies(),
      getTopRatedMovies()
    ])
    
    popularMovies.value = popular.slice(0, 12)
    trendingMovies.value = trending.slice(0, 12)
    topRatedMovies.value = topRated.slice(0, 12)
    featuredMovie.value = popular[0]
    
    if (popularMovies.value.length === 0) {
      throw new Error('No movies received from API')
    }
    
  } catch (err) {
    console.error('Error loading movies:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const selectMovie = (movie) => {
  router.push({ name: 'MovieDetail', params: { id: movie.id } })
}

onMounted(() => {
  loadMovies()
})
</script>
