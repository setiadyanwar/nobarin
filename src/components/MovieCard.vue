<template>
  <div 
    @click="selectMovie"
    class="group cursor-pointer transform transition-all duration-300 hover:scale-105"
  >
    <div class="relative overflow-hidden rounded-xl shadow-lg bg-gray-800 hover:shadow-2xl transition-all duration-300">
      <!-- Movie Poster -->
      <div class="relative bg-gray-700" style="aspect-ratio: 2/3;">
        <!-- Loading State -->
        <div v-if="imageLoading" class="absolute inset-0 flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
        
        <!-- Image -->
        <img
          :src="imageUrl"
          :alt="movie.title"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          @load="handleImageLoad"
          @error="handleImageError"
          style="display: block;"
        />
        
        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <!-- Play Button -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="bg-red-600 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <svg class="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          
          <!-- Movie Info Overlay -->
          <div class="absolute bottom-0 left-0 right-0 p-4">
            <h3 class="text-white font-bold text-lg mb-2 line-clamp-2">{{ movie.title }}</h3>
            
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span class="text-white text-sm font-medium">{{ movie.vote_average?.toFixed(1) || 'N/A' }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span class="text-gray-300 text-sm">{{ getReleaseYear(movie.release_date) }}</span>
                </div>
              </div>
              
              <button
                @click.stop="toggleFavorite"
                class="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                <svg 
                  :class="['w-5 h-5 transition-colors', isFavorite ? 'text-red-500 fill-current' : 'text-white']"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>
            </div>
            
            <p class="text-gray-300 text-sm line-clamp-3">{{ movie.overview }}</p>
          </div>
        </div>
      </div>
      
      <!-- Movie Info (Always Visible) -->
      <div class="p-4">
        <h3 class="text-white font-semibold text-base mb-2 line-clamp-2">{{ movie.title }}</h3>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span class="text-gray-300 text-sm">{{ movie.vote_average?.toFixed(1) || 'N/A' }}</span>
          </div>
          <span class="text-gray-400 text-sm">{{ getReleaseYear(movie.release_date) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const imageLoading = ref(true)

// Favorites store (using localStorage directly)
const favorites = ref(JSON.parse(localStorage.getItem('movieFavorites') || '[]'))

const saveFavorites = () => {
  localStorage.setItem('movieFavorites', JSON.stringify(favorites.value))
}

const isFavorite = computed(() => favorites.value.includes(props.movie.id))

// Image URL computed property
const imageUrl = computed(() => {
  if (!props.movie.poster_path) {
    return 'https://via.placeholder.com/500x750/1f2937/ffffff?text=No+Image'
  }
  
  const url = `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`
  return url
})

const handleImageError = (event) => {
  console.log('Image error for movie:', props.movie.title, 'URL:', event.target.src)
  event.target.src = 'https://via.placeholder.com/500x750/1f2937/ffffff?text=Image+Error'
  imageLoading.value = false
}

const handleImageLoad = () => {
  imageLoading.value = false
}

const selectMovie = () => {
  router.push({ name: 'MovieDetail', params: { id: props.movie.id } })
}

const toggleFavorite = () => {
  const movieId = props.movie.id
  const index = favorites.value.indexOf(movieId)
  if (index > -1) {
    favorites.value.splice(index, 1)
  } else {
    favorites.value.push(movieId)
  }
  saveFavorites()
}

const getReleaseYear = (date) => {
  if (!date) return 'Unknown'
  return new Date(date).getFullYear()
}
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
