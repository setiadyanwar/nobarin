<template>
  <nav class="bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link 
            to="/" 
            class="flex items-center space-x-2 text-2xl font-bold text-red-500 hover:text-red-400 transition-colors"
          >
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
            </svg>
            <span>Nobarin</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <router-link 
            to="/" 
            class="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            active-class="bg-gray-800 text-white"
            exact
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span>Home</span>
          </router-link>
          <router-link 
            to="/favorites" 
            class="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            active-class="bg-gray-800 text-white"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span>Favorites ({{ favoritesCount }})</span>
          </router-link>
        </div>

        <!-- Search Bar -->
        <div class="hidden md:flex items-center">
          <div class="relative">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Search movies..."
              class="bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-gray-700 transition-colors w-64"
            />
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <button 
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-3 top-2.5 text-gray-400 hover:text-white"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <button 
            @click="handleSearch"
            class="ml-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Search
          </button>
        </div>

        <!-- Mobile menu button -->
        <button 
          @click="toggleMenu" 
          class="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none transition-colors"
        >
          <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="isMenuOpen" class="md:hidden border-t border-gray-800">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <!-- Mobile Search -->
          <div class="relative mb-4">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Search movies..."
              class="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <button 
              @click="handleSearch"
              class="absolute right-2 top-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Go
            </button>
          </div>
          
          <router-link 
            to="/" 
            @click="toggleMenu"
            class="flex items-center space-x-3 w-full text-left px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            exact
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span>Home</span>
          </router-link>
          <router-link 
            to="/favorites" 
            @click="toggleMenu"
            class="flex items-center space-x-3 w-full text-left px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span>Favorites ({{ favoritesCount }})</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Favorites store (using localStorage directly)
const favorites = ref(JSON.parse(localStorage.getItem('movieFavorites') || '[]'))

const favoritesCount = computed(() => favorites.value.length)

const searchQuery = ref('')
const isMenuOpen = ref(false)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'Search', query: { q: searchQuery.value.trim() } })
    isMenuOpen.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>
