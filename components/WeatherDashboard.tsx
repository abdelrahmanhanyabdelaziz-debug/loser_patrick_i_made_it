'use client'

import { motion } from 'framer-motion'
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Zap, 
  MapPin, 
  Calendar, 
  Thermometer, 
  Droplets, 
  Sunrise, 
  Sunset,
  Music,
  Camera,
  Coffee,
  Heart,
  Sparkles,
  Wind,
  Eye
} from 'lucide-react'
import WeatherAnimation from './WeatherAnimation'
import MusicPlayer from './MusicPlayer'
import PhotoSuggestions from './PhotoSuggestions'

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

interface WeatherDashboardProps {
  weatherData: WeatherData
}

export default function WeatherDashboard({ weatherData }: WeatherDashboardProps) {
  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-12 h-12 text-yellow-500" />
    if (code >= 1 && code <= 3) return <Cloud className="w-12 h-12 text-gray-500" />
    if (code >= 45 && code <= 48) return <Cloud className="w-12 h-12 text-gray-400" />
    if (code >= 51 && code <= 67) return <CloudRain className="w-12 h-12 text-blue-500" />
    if (code >= 80) return <Zap className="w-12 h-12 text-purple-500" />
    return <Cloud className="w-12 h-12 text-gray-500" />
  }

  const getWeatherGradient = (code: number) => {
    if (code === 0) return 'from-yellow-400 via-orange-400 to-red-400'
    if (code >= 1 && code <= 3) return 'from-gray-300 via-gray-400 to-gray-500'
    if (code >= 45 && code <= 48) return 'from-gray-200 via-gray-300 to-gray-400'
    if (code >= 51 && code <= 67) return 'from-blue-400 via-blue-500 to-blue-600'
    if (code >= 80) return 'from-purple-600 via-purple-700 to-purple-800'
    return 'from-gray-300 via-gray-400 to-gray-500'
  }

  const getWeatherDescription = (code: number) => {
    if (code === 0) return 'Clear Sky'
    if (code >= 1 && code <= 3) return 'Partly Cloudy'
    if (code >= 45 && code <= 48) return 'Foggy'
    if (code >= 51 && code <= 67) return 'Rainy'
    if (code >= 80) return 'Stormy'
    return 'Cloudy'
  }

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString)
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } catch {
      return timeString
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{weatherData.location}</h2>
              <p className="text-blue-100 text-lg">{formatDate(weatherData.date)}</p>
            </div>
            <WeatherAnimation 
              weatherCode={weatherData.weatherCode} 
              className="text-6xl"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold">{weatherData.maxTemp}°C</div>
              <div className="text-blue-100">High</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{weatherData.minTemp}°C</div>
              <div className="text-blue-100">Low</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{weatherData.rain}mm</div>
              <div className="text-blue-100">Rain</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{getWeatherDescription(weatherData.weatherCode)}</div>
              <div className="text-blue-100">Condition</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Day Plan */}
        <motion.div id="dayplan"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Vibe Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="w-6 h-6 text-purple-500" />
              <h3 className="text-xl font-bold text-gray-800">Today's Vibe</h3>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">{weatherData.dayPlan.vibe}</p>
          </div>

          {/* Day Plan Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { 
                title: 'Morning', 
                content: weatherData.dayPlan.morning, 
                icon: <Sunrise className="w-5 h-5" />,
                color: 'from-yellow-400 to-orange-500'
              },
              { 
                title: 'Afternoon', 
                content: weatherData.dayPlan.afternoon, 
                icon: <Sun className="w-5 h-5" />,
                color: 'from-orange-400 to-red-500'
              },
              { 
                title: 'Evening', 
                content: weatherData.dayPlan.evening, 
                icon: <Sunset className="w-5 h-5" />,
                color: 'from-purple-400 to-pink-500'
              }
            ].map((period, index) => (
              <motion.div
                key={period.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r ${period.color} text-white text-sm font-medium mb-4`}>
                  {period.icon}
                  <span>{period.title}</span>
                </div>
                <p className="text-gray-600 leading-relaxed">{period.content}</p>
              </motion.div>
            ))}
          </div>

          {/* Daylight Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center space-x-3 mb-3">
              <Eye className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-800">Daylight Hours</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sunrise className="w-4 h-4 text-orange-500" />
                <span className="text-gray-600">{formatTime(weatherData.sunrise)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sunset className="w-4 h-4 text-purple-500" />
                <span className="text-gray-600">{formatTime(weatherData.sunset)}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{weatherData.dayPlan.daylight}</p>
          </div>
          {/* Music Player (moved to left to balance layout) */}
          <div id="music">
            <MusicPlayer 
              playlist={weatherData.outfit.playlist}
              weatherCode={weatherData.weatherCode}
              temperature={weatherData.maxTemp}
            />
          </div>

          {/* Photo Suggestions (moved to left) */}
          <div id="photos">
            <PhotoSuggestions
              photoTip={weatherData.creative.photoTip}
              weatherCode={weatherData.weatherCode}
              temperature={weatherData.maxTemp}
              location={weatherData.location}
              lat={weatherData.coordinates.lat}
              lng={weatherData.coordinates.lng}
            />
          </div>

        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Outfit Suggestions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="w-6 h-6 text-pink-500" />
              <h3 className="text-xl font-bold text-gray-800">Outfit & Packing</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">👕 Outfit</h4>
                <p className="text-gray-600 text-sm">{weatherData.outfit.outfit}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">✨ Accessories</h4>
                <p className="text-gray-600 text-sm">{weatherData.outfit.accessories}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">🎒 Packing</h4>
                <p className="text-gray-600 text-sm">{weatherData.outfit.pack}</p>
              </div>
            </div>
          </motion.div>

          {/* Music & Creative */}
          <motion.div id="music"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Music className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-bold text-gray-800">Music & Creative</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">🎵 Playlist Vibe</h4>
                <p className="text-gray-600 text-sm">{weatherData.outfit.playlist}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">📸 Photo Tip</h4>
                <p className="text-gray-600 text-sm">{weatherData.creative.photoTip}</p>
              </div>
            </div>
          </motion.div>

          {/* Mini Challenge */}
          <motion.div id="local"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="w-6 h-6" />
              <h3 className="text-xl font-bold">Daily Challenge</h3>
            </div>
            <p className="text-purple-100 leading-relaxed mb-4">{weatherData.creative.miniChallenge}</p>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-sm text-purple-100">{weatherData.creative.localIdea}</p>
            </div>
          </motion.div>

          {/* Right column now focuses on Outfit and Daily Challenge */}
        </div>
      </div>
    </div>
  )
}
