<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
    </div>

    <!-- Movie Details -->
    <div v-else-if="movie" class="space-y-8">
      <!-- Back Button -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button 
          @click="goBack" 
          class="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span>Back to Movies</span>
        </button>
      </div>

      <!-- Hero Section -->
      <div class="relative">
        <div class="absolute inset-0">
          <img
            :src="getBackdropUrl(movie.backdrop_path, 'original')"
            :alt="movie.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        </div>
        
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="flex flex-col lg:flex-row gap-12">
            <!-- Movie Poster -->
            <div class="flex-shrink-0">
              <img
                :src="getImageUrl(movie.poster_path, 'w500')"
                :alt="movie.title"
                class="w-80 h-auto rounded-xl shadow-2xl"
              />
            </div>
            
            <!-- Movie Info -->
            <div class="flex-1 space-y-6">
              <div>
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  {{ movie.title }}
                </h1>
                <p v-if="movie.tagline" class="text-xl text-gray-300 italic">
                  "{{ movie.tagline }}"
                </p>
              </div>
              
              <!-- Movie Stats -->
              <div class="flex flex-wrap items-center gap-6 text-lg">
                <div class="flex items-center space-x-2">
                  <svg class="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span class="text-white font-semibold">{{ movie.vote_average.toFixed(1) }}</span>
                  <span class="text-gray-400">({{ movie.vote_count.toLocaleString() }} votes)</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span class="text-gray-300">{{ new Date(movie.release_date).getFullYear() }}</span>
                </div>
                <div v-if="movie.runtime" class="flex items-center space-x-2">
                  <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-gray-300">{{ formatRuntime(movie.runtime) }}</span>
                </div>
              </div>

              <!-- Genres -->
              <div class="flex flex-wrap gap-3">
                <span
                  v-for="genre in movie.genres"
                  :key="genre.id"
                  class="px-4 py-2 bg-gray-800/80 text-gray-300 rounded-full text-sm font-medium"
                >
                  {{ genre.name }}
                </span>
              </div>

              <!-- Overview -->
              <div>
                <h3 class="text-2xl font-bold text-white mb-4">Overview</h3>
                <p class="text-gray-300 text-lg leading-relaxed max-w-4xl">
                  {{ movie.overview }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-4">
                <button
                  v-if="trailer"
                  @click="playTrailer"
                  class="flex items-center space-x-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span>Watch Trailer</span>
                </button>
                
                <button
                  @click="toggleFavorite"
                  :class="['flex items-center space-x-3 px-8 py-4 rounded-lg font-semibold text-lg transition-colors',
                           isFavorite 
                             ? 'bg-red-600 hover:bg-red-700 text-white' 
                             : 'bg-gray-800 hover:bg-gray-700 text-white']"
                >
                  <svg 
                    :class="['w-6 h-6', isFavorite ? 'fill-current' : '']"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                  <span>{{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Details -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <!-- Movie Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Production Info -->
          <div class="bg-gray-800 rounded-xl p-6">
            <h3 class="text-xl font-bold text-white mb-4">Production Details</h3>
            <div class="space-y-3 text-gray-300">
              <div v-if="movie.budget">
                <span class="font-medium">Budget:</span>
                <span class="ml-2">{{ formatCurrency(movie.budget) }}</span>
              </div>
              <div v-if="movie.revenue">
                <span class="font-medium">Revenue:</span>
                <span class="ml-2">{{ formatCurrency(movie.revenue) }}</span>
              </div>
              <div v-if="movie.production_companies?.length">
                <span class="font-medium">Production:</span>
                <div class="mt-1">
                  <span v-for="(company, index) in movie.production_companies.slice(0, 3)" :key="company.id">
                    {{ company.name }}<span v-if="index < movie.production_companies.slice(0, 3).length - 1">, </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Cast -->
          <div v-if="movie.credits?.cast?.length" class="bg-gray-800 rounded-xl p-6">
            <h3 class="text-xl font-bold text-white mb-4">Top Cast</h3>
            <div class="space-y-3">
              <div 
                v-for="actor in movie.credits.cast.slice(0, 5)" 
                :key="actor.id"
                class="flex items-center space-x-3"
              >
                <img
                  v-if="actor.profile_path"
                  :src="getImageUrl(actor.profile_path, 'w92')"
                  :alt="actor.name"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div v-else class="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div>
                  <div class="text-white font-medium">{{ actor.name }}</div>
                  <div class="text-gray-400 text-sm">{{ actor.character }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Crew -->
          <div v-if="movie.credits?.crew?.length" class="bg-gray-800 rounded-xl p-6">
            <h3 class="text-xl font-bold text-white mb-4">Key Crew</h3>
            <div class="space-y-3">
              <div 
                v-for="member in movie.credits.crew.filter(c => ['Director', 'Producer', 'Writer'].includes(c.job)).slice(0, 5)" 
                :key="`${member.id}-${member.job}`"
                class="flex justify-between"
              >
                <span class="text-white">{{ member.name }}</span>
                <span class="text-gray-400">{{ member.job }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Video Player Modal -->
      <div v-if="isVideoPlaying && trailer" class="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
        <div class="relative w-full max-w-6xl aspect-video">
          <button
            @click="closeVideo"
            class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <iframe
            :src="`https://www.youtube.com/embed/${trailer.key}?autoplay=1`"
            class="w-full h-full rounded-lg"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-white mb-4">Movie not found</h2>
        <button @click="goBack" class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors">
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMovieDetails, getImageUrl, getBackdropUrl } from '../../api/tmdb'

const route = useRoute()
const router = useRouter()

// Favorites store (using localStorage directly)
const favorites = ref(JSON.parse(localStorage.getItem('movieFavorites') || '[]'))

const saveFavorites = () => {
  localStorage.setItem('movieFavorites', JSON.stringify(favorites.value))
}

// State
const movie = ref(null)
const loading = ref(true)
const isVideoPlaying = ref(false)
const trailer = ref(null)

// Computed
const isFavorite = computed(() => movie.value && favorites.value.includes(movie.value.id))

// Methods
const loadMovieDetails = async () => {
  loading.value = true
  try {
    const movieData = await getMovieDetails(route.params.id)
    movie.value = movieData
    
    // Find trailer
    if (movieData?.videos?.results) {
      trailer.value = movieData.videos.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      ) || movieData.videos.results[0]
    }
  } catch (error) {
    console.error('Error loading movie details:', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.go(-1)
}

const playTrailer = () => {
  if (trailer.value) {
    isVideoPlaying.value = true
  }
}

const closeVideo = () => {
  isVideoPlaying.value = false
}

const toggleFavorite = () => {
  if (movie.value) {
    const movieId = movie.value.id
    const index = favorites.value.indexOf(movieId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(movieId)
    }
    saveFavorites()
  }
}

const formatRuntime = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

onMounted(() => {
  loadMovieDetails()
})
</script>
