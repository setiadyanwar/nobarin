<template>
  <div class="min-h-screen bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Header -->
      <div class="mb-8 mt-8">
        <h1 class="text-3xl font-bold text-white mb-2">Search Results</h1>
        <p class="text-gray-400">
          <span v-if="searchQuery">Found {{ searchResults.length }} results for "{{ searchQuery }}"</span>
          <span v-else>Enter a search term to find movies</span>
        </p>
      </div>

      <!-- Search Bar -->
      <div class="mb-8">
        <div class="relative max-w-2xl">
          <input
            v-model="localSearchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Search for movies..."
            class="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg py-3 px-14 text-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-gray-700 transition-colors"
          />
          <svg class="absolute left-4 top-4 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <button 
            @click="handleSearch"
            class="absolute right-2 top-1.5 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>

      <!-- Search Results -->
      <div v-else-if="searchResults.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <MovieCard
          v-for="movie in searchResults"
          :key="movie.id"
          :movie="movie"
        />
      </div>

      <!-- No Results -->
      <div v-else-if="searchQuery" class="text-center py-20">
        <svg class="w-24 h-24 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <h2 class="text-2xl font-bold text-white mb-4">No movies found</h2>
        <p class="text-gray-400 text-lg">Try searching with different keywords</p>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <svg class="w-24 h-24 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <h2 class="text-2xl font-bold text-white mb-4">Search for Movies</h2>
        <p class="text-gray-400 text-lg">Enter a movie title to get started</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MovieCard from '../MovieCard.vue'
import { searchMovies } from '../../api/tmdb'

const route = useRoute()
const router = useRouter()

// State
const searchResults = ref([])
const loading = ref(false)
const localSearchQuery = ref('')
const searchQuery = ref('')

// Methods
const handleSearch = async () => {
  if (!localSearchQuery.value.trim()) return
  
  loading.value = true
  searchQuery.value = localSearchQuery.value.trim()
  
  try {
    const results = await searchMovies(searchQuery.value)
    searchResults.value = results
    
    // Update URL
    router.push({ name: 'Search', query: { q: searchQuery.value } })
  } catch (error) {
    console.error('Error searching movies:', error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

const loadSearchFromQuery = async () => {
  const query = route.query.q
  if (query) {
    localSearchQuery.value = query
    searchQuery.value = query
    loading.value = true
    
    try {
      const results = await searchMovies(query)
      searchResults.value = results
    } catch (error) {
      console.error('Error searching movies:', error)
      searchResults.value = []
    } finally {
      loading.value = false
    }
  }
}

// Watch for route changes
watch(() => route.query.q, (newQuery) => {
  if (newQuery && newQuery !== searchQuery.value) {
    loadSearchFromQuery()
  }
})

onMounted(() => {
  loadSearchFromQuery()
})
</script>
