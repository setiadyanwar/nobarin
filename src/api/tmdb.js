import axios from "axios"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

// Create axios instance with base configuration
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
})

// Popular Movies
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get("/movie/popular", {
      params: { page },
    })
    return response.data.results
  } catch (error) {
    console.error("Error fetching popular movies:", error)
    return []
  }
}

// Search Movies
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get("/search/movie", {
      params: {
        query,
        page,
      },
    })
    return response.data.results
  } catch (error) {
    console.error("Error searching movies:", error)
    return []
  }
}

// Movie Details
export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: "videos,credits",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching movie details:", error)
    return null
  }
}

// Movie Videos
export const getMovieVideos = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/videos`)
    return response.data.results
  } catch (error) {
    console.error("Error fetching movie videos:", error)
    return []
  }
}

// Trending Movies
export const getTrendingMovies = async () => {
  try {
    const response = await tmdbApi.get("/trending/movie/week")
    return response.data.results
  } catch (error) {
    console.error("Error fetching trending movies:", error)
    return []
  }
}

// Top Rated Movies
export const getTopRatedMovies = async () => {
  try {
    const response = await tmdbApi.get("/movie/top_rated")
    return response.data.results
  } catch (error) {
    console.error("Error fetching top rated movies:", error)
    return []
  }
}

// Upcoming Movies
export const getUpcomingMovies = async () => {
  try {
    const response = await tmdbApi.get("/movie/upcoming")
    return response.data.results
  } catch (error) {
    console.error("Error fetching upcoming movies:", error)
    return []
  }
}

// Image URL helpers
export const getImageUrl = (path, size = "w500") => {
  if (!path) return "/placeholder.svg?height=750&width=500"
  return `${IMAGE_BASE_URL}/${size}${path}`
}

export const getBackdropUrl = (path, size = "w1280") => {
  if (!path) return "/placeholder.svg?height=720&width=1280"
  return `${IMAGE_BASE_URL}/${size}${path}`
}
