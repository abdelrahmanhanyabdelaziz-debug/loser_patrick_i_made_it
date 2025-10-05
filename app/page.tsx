'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Calendar, Sun, Cloud, CloudRain, Zap, Sparkles, Music, Camera, Coffee, Heart } from 'lucide-react'
import WeatherDashboard from '@/components/WeatherDashboard'
import DatePicker from '@/components/DatePicker'
import LoadingSpinner from '@/components/LoadingSpinner'
import LandingFeatures from '@/components/LandingFeatures'
import Footer from '@/components/Footer'
import { getWeatherData } from '@/lib/api'
import toast from 'react-hot-toast'

interface WeatherData {
  location: string
  coordinates: { lat: number; lng: number }
  date: string
  maxTemp: number
  minTemp: number
  rain: number
  precipitation: number
  weatherCode: number
  sunrise: string
  sunset: string
  dayPlan: {
    vibe: string
    morning: string
    afternoon: string
    evening: string
    daylight: string
  }
  outfit: {
    outfit: string
    accessories: string
    pack: string
    playlist: string
  }
  creative: {
    photoTip: string
    miniChallenge: string
    localIdea: string
  }
}

export default function Home() {
  const [city, setCity] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleSearch = async () => {
    if (!city.trim() || !selectedDate) {
      toast.error('Please enter a city and select a date')
      return
    }

    setLoading(true)
    try {
      const data = await getWeatherData(city, selectedDate.toISOString().split('T')[0])
      setWeatherData(data)
      setShowResults(true)
      toast.success('Weather forecast loaded successfully!')
    } catch (error) {
      toast.error('Failed to fetch weather data. Please try again.')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-8 h-8 text-yellow-500" />
    if (code >= 1 && code <= 3) return <Cloud className="w-8 h-8 text-gray-500" />
    if (code >= 45 && code <= 48) return <Cloud className="w-8 h-8 text-gray-400" />
    if (code >= 51 && code <= 67) return <CloudRain className="w-8 h-8 text-blue-500" />
    if (code >= 80) return <Zap className="w-8 h-8 text-purple-500" />
    return <Cloud className="w-8 h-8 text-gray-500" />
  }

  const getWeatherGradient = (code: number) => {
    if (code === 0) return 'from-yellow-400 via-orange-400 to-red-400'
    if (code >= 1 && code <= 3) return 'from-gray-300 via-gray-400 to-gray-500'
    if (code >= 45 && code <= 48) return 'from-gray-200 via-gray-300 to-gray-400'
    if (code >= 51 && code <= 67) return 'from-blue-400 via-blue-500 to-blue-600'
    if (code >= 80) return 'from-purple-600 via-purple-700 to-purple-800'
    return 'from-gray-300 via-gray-400 to-gray-500'
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Animated Background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 opacity-10" />

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-4">
                Weather Concierge
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 font-light">
                Your Personal Day Planner Powered by Weather Intelligence
              </p>
            </motion.div>

            {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="ui-overlay bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 max-w-2xl mx-auto"
            >
              <div className="space-y-6">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter city name..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <DatePicker
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    placeholder="Select date..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Get My Perfect Day</span>
                      <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Feature Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              {[
                { icon: <Coffee className="w-8 h-8" />, text: "Activities" },
                { icon: <Music className="w-8 h-8" />, text: "Playlists" },
                { icon: <Camera className="w-8 h-8" />, text: "Photo Spots" },
                { icon: <Heart className="w-8 h-8" />, text: "Local Tips" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex flex-col items-center space-y-2 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/80 transition-all duration-300"
                >
                  <div className="text-blue-500">{feature.icon}</div>
                  <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {showResults && weatherData && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 py-8"
          >
            <WeatherDashboard weatherData={weatherData} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Section - Only show when no results */}
      {!showResults && <LandingFeatures />}
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
